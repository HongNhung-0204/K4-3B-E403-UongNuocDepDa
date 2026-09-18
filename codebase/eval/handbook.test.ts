import { describe, expect, it } from 'vitest';
import cases from './handbook-golden.json';
import { handleChatRequest, NO_SOURCE_ANSWER } from '../server/chatService';
import { KNOWLEDGE, normalizeVietnamese, retrieve } from '../server/retrieval';
import type { ChatResponse } from '../src/types/chat';

const request = (question: string) => new Request('http://localhost/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: question }] }),
});

describe('handbook golden set: retrieval, grounded excerpt and provenance', () => {
  const documents = KNOWLEDGE.filter((chunk) => chunk.source === '20K-AI-Handbook-ver2.1.pdf');
  it('loads the checked handbook with a working source URL', () => {
    expect(documents.length).toBeGreaterThan(20);
    expect(documents.every((chunk) => chunk.verified && chunk.url?.startsWith('https://vinuni.edu.vn/'))).toBe(true);
  });

  for (const item of cases) {
    it(`${item.id}: ${item.question}`, async () => {
      const response = await handleChatRequest(request(item.question), { env: {} });
      const body = await response.json() as ChatResponse;
      expect(response.status).toBe(200);
      if (item.kind === 'grounded') {
        const top = retrieve(item.question)[0];
        expect(top?.chunk.source).toBe('20K-AI-Handbook-ver2.1.pdf');
        expect(item.pages).toContain(top.chunk.page);
        expect(body.mode).toBe('extractive');
        expect(body.sources[0].page).toBe(top.chunk.page);
        expect(body.sources[0].verified).toBe(true);
        const acceptable = item.answerContainsAny ?? (item.answerContains ? [item.answerContains] : []);
        expect(acceptable.some((phrase) => normalizeVietnamese(body.answer).includes(normalizeVietnamese(phrase)))).toBe(true);
      } else {
        expect(body.sources.some((source) => source.source === '20K-AI-Handbook-ver2.1.pdf')).toBe(false);
        expect(body.mode === 'retrieval-fallback' ? body.answer : body.answer.toLowerCase()).toContain(body.mode === 'retrieval-fallback' ? NO_SOURCE_ANSWER : 'chưa có');
      }
    });
  }
});
