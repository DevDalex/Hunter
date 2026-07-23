import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_ARCHIVE_QA_OUTPUT || '.succession-archive-shell-qa');
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
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
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
  }
};

const openDirectory = async (page, base, route) => {
  await page.goto(`${base}/story/succession-contest/${route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.succession-directory .succession-entity-grid', { timeout: 15_000 });
  return page.locator('.succession-entity-grid > article');
};

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

  await record('Canonical character catalogue is expanded and visual', desktop, async () => {
    const cards = await openDirectory(desktop, base, 'characters');
    const cardCount = await cards.count();
    if (cardCount < 150) throw new Error(`Expanded character catalogue is incomplete: ${cardCount} cards`);
    const visualCount = await cards.locator('.succession-entity-visual').count();
    if (visualCount !== cardCount) throw new Error(`Every character card needs a visual frame: ${visualCount}/${cardCount}`);
    const billCard = cards.filter({ hasText: 'Bill' }).first();
    if (!await billCard.count()) throw new Error('Bill canonical record is missing from the character workspace');
    await billCard.locator('.succession-entity-link').click();
    await desktop.waitForSelector('.succession-entity-header .succession-entity-visual', { timeout: 15_000 });
    if (!desktop.url().includes('entity=character%3Abill')) throw new Error('Entity detail did not preserve Bill’s stable namespaced ID');
  });

  await record('Royal directories contain exactly fourteen princes and eight queens', desktop, async () => {
    const princeCards = await openDirectory(desktop, base, 'princes');
    if (await princeCards.count() !== 14) throw new Error(`Prince directory count is ${await princeCards.count()}, expected 14`);
    const princeNames = await princeCards.locator('h3').allInnerTexts();
    if (!princeNames[0]?.includes('Benjamin') || !princeNames[13]?.includes('Woble')) throw new Error('Princes are not ordered First through Fourteenth');
    if (await desktop.locator('.family-tree').count()) throw new Error('Family tree replaced the canonical prince directory');
    await desktop.getByRole('button', { name: 'Open family tree', exact: true }).click();
    await desktop.waitForSelector('.succession-migration-note', { timeout: 15_000 });
    if (!desktop.url().includes('view=tree')) throw new Error('Family tree did not open as an explicit optional view');

    const queenCards = await openDirectory(desktop, base, 'queens');
    if (await queenCards.count() !== 8) throw new Error(`Queen directory count is ${await queenCards.count()}, expected 8`);
  });

  await record('Bodyguard Hunter mafia and military catalogues use corrected roles', desktop, async () => {
    const bodyguards = await openDirectory(desktop, base, 'bodyguards');
    if (await bodyguards.count() < 85) throw new Error(`Bodyguard catalogue is incomplete: ${await bodyguards.count()}`);
    const hunters = await openDirectory(desktop, base, 'hunters');
    if (await hunters.count() < 20) throw new Error(`Hunter catalogue is incomplete: ${await hunters.count()}`);
    const mafia = await openDirectory(desktop, base, 'mafia');
    if (await mafia.count() < 35) throw new Error(`Mafia catalogue is incomplete: ${await mafia.count()}`);
    const mafiaText = (await mafia.allInnerTexts()).join(' ');
    for (const family of ['Xi-Yu Family', 'Heil-Ly Family', 'Cha-R Family']) if (!mafiaText.includes(family)) throw new Error(`${family} organization record is missing`);
    const military = await openDirectory(desktop, base, 'military');
    if (await military.count() < 20) throw new Error(`Military catalogue is incomplete: ${await military.count()}`);
  });

  await record('Guardian Spirit Beast and chapter catalogues are complete', desktop, async () => {
    const beasts = await openDirectory(desktop, base, 'guardian-spirit-beasts');
    if (await beasts.count() !== 15) throw new Error(`Guardian Spirit Beast count is ${await beasts.count()}, expected 15`);
    const chapters = await openDirectory(desktop, base, 'chapter-records');
    if (await chapters.count() !== 74) throw new Error(`Chapter record count is ${await chapters.count()}, expected 74`);
  });

  await record('Existing chapter reader route remains separate and functional', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest/chapters?chapter=414`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector('.succession-reader[data-reader-chapter], .succession-reader .succession-reader__reader[data-reader-chapter="414"]', { timeout: 15_000 });
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
    const expanded = await trigger.getAttribute('aria-expanded');
    if (expanded !== 'true') throw new Error('Mobile archive button did not expose expanded state');
    await mobile.keyboard.press('Escape');
    await mobile.waitForSelector('.succession-drawer', { state: 'detached', timeout: 10_000 });
  });

  await record('Mobile catalogue keeps cards and visuals inside the viewport', mobile, async () => {
    const cards = await openDirectory(mobile, base, 'princes');
    if (await cards.count() !== 14) throw new Error('Mobile prince catalogue did not render all records');
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) throw new Error(`Mobile catalogue overflows horizontally by ${overflow}px`);
    const firstVisual = cards.first().locator('.succession-entity-visual');
    if (!await firstVisual.isVisible()) throw new Error('Mobile record visual is not visible');
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
