import { expect, test } from '@playwright/test';

const routes = [
  { name: 'archive home', path: '/#/home/' },
  { name: 'Chimera Ant archive', path: '/#/series/chimera-ant' },
];

for (const route of routes) {
  test(`${route.name} renders without runtime errors`, async ({ page }) => {
    /** @type {string[]} */
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));

    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.route-loading')).toHaveCount(0, { timeout: 15_000 });

    expect(runtimeErrors).toEqual([]);
  });
}

test('Chimera Ant respects its minimum desktop viewport', async ({ page }) => {
  await page.goto('/#/series/chimera-ant', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toBeVisible();

  const horizontalOverflow = await page.evaluate(
    () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
  );

  expect(horizontalOverflow).toBeLessThanOrEqual(1);
});
