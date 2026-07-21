import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.GREED_ISLAND_QA_OUTPUT || '.greed-island-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';

const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
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

const results = [];
const failures = [];
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

const openGreedIsland = async (page, base) => {
  await page.goto(`${base}/#/series/greed-island`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.greed-island-page', { timeout: 12_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
};

const openLesson = async (page, title) => {
  const button = page.locator('.gi-eta-course__chapters button').filter({ hasText: title });
  if (await button.count() !== 1) throw new Error(`Eta lesson “${title}” is missing or duplicated`);
  await button.click();
  await page.locator('.gi-eta-course__lesson h3').filter({ hasText: title }).waitFor();
};

const readProgress = async (page) => {
  const label = await page.locator('.gi-progress').getAttribute('aria-label');
  const match = label?.match(/^(\d+)\s+of\s+100/);
  return match ? Number(match[1]) : Number.NaN;
};

const transitionSeconds = (value) => value
  .split(',')
  .map((duration) => Number.parseFloat(duration.trim()))
  .filter(Number.isFinite);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const executablePath = await firstAvailable([
  requestedExecutable,
  chromium.executablePath(),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available. Run "npm run browser:install" or set CHROMIUM_PATH.');

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const tutorial = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await record('Eta tutorial card rules, simulations, and persistence', tutorial, async () => {
    await openGreedIsland(tutorial, base);
    if (await tutorial.locator('.gi-eta-course__chapters button').count() !== 12) throw new Error('Eta tutorial does not expose 12 lessons');
    if (await tutorial.locator('.gi-eta-course__announcement').getAttribute('aria-live') !== 'polite') throw new Error('Eta tutorial announcement is not a polite live region');

    await openLesson(tutorial, 'Card anatomy');
    await tutorial.getByRole('button', { name: 'Illustration' }).click();
    await tutorial.locator('.gi-rule-demo--anatomy h4').filter({ hasText: 'Illustration' }).waitFor();

    await openLesson(tutorial, 'Card ranks');
    await tutorial.locator('.gi-rank-ladder button').filter({ hasText: /^SS$/ }).click();
    if ((await tutorial.locator('.gi-rank-readout > b').innerText()).trim() !== 'SS') throw new Error('Rank ladder did not select SS');
    if (!await tutorial.locator('.gi-rank-readout').innerText().then((text) => text.includes('Ruler’s Blessing') || text.includes("Ruler's Blessing"))) throw new Error('Rank ladder is not derived from the Specified registry');

    await openLesson(tutorial, 'Conversion limits');
    await tutorial.locator('.gi-rule-demo--limits select').selectOption('081');
    await tutorial.getByRole('button', { name: 'Fill simulated limit' }).click();
    await tutorial.locator('.gi-limit-result').filter({ hasText: 'LIMIT REACHED' }).waitFor();

    await openLesson(tutorial, '“Gain”');
    await tutorial.getByRole('button', { name: /Say “Gain”/i }).click();
    await tutorial.locator('.gi-gain-object.is-visible').waitFor();
    await tutorial.getByRole('button', { name: /Reset demonstration/i }).click();
    if (await tutorial.locator('.gi-gain-object.is-visible').count()) throw new Error('Gain demonstration did not reset');

    await openLesson(tutorial, 'Spell targeting');
    await tutorial.locator('.gi-rule-demo--spell select').selectOption('1006');
    await tutorial.locator('.gi-rule-demo--spell input').fill('Killua');
    await tutorial.getByRole('button', { name: /Cast with “On”/i }).click();
    await tutorial.locator('.gi-spell-outcome').filter({ hasText: 'Pickpocket On Killua' }).waitFor();

    await openLesson(tutorial, 'Protection and counters');
    await tutorial.locator('.gi-rule-demo--protection select').selectOption('1004');
    await tutorial.getByRole('button', { name: 'Resolve attack' }).click();
    await tutorial.locator('.gi-protection-result').filter({ hasText: 'Reflects one Attack Spell' }).waitFor();

    await openLesson(tutorial, 'Completing the game');
    const completionQuiz = tutorial.locator('.gi-rule-demo--completion fieldset');
    if (await completionQuiz.getAttribute('disabled') === null) throw new Error('Completion quiz is not initially locked');
    await tutorial.getByRole('button', { name: 'Complete 001–099' }).click();
    if (await completionQuiz.getAttribute('disabled') !== null) throw new Error('Completion quiz did not unlock at 99 cards');
    await tutorial.getByLabel('Blue Planet').check();
    await tutorial.locator('.gi-completion-sequence div').nth(2).filter({ hasText: 'Sample complete' }).waitFor();
    await tutorial.locator('.gi-eta-course__controls button.is-primary').click();

    await tutorial.getByLabel('Gain', { exact: true }).check();
    await tutorial.locator('.gi-rule-demo--review > p.is-correct').waitFor();
    await tutorial.locator('.gi-eta-course__controls button.is-primary').click();
    const progressLabel = await tutorial.locator('.gi-eta-course__progress').getAttribute('aria-label');
    if (!progressLabel?.startsWith('2 of 12')) throw new Error(`Tutorial progress did not record completed lessons: ${progressLabel}`);

    await tutorial.reload({ waitUntil: 'domcontentloaded' });
    await tutorial.waitForSelector('.gi-eta-course');
    const persistedLabel = await tutorial.locator('.gi-eta-course__progress').getAttribute('aria-label');
    if (!persistedLabel?.startsWith('2 of 12')) throw new Error(`Tutorial progress did not persist: ${persistedLabel}`);
    await tutorial.getByRole('button', { name: /Replay all/i }).click();
    const resetLabel = await tutorial.locator('.gi-eta-course__progress').getAttribute('aria-label');
    if (!resetLabel?.startsWith('0 of 12')) throw new Error('Replay all did not clear tutorial progress');
    if (await tutorial.locator('.gi-eta-course__controls a', { hasText: 'Show source' }).count() !== 1) throw new Error('Active lesson source control is missing');
  });
  await tutorial.close();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await record('Greed Island Book keyboard, sections, and persistence', desktop, async () => {
    await openGreedIsland(desktop, base);
    await desktop.locator('.gi-book-gate button').click();
    await desktop.waitForSelector('.gi-binder-section');
    const binder = desktop.locator('.gi-binder-section');
    await binder.locator('.gi-book[data-book-state="open"]').waitFor();

    await binder.getByRole('button', { name: 'Close Greed Island Book' }).click();
    await binder.locator('.gi-book[data-book-state="closed"]').waitFor();
    await binder.getByRole('button', { name: 'Open Greed Island Book' }).click();
    await binder.locator('.gi-book[data-book-state="open"]').waitFor();

    await binder.getByRole('button', { name: 'Free Slots', exact: true }).click();
    await binder.getByRole('img', { name: 'Free Slot 01, empty' }).waitFor();
    for (let turn = 0; turn < 4; turn += 1) await binder.getByRole('button', { name: /Next/i }).click();
    await binder.getByRole('img', { name: 'Free Slot 45, empty' }).waitFor();
    await binder.getByRole('button', { name: 'Specified', exact: true }).click();

    const book = binder.locator('.gi-book[data-book-state="open"]');
    await book.focus();
    await desktop.keyboard.press('ArrowRight');
    await binder.locator('.gi-book__pages > header b').filter({ hasText: '010–019' }).waitFor();
    await desktop.keyboard.press('ArrowLeft');
    await binder.locator('.gi-book__pages > header b').filter({ hasText: '000–009' }).waitFor();

    const lockedReward = binder.getByRole('button', { name: /Specified Slot 000 locked/i });
    if (await lockedReward.count() !== 1) throw new Error('Specified Slot 000 is not visibly locked at initial state');

    const plotOfBeach = binder.locator('.gi-card-tray .gi-card').filter({ hasText: 'Plot of Beach' });
    await plotOfBeach.focus();
    await desktop.keyboard.press('Enter');
    const slot002 = binder.getByRole('button', { name: 'Insert held card into Specified Slot 002' });
    await slot002.focus();
    await desktop.keyboard.press('Enter');
    await binder.getByRole('button', { name: /Lift 002, Plot of Beach/i }).waitFor();
    if (await readProgress(desktop) !== 1) throw new Error('Binder progress did not advance to 1 of 100');

    const card003 = binder.locator('.gi-card-tray .gi-card').filter({ hasText: 'Pitcher of Eternal Water' });
    await card003.click();
    await binder.getByRole('button', { name: 'Insert held card into Specified Slot 004' }).click();
    const etaText = await binder.locator('.gi-eta-status').innerText();
    if (!etaText.includes('belongs in Specified Slot 003, not 004')) throw new Error('Eta did not reject the mismatched slot');
    if (await readProgress(desktop) !== 1) throw new Error('Invalid insertion changed Binder progress');

    await binder.locator('.gi-binder-toolbar input').fill('Blue Planet');
    await binder.locator('.gi-binder-toolbar form button').click();
    await binder.locator('.gi-book__pages > header b').filter({ hasText: '080–089' }).waitFor();

    await desktop.reload({ waitUntil: 'domcontentloaded' });
    await desktop.waitForSelector('.greed-island-page');
    await desktop.locator('.gi-book-gate button').click();
    const reloadedBinder = desktop.locator('.gi-binder-section');
    await reloadedBinder.getByRole('button', { name: /Lift 002, Plot of Beach/i }).waitFor();
    await reloadedBinder.getByRole('button', { name: /Reset simulation/i }).click();
    if (await readProgress(desktop) !== 0) throw new Error('Reset did not clear Binder progress');
  });
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Greed Island tutorial and Book mobile reduced motion', mobile, async () => {
    await openGreedIsland(mobile, base);
    await openLesson(mobile, '“Gain”');
    const tutorialState = await mobile.evaluate(() => {
      const gainCard = document.querySelector('.gi-gain-card');
      const progress = document.querySelector('.gi-eta-course__progress > i span');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        gainTransition: gainCard ? getComputedStyle(gainCard).transitionDuration : '',
        progressTransition: progress ? getComputedStyle(progress).transitionDuration : '',
        tutorialLiveRegion: document.querySelector('.gi-eta-course__announcement')?.getAttribute('aria-live'),
      };
    });
    if (tutorialState.overflow > 1) throw new Error(`mobile tutorial overflowed horizontally by ${tutorialState.overflow}px`);
    if (!tutorialState.reducedMotion) throw new Error('reduced-motion emulation was not active');
    if (transitionSeconds(tutorialState.gainTransition).some((duration) => duration > 0.001)) throw new Error(`Gain transition remains ${tutorialState.gainTransition} under reduced motion`);
    if (transitionSeconds(tutorialState.progressTransition).some((duration) => duration > 0.001)) throw new Error(`Tutorial progress transition remains ${tutorialState.progressTransition} under reduced motion`);
    if (tutorialState.tutorialLiveRegion !== 'polite') throw new Error('Eta tutorial status is not exposed as a polite live region');

    await mobile.getByRole('button', { name: /Free Exploration/i }).click();
    await mobile.waitForSelector('.gi-binder-section');
    const binder = mobile.locator('.gi-binder-section');
    await binder.getByRole('button', { name: 'Free Slots', exact: true }).click();
    await binder.getByRole('img', { name: 'Free Slot 01, empty' }).waitFor();
    const state = await mobile.evaluate(() => {
      const card = document.querySelector('.gi-card');
      const book = document.querySelector('.gi-book');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        transitionDuration: card ? getComputedStyle(card).transitionDuration : '',
        bookTransitionDuration: book ? getComputedStyle(book).transitionDuration : '',
        liveRegion: document.querySelector('.gi-eta-status')?.getAttribute('aria-live'),
      };
    });
    if (state.overflow > 1) throw new Error(`mobile page overflowed horizontally by ${state.overflow}px`);
    const durations = transitionSeconds(state.transitionDuration);
    if (!durations.length || durations.some((duration) => duration > 0.001)) throw new Error(`card transition remains ${state.transitionDuration} under reduced motion`);
    const bookDurations = transitionSeconds(state.bookTransitionDuration);
    if (bookDurations.some((duration) => duration > 0.001)) throw new Error(`Book transition remains ${state.bookTransitionDuration} under reduced motion`);
    if (state.liveRegion !== 'polite') throw new Error('Eta status is not exposed as a polite live region');

    await binder.getByRole('button', { name: 'Specified', exact: true }).click();
    await binder.locator('.gi-card-tray .gi-card').filter({ hasText: 'Plot of Beach' }).click();
    await binder.getByRole('button', { name: 'Insert held card into Specified Slot 002' }).click();
    await binder.getByRole('button', { name: /Lift 002, Plot of Beach/i }).waitFor();
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
