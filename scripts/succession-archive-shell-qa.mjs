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

const normalizeText = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');

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
      try { if ((await stat(filename)).isDirectory()) filename = path.join(dist, 'index.html'); }
      catch { filename = path.join(dist, 'index.html'); }
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
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await record('Succession root opens the Black Whale command home', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector('.succession-command-home[data-archive-route="story"][data-archive-hub="story"]', { timeout: 15_000 });

    const home = desktop.locator('.succession-command-home');
    if (await home.count() !== 1) throw new Error('Command home is missing or duplicated');
    if (await home.locator('.succession-command-home__ship-stage img').count() !== 1) throw new Error('Black Whale hero image is missing or duplicated');
    if (await home.locator('.succession-command-home__search').count() !== 1) throw new Error('Archive search command is missing');
    if (await home.locator('.succession-command-home__portal').count() !== 3) throw new Error(`Command home exposes ${await home.locator('.succession-command-home__portal').count()} core portals instead of 3`);
    const portalTitles = await home.locator('.succession-command-home__portal h2').allInnerTexts();
    for (const expected of ['Succession Contest', 'Nen Encyclopedia', 'World Atlas']) {
      if (!portalTitles.some((title) => normalizeText(title) === normalizeText(expected))) throw new Error(`Core portal is missing: ${expected}`);
    }
    const railLabels = await home.locator('.succession-command-home__rail nav a span').allInnerTexts();
    if (railLabels.length < 7) throw new Error(`Command rail exposes only ${railLabels.length} destinations`);
    if (await desktop.locator('main h1').count() !== 1) throw new Error(`Command home exposes ${await desktop.locator('main h1').count()} main headings instead of 1`);
    if (await desktop.locator('.succession-architecture-board').count()) throw new Error('Retired architecture board is still mounted at the archive root');
    if (await horizontalOverflow(desktop) > 1) throw new Error(`Command home overflows horizontally by ${await horizontalOverflow(desktop)}px`);

    const timeline = home.locator('.succession-command-home__rail nav a').filter({ hasText: 'Timeline' }).first();
    await timeline.focus();
    const focus = await timeline.evaluate((element) => ({
      style: getComputedStyle(element).outlineStyle,
      width: Number.parseFloat(getComputedStyle(element).outlineWidth) || 0,
    }));
    if (focus.style === 'none' || focus.width < 2) throw new Error('Command-home keyboard focus is not visible');

    await desktop.screenshot({ path: path.join(output, 'command-home-1440x1000.png') });
  });

  await record('Consolidated child routes retain their hubs and direct URLs', desktop, async () => {
    const cases = [
      ['chapter-records', 'story', ['Story', 'Chapters', 'Timeline', 'Events']],
      ['organizations', 'people', ['Characters', 'Royal Family', 'Assignments', 'Organizations', 'Relationships']],
      ['locations', 'black-whale', ['Ship Atlas', 'Locations']],
      ['guardian-spirit-beasts', 'nen', ['Nen & Rituals', 'Guardian Spirit Beasts']],
    ];
    for (const [route, hub, expectedTabs] of cases) {
      await desktop.goto(`${base}/story/succession-contest/${route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await desktop.waitForSelector(`.succession-archive[data-archive-hub="${hub}"] .succession-hub-tabs`, { timeout: 15_000 });
      const labels = await desktop.locator('.succession-hub-tabs a').allInnerTexts();
      if (labels.map(normalizeText).join('|') !== expectedTabs.map(normalizeText).join('|')) throw new Error(`${route} tabs are incomplete: ${labels.join(' | ')}`);
      if (!desktop.url().includes(`/story/succession-contest/${route}`)) throw new Error(`${route} deep link was replaced instead of preserved`);
    }
  });

  await record('Character workspace is visual and dossier-linked', desktop, async () => {
    const cards = await openWorkspace(desktop, base, 'characters', '.succession-character-grid > article');
    const cardCount = await cards.count();
    if (cardCount < 150) throw new Error(`Expanded character catalogue is incomplete: ${cardCount} cards`);
    if (await cards.locator('.succession-entity-visual').count() !== cardCount) throw new Error('Every character card needs a visual frame');
    const billCard = cards.filter({ hasText: 'Bill' }).first();
    await billCard.getByRole('button', { name: /Open intelligence dossier/i }).click();
    await desktop.waitForSelector('.succession-character-dossier', { timeout: 15_000 });
    if (!desktop.url().includes('entity=character%3Abill')) throw new Error('Character dossier did not preserve Bill’s stable ID');
  });

  await record('Royal workspaces contain fourteen princes and eight queens', desktop, async () => {
    const princeCards = await openWorkspace(desktop, base, 'princes', '.succession-prince-board__grid > .succession-prince-card');
    if (await princeCards.count() !== 14) throw new Error(`Prince board count is ${await princeCards.count()}, expected 14`);
    const princeNames = await princeCards.locator('h3').allInnerTexts();
    if (!princeNames[0]?.includes('Benjamin') || !princeNames[13]?.includes('Woble')) throw new Error('Princes are not ordered First through Fourteenth');
    await desktop.getByRole('button', { name: /Open family hierarchy/i }).click();
    await desktop.waitForSelector('.royal-map', { timeout: 15_000 });
    if (!desktop.url().includes('view=tree')) throw new Error('Family tree did not open as an explicit optional view');
    if (await desktop.locator('.royal-map__queen-node').count() !== 8) throw new Error(`Royal map queen count is ${await desktop.locator('.royal-map__queen-node').count()}, expected 8`);
    const queenCards = await openWorkspace(desktop, base, 'queens', '.succession-queen-command__grid > .succession-queen-card');
    if (await queenCards.count() !== 8) throw new Error(`Queen board count is ${await queenCards.count()}, expected 8`);
  });

  await record('Assignment and retired people-power routes resolve canonical workspaces', desktop, async () => {
    const assignmentRoot = await openWorkspace(desktop, base, 'bodyguards', '.succession-assignment-command');
    const assignmentTotal = Number((await assignmentRoot.locator('.succession-assignment-command__metrics strong').first().innerText()).trim());
    if (!Number.isFinite(assignmentTotal) || assignmentTotal < 30) throw new Error(`Assignment archive total is incomplete: ${assignmentTotal}`);
    const assignments = assignmentRoot.locator('.succession-assignment-card');
    if (await assignments.count() < 15) throw new Error(`Assignment command rendered too few initial records: ${await assignments.count()}`);

    const hunters = await openWorkspace(desktop, base, 'hunters', '.succession-character-grid > article');
    if (await hunters.count() < 150) throw new Error(`Retired Hunter route did not resolve the canonical character archive: ${await hunters.count()} cards`);

    const mafiaOrganizations = await openWorkspace(desktop, base, 'mafia', '.succession-organization-workspace');
    if (await mafiaOrganizations.count() !== 1) throw new Error('Retired Mafia route did not resolve the canonical Organizations workspace');
    if (await mafiaOrganizations.locator('.succession-organization-grid > article').count() < 10) throw new Error('Canonical organization directory is unexpectedly sparse after Mafia redirect');

    const militaryOrganizations = await openWorkspace(desktop, base, 'military', '.succession-organization-workspace');
    if (await militaryOrganizations.count() !== 1) throw new Error('Retired Military route did not resolve the canonical Organizations workspace');
    if (await militaryOrganizations.locator('.succession-organization-grid > article').count() < 10) throw new Error('Canonical organization directory is unexpectedly sparse after Military redirect');
  });

  await record(`Beast and chapter workspaces are complete through Chapter ${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}`, desktop, async () => {
    const beasts = await openWorkspace(desktop, base, 'guardian-spirit-beasts', '.succession-gsb-command__grid > .succession-gsb-command-card');
    if (await beasts.count() !== 15) throw new Error(`Guardian Spirit Beast count is ${await beasts.count()}, expected 15`);
    const chapters = await openWorkspace(desktop, base, 'chapter-records', '.succession-chapter-command__grid > .succession-chapter-command__card');
    if (await chapters.count() !== expectedChapterCount) throw new Error(`Chapter record count is ${await chapters.count()}, expected ${expectedChapterCount}`);
    const latest = chapters.filter({ hasText: String(LATEST_AUTHORIZED_SUCCESSION_CHAPTER) }).first();
    if (!await latest.count()) throw new Error(`Chapter ${LATEST_AUTHORIZED_SUCCESSION_CHAPTER} research record is missing`);
  });

  await record('Research glossary and retired media route use final canonical workspaces', desktop, async () => {
    const sources = await openWorkspace(desktop, base, 'research', '.succession-evidence-source-catalogue article');
    if (await sources.count() < 75) throw new Error(`Research source catalogue is incomplete: ${await sources.count()}`);
    const glossary = await openWorkspace(desktop, base, 'glossary', '.succession-glossary-canonical__grid > article');
    if (await glossary.count() < 20) throw new Error(`Glossary is incomplete: ${await glossary.count()} terms`);
    const mediaResearch = await openWorkspace(desktop, base, 'media', '.succession-evidence-workspace');
    if (await mediaResearch.count() !== 1) throw new Error('Retired Media route did not resolve the canonical Research workspace');
    if (await mediaResearch.locator('.succession-evidence-hero').count() !== 1) throw new Error('Research evidence hero is missing after Media redirect');
  });

  await record('Integrated chapter reader remains functional inside the archive shell', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest/chapters?chapter=${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector('.succession-archive[data-archive-route="reader"] .succession-reader-command', { timeout: 15_000 });
    await desktop.waitForSelector(`.succession-reader[data-reader-chapter="${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}"], .succession-reader__reader[data-reader-chapter="${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}"]`, { timeout: 15_000 });
    if (await desktop.locator('.succession-archive').count() !== 1) throw new Error('Integrated reader is missing the archive shell');
    if (await desktop.locator('.arc-page--succession-contest').count()) throw new Error('Legacy grouped arc page still wraps the chapter reader');
    if (!desktop.url().includes('/story/succession-contest/chapters')) throw new Error(`Reader canonical path changed unexpectedly: ${desktop.url()}`);
  });

  const widescreen = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await record('Black Whale command home fills a widescreen viewport without spill', widescreen, async () => {
    await widescreen.goto(`${base}/story/succession-contest`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await widescreen.waitForSelector('.succession-command-home', { timeout: 15_000 });
    const proof = await widescreen.evaluate(() => {
      const root = document.querySelector('.succession-command-home')?.getBoundingClientRect();
      const hero = document.querySelector('.succession-command-home__hero')?.getBoundingClientRect();
      return {
        root: root ? { left: root.left, right: root.right, width: root.width, height: root.height } : null,
        hero: hero ? { left: hero.left, right: hero.right, width: hero.width, height: hero.height } : null,
        overflowX: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        portalCount: document.querySelectorAll('.succession-command-home__portal').length,
        searchVisible: Boolean(document.querySelector('.succession-command-home__search')?.getClientRects().length),
      };
    });
    if (!proof.root || !proof.hero) throw new Error('Widescreen command home geometry is unavailable');
    if (proof.root.left < -1 || proof.root.right > 1921 || proof.root.width < 1900) throw new Error(`Widescreen command home does not fill the viewport: ${JSON.stringify(proof.root)}`);
    if (proof.overflowX > 1) throw new Error(`Widescreen command home overflows horizontally by ${proof.overflowX}px`);
    if (proof.portalCount !== 3) throw new Error(`Widescreen command home exposes ${proof.portalCount} portals instead of 3`);
    if (!proof.searchVisible) throw new Error('Widescreen archive search command is not visible');
    await widescreen.screenshot({ path: path.join(output, 'command-home-1920x1080.png') });
  });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await record('Mobile archive uses an intentional keyboard-safe drawer', mobile, async () => {
    await mobile.goto(`${base}/story/succession-contest/locations`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await mobile.waitForSelector('.succession-archive__mobile-bar', { timeout: 15_000 });
    const trigger = mobile.getByRole('button', { name: 'Archive', exact: true });
    await trigger.click();
    await mobile.waitForSelector('.succession-drawer [role="dialog"]', { timeout: 10_000 });
    if (await trigger.getAttribute('aria-expanded') !== 'true') throw new Error('Mobile archive button did not expose expanded state');
    const drawerLabels = await mobile.locator('#succession-mobile-navigation a span').allInnerTexts();
    if (drawerLabels.length !== 7) throw new Error(`Mobile drawer exposes ${drawerLabels.length} top-level links instead of 7`);
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
  await widescreen.close();
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = {
  generatedAt: new Date().toISOString(),
  checks: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession Archive shell QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
