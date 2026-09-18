if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mammoth from 'mammoth';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SUPPORTED = new Set(['.pdf', '.docx', '.txt', '.md']);
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 100;
const MAX_CHUNKS = 2000;
const CHUNK_LENGTH = 1100;

async function listDocuments(directory, relative = '') {
  const entries = await readdir(path.join(directory, relative), { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const next = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await listDocuments(directory, next));
    else if (entry.isFile() && SUPPORTED.has(path.extname(entry.name).toLowerCase()) && next.toLowerCase() !== 'readme.md') files.push(next);
  }
  return files;
}

async function readManifest(documentsDir, name = 'manifest.json') {
  let raw;
  try { raw = await readFile(path.join(documentsDir, name), 'utf8'); }
  catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
  const manifest = JSON.parse(raw);
  if (!manifest || Array.isArray(manifest) || typeof manifest !== 'object') throw new Error(`documents/${name} phải là một object.`);
  return manifest;
}

async function readPublicSource(filename, metadata, fetcher) {
  if (path.basename(filename) !== filename || !SUPPORTED.has(path.extname(filename).toLowerCase())) {
    throw new Error(`Tên nguồn công khai không hợp lệ: ${filename}`);
  }
  if (typeof metadata.url !== 'string' || !metadata.url.startsWith('https://')) {
    throw new Error(`Nguồn công khai phải có URL HTTPS: ${filename}`);
  }
  if (typeof metadata.sha256 !== 'string' || !/^[a-f\d]{64}$/i.test(metadata.sha256)) {
    throw new Error(`Nguồn công khai phải có SHA-256: ${filename}`);
  }
  const response = await fetcher(metadata.url, { signal: AbortSignal.timeout(90_000) });
  if (!response.ok || !response.body || !response.url.startsWith('https://')) {
    throw new Error(`Không tải được nguồn công khai ${filename}: HTTP ${response.status}`);
  }
  const reader = response.body.getReader();
  const parts = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FILE_BYTES) throw new Error(`${filename} vượt quá 25 MB.`);
      parts.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(parts.map((part) => Buffer.from(part)), size);
}

function validateMetadata(metadata, filename) {
  if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') throw new Error(`Metadata không hợp lệ: ${filename}`);
  for (const field of ['title', 'url', 'locationId']) {
    if (metadata[field] !== undefined && (typeof metadata[field] !== 'string' || !metadata[field].trim())) throw new Error(`${field} không hợp lệ: ${filename}`);
  }
  if (metadata.verified !== undefined && typeof metadata.verified !== 'boolean') throw new Error(`verified phải là boolean: ${filename}`);
  if (metadata.keywords !== undefined && (!Array.isArray(metadata.keywords) || !metadata.keywords.every((word) => typeof word === 'string' && word.trim()))) throw new Error(`keywords không hợp lệ: ${filename}`);
  if (metadata.url && !/^https?:\/\//i.test(metadata.url)) throw new Error(`url phải dùng http(s): ${filename}`);
  return metadata;
}

function markdownSections(text) {
  const sections = [];
  let heading;
  let lines = [];
  const flush = () => {
    const content = lines.join('\n').trim();
    if (content) sections.push({ section: heading, content });
    lines = [];
  };
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (match) { flush(); heading = match[1]; }
    else lines.push(line);
  }
  flush();
  return sections;
}

async function pdfSections(buffer) {
  const loadingTask = getDocument({ data: new Uint8Array(buffer), useSystemFonts: true });
  try {
    const document = await loadingTask.promise;
    const sections = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const text = await page.getTextContent();
      const content = text.items.map((item) => 'str' in item ? `${item.str}${item.hasEOL ? '\n' : ' '}` : '').join('').trim();
      if (content) sections.push({ page: pageNumber, content });
      page.cleanup();
    }
    return sections;
  } finally {
    await loadingTask.destroy();
  }
}

async function extractSections(filename, buffer) {
  const extension = path.extname(filename).toLowerCase();
  if (extension === '.pdf') return pdfSections(buffer);
  if (extension === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return [{ content: result.value }];
  }
  const text = buffer.toString('utf8').replace(/^\uFEFF/, '');
  if (extension === '.md') return markdownSections(text);
  return [{ content: text }];
}

function splitLongParagraph(paragraph) {
  const pieces = [];
  let current = '';
  for (const word of paragraph.split(/\s+/)) {
    if (!word) continue;
    if (current && current.length + word.length + 1 > CHUNK_LENGTH) { pieces.push(current); current = ''; }
    if (word.length > CHUNK_LENGTH) {
      if (current) { pieces.push(current); current = ''; }
      for (let offset = 0; offset < word.length; offset += CHUNK_LENGTH) pieces.push(word.slice(offset, offset + CHUNK_LENGTH));
    } else current += `${current ? ' ' : ''}${word}`;
  }
  if (current) pieces.push(current);
  return pieces;
}

