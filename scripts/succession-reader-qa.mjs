import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from '../src/data/successionChapterAvailability.generated.js';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_READER_QA_OUTPUT || '.succession-reader-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const results = [];
const failures = [];
const LATEST_CHAPTER = Math.max(414, LATEST_AUTHORIZED_SUCCESSION_CHAPTER);
const EXPECTED_CHAPTER_TOTAL = LATEST_CHAPTER - 338 + 1;

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
  const onPageError = (error) => runtimeErrors.push(error.message);
  page.on('pageerror', onPageError);
  try {
    await test();
    if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
    results.push({ name, status: 'passed' });
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    const screenshot = path.join(output, `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  } finally {
    page.off('pageerror', onPageError);
  }
};

const openReader = async (page, base, query = 'chapter=338&page=1&mode=page&fit=width&direction=rtl') => {
  await page.goto(`${base}/story/succession-contest/chapters?${query}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.succession-reader[data-reader-chapter]', { timeout: 15_000 });
  return page.locator('.succession-reader');
};

await mkdir(output, { recursive: true });
const executablePath = await firstAvailable([
  requestedExecutable,
  chromium.executablePath(),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available.');

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await record('Reader route is standalone and reading-first', desktop, async () => {
    const reader = await openReader(desktop, base);
    if (await desktop.locator('.arc-page, .succession-archive').count()) throw new Error('Reader is still wrapped by a story hero or archive shell');
    if (await reader.locator('.succession-reader__topbar').count() !== 1) throw new Error('Compact reader top bar is missing');
    if (await reader.locator('.succession-reader__bottombar').count() !== 1) throw new Error('Reader bottom navigation is missing');
    if (await reader.locator('.succession-reader__canvas').count() !== 1) throw new Error('Reading canvas is missing');
    if (await reader.locator('.succession-reader__heading, .succession-reader__status, .succession-reader__directory').count()) throw new Error('Legacy dashboard reader UI is still mounted');
    if ((await desktop.locator('body').innerText()).includes('public/media/succession-contest')) throw new Error('Public reader exposes an internal media path');
    if (await reader.getAttribute('data-reader-chapter') !== '338') throw new Error('Direct chapter URL did not open Chapter 338');
    if (await reader.getAttribute('data-reader-mode') !== 'page') throw new Error('Page mode route state was not applied');
    if (await reader.getAttribute('data-reader-fit') !== 'width') throw new Error('Fit route state was not applied');
    if (await reader.getAttribute('data-reader-direction') !== 'rtl') throw new Error('Direction route state was not applied');
  });

  await record('Chapter drawer exposes the complete grouped catalogue', desktop, async () => {
    const reader = await openReader(desktop, base);
    await reader.getByRole('button', { name: 'Chapters', exact: true }).click();
    await desktop.waitForSelector('.succession-reader-panel [role="dialog"]');
    const chapterButtons = desktop.locator('.succession-reader__chapter-groups > section > div > button');
    if (await chapterButtons.count() !== EXPECTED_CHAPTER_TOTAL) throw new Error(`Chapter drawer contains ${await chapterButtons.count()} records instead of ${EXPECTED_CHAPTER_TOTAL}`);
    const labels = await chapterButtons.locator('.succession-reader__chapter-number').allInnerTexts();
    if (Number(labels[0]) !== 338 || Number(labels.at(-1)) !== LATEST_CHAPTER) throw new Error(`Chapter boundaries drifted: ${labels[0]}–${labels.at(-1)}`);
    const search = desktop.locator('.succession-reader__chapter-tools input');
    await search.fill(String(LATEST_CHAPTER));
    if (await chapterButtons.count() !== 1) throw new Error(`Chapter search did not isolate Chapter ${LATEST_CHAPTER}`);
    await chapterButtons.first().click();
    await desktop.waitForFunction((chapter) => document.querySelector('.succession-reader')?.dataset.readerChapter === String(chapter), LATEST_CHAPTER);
    if (!desktop.url().includes(`chapter=${LATEST_CHAPTER}`)) throw new Error('Latest chapter selection did not persist in the URL');
  });

  await record('Reader modes fit direction and panels preserve URL state', desktop, async () => {
    const reader = await openReader(desktop, base, 'chapter=400&page=1&mode=spread&fit=height&direction=ltr');
    if (await reader.getAttribute('data-reader-mode') !== 'spread') throw new Error('Spread mode did not initialize');
    if (await reader.getAttribute('data-reader-fit') !== 'height') throw new Error('Fit-height did not initialize');
    if (await reader.getAttribute('data-reader-direction') !== 'ltr') throw new Error('LTR direction did not initialize');

    await desktop.keyboard.press('Control+k');
    await desktop.waitForSelector('.succession-reader-panel--commands [role="dialog"]');
    if (!desktop.url().includes('panel=commands')) throw new Error('Command palette state is not represented in the URL');
    await desktop.keyboard.press('Escape');
    await desktop.waitForSelector('.succession-reader-panel--commands', { state: 'detached' });

    await reader.getByRole('button', { name: 'Reader settings' }).click();
    await desktop.waitForSelector('.succession-reader__settings');
    await desktop.getByRole('button', { name: 'Scroll', exact: true }).click();
    await desktop.waitForFunction(() => document.querySelector('.succession-reader')?.dataset.readerMode === 'scroll');
    if (!desktop.url().includes('mode=scroll')) throw new Error('Mode change did not update the route');
    await desktop.getByRole('button', { name: 'Right to left', exact: true }).click();
    if (!desktop.url().includes('direction=rtl')) throw new Error('Direction change did not update the route');
    await desktop.keyboard.press('Escape');
  });

  await record('Bookmarks persist and chapter information bridges to archive records', desktop, async () => {
    let reader = await openReader(desktop, base, 'chapter=400&page=1&mode=page');
    await reader.getByRole('button', { name: 'Bookmark current page' }).click();
    const saved = await desktop.evaluate(() => JSON.parse(localStorage.getItem('hxh-succession-reader-state-v2') || '{}'));
    if (!saved.bookmarks?.some((bookmark) => bookmark.chapter === 400 && bookmark.page === 1)) throw new Error('Current page bookmark was not persisted');

    await reader.getByRole('button', { name: 'Reader settings' }).click();
    await desktop.getByRole('button', { name: /Manage 1 bookmark/ }).click();
    await desktop.waitForSelector('.succession-reader__bookmark-list article');
    await desktop.keyboard.press('Escape');

    await desktop.keyboard.press('i');
    await desktop.waitForSelector('.succession-reader__chapter-info');
    const recordButton = desktop.getByRole('button', { name: /Open Chapter Record/ });
    if (await recordButton.count() !== 1) throw new Error('Chapter information panel does not expose the archive record bridge');
    await recordButton.click();
    await desktop.waitForSelector('.succession-archive[data-archive-route="chapters"]', { timeout: 15_000 });
    if (!desktop.url().includes('entity=chapter%3A400')) throw new Error('Chapter record bridge did not preserve the canonical chapter ID');

    reader = await openReader(desktop, base, 'chapter=400&page=1&mode=page');
    const persisted = await desktop.evaluate(() => JSON.parse(localStorage.getItem('hxh-succession-reader-state-v2') || '{}'));
    if (persisted.lastChapter !== 400) throw new Error('Reader progress did not survive route navigation');
  });

  await record('Keyboard chapter navigation remains available', desktop, async () => {
    const reader = await openReader(desktop, base, 'chapter=338&page=1&mode=page');
    await reader.focus();
    await desktop.keyboard.press('PageDown');
    await desktop.waitForFunction(() => document.querySelector('.succession-reader')?.dataset.readerChapter === '339');
    await desktop.keyboard.press('PageUp');
    await desktop.waitForFunction(() => document.querySelector('.succession-reader')?.dataset.readerChapter === '338');
    await desktop.keyboard.press('?');
    await desktop.waitForSelector('.succession-reader__shortcuts');
    await desktop.keyboard.press('Escape');
  });

  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', isMobile: true });
  await record('Mobile reader is contained and uses accessible sheets', mobile, async () => {
    const reader = await openReader(mobile, base, `chapter=${LATEST_CHAPTER}&page=1&mode=page`);
    const state = await mobile.evaluate(() => ({
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      readerWidth: document.querySelector('.succession-reader')?.getBoundingClientRect().width || 0,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      arcPage: Boolean(document.querySelector('.arc-page')),
      archiveShell: Boolean(document.querySelector('.succession-archive')),
    }));
    if (state.arcPage || state.archiveShell) throw new Error('Mobile reader is wrapped by another application shell');
    if (state.overflow > 1) throw new Error(`Reader overflowed mobile viewport by ${state.overflow}px`);
    if (state.readerWidth > 390.5) throw new Error(`Reader exceeds mobile width: ${state.readerWidth}`);
    if (!state.reducedMotion) throw new Error('Reduced-motion emulation was not active');

    await reader.getByRole('button', { name: 'Chapters', exact: true }).click();
    await mobile.waitForSelector('.succession-reader-panel--left [role="dialog"]');
    const sheet = mobile.locator('.succession-reader-panel--left > section');
    if ((await sheet.boundingBox()).width > 390.5) throw new Error('Mobile chapter sheet exceeds the viewport');
    const firstInput = mobile.locator('.succession-reader__chapter-tools input');
    if (!await firstInput.evaluate((node) => node === document.activeElement)) throw new Error('Chapter search did not receive initial panel focus');
    await mobile.keyboard.press('Escape');
    await mobile.waitForSelector('.succession-reader-panel--left', { state: 'detached' });
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession chapter reader QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
