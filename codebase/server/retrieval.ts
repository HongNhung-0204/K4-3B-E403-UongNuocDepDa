import knowledgeData from './knowledge.json';
import generatedKnowledge from './generated-knowledge.json';

export type KnowledgeChunk = {
  id: string;
  title: string;
  content: string;
  source: string;
  url?: string;
  section?: string;
  page?: number;
  keywords: string[];
  locationId?: string;
  verified: boolean;
  origin?: 'document';
};

export type RetrievalHit = { chunk: KnowledgeChunk; score: number };
export const KNOWLEDGE: KnowledgeChunk[] = [...generatedKnowledge as KnowledgeChunk[], ...knowledgeData];

const STOP_WORDS = new Set(['cho', 'toi', 'minh', 'ban', 'cua', 'la', 'o', 'va', 'co', 'khong', 'duoc', 'den', 'may', 'nhung', 'nhu', 'the', 'nao', 'hoi', 've', 'trong', 'nay', 'mot', 'giup', 'voi', 'tai', 'cac', 'di', 'dau', 'tren', 'gi', 'bao', 'nhieu', 'khi', 'neu', 'bi', 'sao', 'can', 'viec']);
const REQUIRED_PHRASES = ['mo cua', 'mat khau', 'hoc phi', 'thi cuoi ky'];
const COMMON_DOCUMENT_WORDS = new Set(['chuong', 'trinh', 'hoc', 'vien']);

export function normalizeVietnamese(input: string): string {
  return input.toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

export function meaningfulTokens(input: string): string[] {
  return [...new Set(normalizeVietnamese(input).replace(/\blam gi\b/g, ' ').split(' ').filter((token) => (token.length >= 2 || /^\d$/.test(token)) && !STOP_WORDS.has(token)))];
}

function coreProximityBonus(queryTokens: string[], content: string): number {
  const core = queryTokens.filter((token) => !COMMON_DOCUMENT_WORDS.has(token));
  if (core.length < 2) return 0;
  const wanted = new Set(core);
  const counts = new Map<string, number>();
  const words = content.split(' ');
  let left = 0;
  let covered = 0;
  let shortest = Number.POSITIVE_INFINITY;
  for (let right = 0; right < words.length; right++) {
    const word = words[right];
    if (wanted.has(word)) {
      const next = (counts.get(word) ?? 0) + 1;
      counts.set(word, next);
      if (next === 1) covered++;
    }
    while (covered === wanted.size) {
      shortest = Math.min(shortest, right - left + 1);
      const first = words[left++];
      if (wanted.has(first)) {
        const next = (counts.get(first) ?? 0) - 1;
        counts.set(first, next);
        if (next === 0) covered--;
      }
    }
  }
  return Number.isFinite(shortest) ? 60 / (1 + shortest / 6) : 0;
}

function proximityScore(queryTokens: string[], content: string): number {
  const words = content.split(' ');
  let score = 0;
  for (let index = 0; index < queryTokens.length - 1; index++) {
    const first = queryTokens[index];
    const second = queryTokens[index + 1];
    if (content.includes(`${first} ${second}`)) { score += 6; continue; }
    const position = words.findIndex((word, wordIndex) => word === first && words.slice(wordIndex + 1, wordIndex + 6).includes(second));
    if (position >= 0) score += 2;
  }
  for (let index = 0; index < queryTokens.length - 2; index++) {
    const [first, second, third] = queryTokens.slice(index, index + 3);
    if (words.some((word, position) => word === first && words.slice(position + 1, position + 6).includes(second)
      && words.slice(position + 2, position + 11).includes(third))) score += 12;
  }
  return score;
}

export function retrieve(query: string, chunks: KnowledgeChunk[] = KNOWLEDGE, limit = 3): RetrievalHit[] {
  const normalizedQuery = normalizeVietnamese(query);
  const queryTokens = meaningfulTokens(query);
  if (!normalizedQuery || queryTokens.length === 0) return [];

  const documentContents = chunks.filter((chunk) => chunk.origin === 'document')
    .map((chunk) => new Set(normalizeVietnamese(chunk.content).split(' ')));
  const frequency = new Map(queryTokens.map((token) => [token, documentContents.filter((words) => words.has(token)).length]));
  const weight = (token: string) => 1 + Math.log((documentContents.length + 1) / ((frequency.get(token) ?? 0) + 1));
  const totalWeight = queryTokens.reduce((sum, token) => sum + weight(token), 0);

  const hits = chunks.map((chunk, index) => {
    const title = normalizeVietnamese(chunk.title);
    const content = normalizeVietnamese(chunk.content);
    const contentTokens = new Set(content.split(' '));
    if (chunk.origin === 'document') {
      const matches = queryTokens.filter((token) => contentTokens.has(token));
      const coverage = matches.reduce((sum, token) => sum + weight(token), 0) / totalWeight;
      const numbersMatched = queryTokens.filter((token) => /^\d+$/.test(token)).every((token) => contentTokens.has(token));
      const phrasesMatched = REQUIRED_PHRASES.every((phrase) => !normalizedQuery.includes(phrase) || content.includes(phrase));
      const relevant = matches.length >= Math.min(2, queryTokens.length) && coverage > 0.55 && numbersMatched && phrasesMatched;
      const score = relevant
        ? 20 + coverage * 10 + matches.reduce((sum, token) => sum + 4 * weight(token), 0)
          + proximityScore(queryTokens, content)
          + coreProximityBonus(queryTokens, content)
          + (normalizedQuery.length >= 5 && content.includes(normalizedQuery) ? 8 : 0)
        : 0;
      return { chunk, score, index, relevant };
    }
    const keywords = chunk.keywords.map(normalizeVietnamese);
    let score = 0;
    let matchedKeyword = false;

    for (const keyword of keywords) {
      if (keyword && normalizedQuery.includes(keyword)) { score += 12 + Math.min(keyword.split(' ').length, 4); matchedKeyword = true; }
      else if (keyword && keyword.includes(normalizedQuery) && normalizedQuery.length >= 5) { score += 8; matchedKeyword = true; }
    }
    if (normalizedQuery === title) score += 18;
    const titleTokens = new Set(title.split(' '));
    const keywordTokens = new Set(keywords.flatMap((keyword) => keyword.split(' ')));
    for (const token of queryTokens) {
      const titleMatch = titleTokens.has(token);
      const keywordMatch = keywordTokens.has(token);
      const contentMatch = contentTokens.has(token);
      if (titleMatch) score += 4;
      if (keywordMatch) {
        score += 3;
        if (keywords.some((keyword) => keyword === token)) matchedKeyword = true;
      }
      if (contentMatch) score += 1;
    }
    return { chunk, score, index, relevant: matchedKeyword };
  }).filter((hit) => hit.score > 0 && hit.relevant);
  const documents = hits.filter((hit) => hit.chunk.origin === 'document');
  return (documents.length ? documents : hits)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, Math.max(0, Math.min(limit, 3)))
    .map(({ chunk, score }) => ({ chunk, score }));
}
