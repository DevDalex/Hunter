import { withPreviewPage } from './lib/browserSmoke.mjs';

const routes = ['/', '/timeline', '/characters', '/nen'];

await withPreviewPage({ port: 4173 }, async ({ page, baseUrl }) => {
  for (const route of routes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`${route} failed with HTTP ${response?.status() ?? 'unknown'}`);
    if (!(await page.locator('body').isVisible())) throw new Error(`${route} body is not visible`);
    const text = (await page.locator('body').innerText()).trim();
    if (!text) throw new Error(`${route} rendered no visible text`);
  }
  console.log(`Browser smoke QA passed: ${routes.join(', ')} rendered without page errors.`);
});
