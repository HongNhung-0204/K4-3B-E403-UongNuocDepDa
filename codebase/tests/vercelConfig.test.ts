import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Vercel SPA routing', () => {
  it('rewrites app routes while preserving API and static assets', () => {
    const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as { rewrites: Array<{ source: string }> };
    const rewrite = new RegExp(`^${config.rewrites[0].source}$`);
    expect(rewrite.test('/campus')).toBe(true);
    expect(rewrite.test('/navigation/plaza-to-library')).toBe(true);
    expect(rewrite.test('/api/chat')).toBe(false);
    expect(rewrite.test('/maps/vinuni-campus.webp')).toBe(false);
    expect(rewrite.test('/assets/app.js')).toBe(false);
  });
});
