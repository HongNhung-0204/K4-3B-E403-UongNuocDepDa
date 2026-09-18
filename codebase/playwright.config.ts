import { defineConfig } from '@playwright/test';

const production = process.env.PLAYWRIGHT_TARGET === 'render';
const port = production ? 10002 : 5173;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  testMatch: '*.e2e.ts',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL,
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: production ? 'node dist-server/render.js' : 'npm run dev -- --host 127.0.0.1',
    url: baseURL,
    env: production ? { PORT: String(port), ANTHROPIC_API_KEY: '', ANTHROPIC_BASE_URL: '', ANTHROPIC_MODEL: '' } : undefined,
    reuseExistingServer: !production,
    timeout: 30_000,
  },
});
