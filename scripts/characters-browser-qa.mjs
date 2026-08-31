import { withPreviewPage } from './lib/browserSmoke.mjs';

const assertNoHorizontalOverflow = async (page, label) => {
  const result = await page.evaluate(() => {
    const documentWidth = document.documentElement.scrollWidth;
    const viewportWidth = document.documentElement.clientWidth;
    const offenders = [...document.querySelectorAll('body *')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          id: element.id || '',
          className: typeof element.className === 'string' ? element.className : '',
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          scrollWidth: element.scrollWidth,
          minWidth: getComputedStyle(element).minWidth,
          widthRule: getComputedStyle(element).width,
        };
      })
      .filter((entry) => entry.right > viewportWidth + 2 || entry.left < -2 || entry.width > viewportWidth + 2 || entry.scrollWidth > viewportWidth + 2)
      .sort((a, b) => Math.max(b.width, b.scrollWidth) - Math.max(a.width, a.scrollWidth))
      .slice(0, 12);
    return { overflow: documentWidth - viewportWidth, offenders };
  });
  if (result.overflow > 2) throw new Error(`${label} has ${result.overflow}px of horizontal overflow; offenders=${JSON.stringify(result.offenders)}`);
};

await withPreviewPage({ port: 4173, path: '/characters' }, async ({ page, baseUrl }) => {
  const root = page.getByTestId('characters-root');
  await root.waitFor({ state: 'visible' });

  const rootText = await root.innerText();
  const countMatch = rootText.match(/([\d,]+)\s+Succession character records/i);
  if (!countMatch) throw new Error('Characters did not expose an in-scope Succession character count');
  const characterCount = Number(countMatch[1].replaceAll(',', ''));
  if (characterCount < 274) throw new Error(`Expected at least 274 in-scope Succession character records, found ${characterCount}`);
  if (!rootText.includes('274 detailed roster profiles')) throw new Error('Characters did not preserve all 274 detailed Succession roster profiles');

  const theme = await root.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return { background: style.backgroundColor, color: style.color, width: rect.width, viewport: window.innerWidth };
  });
  if (theme.background !== 'rgb(0, 0, 0)') throw new Error(`Characters background is not pure black: ${theme.background}`);
  if (theme.color !== 'rgb(255, 255, 255)') throw new Error(`Characters text is not pure white: ${theme.color}`);
  if (theme.width / theme.viewport < 0.94) throw new Error(`Characters does not scale to the viewport: ${theme.width}/${theme.viewport}`);

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
  if (beforeSelectionScroll > 200 && afterSelectionScroll < 100) throw new Error(`Character selection jumped to page top (${beforeSelectionScroll} -> ${afterSelectionScroll})`);

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

  const focusedCourt = page.getByTestId('focused-court');
  const hierarchyText = await focusedCourt.innerText();
  if (!/King\s*→\s*Queen\s*→\s*Prince\s*→\s*Guard formation/i.test(hierarchyText)) throw new Error('Focused court does not expose the King → Queen → Prince → Guard hierarchy');
  if (!hierarchyText.toLowerCase().includes('nasubi')) throw new Error('Focused court does not show King Nasubi');
  if (/\bqueen\s+unknown\b|\bunknown\s+royal household\b/i.test(hierarchyText)) throw new Error('Focused court still resolves a Queen as Unknown');
  if (await focusedCourt.locator('.royal-lineage-portrait--king').count() !== 1) throw new Error('Focused court is missing the King portrait');
  if (await focusedCourt.locator('.royal-lineage-portrait--queen').count() !== 1) throw new Error('Focused court is missing the Queen portrait');
  if (await focusedCourt.locator('.court-prince-card').count() !== 1) throw new Error('Focused court is missing the Prince portrait');

  const focusedBefore = await focusedCourt.innerText();
  await courtCards.nth(1).click();
  await page.waitForTimeout(50);
  const focusedAfter = await focusedCourt.innerText();
  if (focusedAfter === focusedBefore) throw new Error('Selecting another Prince did not update the focused court');
  if (/surveillance|assassination|instruction|custody/i.test(focusedAfter.match(/confirmed guards[\s\S]*$/i)?.[0] || '')) throw new Error('Non-security operation leaked into the focused guard presentation');

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

  console.log(`Character browser QA passed: ${characterCount} records, 274 detailed profiles, monochrome full-width layout, royal portrait hierarchy, search, court switching, groups, and responsive overflow checks.`);
});
