import assert from 'node:assert/strict';
import { copyFile, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildIndex } from './ingest-documents.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = await mkdtemp(path.join(os.tmpdir(), 'myviuni-public-source-'));
try {
  await copyFile(path.join(root, 'documents', 'public-sources.json'), path.join(directory, 'public-sources.json'));
  const result = await buildIndex({ documentsDir: directory, outputFile: path.join(directory, 'index.json') });
  assert.ok(result.files > 0 && result.chunks > 0, 'Không tạo được chỉ mục từ nguồn công khai.');
  console.log(`Đã xác minh tải nguồn công khai: ${result.files} tài liệu, ${result.chunks} đoạn.`);
} finally {
  const absolute = path.resolve(directory);
  if (!absolute.startsWith(`${path.resolve(os.tmpdir())}${path.sep}`) || path.basename(absolute).startsWith('myviuni-public-source-') === false) {
    throw new Error('Unsafe temporary directory');
  }
  await rm(absolute, { recursive: true, force: true });
}
