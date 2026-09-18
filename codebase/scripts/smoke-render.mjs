import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createRenderServer } from '../dist-server/render.js';

const server = createRenderServer({});
try {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const base = `http://127.0.0.1:${address.port}`;

  for (const route of ['/', '/chat', '/campus', '/navigation/library-c']) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('content-type') ?? '', /text\/html/, route);
    assert.match(await response.text(), /MyViUni AI/, route);
  }
  const map = await fetch(`${base}/maps/vinuni-campus.webp`);
  assert.equal(map.status, 200);
  assert.match(map.headers.get('content-type') ?? '', /image\/webp/);
  assert.equal((await fetch(`${base}/healthz`)).status, 200);
  assert.equal((await fetch(`${base}/api/unknown`)).status, 404);
  assert.equal((await fetch(`${base}/assets/missing.js`)).status, 404);

  const chat = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Phòng C401 chứa bao nhiêu người?' }] }),
  });
  assert.equal(chat.status, 200);
  const answer = await chat.json();
  assert.equal(answer.mode, 'extractive');
  assert.match(answer.answer, /236/);
  assert.equal(answer.sources[0].source, '20K-AI-Handbook-ver2.1.pdf');
  assert.equal(answer.sources[0].page, 13);
  assert.equal(answer.sources[0].verified, true);
  console.log('Render production smoke: Home, routes, map, health and RAG API passed.');
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
