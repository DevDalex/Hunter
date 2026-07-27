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
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('.route-loading')).toHaveCount(0, { timeout: 15_000 });

    expect(runtimeErrors).toEqual([]);
  });
}

test('Chimera Ant respects its minimum desktop viewport', async ({ page }) => {
  await page.goto('/#/series/chimera-ant', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#main-content')).toBeVisible();

  const horizontalOverflow = await page.evaluate(
    () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
  );

  expect(horizontalOverflow).toBeLessThanOrEqual(1);
});

test('Chimera Ant phase artwork uses generated manifest media', async ({ page }) => {
  await page.goto('/#/series/chimera-ant', { waitUntil: 'domcontentloaded' });
  const phaseImage = page.locator('[data-phase-id="ngl-expedition"] .chimera-phase-spread__media img');

  await phaseImage.scrollIntoViewIfNeeded();
  await expect(phaseImage).toBeVisible();
  await expect(phaseImage).toHaveAttribute('data-media-id', 'media:chimera-ant:kite-phase');
  await expect(phaseImage).toHaveAttribute('data-media-variant', 'phase');
  await expect(phaseImage).toHaveAttribute('src', '/media/generated/chimera-ant/kite-phase.avif');
  await expect(phaseImage).toHaveAttribute('data-image-loaded', 'true', { timeout: 15_000 });
  await expect(phaseImage).toHaveJSProperty('naturalWidth', 1200);
  await expect(phaseImage).toHaveJSProperty('naturalHeight', 800);
});
