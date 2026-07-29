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

const makePage = async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  const consoleErrors = [];
  const failedRequests = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} · ${request.failure()?.errorText || 'failed'}`));
  return { page, pageErrors, consoleErrors, failedRequests };
};

const inspect = async ({ page, pageErrors, consoleErrors, failedRequests }) => page.evaluate(({ pageErrors, consoleErrors, failedRequests }) => ({
  href: window.location.href,
  pathname: window.location.pathname,
  search: window.location.search,
  readyState: document.readyState,
  appClass: document.querySelector('#top')?.className || '',
  rootHtml: document.querySelector('#root')?.innerHTML?.slice(0, 500) || '',
  bodyHtml: document.body?.innerHTML?.slice(0, 800) || '',
  readerChapter: document.querySelector('.succession-reader')?.getAttribute('data-reader-chapter') || '',
  archiveRoute: document.querySelector('.succession-archive')?.getAttribute('data-archive-route') || '',
  routeLoading: document.querySelector('.route-loading')?.textContent?.trim() || '',
  notFound: document.querySelector('.view-not-found')?.textContent?.slice(0, 240) || '',
  mainText: document.querySelector('#main-content')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 500) || '',
  navigationType: performance.getEntriesByType('navigation')[0]?.type || '',
  pageErrors,
  consoleErrors,
  failedRequests,
}), { pageErrors, consoleErrors, failedRequests });

const direct = await makePage();
const bridge = await makePage();
try {
  await direct.page.goto(`${base}/story/succession-contest/chapter-records?entity=chapter%3A400`, {
    waitUntil: 'domcontentloaded',
    timeout: 25_000,
  });
  await direct.page.waitForTimeout(2_000);
  const directState = await inspect(direct);
  console.log(`Direct chapter-record diagnostic: ${JSON.stringify(directState)}`);

  await bridge.page.goto(`${base}/story/succession-contest/chapters?chapter=400&page=1&mode=page`, {
    waitUntil: 'domcontentloaded',
    timeout: 25_000,
  });
  await bridge.page.waitForSelector('.succession-reader[data-reader-chapter="400"]', { timeout: 15_000 });
  await bridge.page.keyboard.press('i');
  await bridge.page.waitForSelector('.succession-reader__chapter-info', { timeout: 8_000 });
  await bridge.page.locator('.succession-reader__chapter-info-actions .is-primary').click();
  await bridge.page.waitForTimeout(2_000);
  const bridgeState = await inspect(bridge);
  console.log(`Reader chapter-record bridge diagnostic: ${JSON.stringify(bridgeState)}`);

  const directWorks = directState.archiveRoute === 'chapters' && directState.appClass.includes('view-succession');
  const bridgeUrl = bridgeState.pathname.includes('/story/succession-contest/chapter-records')
    && new URLSearchParams(bridgeState.search).get('entity') === 'chapter:400';
  const bridgeWorks = bridgeState.archiveRoute === 'chapters' && bridgeState.appClass.includes('view-succession');
  const errors = [...directState.pageErrors, ...directState.consoleErrors, ...bridgeState.pageErrors, ...bridgeState.consoleErrors];
  if (!directWorks || !bridgeUrl || !bridgeWorks || errors.length) {
    throw new Error(`Reader chapter-record bridge failed: ${JSON.stringify({ directState, bridgeState })}`);
  }
  console.log('Reader chapter-record bridge QA passed.');
} finally {
  await direct.page.close();
  await bridge.page.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
