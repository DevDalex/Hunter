import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession information design audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const design = await vite.ssrLoadModule('/src/data/succession/comprehensionDesignSystem.js');
  const requiredStates = ['canon', 'inference', 'theory', 'editorial', 'translation', 'changed', 'unresolved'];
  assert(design.successionSemanticStates.length === requiredStates.length, `semantic vocabulary must contain exactly ${requiredStates.length} published states`);
  for (const state of requiredStates) assert(design.successionSemanticStateMap[state]?.label, `semantic state ${state} is unavailable`);
  assert(design.successionInformationHierarchy.map((record) => record.id).join('|') === 'briefing|intelligence|research', 'progressive-disclosure hierarchy drifted from Briefing → Intelligence → Research');
  assert(design.successionPresentationRules.some((rule) => /Color never carries semantic meaning alone/i.test(rule)), 'semantic color accessibility rule is missing');
  assert(design.successionPresentationRules.some((rule) => /Top-N subsets disclose/i.test(rule)), 'top-N disclosure rule is missing');
  assert(design.successionPresentationRules.some((rule) => /density modes change presentation only/i.test(rule)), 'density-mode integrity rule is missing');

  const [badge, badgeCss, bar, barCss, primitives, quick, quickCss, shell] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionSemanticStateBadge.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionSemanticStateBadge.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionComprehensionBar.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionComprehensionBar.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionArchivePrimitives.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionEntityQuickBriefing.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionEntityQuickBriefing.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveShell.jsx'), 'utf8'),
  ]);

  assert(badge.includes('normalizeSuccessionSemanticState') && badge.includes('data-semantic-state'), 'shared semantic badge is not bound to the design-system vocabulary');
  for (const state of requiredStates) assert(badgeCss.includes(`.succession-semantic-state.is-${state}`), `semantic badge has no visible treatment for ${state}`);
  assert(badge.includes('lucide-react') && badge.includes('aria-hidden="true"'), 'semantic states do not retain a non-color icon cue');
  assert(bar.includes('successionSemanticStates.map') && bar.includes('SuccessionSemanticStateBadge'), 'global Meaning legend is not rendered from the shared semantic vocabulary');
  assert(primitives.includes('SuccessionSemanticStateBadge') && primitives.includes('semanticStateForCanonLevel'), 'canonical entity headers do not use the shared semantic vocabulary');

  for (const mode of ['comfortable', 'compact', 'analyst']) assert(bar.includes(`'${mode}'`), `density mode ${mode} is missing`);
  assert(bar.includes("hxh-succession-density-v1") && bar.includes('archive.dataset.density = density'), 'density mode is not persisted and attached to the archive root');
  assert(barCss.includes("[data-density='compact']") && barCss.includes("[data-density='analyst']"), 'compact/analyst archive density contracts are missing');

  for (const token of ['Five-second briefing', 'Recent change', 'Evidence', 'Unknown / unresolved', 'Connected state']) assert(quick.includes(token), `briefing hierarchy is missing ${token}`);
  assert(shell.includes('briefingEntity && <SuccessionEntityQuickBriefing'), 'selected records do not enter through the shared Briefing layer');
  assert(shell.indexOf('SuccessionEntityQuickBriefing') < shell.indexOf('SuccessionPeoplePowerComprehensionPanel'), 'Briefing does not precede deeper Intelligence surfaces in the shell source');

  for (const css of [badgeCss, barCss, quickCss]) {
    const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
    assert(fontSizes.every((size) => size >= 11), `information design introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
    assert(!/@media\s*\([^)]*max-width:/i.test(css), 'information design system must not add mobile/tablet product breakpoints');
    assert(css.includes('prefers-reduced-motion'), 'information design surface lacks reduced-motion handling');
  }

  console.log(`Succession information design audit passed: ${requiredStates.length} semantic states, ${design.successionInformationHierarchy.length} progressive-disclosure layers, shared entity briefing, and three persisted density modes are enforced.`);
} finally {
  await vite.close();
}
