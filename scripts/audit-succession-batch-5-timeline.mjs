import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Succession Batch 5 timeline audit failed: ${message}`); };

const [workspace, voyage, styles, phaseData, timelineData, workflow, finalQa, router, intelligence, intelligenceData, intelligenceStyles, intelligenceView, questionLedger] = await Promise.all([
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/SuccessionTimeline.jsx'),
  read('src/components/SuccessionTimelineEditorial.css'),
  read('src/data/successionTimelinePresentation.js'),
  read('src/data/successionTimeline.js'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('scripts/succession-final-release-qa.mjs'),
  read('src/lib/appRouter.js'),
  read('src/components/TimelineIntelligencePanels.jsx'),
  read('src/data/successionTimelineIntelligence.js'),
  read('src/components/TimelineIntelligencePanels.css'),
  read('src/data/successionTimelineIntelligenceView.js'),
  read('src/data/successionTimelineQuestions.js'),
]);

for (const token of [
  'timeline-command--voyage-only',
  'SuccessionTimeline',
  'TimelineIntelligencePanels',
  'Research annex',
  'showChronology={false}',
  'defaultSectionsOpen={false}',
  'embedded',
  'onSearchCommit={applySearch}',
  'onOpenLocation',
  "scope: 'events'",
]) assert(workspace.includes(token), `semantic-zoom timeline wrapper is missing ${token}`);
assert(!workspace.includes('Complete series'), 'the retired complete-series timeline control returned');
assert(!workspace.includes('Global chronology command'), 'the retired global chronology identity returned');
assert(!workspace.includes("from '../data/arcs'"), 'the timeline wrapper imports the full-series arc catalogue');
assert(!workspace.includes("from '../data/seriesResearch'"), 'the timeline wrapper imports full-series chronology data');

for (const token of [
  'successionPreludeEvents',
  'successionTimelinePhases',
  'mediaForTimelinePhase',
  'timelinePhaseForChapter',
  'confidenceGroup',
  'chapterFrom',
  'chapterTo',
  'locationOptions',
  'activeFilterCount',
  'PAGE_SIZE',
  'TimelineEventRecord',
  'searchTextForEvent',
  'The story in seven movements. The record in full.',
  'What changed',
  'Movement spine',
  'Every event, in order.',
  'Entire archive',
  'Complete event record',
  'Cause / setup',
  'Show all {filteredEvents.length}',
]) assert(voyage.includes(token), `editorial timeline is missing ${token}`);
assert(!voyage.includes('timeline-command-voyage__mobile-lanes'), 'duplicate device-specific lane renderer returned');

for (const id of ['foundation', 'sealed-room', 'public-nen', 'lower-decks', 'failed-escape', 'convergence', 'martial-law']) {
  assert(phaseData.includes(`id: '${id}'`), `seven-movement presentation model is missing ${id}`);
}
for (const token of ['startChapter', 'endChapter', 'focusTracks', 'spotlightTerms', 'mediaForTimelinePhase', '/media/succession-contest/chapters/']) {
  assert(phaseData.includes(token), `timeline presentation data is missing ${token}`);
}
assert((phaseData.match(/id: '/g) || []).length === 7, 'timeline presentation must contain exactly seven editorial movements');
for (const token of ['export const successionPreludeEvents', 'maintainedPreludeByChapter', 'periodTitle', '+ successionPreludeEvents.length']) {
  assert(timelineData.includes(token), `complete pre-voyage event exposure is missing ${token}`);
}

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
  'showChronology = true',
  'defaultSectionsOpen = true',
]) assert(intelligence.includes(token), `timeline intelligence annex is missing ${token}`);

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

for (const token of ['strictTimelineNenForEvent', 'developmentMatchers', 'Gypsy Life: Bohemian Rhapsody mechanics are revealed', 'Dust in the Wind: Hell Fruit activates']) assert(intelligenceView.includes(token), `strict Nen timeline matching is missing ${token}`);
for (const token of ['successionDossierThrough417.js', 'successionMysteries', 'successionResolvedQuestions', 'timelineQuestionLedger', 'open:', 'resolved:']) assert(questionLedger.includes(token), `cumulative Timeline question ledger is missing ${token}`);

const princeCount = (intelligenceData.match(/order:\s*\d+,\s*name:/g) || []).length;
assert(princeCount === 14, `timeline intelligence must register all 14 princes; found ${princeCount}`);
for (let day = 1; day <= 12; day += 1) assert(intelligenceData.includes(`day: ${day},`), `timeline end-of-day synthesis is missing Voyage Day ${day}`);
for (const chapter of [385, 401, 409, 416, 417]) assert(intelligenceData.includes(String(chapter)), `timeline intelligence data is missing expected chapter signal ${chapter}`);

for (const selector of [
  '.st-editorial__masthead',
  '.st-phase-rail',
  '.st-phase-spread',
  '.st-phase-change',
  '.st-spotlight',
  '.st-archive-controls',
  '.st-arrangement',
  '.st-group',
  '.st-record',
  '.st-record__causality',
  '.st-record__metadata',
  '.st-research-annex',
]) assert(styles.includes(selector), `editorial timeline visual system is missing ${selector}`);
for (const selector of ['.timeline-intelligence', '.timeline-intelligence__causality', '.timeline-intelligence__day-change', '.timeline-intelligence__princes', '.timeline-intelligence__questions', '.timeline-intelligence__nen-grid', '.timeline-intelligence__deadlines']) assert(intelligenceStyles.includes(selector), `timeline intelligence visual system is missing ${selector}`);

assert(styles.includes('@media (max-width: 1080px)') && styles.includes('@media (max-width: 760px)') && styles.includes('@media (max-width: 520px)'), 'editorial timeline must include responsive composition changes');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'timeline reduced-motion behavior is required');
assert(intelligenceStyles.includes('@media (prefers-reduced-motion: reduce)'), 'timeline intelligence reduced-motion behavior is required');
assert(!styles.includes('!important'), 'editorial timeline CSS must not depend on important overrides');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'editorial timeline CSS must use the archive design tokens instead of raw hex colors');

assertReleasedSuccessionRoutes(['timeline'], assert, 'Succession release manifest');
assert(router.includes("candidate === 'timeline'") && router.includes("normalizeDestination('succession', 'timeline'"), 'legacy global Timeline URLs must redirect to the Succession voyage timeline');
assert(workflow.includes('node scripts/audit-succession-batch-5-timeline.mjs'), 'Batch 5 workflow must run the timeline audit');
assert(finalQa.includes('...successionReleaseRoutes.map'), 'the release matrix must render the curated Succession routes, including Timeline');
assert(workflow.includes('set -o pipefail'), 'final visual-QA command must propagate failures through tee');

console.log('Succession Batch 5 timeline audit passed: seven editorial movements, canonical chapter media, progressive record delivery, full pre-voyage detail, complete expandable evidence, responsive controls, and the research annex are registered without deleting chronology data.');
