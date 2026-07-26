import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_READER_ENHANCEMENTS_QA_OUTPUT || '.succession-reader-enhancements-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const results = [];
const failures = [];
const mime = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json; charset=utf-8' };

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
  try {
    await test();
    results.push({ name, status: 'passed' });
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    const screenshot = path.join(output, `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot) };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const openReader = async (page, base, query = 'chapter=400&page=1&mode=page&fit=width&direction=rtl') => {
  await page.goto(`${base}/story/succession-contest/chapters?${query}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.succession-reader[data-reader-chapter="400"]', { timeout: 15_000 });
};

await mkdir(output, { recursive: true });
const executablePath = await firstAvailable([requestedExecutable, chromium.executablePath(), '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']);
if (!executablePath) throw new Error('No Chromium executable is available.');
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'] });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await record('Manual chapter completion persists independently', page, async () => {
    await openReader(page, base);
    await page.keyboard.press('i');
    await page.waitForSelector('.succession-reader__panel-enhancement');
    await page.getByRole('button', { name: 'Mark chapter complete', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.succession-reader[data-reader-chapter="400"]');
    const completed = await page.evaluate(() => JSON.parse(localStorage.getItem('hxh-succession-reader-state-v2') || '{}').chapters?.['400']?.completed);
    if (completed !== true) throw new Error('Manual chapter completion was not persisted');
    await page.keyboard.press('i');
    await page.waitForSelector('.succession-reader__panel-enhancement');
    if (await page.getByRole('button', { name: 'Mark chapter incomplete', exact: true }).count() !== 1) throw new Error('Completed chapter did not expose the inverse action');
  });

  await record('Bookmark-only reset preserves reading progress', page, async () => {
    await openReader(page, base);
    const bookmark = page.getByRole('button', { name: 'Bookmark current page' });
    if (await bookmark.count()) await bookmark.click();
    await page.getByRole('button', { name: 'Reader settings' }).click();
    await page.waitForSelector('.succession-reader__settings');
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Clear bookmarks only', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.succession-reader[data-reader-chapter="400"]');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hxh-succession-reader-state-v2') || '{}'));
    if (saved.bookmarks?.length) throw new Error('Bookmark-only reset left bookmarks behind');
    if (!saved.chapters?.['400']) throw new Error('Bookmark-only reset removed chapter progress');
  });

  await record('Direct command syntax opens exact chapter and page', page, async () => {
    await openReader(page, base, 'chapter=400&page=1&mode=page&fit=width&direction=rtl&panel=commands');
    const input = page.locator('.succession-reader-panel--commands input[data-reader-autofocus]');
    await input.waitFor({ state: 'visible' });
    await input.fill('400:7');
    await input.press('Enter');
    await page.waitForFunction(() => {
      const url = new URL(location.href);
      return url.searchParams.get('chapter') === '400' && url.searchParams.get('page') === '7' && !url.searchParams.has('panel');
    });
    if (!page.url().includes('page=7')) throw new Error('chapter:page command did not preserve page 7');

    await openReader(page, base, 'chapter=400&page=7&mode=page&fit=width&direction=rtl&panel=commands');
    const secondInput = page.locator('.succession-reader-panel--commands input[data-reader-autofocus]');
    await secondInput.waitFor({ state: 'visible' });
    await secondInput.fill('bookmarks');
    await secondInput.press('Enter');
    await page.waitForSelector('.succession-reader__bookmark-current');
    if (!page.url().includes('panel=bookmarks')) throw new Error('Panel command did not open Bookmarks');
  });

  await page.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession reader enhancements QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
