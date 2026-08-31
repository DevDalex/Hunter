import { withPreviewPage } from './lib/browserSmoke.mjs';

const assertNoHorizontalOverflow = async (page, label) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 2) throw new Error(`${label} has ${overflow}px of horizontal overflow`);
};

await withPreviewPage({ port: 4173, path: '/characters' }, async ({ page, baseUrl }) => {
  const root = page.getByTestId('characters-root');
  await root.waitFor({ state: 'visible' });

  const rootText = await root.innerText();
  const countMatch = rootText.match(/([\d,]+)\s+Succession character records/i);
  if (!countMatch) throw new Error('Characters did not expose an in-scope Succession character count');
  const characterCount = Number(countMatch[1].replaceAll(',', ''));
  if (characterCount < 274) {
    throw new Error(`Expected at least 274 in-scope Succession character records, found ${characterCount}`);
  }
  if (!rootText.includes('274 detailed roster profiles')) {
    throw new Error('Characters did not preserve all 274 detailed Succession roster profiles');
  }

  const allView = page.getByTestId('characters-mode-all');
  await allView.waitFor({ state: 'visible' });
  const initialCards = page.getByTestId('character-card');
  const initialCount = await initialCards.count();
  if (initialCount < 80) throw new Error(`Expected a substantial first character batch, found ${initialCount}`);

  const lowerCard = initialCards.nth(Math.min(30, initialCount - 1));
  await lowerCard.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 180));
  const beforeSelectionScroll = await page.evaluate(() => window.scrollY);
  await lowerCard.click();
  await page.waitForTimeout(100);
  const afterSelectionScroll = await page.evaluate(() => window.scrollY);
  if (beforeSelectionScroll > 200 && afterSelectionScroll < 100) {
    throw new Error(`Character selection jumped to page top (${beforeSelectionScroll} -> ${afterSelectionScroll})`);
  }

  const search = page.getByTestId('character-search');
  await search.scrollIntoViewIfNeeded();
  await search.fill('Kurapika');
  await page.waitForTimeout(50);
  const searchText = await page.getByTestId('character-grid').innerText();
  if (!searchText.toLowerCase().includes('kurapika')) throw new Error('Character search did not return Kurapika');
  await search.fill('');

  await page.getByRole('button', { name: /Royal Courts/ }).click();
  const courtsView = page.getByTestId('characters-mode-courts');
  await courtsView.waitFor({ state: 'visible' });
  const courtCards = page.getByTestId('court-card');
  const courtCount = await courtCards.count();
  if (courtCount !== 14) throw new Error(`Expected 14 Prince courts, found ${courtCount}`);
  const focusedBefore = await page.getByTestId('focused-court').innerText();
  await courtCards.nth(1).click();
  await page.waitForTimeout(50);
  const focusedAfter = await page.getByTestId('focused-court').innerText();
  if (focusedAfter === focusedBefore) throw new Error('Selecting another Prince did not update the focused court');
  if (/surveillance|assassination|instruction|custody/i.test(focusedAfter.match(/confirmed protection[\s\S]*$/i)?.[0] || '')) {
    throw new Error('Non-security operation leaked into the focused guard presentation');
  }

  await page.getByRole('button', { name: /Groups/ }).click();
  const groupsView = page.getByTestId('characters-mode-groups');
  await groupsView.waitFor({ state: 'visible' });
  const groupCards = groupsView.locator('.group-card');
  const groupCount = await groupCards.count();
  if (groupCount !== 15) throw new Error(`Expected all 15 Succession roster groups, found ${groupCount}`);

  await assertNoHorizontalOverflow(page, 'desktop Characters view');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/characters?view=courts`, { waitUntil: 'networkidle' });
  await page.getByTestId('characters-mode-courts').waitFor({ state: 'visible' });
  await assertNoHorizontalOverflow(page, 'mobile court view');

  await page.goto(`${baseUrl}/characters`, { waitUntil: 'networkidle' });
  await page.getByTestId('characters-mode-all').waitFor({ state: 'visible' });
  await assertNoHorizontalOverflow(page, 'mobile character directory');

  console.log(`Character browser QA passed: ${characterCount} in-scope records, all 274 detailed profiles, search, stable selection, 14 courts, 15 groups, and responsive overflow checks.`);
});
