import { createServer as createHttpServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { createServer as createViteServer } from 'vite';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_VISIBILITY_QA_OUTPUT || '.succession-339-417-visibility-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const END = 417;
const results = [];
const failures = [];
const mime = { '.css':'text/css; charset=utf-8', '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.json':'application/json; charset=utf-8' };

const normalize = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
const published = (record) => record && !['hidden','draft'].includes(record.publicationStatus);
const uniqueNames = (records) => [...new Set(records.filter(Boolean).map((record) => record.name || record.term || record.label || record.title).filter(Boolean))];

const vite = await createViteServer({ appType:'custom', logLevel:'error', server:{ middlewareMode:true } });
const runtime = await vite.ssrLoadModule('/src/data/succession/successionData.js');
const readerCatalogModule = await vite.ssrLoadModule('/src/data/successionReaderCatalog.js');
const canonicalEvents = runtime.getEntitiesByType('event').filter((record) => published(record) && (record.chapterRange?.start || 0) <= END);
const expected = Object.freeze({
  characters: uniqueNames(runtime.getEntitiesByType('character').filter(published)),
  organizations: uniqueNames(runtime.getEntitiesByType('organization').filter(published)),
  locations: uniqueNames(runtime.getEntitiesByType('location').filter(published)),
  eventCount: canonicalEvents.length,
  assignments: uniqueNames(runtime.getEntitiesByType('assignment').filter(published)),
  relationships: uniqueNames(runtime.getEntitiesByType('relationship').filter(published)),
  guardianBeasts: uniqueNames(runtime.getEntitiesByType('guardian-beast').filter(published)),
  chapterCount: runtime.getEntitiesByType('chapter').filter((record) => record.number >= 340 && record.number <= END).length,
  abilities: uniqueNames(runtime.getAbilitiesKnownAtChapter(END).map((record) => record.ability).filter(published)),
  nenSystems: uniqueNames(runtime.getNenSystemsAtChapter(END)),
  glossary: uniqueNames(runtime.getGlossaryEntriesAtChapter(END)),
  sources: uniqueNames(runtime.getEntitiesByType('source').filter(published)),
  media: runtime.getMediaRecordsAtChapter(END),
});
const reader417 = readerCatalogModule.successionReaderCatalogByNumber?.get?.(417) || null;
await vite.close();

const firstAvailable = async (candidates) => {
  for (const candidate of candidates.filter(Boolean)) {
    try { await access(candidate); return candidate; } catch { /* next */ }
  }
  return '';
};
const serve = async () => {
  await access(path.join(dist, 'index.html'));
  const server = createHttpServer(async (request, response) => {
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
    results.push({ name, status:'passed' });
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    const screenshot = path.join(output, `${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.png`);
    await page.screenshot({ path:screenshot, fullPage:true }).catch(() => {});
    const failure = { name, status:'failed', error:error.message, runtimeErrors, screenshot:path.relative(root, screenshot) };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  } finally {
    page.off('pageerror', onPageError);
  }
};
const open = async (page, base, route, selector, query='') => {
  await page.goto(`${base}/story/succession-contest/${route}${query}`, { waitUntil:'domcontentloaded', timeout:20_000 });
  await page.waitForSelector(selector, { timeout:20_000 });
  return page.locator(selector);
};
const assertNames = async (rootLocator, names, label) => {
  const text = normalize(await rootLocator.innerText());
  const missing = names.filter((name) => !text.includes(normalize(name)));
  if (missing.length) throw new Error(`${label}: ${missing.length}/${names.length} expected records are absent from rendered workspace: ${missing.slice(0, 25).join(' | ')}${missing.length > 25 ? ' | …' : ''}`);
};

await mkdir(output, { recursive:true });
const executablePath = await firstAvailable([requestedExecutable, chromium.executablePath(), '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']);
if (!executablePath) throw new Error('No Chromium executable is available.');
const browser = await chromium.launch({ headless:true, executablePath, args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-zygote'] });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 } });

  await record('All 340-417 chapter dossiers render in the Chapters directory', page, async () => {
    const root = await open(page, base, 'chapter-records', '.succession-chapter-command');
    const cards = root.locator('.succession-chapter-command__grid > *');
    const count = await cards.count();
    if (count !== expected.chapterCount) throw new Error(`Rendered ${count} chapter cards, expected ${expected.chapterCount}`);
    const status = normalize(await root.locator('#succession-chapter-directory-title').innerText());
    if (!status.includes(`${expected.chapterCount} of ${expected.chapterCount}`)) throw new Error(`Chapter directory status did not confirm ${expected.chapterCount}/${expected.chapterCount}: ${status}`);
  });

  await record('Every published canonical character is rendered', page, async () => {
    const root = await open(page, base, 'characters', '.succession-character-grid');
    await assertNames(root, expected.characters, 'Characters');
  });

  await record('Every published canonical organization is rendered', page, async () => {
    const root = await open(page, base, 'organizations', '.succession-organization-workspace');
    await assertNames(root, expected.organizations, 'Organizations');
  });

  await record('Every published canonical location is rendered', page, async () => {
    const root = await open(page, base, 'locations', '.succession-canonical-locations');
    await assertNames(root, expected.locations, 'Locations');
  });

  await record('All canonical events through Chapter 417 render in Events', page, async () => {
    const root = await open(page, base, 'events', '.succession-canonical-events', '?view=grid');
    const status = normalize(await root.locator('.succession-event-filter-panel footer [role="status"]').innerText());
    if (!status.includes(`showing ${expected.eventCount} of ${expected.eventCount} events`)) throw new Error(`Event status did not confirm ${expected.eventCount}/${expected.eventCount}: ${status}`);
    const cards = root.locator('.succession-event-command__grid > *');
    const count = await cards.count();
    if (count !== expected.eventCount) throw new Error(`Rendered ${count} canonical event cards, expected ${expected.eventCount}`);
  });

  await record('Every published assignment survives progressive rendering', page, async () => {
    const root = await open(page, base, 'bodyguards', '.succession-assignment-command');
    for (let guard = 0; guard < 20; guard += 1) {
      const button = root.locator('.succession-assignment-load-more');
      if (!await button.count()) break;
      await button.click();
      await page.waitForTimeout(40);
    }
    const finalButton = root.locator('.succession-assignment-load-more');
    if (await finalButton.count()) throw new Error('Assignment progressive-render button still remains after exhaustion loop');
    await assertNames(root, expected.assignments, 'Assignments');
    const status = normalize(await root.locator('.succession-assignment-filter-panel footer [role="status"]').innerText());
    if (!status.includes(`showing ${expected.assignments.length} of ${expected.assignments.length}`)) throw new Error(`Assignment status did not confirm ${expected.assignments.length}/${expected.assignments.length}: ${status}`);
  });

  await record('Every published relationship is rendered in the semantic edge list', page, async () => {
    const root = await open(page, base, 'relationships', '.succession-canonical-relationships', '?view=list');
    const list = root.locator('.succession-relationship-accessible').last();
    await list.waitFor({ state:'visible', timeout:15_000 });
    await assertNames(list, expected.relationships, 'Relationships');
    const rows = list.locator('ol > li');
    const count = await rows.count();
    if (count !== expected.relationships.length) throw new Error(`Rendered ${count} relationship rows, expected ${expected.relationships.length}`);
  });

  await record('Every published Guardian Spirit Beast is rendered', page, async () => {
    const root = await open(page, base, 'guardian-spirit-beasts', '.succession-gsb-command');
    await assertNames(root, expected.guardianBeasts, 'Guardian Spirit Beasts');
  });

  await record('Every ability known at Chapter 417 is rendered in Nen abilities', page, async () => {
    const root = await open(page, base, 'nen', '.succession-nen-workspace', '?view=abilities');
    await assertNames(root, expected.abilities, 'Nen abilities');
  });

  await record('Every Nen system known at Chapter 417 is rendered', page, async () => {
    const root = await open(page, base, 'nen', '.succession-nen-workspace');
    await assertNames(root, expected.nenSystems, 'Nen systems');
  });

  await record('Every active glossary term is rendered', page, async () => {
    const root = await open(page, base, 'glossary', '.succession-glossary-canonical');
    await assertNames(root, expected.glossary, 'Glossary');
  });

  await record('Every published source is represented in Research', page, async () => {
    const root = await open(page, base, 'research', '.succession-evidence-workspace');
    await assertNames(root, expected.sources, 'Research sources');
  });

  await record('Media records resolve through the retired-Media Research deep link', page, async () => {
    if (!expected.media.length) throw new Error('No media records are available at Chapter 417');
    const probes = [expected.media[0], expected.media[Math.floor(expected.media.length / 2)], expected.media.at(-1)].filter(Boolean);
    for (const media of probes) {
      const url = `${base}/story/succession-contest/research?media=${encodeURIComponent(media.id)}&chapter=417`;
      await page.goto(url, { waitUntil:'domcontentloaded', timeout:20_000 });
      const dossier = page.locator('.succession-evidence-media-record');
      await dossier.waitFor({ state:'visible', timeout:15_000 });
      const text = normalize(await dossier.innerText());
      if (!text.includes(normalize(media.label))) throw new Error(`Research media deep link did not render ${media.id} / ${media.label}`);
      if (!text.includes(normalize(media.id))) throw new Error(`Research media dossier omitted media ID ${media.id}`);
    }
  });

  await record('Chapter 417 is indexed in Reader with explicit no-pages state', page, async () => {
    await page.goto(`${base}/story/succession-contest/chapters?chapter=417`, { waitUntil:'domcontentloaded', timeout:20_000 });
    const reader = page.locator('.succession-reader[data-reader-chapter="417"]');
    await reader.waitFor({ state:'visible', timeout:20_000 });
    const empty = reader.locator('.succession-reader__empty');
    await empty.waitFor({ state:'visible', timeout:10_000 });
    const text = normalize(await empty.innerText());
    if (!text.includes('chapter 417')) throw new Error('Reader empty state does not identify Chapter 417');
    if (!text.includes('pages are not available')) throw new Error('Reader does not explicitly communicate the Chapter 417 no-pages state');
    if (reader417?.pageCount > 0 || reader417?.pages?.length > 0) throw new Error('Source reader catalogue incorrectly claims Chapter 417 has imported local pages');
  });

  await page.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const expectedCounts = {
  characters: expected.characters.length,
  organizations: expected.organizations.length,
  locations: expected.locations.length,
  events: expected.eventCount,
  assignments: expected.assignments.length,
  relationships: expected.relationships.length,
  guardianBeasts: expected.guardianBeasts.length,
  chapters: expected.chapterCount,
  abilities: expected.abilities.length,
  nenSystems: expected.nenSystems.length,
  glossary: expected.glossary.length,
  sources: expected.sources.length,
  media: expected.media.length,
};
const summary = { generatedAt:new Date().toISOString(), checks:results.length, passed:results.length-failures.length, failed:failures.length, expectedCounts };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession 339–417 rendered visibility QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
