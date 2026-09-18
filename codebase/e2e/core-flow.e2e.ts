import { expect, test } from '@playwright/test';

test('Home → Chat → source → campus map → navigation complete', async ({ page }) => {
  const browserErrors: string[] = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(`${message.text()} @ ${message.location().url}`); });
  page.on('response', (response) => { if (response.status() >= 400) browserErrors.push(`HTTP ${response.status()} ${response.url()}`); });
  await page.goto('/');
  await page.getByRole('link', { name: 'Hỏi MyViUni AI' }).click();
  await expect(page).toHaveURL(/\/chat$/);
  await page.getByRole('button', { name: 'Thư viện mở đến mấy giờ và ở đâu?' }).click();
  await expect(page.locator('.answer-card')).toContainText('Building C');
  await expect(page.locator('.answer-card')).toContainText('Chưa xác minh');
  await expect(page.locator('.answer-card')).toContainText('Thư viện Trung tâm');
  await page.getByRole('link', { name: 'Xem trên Campus Map' }).click();
  await expect(page).toHaveURL(/\/campus\?destination=library-c$/);
  await expect(page.locator('img[src="/maps/vinuni-campus.webp"]')).toBeVisible();
  expect(await page.locator('img[src="/maps/vinuni-campus.webp"]').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1600);
  await expect(page.locator('.campus-map__marker.is-selected[aria-label*="Building C"]')).toHaveCount(1);
  await expect(page.locator('.campus-map__route')).toHaveCount(1);
  await page.getByRole('button', { name: 'Bắt đầu chỉ đường' }).click();
  await expect(page).toHaveURL(/\/navigation\/plaza-to-library$/);
  await expect(page.getByText('Bước 1/4')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Trước' })).toBeDisabled();
  await page.getByRole('button', { name: 'Tiếp theo' }).click();
  await expect(page.getByText('Bước 2/4')).toBeVisible();
  await page.getByRole('button', { name: 'Trước' }).click();
  await expect(page.getByText('Bước 1/4')).toBeVisible();
  for (let index = 0; index < 3; index += 1) await page.getByRole('button', { name: 'Tiếp theo' }).click();
  await page.getByRole('button', { name: 'Hoàn tất' }).click();
  await expect(page.getByRole('heading', { name: 'Bạn đã đến nơi' })).toBeVisible();
  await page.getByRole('button', { name: 'Kết thúc và xem bản đồ' }).click();
  await expect(page).toHaveURL(/\/campus\?destination=library-c$/);
  expect(browserErrors).toEqual([]);
});

test('direct campus load and unknown routes remain usable', async ({ page }) => {
  await page.goto('/campus?destination=library-c');
  await expect(page.locator('.campus-map__route')).toHaveCount(1);
  await page.goto('/campus?destination=not-here');
  await expect(page.getByText('Không tìm thấy điểm đến trong bản đồ demo.')).toBeVisible();
  await expect(page.locator('.campus-map__route')).toHaveCount(0);
  await page.goto('/navigation/missing-route');
  await expect(page.getByRole('heading', { name: 'Không tìm thấy tuyến' })).toBeVisible();
  await page.getByRole('button', { name: 'Quay lại Campus' }).click();
  await expect(page).toHaveURL(/\/campus$/);
});

test('no-source and retry paths', async ({ page }) => {
  await page.goto('/chat');
  const composer = page.getByRole('textbox', { name: 'Nhập câu hỏi' });
  await composer.fill('Thời tiết trên sao Hỏa hôm nay?');
  await composer.press('Enter');
  await expect(page.locator('.answer-card')).toContainText('chưa tìm thấy thông tin đủ tin cậy');
  await expect(page.locator('.answer-card .source-card')).toHaveCount(0);

  let requests = 0;
  await page.route('**/api/chat', async (route) => {
    requests += 1;
    if (requests === 1) await route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'Dịch vụ AI tạm thời không phản hồi.', code: 'UPSTREAM_UNAVAILABLE' }) });
    else await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ answer: 'CECS Lab được gắn với Building B trong dữ liệu demo.', confidence: { level: 'high', label: 'Khớp dữ liệu tham khảo' }, sources: [{ id: 'cecs-lab', title: 'CECS Lab trên bản đồ demo', source: 'Bộ dữ liệu demo MyViUni AI', section: 'Phòng lab', page: null, verified: false }], locationId: 'building-b', mode: 'live' }) });
  });
  await composer.fill('CECS Lab ở tòa nào?');
  await composer.press('Enter');
  await expect(page.getByRole('alert')).toContainText('Dịch vụ AI tạm thời không phản hồi.');
  await page.getByRole('button', { name: 'Thử lại' }).click();
  await expect(page.locator('.answer-card').last()).toContainText('Building B');
  expect(requests).toBe(2);
});

test('390px and desktop do not overflow horizontally', async ({ page }) => {
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.goto('/chat');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.goto('/campus?destination=library-c');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('keyboard map selection and chat controls are accessible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  expect(await page.locator(':focus-visible').count()).toBeGreaterThan(0);
  await page.goto('/campus');
  const marker = page.locator('.campus-map__marker[aria-label*="Building C"]');
  await marker.focus();
  await page.keyboard.press('Enter');
  await expect(marker).toHaveClass(/is-selected/);
  await page.goto('/chat');
  const composer = await page.locator('.chat-composer').boundingBox();
  const nav = await page.locator('.bottom-nav').boundingBox();
  expect(composer && nav && composer.y + composer.height <= nav.y + 1).toBeTruthy();
});
