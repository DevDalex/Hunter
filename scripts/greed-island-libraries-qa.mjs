import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.GREED_ISLAND_QA_OUTPUT || '.greed-island-qa');
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
    const screenshot = path.join(output, `libraries-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const openLibraries = async (page, base, collection = 'spells') => {
  await page.goto(`${base}/#/series/greed-island/cards/${collection}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.gi-card-libraries', { timeout: 15_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
};

const waitForRenderedImages = async (page, selector, expected) => {
  await page.waitForFunction(({ selector: target, expected: count }) => {
    const images = [...document.querySelectorAll(target)];
    return images.length === count && images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
  }, { selector, expected }, { timeout: 12_000 });
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
  await record('Card library Binder search, controls, classes, rendered imagery, and spell lab', desktop, async () => {
    await openLibraries(desktop, base, 'spells');
    const library = desktop.locator('.gi-card-libraries');
    if ((await library.getAttribute('data-card-library')) !== 'spell') throw new Error('Spell route did not select the Spell Card collection');
    const metrics = await library.locator('.gi-card-libraries__metrics').innerText();
    if (!metrics.includes('40') || !metrics.includes('20') || !metrics.includes('4')) throw new Error(`library metrics are incomplete: ${metrics}`);
    if (await library.getAttribute('data-library-total') !== '40') throw new Error('Spell Binder does not expose all 40 records');
    if (await library.getAttribute('data-library-page-count') !== '5') throw new Error('Spell Binder does not expose five 3×3 pages');
    if (await library.getAttribute('data-library-media-count') !== '40') throw new Error('Spell Binder did not register all 40 local images');
    if (await library.locator('[data-library-card]').count() !== 9) throw new Error('Spell Binder first page does not contain nine cards');
    if (await library.getAttribute('data-library-selected-card') !== '1006') throw new Error('Spell Binder did not keep Pickpocket highlighted');
    if (await library.locator('.gi-library-book__dpad button').count() !== 5) throw new Error('Spell Binder does not expose five red controls');

    await library.locator('[data-library-card="1001"] [data-library-media="verified-local-webp"]').waitFor();
    if (await library.locator('[data-library-card] [data-library-media="verified-local-webp"]').count() !== 9) throw new Error('Spell Binder first page does not use nine local verified scans');
    await waitForRenderedImages(desktop, '[data-library-card] .gi-library-card-face__image', 9);
    const spellImageSources = await library.locator('[data-library-card] .gi-library-card-face__image').evaluateAll((images) => images.map((image) => image.getAttribute('src') || ''));
    if (spellImageSources.some((source) => !source.startsWith('/media/greed-island/library-cards/'))) throw new Error('Spell Binder is not rendering stabilized local artwork');
    if (await library.locator('.gi-card-libraries__source-links a', { hasText: 'Open image source' }).count() !== 1) throw new Error('Selected Spell Card image attribution is missing');

    await library.getByRole('button', { name: 'Move library highlight right' }).click();
    if (await library.getAttribute('data-library-selected-card') !== '1007') throw new Error('Right red control did not select Thief');
    if (!(await library.locator('.gi-card-libraries__record').innerText()).includes('Thief')) throw new Error('Right-hand explanation did not update for Thief');

    await library.locator('.gi-library-book').focus();
    await desktop.keyboard.press('ArrowDown');
    if (await library.getAttribute('data-library-selected-card') !== '1010') throw new Error('Keyboard ArrowDown did not move three card positions');

    await library.locator('.gi-card-libraries__search input').fill('Mug');
    if (await library.getAttribute('data-library-total') !== '1') throw new Error('Mug search did not reduce the Binder to one matching card');
    await library.getByRole('button', { name: /Spell Card 1021, Mug/ }).click();
    const mug = (await library.locator('.gi-card-libraries__record').innerText()).toLowerCase();
    if (!mug.includes('take one chosen card') || !mug.includes('attack spell')) throw new Error('Mug record is missing attack details');
    await waitForRenderedImages(desktop, '[data-library-card="1021"] .gi-library-card-face__image', 1);
    const mugSource = await library.locator('[data-library-card="1021"] .gi-library-card-face__image').getAttribute('src');
    if (!mugSource?.endsWith('/1021.webp')) throw new Error(`Mug does not use its local scan: ${mugSource}`);

    await library.getByRole('button', { name: 'Open extended library record' }).click();
    const expanded = (await library.locator('.gi-card-libraries__extended.is-open').innerText()).toLowerCase();
    if (!expanded.includes('acquisition') || !expanded.includes('masadora')) throw new Error('Center red control did not reveal Mug acquisition details');

    await library.locator('.gi-card-libraries__search input').fill('');
    await library.locator('label').filter({ hasText: 'Class' }).locator('select').selectOption('AS');
    if (await library.getAttribute('data-library-total') !== '10') throw new Error('Attack Spell class filter did not return 10 records');
    if (await library.getAttribute('data-library-page-count') !== '2') throw new Error('Ten Attack Spells were not divided into two Binder pages');
    await library.getByRole('button', { name: 'Open Spell Cards page 2', exact: true }).click();
    if (await library.locator('[data-library-card]').count() !== 1) throw new Error('Attack Spell final page should contain one card');
    if (await library.locator('.gi-library-book__card.is-empty').count() !== 8) throw new Error('Attack Spell final page should preserve eight empty pockets');
    await library.locator('label').filter({ hasText: 'Class' }).locator('select').selectOption('all');

    const lab = library.locator('.gi-card-libraries__lab');
    await lab.locator('select').nth(0).selectOption('1029');
    await lab.locator('select').nth(1).selectOption('1035');
    const protectedOutcome = (await lab.locator('.gi-card-libraries__outcome').innerText()).toLowerCase();
    if (!protectedOutcome.includes('15-second') || !protectedOutcome.includes('fortress')) throw new Error('Spell lab does not apply Fortress in the response window');
    await lab.locator('input[type="checkbox"]').uncheck();
    const closedOutcome = (await lab.locator('.gi-card-libraries__outcome').innerText()).toLowerCase();
    if (!closedOutcome.includes('binder closed')) throw new Error('Spell lab does not explain closed-Binder behavior');
  });
  await desktop.close();

  const freeAndGm = await browser.newPage({ viewport: { width: 1280, height: 940 } });
  await record('Free Slot and Game Master rendered-image Binder boundaries', freeAndGm, async () => {
    await openLibraries(freeAndGm, base, 'free-slot');
    let library = freeAndGm.locator('.gi-card-libraries');
    if ((await library.getAttribute('data-card-library')) !== 'free') throw new Error('Free Slot route did not select the documented Free Slot collection');
    if (await library.getAttribute('data-library-total') !== '20') throw new Error('Free Slot Binder does not expose 20 documented records');
    if (await library.getAttribute('data-library-page-count') !== '3') throw new Error('Free Slot Binder does not expose three pages');
    if (await library.getAttribute('data-library-media-count') !== '18') throw new Error('Free Slot Binder did not register the 18 table images');
    if (await library.locator('[data-library-card]').count() !== 9) throw new Error('Free Slot Binder first page does not contain nine cards');
    if (await library.locator('.gi-card-libraries__lab').count()) throw new Error('Spell lab remained mounted on the Free Slot route');
    await library.locator('[data-library-card="100"] [data-library-media="verified-local-webp"]').waitFor();
    if (await library.locator('[data-library-card] [data-library-media="verified-local-webp"]').count() !== 9) throw new Error('Free Slot first page lost one or more local table images');
    await waitForRenderedImages(freeAndGm, '[data-library-card] .gi-library-card-face__image', 9);
    const transportSource = await library.locator('[data-library-card="266"] img').getAttribute('src');
    if (!transportSource?.endsWith('/266.webp')) throw new Error(`Transport Ticket local scan is missing: ${transportSource}`);

    await library.locator('.gi-card-libraries__search input').fill('Chidon');
    await library.getByRole('button', { name: /Documented Free Slot Card 7018, Chidon/ }).click();
    const chidon = (await library.locator('.gi-card-libraries__record').innerText()).toLowerCase();
    if (!chidon.includes('chapter 172') || !chidon.includes('fish')) throw new Error('Chidon record lost its documented debut/effect boundary');
    if (await library.locator('[data-library-card="7018"] [data-library-media="designed-fallback"]').count() !== 1) throw new Error('Chidon does not use the deliberate no-image fallback shown by the source table');

    await freeAndGm.goto(`${base}/#/series/greed-island/cards/game-master`, { waitUntil: 'domcontentloaded' });
    await freeAndGm.waitForSelector('.gi-card-libraries[data-card-library="gm"]');
    library = freeAndGm.locator('.gi-card-libraries');
    if (await library.getAttribute('data-library-total') !== '4') throw new Error('GM Binder does not expose four records');
    if (await library.getAttribute('data-library-page-count') !== '1') throw new Error('GM Binder should use one page');
    if (await library.getAttribute('data-library-media-count') !== '4') throw new Error('GM Binder did not register four local images');
    if (await library.locator('[data-library-card]').count() !== 4) throw new Error('GM Binder page does not contain four cards');
    if (await library.locator('.gi-library-book__card.is-empty').count() !== 5) throw new Error('GM Binder page does not preserve five empty pockets');
    if (await library.locator('.gi-card-libraries__lab').count()) throw new Error('Spell lab remained mounted on the Game Master route');
    await library.locator('[data-library-card="-000"] [data-library-media="verified-local-webp"]').waitFor();
    if (await library.locator('[data-library-card] [data-library-media="verified-local-webp"]').count() !== 4) throw new Error('GM Binder does not use four local verified scans');
    await waitForRenderedImages(freeAndGm, '[data-library-card] .gi-library-card-face__image', 4);
    const eliminateSource = await library.locator('[data-library-card="-003"] img').getAttribute('src');
    if (!eliminateSource?.endsWith('/gm-003.webp')) throw new Error(`Eliminate local artwork is missing: ${eliminateSource}`);
    await library.getByRole('button', { name: /Game Master-only Card -003, Eliminate/ }).click();
    const eliminate = (await library.locator('.gi-card-libraries__record').innerText()).toLowerCase();
    if (!eliminate.includes('game master only') || !eliminate.includes('azian continent')) throw new Error('Eliminate record lost restricted-access boundary');
    if (await library.locator('a', { hasText: 'Open table source' }).count() < 1) throw new Error('Library source link is missing');
    if (await library.locator('a', { hasText: 'Open image source' }).count() < 1) throw new Error('GM image source link is missing');
  });
  await freeAndGm.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Card library Binders mobile rendered-image containment and reduced motion', mobile, async () => {
    await openLibraries(mobile, base, 'spells');
    const library = mobile.locator('.gi-card-libraries');
    await waitForRenderedImages(mobile, '[data-library-card] .gi-library-card-face__image', 9);
    await library.getByRole('button', { name: 'Move library highlight right' }).click();
    if (await library.getAttribute('data-library-selected-card') !== '1007') throw new Error('Mobile red control did not update the Spell Binder');
    await library.getByRole('button', { name: 'Open Spell Cards page 5', exact: true }).click();
    if (await library.locator('[data-library-card]').count() !== 4) throw new Error('Spell Binder final page does not contain cards 1037–1040');
    if (await library.locator('.gi-library-book__card.is-empty').count() !== 5) throw new Error('Spell Binder final page does not retain five empty pockets');
    await waitForRenderedImages(mobile, '[data-library-card] .gi-library-card-face__image', 4);

    const state = await mobile.evaluate(() => {
      const library = document.querySelector('.gi-card-libraries');
      const book = document.querySelector('.gi-library-book');
      const card = document.querySelector('.gi-library-book__card');
      const image = document.querySelector('.gi-library-card-face__image');
      const recordPanel = document.querySelector('.gi-card-libraries__record');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        libraryWidth: library?.getBoundingClientRect().width || 0,
        bookWidth: book?.getBoundingClientRect().width || 0,
        recordWidth: recordPanel?.getBoundingClientRect().width || 0,
        imageWidth: image?.getBoundingClientRect().width || 0,
        imageNaturalWidth: image?.naturalWidth || 0,
        cardWidth: card?.getBoundingClientRect().width || 0,
        cardTransition: card ? getComputedStyle(card).transitionDuration : '',
        liveRegion: document.querySelector('.gi-card-libraries__status')?.getAttribute('aria-live'),
      };
    });
    if (state.overflow > 1) throw new Error(`card library Binders overflowed mobile viewport by ${state.overflow}px`);
    if (!state.reducedMotion) throw new Error('reduced-motion emulation was not active');
    if (state.libraryWidth > 390.5 || state.bookWidth > 390.5 || state.recordWidth > 390.5) throw new Error(`library panels exceed mobile width: ${JSON.stringify(state)}`);
    if (state.imageWidth > state.cardWidth + 1 || state.imageNaturalWidth < 1) throw new Error(`card artwork is broken or exceeds its mobile pocket: ${JSON.stringify(state)}`);
    if (state.cardTransition.split(',').map(Number.parseFloat).some((duration) => duration > 0.001)) throw new Error(`library card transition remains ${state.cardTransition} under reduced motion`);
    if (state.liveRegion !== 'polite') throw new Error('Library Binder status is not exposed as a polite live region');
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'libraries-report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'libraries-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island card libraries QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
