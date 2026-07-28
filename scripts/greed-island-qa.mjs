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

const openGreedIsland = async (page, base, module) => {
  await page.goto(`${base}/#/series/greed-island/${module}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector(`.greed-island-page[data-greed-island-active-module="${module}"]`, { timeout: 12_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
};

const openLesson = async (page, title) => {
  const button = page.locator('.gi-eta-course__chapters button').filter({ hasText: title });
  if (await button.count() !== 1) throw new Error(`Eta lesson “${title}” is missing or duplicated`);
  await button.click();
  await page.locator('.gi-eta-course__lesson h3').filter({ hasText: title }).waitFor();
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
  await record('Eta tutorial direct route rules, simulations, and persistence', tutorial, async () => {
    await openGreedIsland(tutorial, base, 'eta');
    if (await tutorial.locator('.gi-binder-section, .gi-card-archive, .gi-systems, .gi-tactical, .gi-completion').count()) throw new Error('Inactive Greed Island modules remain mounted on the Eta route');
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
  await record('Greed Island Binder card-filled layout and navigation', desktop, async () => {
    await openGreedIsland(desktop, base, 'binder');
    await desktop.waitForSelector('.gi-binder-section');
    if (await desktop.locator('[data-eta-scene], .gi-card-archive, .gi-systems, .gi-tactical, .gi-completion').count()) throw new Error('Inactive Greed Island modules remain mounted on the Binder route');
    const binder = desktop.locator('.gi-binder-section');
    const device = binder.locator('.gi-binder-device[data-book-state="open"]');
    await device.waitFor();

    if (await binder.locator('[data-binder-card-id]').count() !== 9) throw new Error('First Binder page does not contain nine inserted cards');
    if (await binder.locator('.gi-binder-page-rail button').count() !== 12) throw new Error('Binder does not expose all twelve Specified Slot pages');
    if (await binder.locator('.gi-card-tray').count()) throw new Error('Legacy external card tray is still mounted');
    if (await device.getAttribute('data-binder-page') !== '1') throw new Error('Binder did not open on page 1');
    if (await device.getAttribute('data-binder-selected-card') !== '004') throw new Error('Binder did not highlight the middle card on page 1');
    const defaultScreen = (await binder.locator('.gi-binder-screen').innerText()).toLowerCase();
    if (!defaultScreen.includes('skin care hot springs') || !defaultScreen.includes('materialized form')) throw new Error('Default selected-card explanation is incomplete');

    await binder.getByRole('button', { name: 'Close Greed Island Binder' }).click();
    await binder.getByRole('button', { name: 'Open Greed Island Binder' }).waitFor();
    await binder.getByRole('button', { name: 'Open Greed Island Binder' }).click();
    await binder.locator('.gi-binder-device[data-book-state="open"]').waitFor();

    await binder.getByRole('button', { name: 'Move highlight right' }).click();
    if (await binder.locator('.gi-binder-device').getAttribute('data-binder-selected-card') !== '005') throw new Error('Right control did not select card 005');
    if (!(await binder.locator('.gi-binder-screen').innerText()).includes('Spirited Away Hollow')) throw new Error('Right-side explanation did not update for card 005');

    await binder.getByRole('button', { name: 'Move highlight down' }).click();
    if (await binder.locator('.gi-binder-device').getAttribute('data-binder-selected-card') !== '008') throw new Error('Down control did not select card 008');
    await binder.getByRole('button', { name: 'Move highlight right' }).click();
    if (await binder.locator('.gi-binder-device').getAttribute('data-binder-page') !== '2') throw new Error('Directional navigation did not cross into page 2');
    if (await binder.locator('.gi-binder-device').getAttribute('data-binder-selected-card') !== '009') throw new Error('Directional page crossing did not land on card 009');

    await binder.locator('.gi-binder-device').focus();
    await desktop.keyboard.press('ArrowLeft');
    if (await binder.locator('.gi-binder-device').getAttribute('data-binder-selected-card') !== '008') throw new Error('Keyboard ArrowLeft did not return to card 008');
    await desktop.keyboard.press('ArrowRight');
    if (await binder.locator('.gi-binder-device').getAttribute('data-binder-selected-card') !== '009') throw new Error('Keyboard ArrowRight did not return to card 009');

    await binder.getByRole('button', { name: 'Open Binder page 10', exact: true }).click();
    if (await binder.locator('.gi-binder-device').getAttribute('data-binder-selected-card') !== '085') throw new Error('Direct page selection did not highlight the middle available card');
    await binder.locator('.gi-binder-search input').fill('Blue Planet');
    await binder.locator('.gi-binder-search button').click();
    if (await binder.locator('.gi-binder-device').getAttribute('data-binder-selected-card') !== '081') throw new Error('Binder search did not select Blue Planet');
    if (await binder.locator('.gi-binder-device').getAttribute('data-binder-page') !== '10') throw new Error('Binder search did not open Blue Planet’s page');

    await binder.getByRole('button', { name: 'Open extended selected-card record' }).click();
    const deepRecord = binder.locator('.gi-binder-screen__deep.is-open');
    await deepRecord.waitFor();
    const deepText = (await deepRecord.innerText()).toLowerCase();
    if (!deepText.includes('acquisition') || !deepText.includes('story record')) throw new Error('Center red button did not reveal the extended card record');

    await binder.getByRole('button', { name: 'Open Binder page 1', exact: true }).click();
    await binder.getByRole('button', { name: /Card 002, Plot of Beach/ }).click();
    if (!(await binder.locator('.gi-binder-screen').innerText()).includes('Plot of Beach')) throw new Error('Direct card selection did not update the right-hand display');
  });
  await desktop.close();


} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
