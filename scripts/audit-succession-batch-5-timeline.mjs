import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Succession Batch 5 timeline audit failed: ${message}`); };

const [workspace, voyage, styles, workflow, finalQa, router, intelligence, intelligenceData, intelligenceStyles, intelligenceView, questionLedger] = await Promise.all([
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/SuccessionTimeline.jsx'),
  read('src/components/TimelineCommand.css'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('scripts/succession-final-release-qa.mjs'),
  read('src/lib/appRouter.js'),
  read('src/components/TimelineIntelligencePanels.jsx'),
  read('src/data/successionTimelineIntelligence.js'),
  read('src/components/TimelineIntelligencePanels.css'),
  read('src/data/successionTimelineIntelligenceView.js'),
  read('src/data/successionTimelineQuestions.js'),
]);

for (const token of ['timeline-command--voyage-only','Succession voyage chronology','The voyage as a chapter-bounded operational ledger','without opening the retired global chronology','SuccessionTimeline','TimelineIntelligencePanels','onOpenLocation',"scope: 'events'"]) assert(workspace.includes(token), `voyage-only timeline wrapper is missing ${token}`);
assert(!workspace.includes('Complete series'), 'the retired complete-series timeline control returned');
assert(!workspace.includes('Global chronology command'), 'the retired global chronology identity returned');
assert(!workspace.includes("from '../data/arcs'"), 'the voyage-only wrapper still imports the full-series arc catalogue');
assert(!workspace.includes("from '../data/seriesResearch'"), 'the voyage-only wrapper still imports full-series chronology data');

for (const token of ['confidenceGroup','chapterFrom','chapterTo','locationOptions','activeFilterCount','timeline-command-voyage__hero','timeline-command-voyage__metrics','timeline-command-voyage__controls','timeline-command-voyage__selected']) assert(voyage.includes(token), `voyage timeline workspace is missing ${token}`);
assert(!voyage.includes('timeline-command-voyage__mobile-lanes'), 'duplicate narrow-screen lane renderer returned');
assert(!/\bmobile\b/i.test(voyage), 'device-specific timeline wording returned');

for (const token of [
  'What happened, why it mattered, and what it changed.',
  'Integrated chronology',
  'All fourteen princes',
  'Open ↔ resolved ↔ all',
  "['open', 'resolved', 'all']",
  'Nen developments',
  'Active deadlines & countdowns',
  "['major', 'standard', 'complete']",
  'Cause / setup',
  'Immediate consequence',
  'Leads to',
  'Timing:',
  'Evidence:',
  'Pre-voyage · Chapters 340–358',
  'End-of-day synthesis',
  'What changed?',
  'People',
  'Continue through the archive',
  'timelineQuestionLedger',
  'strictTimelineNenForEvent',
]) assert(intelligence.includes(token), `timeline intelligence UI is missing ${token}`);

for (const token of [
  'timelinePrinceProfiles',
  'timelineCausality',
  'timelineDayChanges',
  'timelineDeadlines',
  'timelineNenDevelopments',
  'timelineImportance',
  'timingConfidenceForEvent',
  'evidenceConfidenceForEvent',
  'peopleForTimelineEvent',
  'timelinePreludeRecords',
]) assert(intelligenceData.includes(token), `timeline intelligence data is missing ${token}`);

for (const token of ['strictTimelineNenForEvent','developmentMatchers','Gypsy Life: Bohemian Rhapsody mechanics are revealed','Dust in the Wind: Hell Fruit activates']) assert(intelligenceView.includes(token), `strict Nen timeline matching is missing ${token}`);
for (const token of ['successionDossierThrough417.js','successionMysteries','successionResolvedQuestions','timelineQuestionLedger','open:','resolved:']) assert(questionLedger.includes(token), `cumulative Timeline question ledger is missing ${token}`);

const princeCount = (intelligenceData.match(/order:\s*\d+,\s*name:/g) || []).length;
assert(princeCount === 14, `timeline intelligence must register all 14 princes; found ${princeCount}`);
for (let day = 1; day <= 12; day += 1) assert(intelligenceData.includes(`day: ${day},`), `timeline end-of-day synthesis is missing Voyage Day ${day}`);
for (const chapter of [385, 401, 409, 416, 417]) assert(intelligenceData.includes(String(chapter)), `timeline intelligence data is missing expected chapter signal ${chapter}`);
assert(intelligence.includes('Chapter 340 → Ch. {spoilerLimit}') && intelligence.includes('Pre-voyage · Chapters 340–358'), 'pre-voyage Chapters 340–358 must remain visibly integrated through derived prelude data');

for (const selector of ['.timeline-command__hero','.timeline-command__signal','.timeline-command-voyage__hero','.timeline-command-voyage__filter-grid','.timeline-command-voyage__selected','.timeline-day-rail','.timeline-workbench','.timeline-swimlanes','.timeline-thread-view','.timeline-chapter-view','.timeline-location-view']) assert(styles.includes(selector), `timeline visual system is missing ${selector}`);
for (const selector of ['.timeline-intelligence','.timeline-intelligence__causality','.timeline-intelligence__day-change','.timeline-intelligence__princes','.timeline-intelligence__questions','.timeline-intelligence__nen-grid','.timeline-intelligence__deadlines']) assert(intelligenceStyles.includes(selector), `timeline intelligence visual system is missing ${selector}`);

for (const css of [styles, intelligenceStyles]) {
  assert(!/@media\s*\([^)]*max-width:/i.test(css), 'desktop-only timeline CSS must not carry narrow-width breakpoint layouts');
  assert(!css.includes('@media (hover: none)'), 'desktop-only timeline CSS must not carry no-hover device behavior');
  assert(!css.includes('(pointer: coarse)'), 'desktop-only timeline CSS must not carry coarse-pointer behavior');
  assert(!css.includes('touch-action:'), 'desktop-only timeline CSS must not carry touch-action rules');
  assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(css), 'timeline CSS must not introduce raw hex colors');
  assert(!css.includes('!important'), 'timeline CSS must not depend on !important');
}
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'timeline reduced-motion behavior is required');
assert(intelligenceStyles.includes('@media (prefers-reduced-motion: reduce)'), 'timeline intelligence reduced-motion behavior is required');

assertReleasedSuccessionRoutes(['timeline'], assert, 'Succession release manifest');
assert(router.includes("candidate === 'timeline'") && router.includes("normalizeDestination('succession', 'timeline'"), 'legacy global Timeline URLs must redirect to the Succession voyage timeline');
assert(workflow.includes('node scripts/audit-succession-batch-5-timeline.mjs'), 'Batch 5 workflow must run the timeline audit');
assert(finalQa.includes('...successionReleaseRoutes.map'), 'the release matrix must render the curated Succession routes, including Timeline');
assert(workflow.includes('set -o pipefail'), 'final visual-QA command must propagate failures through tee');
console.log('Succession Batch 5 timeline audit passed: desktop voyage chronology plus causality, day-change synthesis, 14-prince progression, cumulative open/resolved questions, strict Nen signals, deadlines, archive links, dual certainty, and real content-depth modes are registered without narrow-screen behavior.');
