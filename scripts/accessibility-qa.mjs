import axe from 'axe-core';
import { withPreviewPage } from './lib/browserSmoke.mjs';

await withPreviewPage({ port: 4174 }, async ({ page }) => {
  await page.addScriptTag({ content: axe.source });
  const results = await page.evaluate(async () => window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    resultTypes: ['violations'],
  }));
  const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
  if (blocking.length) {
    const summary = blocking.map((violation) => `${violation.id} (${violation.impact}): ${violation.nodes.length} node(s)`).join(' | ');
    throw new Error(`blocking accessibility violations: ${summary}`);
  }
  console.log(`Accessibility browser QA passed: ${results.violations.length} total axe violation group(s), none serious or critical.`);
});