export function chunkText(text) {
  const paragraphs = text.split(/\n\s*\n/).map((part) => part.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const chunks = [];
  let current = '';
  for (const paragraph of paragraphs) {
    for (const piece of splitLongParagraph(paragraph)) {
      if (current && current.length + piece.length + 2 > CHUNK_LENGTH) { chunks.push(current); current = ''; }
      current += `${current ? '\n\n' : ''}${piece}`;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function buildIndex({ documentsDir = path.join(ROOT, 'documents'), outputFile = path.join(ROOT, 'server', 'generated-knowledge.json'), fetcher = fetch } = {}) {
  const manifest = await readManifest(documentsDir);
  const publicSources = await readManifest(documentsDir, 'public-sources.json');
  const localFiles = await listDocuments(documentsDir);
  const files = [...new Set([...localFiles, ...Object.keys(publicSources)])].sort((a, b) => a.localeCompare(b, 'en'));
  if (files.length > MAX_FILES) throw new Error(`Tối đa ${MAX_FILES} tài liệu.`);
  for (const filename of Object.keys(manifest)) {
    if (!files.includes(filename)) throw new Error(`manifest.json tham chiếu file không tồn tại hoặc không được hỗ trợ: ${filename}`);
  }
  const chunks = [];
  for (const filename of files) {
    const publicMetadata = publicSources[filename];
    if (publicMetadata !== undefined) {
      if (!publicMetadata || Array.isArray(publicMetadata) || typeof publicMetadata !== 'object') throw new Error(`Nguồn công khai không hợp lệ: ${filename}`);
      if (path.basename(filename) !== filename || !SUPPORTED.has(path.extname(filename).toLowerCase())) throw new Error(`Tên nguồn công khai không hợp lệ: ${filename}`);
      if (typeof publicMetadata.url !== 'string' || !publicMetadata.url.startsWith('https://')) throw new Error(`Nguồn công khai phải có URL HTTPS: ${filename}`);
      if (typeof publicMetadata.sha256 !== 'string' || !/^[a-f\d]{64}$/i.test(publicMetadata.sha256)) throw new Error(`Nguồn công khai phải có SHA-256: ${filename}`);
    }
    const metadata = validateMetadata({ ...publicMetadata, ...manifest[filename] }, filename);
    const buffer = localFiles.includes(filename)
      ? await readFile(path.join(documentsDir, filename))
      : await readPublicSource(filename, publicMetadata, fetcher);
    if (buffer.byteLength > MAX_FILE_BYTES) throw new Error(`${filename} vượt quá 25 MB.`);
    if (publicMetadata && createHash('sha256').update(buffer).digest('hex').toLowerCase() !== publicMetadata.sha256.toLowerCase()) {
      throw new Error(`SHA-256 không khớp với nguồn công khai: ${filename}`);
    }
    const sections = await extractSections(filename, buffer);
    if (sections.every(({ content }) => !content.trim())) throw new Error(`${filename} không có text đọc được. PDF dạng scan cần OCR trước khi nạp.`);
    const title = metadata.title ?? path.basename(filename, path.extname(filename)).replace(/[_-]+/g, ' ');
    const fileId = createHash('sha256').update(filename).digest('hex').slice(0, 12);
    let chunkNumber = 0;
    for (const { section, page, content } of sections) {
      for (const part of chunkText(content)) {
        chunks.push({
          id: `doc-${fileId}-${++chunkNumber}`,
          title,
          content: part,
          source: filename,
          ...(section ? { section } : {}),
          ...(page ? { page } : {}),
          keywords: [...new Set([title, section, ...(metadata.keywords ?? [])].filter(Boolean))],
          ...(metadata.locationId ? { locationId: metadata.locationId } : {}),
          ...(metadata.url ? { url: metadata.url } : {}),
          verified: metadata.verified === true,
          origin: 'document',
        });
        if (chunks.length > MAX_CHUNKS) throw new Error(`Chỉ mục vượt quá ${MAX_CHUNKS} đoạn. Hãy chia nhỏ hoặc chọn lọc tài liệu.`);
      }
    }
  }
  await writeFile(outputFile, `${JSON.stringify(chunks, null, 2)}\n`, 'utf8');
  return { files: files.length, chunks: chunks.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildIndex().then(({ files, chunks }) => console.log(`Đã lập chỉ mục ${files} tài liệu thành ${chunks} đoạn.`)).catch((error) => {
    console.error(`Lỗi nạp tài liệu: ${error.message}`);
    process.exitCode = 1;
  });
}
