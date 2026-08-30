import { withPreviewPage } from './lib/browserSmoke.mjs';

const searchSelector = ['input[type="search"]', 'input[placeholder*="search" i]', 'input[aria-label*="search" i]', '[role="search"] input'].join(',');

await withPreviewPage({ port: 4175 }, async ({ page, baseUrl }) => {
  let input = page.locator(searchSelector).first();
  if ((await input.count()) === 0) {
    const links = page.locator('a[href]');
    const count = Math.min(await links.count(), 100);
    for (let index = 0; index < count; index += 1) {
      const link = links.nth(index);
      const href = await link.getAttribute('href');
      if (!href) continue;
      let target;
      try { target = new URL(href, baseUrl); } catch { continue; }
      const label = await link.innerText().catch(() => '');
      if (target.origin !== baseUrl || !/search/i.test(`${target.pathname}${label}`)) continue;
      await link.click();
      await page.waitForLoadState('networkidle');
      input = page.locator(searchSelector).first();
      if ((await input.count()) > 0) break;
    }
  }
  if ((await input.count()) === 0) {
    console.log('Search smoke QA skipped: this version of the site exposes no search input.');
    return;
  }
  await input.fill('Kurapika');
  await page.waitForTimeout(600);
  let text = await page.locator('body').innerText();
  if (!/Kurapika/i.test(text)) {
    await input.press('Enter').catch(() => {});
    await page.waitForTimeout(600);
    text = await page.locator('body').innerText();
  }
  if (!/Kurapika/i.test(text)) throw new Error('search input is present but produced no visible result for Kurapika');
  console.log('Search smoke QA passed.');
});
