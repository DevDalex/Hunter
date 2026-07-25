import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_FINAL_PRODUCT_QA_OUTPUT || '.succession-final-product-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const results = [];
const failures = [];
const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json; charset=utf-8',
};

const firstAvailable = async (candidates) => {
  for (const candidate of candidates.filter(Boolean)) {
    try { await access(candidate); return candidate; } catch { /* continue */ }
  }
  return '';
};

const serve = async () => {
  await access(path.join(dist, 'index.html'));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let filename = path.join(dist, pathname === '/' ? 'index.html' : pathname);
      if (!filename.startsWith(dist)) throw new Error('Invalid path');
      try { if ((await stat(filename)).isDirectory()) filename = path.join(dist, 'index.html'); } catch { filename = path.join(dist, 'index.html'); }
      response.setHeader('content-type', mime[path.extname(filename).toLowerCase()] || 'application/octet-stream');
      response.setHeader('cache-control', 'no-store');
      response.end(await readFile(filename));
    } catch (error) {
      response.statusCode = 500;
      response.end(error.message);
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return server;
};

const record = async (name, page, test) => {
  const runtimeErrors = [];
  const consoleErrors = [];
  const onPageError = (error) => runtimeErrors.push(error.message);
  const onConsole = (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); };
  page.on('pageerror', onPageError);
  page.on('console', onConsole);
  try {
    await test();
    if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
    if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join(' | ')}`);
    results.push({ name, status: 'passed' });
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    const screenshot = path.join(output, `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors, consoleErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  } finally {
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
  }
};

const horizontalOverflow = (page) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
const resultGroup = (page, heading) => page.locator('.succession-search-complete__groups > section').filter({ has: page.getByRole('heading', { name: heading, exact: true }) });

await mkdir(output, { recursive: true });
const executablePath = await firstAvailable([
  requestedExecutable, chromium.executablePath(), '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available.');
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'] });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await record('Grouped search explains glossary and media matches', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest/search`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector('.succession-search-complete input', { timeout: 15_000 });
    const input = desktop.locator('.succession-search-complete input');
    await input.fill('GSB');
    const glossaryGroup = resultGroup(desktop, 'Glossary');
    await glossaryGroup.waitFor({ state: 'visible', timeout: 15_000 });
    const glossaryResult = glossaryGroup.locator('article').filter({ hasText: 'Guardian Spirit Beast' }).first();
    await glossaryResult.waitFor({ state: 'visible', timeout: 15_000 });
    const reason = await glossaryResult.locator('small').innerText();
    if (!reason.trim()) throw new Error('Search result does not explain why it matched');

    await input.fill('Kurapika portrait');
    const mediaGroup = resultGroup(desktop, 'media');
    await mediaGroup.waitFor({ state: 'visible', timeout: 15_000 });
    const mediaResult = mediaGroup.locator('article').filter({ hasText: 'Kurapika' }).first();
    await mediaResult.waitFor({ state: 'visible', timeout: 15_000 });
    const mediaReason = await mediaResult.locator('small').innerText();
    if (!mediaReason.toLowerCase().includes('media')) throw new Error(`Media result explanation is incomplete: ${mediaReason}`);
  });

  await record('Search opens a graph-connected glossary dossier and browser back restores search', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest/search`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    const input = desktop.locator('.succession-search-complete input');
    await input.fill('GSB');
    const glossaryGroup = resultGroup(desktop, 'Glossary');
    const result = glossaryGroup.locator('article').filter({ hasText: 'Guardian Spirit Beast' }).first();
    await result.getByRole('button', { name: 'Open', exact: true }).click();
    await desktop.waitForSelector('.succession-product-dossier #glossary-dossier-title', { timeout: 15_000 });
    if (!desktop.url().includes('/glossary') || !desktop.url().includes('term=glossary%3Aguardian-spirit-beast')) throw new Error(`Glossary deep link was not preserved: ${desktop.url()}`);
    const graphLinks = desktop.locator('.succession-product-links > button, .succession-product-links > .succession-entity-link');
    if (await graphLinks.count() < 15) throw new Error(`Guardian Spirit Beast glossary graph is incomplete: ${await graphLinks.count()} links`);
    const systemLink = desktop.locator('.succession-product-links > button').filter({ hasText: 'Guardian Spirit Beast Contract' });
    if (!await systemLink.count()) throw new Error('Glossary does not link to the canonical Guardian Spirit Beast Nen system');
    await desktop.goBack({ waitUntil: 'domcontentloaded' });
    await desktop.waitForSelector('.succession-search-complete input', { timeout: 15_000 });
  });

  await record('Media library exposes alt text provenance and canonical subjects', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest/media`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    const cards = desktop.locator('.succession-media-canonical__grid > article');
    await cards.first().waitFor({ state: 'visible', timeout: 15_000 });
    if (await cards.count() < 20) throw new Error(`Media library is unexpectedly sparse: ${await cards.count()} records`);
    const images = cards.locator('img');
    const imageCount = await images.count();
    if (!imageCount) throw new Error('Media library rendered no images');
    for (let index = 0; index < imageCount; index += 1) {
      const alt = await images.nth(index).getAttribute('alt');
      if (!alt?.trim()) throw new Error(`Media image ${index + 1} has no alt text`);
    }
    await cards.first().getByRole('button', { name: /Open provenance/i }).click();
    await desktop.waitForSelector('.succession-media-dossier', { timeout: 15_000 });
    if (!await desktop.locator('.succession-media-dossier__visual code').count()) throw new Error('Media dossier does not expose its stable media ID');
    const provenance = desktop.getByRole('link', { name: /Open provenance/i });
    if (!await provenance.count()) throw new Error('Media dossier has no provenance link');
    if ((await provenance.getAttribute('rel')) !== 'noreferrer noopener') throw new Error('External provenance link is missing safe rel attributes');
    if (!await desktop.locator('.succession-product-links .succession-entity-link').count()) throw new Error('Media dossier does not link to canonical subjects');
  });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await record('Final Search Glossary and Media remain usable on mobile', mobile, async () => {
    for (const [route, selector] of [
      ['search', '.succession-search-complete'],
      ['glossary', '.succession-glossary-canonical'],
      ['media', '.succession-media-canonical'],
    ]) {
      await mobile.goto(`${base}/story/succession-contest/${route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await mobile.waitForSelector(selector, { timeout: 15_000 });
      const overflow = await horizontalOverflow(mobile);
      if (overflow > 1) throw new Error(`${route} overflows the mobile viewport by ${overflow}px`);
    }
    const mediaFilterButtons = mobile.locator('.succession-product-tools [role="group"] button');
    if (!await mediaFilterButtons.count()) throw new Error('Mobile media filters are not reachable');
  });

  await desktop.close();
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession final product QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
