import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SEARCH_QA_OUTPUT || '.search-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';

const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
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

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const executablePath = await firstAvailable([
  requestedExecutable,
  chromium.executablePath(),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available. Run "npm run browser:install" or set CHROMIUM_PATH.');

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const runtimeErrors = [];
page.on('pageerror', (error) => runtimeErrors.push(error.message));

let result;
try {
  await page.goto(`${base}/#/home/`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('main', { timeout: 10_000 });
  await page.locator('.header-search-button').click();
  await page.waitForSelector('.archive-search-dialog[role="dialog"]');

  const input = page.locator('.archive-search-input input');
  await input.fill('Hisoka vs. Chrollo');
  await page.waitForFunction(() => document.querySelector('.archive-search-dialog')?.getAttribute('aria-busy') === 'false', null, { timeout: 15_000 });
  await page.waitForSelector('.archive-search-results button', { timeout: 15_000 });

  const first = page.locator('.archive-search-results button').first();
  const firstResult = (await first.innerText()).replace(/\s+/g, ' ').trim();
  if (!/Hisoka vs\. Chrollo/i.test(firstResult)) throw new Error(`punctuation-heavy query ranked an unexpected first result: ${firstResult}`);

  const resourceUrls = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name));
  const expectedShards = ['archiveSearch.series-', 'archiveSearch.succession-', 'archiveSearch.reference-'];
  const loadedShards = expectedShards.filter((shard) => resourceUrls.some((url) => url.includes(shard)));
  if (loadedShards.length !== expectedShards.length) throw new Error(`search did not load all domain shards: ${loadedShards.join(', ') || 'none'}`);

  await input.focus();
  await page.keyboard.press('ArrowDown');
  if (!await first.evaluate((node) => node === document.activeElement)) throw new Error('ArrowDown did not move focus from the search input to the first result');
  if (runtimeErrors.length) throw new Error(`runtime errors: ${runtimeErrors.join(' | ')}`);

  result = { status: 'passed', query: 'Hisoka vs. Chrollo', firstResult, loadedShards };
  process.stdout.write(`✓ archive search split, punctuation ranking, and keyboard focus · ${firstResult}\n`);
} catch (error) {
  const screenshot = path.join(output, 'archive-search-failure.png');
  await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
  result = { status: 'failed', error: error.message, runtimeErrors, screenshot: path.relative(root, screenshot) };
  process.stdout.write(`✗ archive search browser QA · ${error.message}\n`);
} finally {
  await page.close().catch(() => {});
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: 1, passed: result.status === 'passed' ? 1 : 0, failed: result.status === 'failed' ? 1 : 0 };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, result }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`Search QA: ${summary.passed}/${summary.checks} checks passed.`);
if (summary.failed) process.exitCode = 1;
