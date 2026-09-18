import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleChatRequest } from './server/chatService';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-chat-api',
      configureServer(server) {
        const localEnv = loadEnv(server.config.mode, server.config.root, '');
        server.middlewares.use('/api/chat', async (incoming, outgoing) => {
          try {
            const chunks: Buffer[] = [];
            let size = 0;
            for await (const chunk of incoming) {
              const part = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
              size += part.byteLength;
              if (size > 16_384) { outgoing.writeHead(413).end('Request too large'); return; }
              chunks.push(part);
            }
            const headers = new Headers();
            for (const [name, value] of Object.entries(incoming.headers)) {
              if (typeof value === 'string') headers.set(name, value);
              else if (Array.isArray(value)) headers.set(name, value.join(', '));
            }
            const request = new Request('http://localhost/api/chat', {
              method: incoming.method,
              headers,
              body: incoming.method === 'GET' || incoming.method === 'HEAD' ? undefined : Buffer.concat(chunks),
            });
            const response = await handleChatRequest(request, { env: { ...localEnv, ...process.env } });
            outgoing.statusCode = response.status;
            response.headers.forEach((value, name) => outgoing.setHeader(name, value));
            outgoing.end(await response.text());
          } catch {
            outgoing.writeHead(500, { 'Content-Type': 'application/json' });
            outgoing.end(JSON.stringify({ code: 'SERVER_ERROR', error: 'Lỗi máy chủ. Vui lòng thử lại.' }));
          }
        });
      },
    },
  ],
});
