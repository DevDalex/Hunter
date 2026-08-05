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
  await page.waitForSelector('.succession-archive[data-archive-route="search"]', { timeout: 10_000 });

  const input = page.locator('.succession-search-workspace input');
  await input.waitFor({ state: 'visible', timeout: 10_000 });
  if (!await input.evaluate((node) => node === document.activeElement)) throw new Error('routed search input did not receive focus');

  await input.fill('Kurapika');
  const matchingResult = page.locator('.succession-search-complete__groups article').filter({ hasText: 'Kurapika' }).first();
  await matchingResult.waitFor({ state: 'visible', timeout: 15_000 });
  const firstResult = (await matchingResult.innerText()).replace(/\s+/g, ' ').trim();
  if (!/Kurapika/i.test(firstResult)) throw new Error(`canonical query returned an unexpected result: ${firstResult}`);

  const openButton = matchingResult.locator('button');
  await openButton.focus();
  if (!await openButton.evaluate((node) => node === document.activeElement)) throw new Error('search result action did not accept keyboard focus');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.succession-archive[data-archive-route="characters"]', { timeout: 10_000 });
  if (runtimeErrors.length) throw new Error(`runtime errors: ${runtimeErrors.join(' | ')}`);

  result = { status: 'passed', query: 'Kurapika', firstResult, destination: 'succession/characters' };
  process.stdout.write(`✓ routed Succession search, canonical result, and keyboard activation · ${firstResult}\n`);
} catch (error) {
  const screenshot = path.join(output, 'succession-search-failure.png');
  await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
  result = { status: 'failed', error: error.message, runtimeErrors, screenshot: path.relative(root, screenshot) };
  process.stdout.write(`✗ routed Succession search browser QA · ${error.message}\n`);
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
