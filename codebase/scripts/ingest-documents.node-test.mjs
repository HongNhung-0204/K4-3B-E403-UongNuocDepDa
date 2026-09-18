import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import JSZip from 'jszip';
import { buildIndex } from './ingest-documents.mjs';

async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'myviuni-rag-test-'));
  t.after(async () => {
    if (!path.resolve(directory).startsWith(`${path.resolve(os.tmpdir())}${path.sep}`)) throw new Error('Unsafe fixture path');
    await rm(directory, { recursive: true, force: true });
  });
  return { documentsDir: directory, outputFile: path.join(directory, 'index.json') };
}

function makePdf(text) {
  const stream = `BT /F1 18 Tf 72 720 Td (${text}) Tj ET`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let output = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(output));
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(output);
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  output += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(output);
}

async function makeDocx() {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  zip.file('_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  zip.file('word/document.xml', '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Campus handbook: library closes at 18:00.</w:t></w:r></w:p></w:body></w:document>');
  return zip.generateAsync({ type: 'nodebuffer' });
}

test('indexes Markdown sections and metadata, then removes deleted sources on reindex', async (t) => {
  const options = await fixture(t);
  await writeFile(path.join(options.documentsDir, 'rules.md'), '# Library\nBorrow books for 14 days.\n\n## Renewal\nRenew before the due date.');
  await writeFile(path.join(options.documentsDir, 'manifest.json'), JSON.stringify({ 'rules.md': { title: 'Library rules', verified: true, url: 'https://example.org/rules', locationId: 'library-c' } }));
  assert.deepEqual(await buildIndex(options), { files: 1, chunks: 2 });
  const chunks = JSON.parse(await readFile(options.outputFile, 'utf8'));
  assert.equal(chunks[0].source, 'rules.md');
  assert.equal(chunks[0].section, 'Library');
  assert.equal(chunks[1].section, 'Renewal');
  assert.equal(chunks[0].verified, true);
  assert.equal(chunks[0].url, 'https://example.org/rules');
  assert.equal(chunks[0].locationId, 'library-c');
  const firstIndex = await readFile(options.outputFile, 'utf8');
  await buildIndex(options);
  assert.equal(await readFile(options.outputFile, 'utf8'), firstIndex);
  await rm(path.join(options.documentsDir, 'rules.md'));
  assert.deepEqual(await buildIndex(options), { files: 0, chunks: 0 });
});

test('reads PDF page numbers and DOCX text', async (t) => {
  const options = await fixture(t);
  await writeFile(path.join(options.documentsDir, 'hours.pdf'), makePdf('Library opens at 08:00'));
  await writeFile(path.join(options.documentsDir, 'handbook.docx'), await makeDocx());
  assert.deepEqual(await buildIndex(options), { files: 2, chunks: 2 });
  const chunks = JSON.parse(await readFile(options.outputFile, 'utf8'));
  assert.equal(chunks.find((chunk) => chunk.source === 'hours.pdf').page, 1);
  assert.match(chunks.find((chunk) => chunk.source === 'hours.pdf').content, /Library opens at 08:00/);
  assert.match(chunks.find((chunk) => chunk.source === 'handbook.docx').content, /library closes at 18:00/);
  assert.equal(chunks.every((chunk) => chunk.verified === false), true);
});

test('rejects image-only PDFs instead of silently creating an empty source', async (t) => {
  const options = await fixture(t);
  await writeFile(path.join(options.documentsDir, 'scan.pdf'), makePdf(''));
  await assert.rejects(buildIndex(options), /OCR/);
});

test('rejects metadata for a missing document instead of silently dropping verification', async (t) => {
  const options = await fixture(t);
  await writeFile(path.join(options.documentsDir, 'manifest.json'), JSON.stringify({ 'wrong-name.pdf': { verified: true } }));
  await assert.rejects(buildIndex(options), /wrong-name\.pdf/);
});
