import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleChatRequest } from './chatService';

const DIST_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const MAX_REQUEST_BYTES = 16_384;
const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

function send(response: ServerResponse, status: number, body: string | Buffer, contentType: string, head = false) {
  response.writeHead(status, { 'Content-Type': contentType, 'Content-Length': Buffer.byteLength(body), 'X-Content-Type-Options': 'nosniff' });
  response.end(head ? undefined : body);
}

async function serveStatic(request: IncomingMessage, response: ServerResponse, pathname: string) {
  const head = request.method === 'HEAD';
  if (request.method !== 'GET' && !head) {
    send(response, 405, 'Method Not Allowed', 'text/plain; charset=utf-8');
    return;
  }
  if (pathname.includes('\0')) {
    send(response, 400, 'Bad Request', 'text/plain; charset=utf-8', head);
    return;
  }
  const candidate = path.resolve(DIST_DIR, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!candidate.startsWith(`${DIST_DIR}${path.sep}`)) {
    send(response, 403, 'Forbidden', 'text/plain; charset=utf-8', head);
    return;
  }
  let file = candidate;
  try {
    if (!(await stat(file)).isFile()) throw new Error('NOT_A_FILE');
  } catch {
    if (path.extname(pathname)) {
      send(response, 404, 'Not Found', 'text/plain; charset=utf-8', head);
      return;
    }
    file = path.join(DIST_DIR, 'index.html');
  }
  try {
    const body = await readFile(file);
    send(response, 200, body, MIME_TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream', head);
  } catch {
    send(response, 500, 'Static build unavailable', 'text/plain; charset=utf-8', head);
  }
}

async function serveChat(request: IncomingMessage, response: ServerResponse, env: Record<string, string | undefined>) {
  if (Number(request.headers['content-length'] ?? 0) > MAX_REQUEST_BYTES) {
    send(response, 413, JSON.stringify({ code: 'TOO_LARGE', error: 'Yêu cầu quá lớn.' }), 'application/json; charset=utf-8');
    request.resume();
    return;
  }
  const parts: Buffer[] = [];
  let size = 0;
  for await (const part of request) {
    const chunk = Buffer.isBuffer(part) ? part : Buffer.from(part);
    size += chunk.byteLength;
    if (size > MAX_REQUEST_BYTES) {
      send(response, 413, JSON.stringify({ code: 'TOO_LARGE', error: 'Yêu cầu quá lớn.' }), 'application/json; charset=utf-8');
      request.resume();
      return;
    }
    parts.push(chunk);
  }
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (typeof value === 'string') headers.set(name, value);
    else if (Array.isArray(value)) headers.set(name, value.join(', '));
  }
  const apiRequest = new Request('http://localhost/api/chat', {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : Buffer.concat(parts),
  });
  const apiResponse = await handleChatRequest(apiRequest, { env });
  response.statusCode = apiResponse.status;
  apiResponse.headers.forEach((value, name) => response.setHeader(name, value));
  response.end(Buffer.from(await apiResponse.arrayBuffer()));
}

export function createRenderServer(env: Record<string, string | undefined> = process.env) {
  return createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      if (pathname === '/healthz') {
        send(response, 200, 'ok', 'text/plain; charset=utf-8', request.method === 'HEAD');
      } else if (pathname === '/api/chat') {
        await serveChat(request, response, env);
      } else if (pathname.startsWith('/api/')) {
        send(response, 404, JSON.stringify({ code: 'NOT_FOUND', error: 'API không tồn tại.' }), 'application/json; charset=utf-8');
      } else {
        await serveStatic(request, response, pathname);
      }
    } catch (error) {
      console.error('Render request failed:', error);
      if (!response.headersSent) send(response, 500, JSON.stringify({ code: 'SERVER_ERROR', error: 'Lỗi máy chủ.' }), 'application/json; charset=utf-8');
      else response.end();
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 10000);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error('PORT không hợp lệ.');
  createRenderServer().listen(port, '0.0.0.0', () => console.log(`MyViUni AI listening on 0.0.0.0:${port}`));
}
