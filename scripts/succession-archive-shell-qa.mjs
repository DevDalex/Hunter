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

const normalizeText = (value) => String(value).trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
const assertClose = (values, tolerance, label) => {
  const spread = Math.max(...values) - Math.min(...values);
  if (spread > tolerance) throw new Error(`${label} differ by ${spread.toFixed(2)}px: ${values.map((value) => value.toFixed(2)).join(' | ')}`);
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

  await record('Succession root opens the approved locked architecture portal', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector('.succession-archive[data-architecture-status="approved"][data-architecture-version="1.0"]', { timeout: 15_000 });

    const board = desktop.locator('.succession-architecture-board');
    if (await board.count() !== 1) throw new Error('Approved architecture portal is missing or duplicated');
    if (await board.locator('.succession-architecture__left-column #succession-desktop-navigation').count() !== 1) throw new Error('Persistent architecture navigation rail is missing or duplicated');

    const title = await board.locator('.succession-architecture__title h1').innerText();
    if (title.trim() !== 'Succession Contest') throw new Error(`Unexpected architecture title: ${title}`);
    const subtitle = await board.locator('.succession-architecture__title p').innerText();
    if (normalizeText(subtitle) !== normalizeText('Approved architecture for section redesign')) throw new Error(`Unexpected architecture subtitle: ${subtitle}`);

    if (await board.getAttribute('data-architecture-status') !== 'approved') throw new Error('Architecture status is not approved');
    if (await board.getAttribute('data-architecture-version') !== '1.0') throw new Error('Architecture version is not 1.0');
    const metadata = normalizeText(await board.locator('.succession-architecture__document-meta').innerText());
    if (!metadata.includes('approved') || !metadata.includes('1.0')) throw new Error(`Approved metadata is incomplete: ${metadata}`);
    if (metadata.includes('draft') || metadata.includes('0.9')) throw new Error(`Draft metadata remains in the portal: ${metadata}`);

    if (await board.locator('.succession-architecture__module').count() !== 4) throw new Error(`Architecture module count is ${await board.locator('.succession-architecture__module').count()}, expected 4`);
    if (await board.locator('.succession-architecture__library').count() !== 1) throw new Error('Library Tools rail is missing or duplicated');
    if (await board.locator('.succession-architecture__contracts').count() !== 1) throw new Error('Preserved Contracts panel is missing or duplicated');
    if (await board.locator('.succession-architecture__skeleton-block').count() !== 1) throw new Error('Page Layout Skeleton is missing or duplicated');

    const primaryLabels = await board.locator('#succession-desktop-navigation a span').allInnerTexts();
    const expected = ['Story Intelligence', 'People & Power', 'Black Whale', 'Nen Systems', 'Search', 'Research', 'Glossary'];
    if (primaryLabels.map(normalizeText).join('|') !== expected.map(normalizeText).join('|')) throw new Error(`Unexpected top-level navigation: ${primaryLabels.join(' | ')}`);

    const storyTabs = await board.locator('.succession-hub-tabs a').evaluateAll((links) => links.map((link) => link.querySelector('strong')?.textContent || ''));
    const expectedStoryTabs = ['Story', 'Chapters', 'Timeline', 'Events'];
    if (storyTabs.map(normalizeText).join('|') !== expectedStoryTabs.map(normalizeText).join('|')) throw new Error(`Story architecture views are incomplete: ${storyTabs.join(' | ')}`);

    const feedbackCount = await board.locator('[data-route-action]').count();
    if (feedbackCount < 20) throw new Error(`Only ${feedbackCount} architecture destinations expose route feedback`);

    const firstStoryLink = board.locator('.succession-hub-tabs a').first();
    await firstStoryLink.focus();
    const routeFeedback = await firstStoryLink.evaluate((element) => getComputedStyle(element, '::after').content);
    if (!routeFeedback || routeFeedback === 'none' || !routeFeedback.toLowerCase().includes('open story')) throw new Error(`Focused route feedback is missing: ${routeFeedback}`);

    const viewport = await desktop.evaluate(() => {
      const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect();
      const sheet = rect('.succession-architecture__sheet');
      const primaryColumns = [
        rect('.succession-architecture__left-column'),
        rect('.succession-architecture__modules'),
        rect('.succession-architecture__library'),
      ];
      const modules = [...document.querySelectorAll('.succession-architecture__module')].map((element) => element.getBoundingClientRect());
      const lowerLeft = document.querySelector('.succession-architecture__lower-grid > div')?.getBoundingClientRect();
      const lowerRight = rect('.succession-architecture__skeleton-block');
      const headingStyles = [...document.querySelectorAll('.succession-architecture__view-cell > strong, .succession-architecture__split-grid strong')].map((element) => {
        const style = getComputedStyle(element);
        return { wordBreak: style.wordBreak, overflowWrap: style.overflowWrap, hyphens: style.hyphens };
      });

      return {
        horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        verticalOverflow: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - innerHeight,
        bodyOverflow: getComputedStyle(document.body).overflow,
        boardPosition: getComputedStyle(document.querySelector('.succession-architecture-board')).position,
        bodyBackground: getComputedStyle(document.body).backgroundColor,
        sheetEdges: sheet ? [sheet.left, sheet.top, innerWidth - sheet.right, innerHeight - sheet.bottom] : [],
        primaryColumnBottoms: primaryColumns.map((box) => box?.bottom || 0),
        primaryColumnTops: primaryColumns.map((box) => box?.top || 0),
        moduleRowBottoms: modules.length === 4 ? [modules[0].bottom, modules[1].bottom, modules[2].bottom, modules[3].bottom] : [],
        lowerBandBottoms: [lowerLeft?.bottom || 0, lowerRight?.bottom || 0],
        lowerBandTops: [lowerLeft?.top || 0, lowerRight?.top || 0],
        headingStyles,
      };
    });

    if (viewport.horizontalOverflow > 1) throw new Error(`Architecture canvas overflows horizontally by ${viewport.horizontalOverflow}px`);
    if (viewport.verticalOverflow > 1) throw new Error(`Architecture canvas creates ${viewport.verticalOverflow}px of page scroll`);
    if (viewport.bodyOverflow !== 'hidden') throw new Error(`Architecture body overflow is ${viewport.bodyOverflow}, expected hidden`);
    if (viewport.boardPosition !== 'fixed') throw new Error(`Architecture canvas position is ${viewport.boardPosition}, expected fixed`);
    if (viewport.bodyBackground === 'rgb(9, 11, 15)' || viewport.bodyBackground === 'rgb(13, 17, 23)') throw new Error('Dark side gutters remain behind the architecture canvas');
    if (viewport.sheetEdges.some((distance) => Math.abs(distance) > 1.5)) throw new Error(`Architecture sheet does not touch all viewport edges: ${viewport.sheetEdges.join(' | ')}`);

    assertClose(viewport.primaryColumnTops, 1.5, 'Primary column tops');
    assertClose(viewport.primaryColumnBottoms, 1.5, 'Primary column bottoms');
    assertClose(viewport.moduleRowBottoms.slice(0, 2), 1.5, 'Top module row bottoms');
    assertClose(viewport.moduleRowBottoms.slice(2), 1.5, 'Bottom module row bottoms');
    assertClose(viewport.lowerBandTops, 1.5, 'Lower band tops');
    assertClose(viewport.lowerBandBottoms, 1.5, 'Lower band bottoms');

    for (const style of viewport.headingStyles) {
      if (style.wordBreak !== 'normal') throw new Error(`Architecture heading word-break is ${style.wordBreak}`);
      if (style.overflowWrap !== 'normal') throw new Error(`Architecture heading overflow-wrap is ${style.overflowWrap}`);
      if (style.hyphens !== 'none' && style.hyphens !== 'manual') throw new Error(`Architecture heading hyphens are ${style.hyphens}`);
    }

    if (await desktop.getByRole('link', { name: 'Archive Home', exact: true }).count()) throw new Error('Archive Home returned to navigation');
    if (await desktop.getByRole('link', { name: 'Reader', exact: true }).count()) throw new Error('Duplicate Reader returned to navigation');
    if (await desktop.locator('.arc-page--succession-contest').count()) throw new Error('Legacy grouped arc page is still mounted at the archive root');

    await desktop.screenshot({ path: path.join(output, 'architecture-approved-1440x1000.png') });
  });

  await record('Consolidated child routes retain their hub and direct URLs', desktop, async () => {
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
      if (labels.join('|') !== expectedTabs.join('|')) throw new Error(`${route} tabs are incomplete: ${labels.join(' | ')}`);
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

  await record('Existing chapter reader route remains separate and functional', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest/chapters?chapter=${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector(`.succession-reader[data-reader-chapter], .succession-reader .succession-reader__reader[data-reader-chapter="${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}"]`, { timeout: 15_000 });
    if (await desktop.locator('.succession-archive').count()) throw new Error('Reference archive shell incorrectly wraps the image reader');
    if (await desktop.locator('.arc-page--succession-contest').count()) throw new Error('Full Succession arc page still wraps the chapter reader');
  });

  const widescreen = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await record('Approved architecture fills and balances a widescreen viewport', widescreen, async () => {
    await widescreen.goto(`${base}/story/succession-contest`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await widescreen.waitForSelector('.succession-architecture-board[data-architecture-status="approved"]', { timeout: 15_000 });
    const proof = await widescreen.evaluate(() => {
      const sheet = document.querySelector('.succession-architecture__sheet')?.getBoundingClientRect();
      const modules = [...document.querySelectorAll('.succession-architecture__module')].map((element) => element.getBoundingClientRect());
      return {
        edges: sheet ? [sheet.left, sheet.top, innerWidth - sheet.right, innerHeight - sheet.bottom] : [],
        overflowX: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        overflowY: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - innerHeight,
        moduleRowBottoms: modules.map((box) => box.bottom),
      };
    });
    if (proof.edges.some((distance) => Math.abs(distance) > 1.5)) throw new Error(`Widescreen architecture edges are uneven: ${proof.edges.join(' | ')}`);
    if (proof.overflowX > 1 || proof.overflowY > 1) throw new Error(`Widescreen overflow is ${proof.overflowX}px × ${proof.overflowY}px`);
    assertClose(proof.moduleRowBottoms.slice(0, 2), 1.5, 'Widescreen top module row');
    assertClose(proof.moduleRowBottoms.slice(2), 1.5, 'Widescreen bottom module row');
    await widescreen.screenshot({ path: path.join(output, 'architecture-approved-1920x1080.png') });
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

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession Archive shell QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
