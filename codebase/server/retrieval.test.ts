import { describe, expect, it } from 'vitest';
import { normalizeVietnamese, retrieve, type KnowledgeChunk } from './retrieval';

describe('deterministic retrieval', () => {
  it('finds library hours for a Vietnamese query', () => {
    expect(retrieve('thư viện mở đến mấy giờ')[0]?.chunk.id).toBe('library-hours');
    expect(retrieve('Thư viện mở đến mấy giờ và ở đâu?').map((hit) => hit.chunk.id)).toEqual(['library-hours']);
  });

  it('matches unaccented Vietnamese', () => {
    expect(normalizeVietnamese('Thư viện ở đâu?')).toBe('thu vien o dau');
    expect(retrieve('thu vien mo den may gio')[0]?.chunk.id).toBe('library-hours');
  });

  it('returns no source for an unrelated query', () => {
    expect(retrieve('thời tiết trên sao Hỏa')).toEqual([]);
  });

  it('keeps source order when scores tie', () => {
    const chunks: KnowledgeChunk[] = [
      { id: 'first', title: 'Campus', content: 'Campus', source: 'demo', keywords: ['campus'], verified: false },
      { id: 'second', title: 'Campus', content: 'Campus', source: 'demo', keywords: ['campus'], verified: false },
    ];
    expect(retrieve('campus', chunks).map((hit) => hit.chunk.id)).toEqual(['first', 'second']);
  });

  it('uses imported document content ahead of overlapping demo notes', () => {
    const imported: KnowledgeChunk = {
      id: 'doc-library', title: 'Nội quy', content: 'Thư viện mở cửa lúc 08:00 mỗi ngày.',
      source: 'library.pdf', page: 2, keywords: [], verified: true, origin: 'document',
    };
    const demo: KnowledgeChunk = {
      id: 'library-hours', title: 'Thư viện', content: 'Chưa có giờ mở cửa.',
      source: 'demo', keywords: ['thư viện', 'giờ mở cửa thư viện'], verified: false,
    };
    expect(retrieve('Thư viện mở cửa lúc nào?', [demo, imported]).map((hit) => hit.chunk.id)).toEqual(['doc-library']);
    expect(retrieve('Thời tiết trên sao Hỏa?', [imported])).toEqual([]);
  });
});
