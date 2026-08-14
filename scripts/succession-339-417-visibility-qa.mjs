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
const readerModule = await vite.ssrLoadModule('/src/data/successionChapterReader.js');
const expected = Object.freeze({
  characters: uniqueNames(runtime.getEntitiesByType('character').filter(published)),
  organizations: uniqueNames(runtime.getEntitiesByType('organization').filter(published)),
  locations: uniqueNames(runtime.getEntitiesByType('location').filter(published)),
  events: uniqueNames(runtime.getStoryEventsKnownAtChapter(END).filter(published)),
  assignments: uniqueNames(runtime.getEntitiesByType('assignment').filter(published)),
  relationships: uniqueNames(runtime.getEntitiesByType('relationship').filter((record) => published(record) && (record.chapterRange?.start || 0) <= END)),
  guardianBeasts: uniqueNames(runtime.getEntitiesByType('guardian-beast').filter(published)),
  chapters: runtime.getEntitiesByType('chapter').filter((record) => record.number >= 340 && record.number <= END).map((record) => `Chapter ${record.number}`),
  abilities: uniqueNames(runtime.getAbilitiesKnownAtChapter(END).map((record) => record.ability).filter(published)),
  nenSystems: uniqueNames(runtime.getNenSystemsAtChapter(END)),
  glossary: uniqueNames(runtime.getGlossaryEntriesAtChapter(END)),
  sources: uniqueNames(runtime.getEntitiesByType('source').filter(published)),
  media: uniqueNames(runtime.getMediaRecordsAtChapter(END)),
});
const reader417 = readerModule.getSuccessionReaderChapter?.(417) || readerModule.getSuccessionChapterReaderRecord?.(417) || null;
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
  await page.waitForSelector(selector, { timeout:15_000 });
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

  await record('Every Chapter 340-417 record is rendered in the Chapters workspace', page, async () => {
    const root = await open(page, base, 'chapter-records', '.succession-chapter-command');
    await assertNames(root, expected.chapters, 'Chapters');
    const cards = root.locator('.succession-chapter-command__card');
    if (await cards.count() !== expected.chapters.length) throw new Error(`Rendered ${await cards.count()} chapter cards, expected ${expected.chapters.length}`);
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

  await record('Every Chapter-417-visible canonical event is rendered', page, async () => {
    const root = await open(page, base, 'events', '.succession-canonical-events', '?view=grid');
    await assertNames(root, expected.events, 'Events');
  });

  await record('Every published assignment survives progressive rendering', page, async () => {
    const root = await open(page, base, 'bodyguards', '.succession-assignment-command');
    for (let guard = 0; guard < 100; guard += 1) {
      const button = root.getByRole('button', { name:/load more/i }).last();
      if (!await button.count()) break;
      if (!await button.isVisible().catch(() => false)) break;
      await button.click();
      await page.waitForTimeout(25);
    }
    await assertNames(root, expected.assignments, 'Assignments');
  });

  await record('Every published relationship is rendered in the accessible edge list', page, async () => {
    const root = await open(page, base, 'relationships', '.succession-relationship-command', '?view=list');
    await assertNames(root, expected.relationships, 'Relationships');
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

  await record('Every Chapter-417 media record is represented in Research', page, async () => {
    const root = await open(page, base, 'research', '.succession-evidence-workspace');
    await assertNames(root, expected.media, 'Research media');
  });

  await record('Chapter 417 is published in the reader catalogue without fake page media', page, async () => {
    await page.goto(`${base}/story/succession-contest/chapters?chapter=417`, { waitUntil:'domcontentloaded', timeout:20_000 });
    await page.waitForSelector('.succession-reader-command', { timeout:15_000 });
    const text = normalize(await page.locator('.succession-reader-command').innerText());
    if (!text.includes('417')) throw new Error('Chapter 417 is absent from the rendered reader command surface');
    if (!text.includes('awaiting') && !text.includes('local media') && !text.includes('media')) throw new Error('Chapter 417 does not visibly communicate its no-local-media state');
    if (reader417?.hasPages === true || reader417?.pageCount > 0) throw new Error('Source reader model incorrectly claims Chapter 417 has imported local pages');
  });

  await page.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt:new Date().toISOString(), checks:results.length, passed:results.length-failures.length, failed:failures.length, expectedCounts:Object.fromEntries(Object.entries(expected).map(([key,value]) => [key,value.length])) };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession 339–417 rendered visibility QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
