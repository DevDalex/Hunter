import { createServer } from 'node:http';
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const firstAvailable = async (candidates) => {
  for (const candidate of candidates.filter(Boolean)) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue to the next installed browser.
    }
  }
  return '';
};

const executablePath = await firstAvailable([
  requestedExecutable,
  chromium.executablePath(),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available for reader bridge QA.');

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    let filename = path.join(dist, pathname === '/' ? 'index.html' : pathname);
    if (!filename.startsWith(dist)) throw new Error('Invalid path');
    try {
      if ((await stat(filename)).isDirectory()) filename = path.join(dist, 'index.html');
    } catch {
      filename = path.join(dist, 'index.html');
    }
    response.setHeader('content-type', mime[path.extname(filename).toLowerCase()] || 'application/octet-stream');
    response.setHeader('cache-control', 'no-store');
    response.end(await readFile(filename));
  } catch (error) {
    response.statusCode = 500;
    response.end(error.message);
  }
});

await access(path.join(dist, 'index.html'));
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const runtimeErrors = [];
page.on('pageerror', (error) => runtimeErrors.push(error.message));

try {
  await page.goto(`${base}/story/succession-contest/chapters?chapter=400&page=1&mode=page`, {
    waitUntil: 'domcontentloaded',
    timeout: 25_000,
  });
  await page.waitForSelector('.succession-reader[data-reader-chapter="400"]', { timeout: 15_000 });
  await page.keyboard.press('i');
  await page.waitForSelector('.succession-reader__chapter-info', { timeout: 8_000 });
  const button = page.locator('.succession-reader__chapter-info-actions .is-primary');
  await button.click();
  await page.waitForTimeout(2_000);

  const state = await page.evaluate(() => ({
    href: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    appClass: document.querySelector('#top')?.className || '',
    readerChapter: document.querySelector('.succession-reader')?.getAttribute('data-reader-chapter') || '',
    archiveRoute: document.querySelector('.succession-archive')?.getAttribute('data-archive-route') || '',
    routeLoading: document.querySelector('.route-loading')?.textContent?.trim() || '',
    notFound: document.querySelector('.view-not-found')?.textContent?.slice(0, 240) || '',
    mainText: document.querySelector('#main-content')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 500) || '',
  }));
  const diagnostic = { ...state, runtimeErrors };
  console.log(`Reader chapter-record bridge diagnostic: ${JSON.stringify(diagnostic)}`);

  const correctUrl = state.pathname.includes('/story/succession-contest/chapter-records')
    && new URLSearchParams(state.search).get('entity') === 'chapter:400';
  const correctWorkspace = state.archiveRoute === 'chapters';
  if (!correctUrl || !correctWorkspace || runtimeErrors.length) {
    throw new Error(`Reader chapter-record bridge failed: ${JSON.stringify(diagnostic)}`);
  }
  console.log('Reader chapter-record bridge QA passed.');
} finally {
  await page.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
