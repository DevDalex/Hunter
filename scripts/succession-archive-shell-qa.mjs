import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from '../src/data/successionChapterAvailability.generated.js';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_ARCHIVE_QA_OUTPUT || '.succession-archive-shell-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const results = [];
const failures = [];
const expectedChapterCount = LATEST_AUTHORIZED_SUCCESSION_CHAPTER - 340 + 1;
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

const openWorkspace = async (page, base, route, selector) => {
  await page.goto(`${base}/story/succession-contest/${route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector(selector, { timeout: 15_000 });
  return page.locator(selector);
};

const horizontalOverflow = (page) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);

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

  await record('Succession root opens the dedicated archive shell', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector('.succession-archive[data-archive-route="archive"]', { timeout: 15_000 });
    if (await desktop.locator('.succession-archive__sidebar').count() !== 1) throw new Error('Persistent archive sidebar is missing or duplicated');
    const title = await desktop.locator('.succession-page-header h1').innerText();
    if (title.trim() !== 'Succession Contest Archive') throw new Error(`Unexpected archive title: ${title}`);
    if (await desktop.locator('.arc-page--succession-contest').count()) throw new Error('Legacy grouped arc page is still mounted at the archive root');
  });

  await record('Character workspace is visual and dossier-linked', desktop, async () => {
    const cards = await openWorkspace(desktop, base, 'characters', '.succession-character-ledger > button');
    const cardCount = await cards.count();
    if (cardCount < 150) throw new Error(`Expanded character catalogue is incomplete: ${cardCount} cards`);
    if (await cards.locator('.succession-entity-visual').count() !== cardCount) throw new Error('Every character card needs a visual frame');
    const billCard = cards.filter({ hasText: 'Bill' }).first();
    await billCard.click();
    await desktop.waitForSelector('.succession-character-dossier', { timeout: 15_000 });
    if (!desktop.url().includes('entity=character%3Abill')) throw new Error('Character dossier did not preserve Bill’s stable ID');
  });

  await record('Royal workspaces contain fourteen princes and eight queens', desktop, async () => {
    const princeCards = await openWorkspace(desktop, base, 'princes', '.succession-prince-board__grid > .succession-prince-card');
    if (await princeCards.count() !== 14) throw new Error(`Prince board count is ${await princeCards.count()}, expected 14`);
    const princeNames = await princeCards.locator('h3').allInnerTexts();
    if (!princeNames[0]?.includes('Benjamin') || !princeNames[13]?.includes('Woble')) throw new Error('Princes are not ordered First through Fourteenth');
    await desktop.getByRole('button', { name: 'Open family tree', exact: true }).click();
    await desktop.waitForSelector('.succession-migration-note', { timeout: 15_000 });
    if (!desktop.url().includes('view=tree')) throw new Error('Family tree did not open as an explicit optional view');
    const queenCards = await openWorkspace(desktop, base, 'queens', '.succession-queen-board .succession-queen-card');
    if (await queenCards.count() !== 8) throw new Error(`Queen board count is ${await queenCards.count()}, expected 8`);
  });

  await record('Assignment Hunter mafia and military workspaces expose canonical structures', desktop, async () => {
    const assignments = await openWorkspace(desktop, base, 'bodyguards', '.succession-assignment-card');
    if (await assignments.count() < 30) throw new Error(`Assignment workspace is incomplete: ${await assignments.count()}`);
    const hunters = await openWorkspace(desktop, base, 'hunters', '.succession-hunter-missions button');
    if (await hunters.count() < 20) throw new Error(`Hunter mission workspace is incomplete: ${await hunters.count()}`);
    const mafiaFamilies = await openWorkspace(desktop, base, 'mafia', '.succession-mafia-workspace__families > div > article');
    if (await mafiaFamilies.count() !== 3) throw new Error(`Mafia comparison has ${await mafiaFamilies.count()} families; expected 3`);
    const military = await openWorkspace(desktop, base, 'military', '.succession-military-people .succession-extended-entity');
    if (await military.count() < 20) throw new Error(`Military personnel workspace is incomplete: ${await military.count()}`);
  });

  await record(`Beast and chapter workspaces are complete through Chapter ${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}`, desktop, async () => {
    const beasts = await openWorkspace(desktop, base, 'guardian-spirit-beasts', '.succession-gsb-grid > button');
    if (await beasts.count() !== 15) throw new Error(`Guardian Spirit Beast count is ${await beasts.count()}, expected 15`);
    const chapters = await openWorkspace(desktop, base, 'chapter-records', '.succession-chapter-intel__index > div > button');
    if (await chapters.count() !== expectedChapterCount) throw new Error(`Chapter record count is ${await chapters.count()}, expected ${expectedChapterCount}`);
    const latest = chapters.filter({ hasText: String(LATEST_AUTHORIZED_SUCCESSION_CHAPTER) }).first();
    if (!await latest.count()) throw new Error(`Chapter ${LATEST_AUTHORIZED_SUCCESSION_CHAPTER} research record is missing`);
  });

  await record('Research glossary and media routes use final canonical workspaces', desktop, async () => {
    const sources = await openWorkspace(desktop, base, 'research', '.succession-source-catalogue article');
    if (await sources.count() < 75) throw new Error(`Research source catalogue is incomplete: ${await sources.count()}`);
    const glossary = await openWorkspace(desktop, base, 'glossary', '.succession-glossary-canonical__grid > article');
    if (await glossary.count() < 20) throw new Error(`Glossary is incomplete: ${await glossary.count()} terms`);
    const media = await openWorkspace(desktop, base, 'media', '.succession-media-canonical__grid > article');
    if (await media.count() < 20) throw new Error(`Media archive is unexpectedly sparse: ${await media.count()} records`);
  });

  await record('Existing chapter reader route remains separate and functional', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest/chapters?chapter=${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector(`.succession-reader[data-reader-chapter], .succession-reader .succession-reader__reader[data-reader-chapter="${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}"]`, { timeout: 15_000 });
    if (await desktop.locator('.succession-archive').count()) throw new Error('Reference archive shell incorrectly wraps the image reader');
    if (await desktop.locator('.arc-page--succession-contest').count()) throw new Error('Full Succession arc page still wraps the chapter reader');
  });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await record('Mobile archive uses an intentional keyboard-safe drawer', mobile, async () => {
    await mobile.goto(`${base}/story/succession-contest/locations`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await mobile.waitForSelector('.succession-archive__mobile-bar', { timeout: 15_000 });
    const trigger = mobile.getByRole('button', { name: 'Archive', exact: true });
    await trigger.click();
    await mobile.waitForSelector('.succession-drawer [role="dialog"]', { timeout: 10_000 });
    if (await trigger.getAttribute('aria-expanded') !== 'true') throw new Error('Mobile archive button did not expose expanded state');
    await mobile.keyboard.press('Escape');
    await mobile.waitForSelector('.succession-drawer', { state: 'detached', timeout: 10_000 });
  });

  await record('Mobile dedicated workspaces remain inside the viewport', mobile, async () => {
    const princeCards = await openWorkspace(mobile, base, 'princes', '.succession-prince-board__grid > .succession-prince-card');
    if (await princeCards.count() !== 14) throw new Error('Mobile prince board did not render all records');
    if (await horizontalOverflow(mobile) > 1) throw new Error(`Mobile prince board overflows horizontally by ${await horizontalOverflow(mobile)}px`);
    const glossary = await openWorkspace(mobile, base, 'glossary', '.succession-glossary-canonical');
    if (!await glossary.count()) throw new Error('Mobile glossary did not render');
    if (await horizontalOverflow(mobile) > 1) throw new Error(`Mobile glossary overflows horizontally by ${await horizontalOverflow(mobile)}px`);
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
console.log(`\nSuccession Archive shell QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
