import { withPreviewPage } from './lib/browserSmoke.mjs';

await withPreviewPage({ port: 4173 }, async ({ page }) => {
  if (!(await page.locator('body').isVisible())) throw new Error('homepage body is not visible');
  const text = (await page.locator('body').innerText()).trim();
  if (!text) throw new Error('homepage rendered no visible text');
  console.log(`Homepage smoke QA passed: ${text.length} characters of visible content rendered without page errors.`);
});
