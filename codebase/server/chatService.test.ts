import { describe, expect, it, vi } from 'vitest';
import { createServer } from 'node:http';
import { handleChatRequest, NO_SOURCE_ANSWER } from './chatService';
import type { ChatResponse } from '../src/types/chat';
import type { KnowledgeChunk } from './retrieval';

const request = (messages: unknown) => new Request('http://localhost/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages }),
});

describe('chat API', () => {
  it('rejects invalid messages', async () => {
    const response = await handleChatRequest(request([{ role: 'system', content: 'hello' }]));
    expect(response.status).toBe(400);
  });

  it('does not call AI when retrieval has no source', async () => {
    const generate = vi.fn(async () => 'should not run');
    const response = await handleChatRequest(request([{ role: 'user', content: 'thời tiết trên sao Hỏa' }]), { generate });
    const body = await response.json() as ChatResponse;
    expect(body.answer).toBe(NO_SOURCE_ANSWER);
    expect(body.mode).toBe('retrieval-fallback');
    expect(body.sources).toEqual([]);
    expect(generate).not.toHaveBeenCalled();
  });

  it('attaches sources and location on the server', async () => {
    const response = await handleChatRequest(request([{ role: 'user', content: 'Thư viện mở đến mấy giờ và ở đâu?' }]), { generate: async () => 'Chưa có giờ xác minh.', env: {} });
    const body = await response.json() as ChatResponse;
    expect(response.status).toBe(200);
    expect(body.mode).toBe('live');
    expect(body.locationId).toBe('library-c');
    expect(body.sources[0].id).toBe('library-hours');
    expect(body.sources[0].verified).toBe(false);
  });

  it('uses a clearly labeled offline answer for the library demo when upstream fails', async () => {
    const response = await handleChatRequest(request([{ role: 'user', content: 'Thư viện mở đến mấy giờ và ở đâu?' }]), { generate: async () => { throw new Error('upstream'); }, env: {} });
    const body = await response.json() as ChatResponse;
    expect(body.mode).toBe('offline-demo');
    expect(body.answer).toContain('chưa có giờ mở cửa');
  });

  it('returns a configuration error for other sourced questions without server env', async () => {
    const response = await handleChatRequest(request([{ role: 'user', content: 'CECS Lab ở đâu?' }]), { env: {} });
    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe('CONFIG_UNAVAILABLE');
  });

  it('quotes an imported document with page and source link when AI is not configured', async () => {
    const document: KnowledgeChunk = {
      id: 'doc-library-1', title: 'Nội quy thư viện',
      content: 'Thư viện mở cửa lúc 08:00. Thư viện đóng cửa lúc 18:00.',
      source: 'hours.pdf', url: 'https://example.org/hours.pdf', page: 2,
      keywords: [], verified: true, origin: 'document', locationId: 'library-c',
    };
    const response = await handleChatRequest(request([{ role: 'user', content: 'Thư viện đóng cửa lúc mấy giờ?' }]), { env: {}, chunks: [document] });
    const body = await response.json() as ChatResponse;
    expect(response.status).toBe(200);
    expect(body.mode).toBe('extractive');
    expect(body.answer).toContain('đóng cửa lúc 18:00');
    expect(body.answer).toContain('trang 2');
    expect(body.sources).toEqual([{ id: 'doc-library-1', title: 'Nội quy thư viện', source: 'hours.pdf', url: 'https://example.org/hours.pdf', section: null, page: 2, verified: true }]);
    expect(body.locationId).toBe('library-c');
  });

  it('calls an Anthropic-compatible endpoint only from the server and keeps metadata server-owned', async () => {
    let gatewayPath = '';
    let receivedServerKey = false;
    const gateway = createServer(async (incoming, outgoing) => {
      gatewayPath = incoming.url ?? '';
      receivedServerKey = incoming.headers['x-api-key'] === 'test-server-only-key';
      for await (const _part of incoming) { /* consume request body */ }
      outgoing.writeHead(200, { 'Content-Type': 'application/json' });
      outgoing.end(JSON.stringify({
        id: 'msg_mock', type: 'message', role: 'assistant', model: 'mock-claude',
        content: [{ type: 'text', text: 'Theo dữ liệu demo, thư viện ở Building C; giờ mở cửa chưa xác minh.' }],
        stop_reason: 'end_turn', stop_sequence: null,
        usage: { input_tokens: 20, output_tokens: 18 },
      }));
    });
    await new Promise<void>((resolve) => gateway.listen(0, '127.0.0.1', resolve));
    try {
      const address = gateway.address();
      if (!address || typeof address === 'string') throw new Error('Mock gateway did not start');
      const response = await handleChatRequest(request([{ role: 'user', content: 'Thư viện mở đến mấy giờ và ở đâu?' }]), {
        env: { ANTHROPIC_BASE_URL: `http://127.0.0.1:${address.port}/v1`, ANTHROPIC_API_KEY: 'test-server-only-key', ANTHROPIC_MODEL: 'mock-claude' },
      });
      const body = await response.json() as ChatResponse;
      expect(gatewayPath).toBe('/v1/messages');
      expect(receivedServerKey).toBe(true);
      expect(body.mode).toBe('live');
      expect(body.answer).toContain('Building C');
      expect(body.sources[0].id).toBe('library-hours');
      expect(body.locationId).toBe('library-c');
    } finally {
      await new Promise<void>((resolve, reject) => gateway.close((cause) => cause ? reject(cause) : resolve()));
    }
  });
});
