import {
  adaptationCompletionRecords,
  completionArchiveCollections,
  completionQuizRecords,
  completionRewardRecords,
  GREED_ISLAND_COMPLETION_SOURCES,
  greedIslandCompletionStats,
  postClearRouteRecords,
  releaseReviewChecks,
  resolveGreedIslandCompletionSource,
} from '../src/data/greed-island/completionArchive.js';
import { enrichedSpecifiedCardById } from '../src/data/greed-island/specifiedCardsEnriched.js';
import { spellCardsById } from '../src/data/greed-island/cardLibraries.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Greed Island completion audit failed: ${message}`);
};

const cardExists = (rawId) => {
  const id = String(rawId);
  if (enrichedSpecifiedCardById.has(id)) return true;
  if (spellCardsById.has(id)) return true;
  return false;
};

const unique = (records, label) => {
  const ids = records.map((record) => record.id);
  assert(new Set(ids).size === ids.length, `${label} ids must be unique`);
};

assert(completionQuizRecords.length === 5, `expected 5 quiz records, found ${completionQuizRecords.length}`);
assert(completionRewardRecords.length === 5, `expected 5 reward records, found ${completionRewardRecords.length}`);
assert(postClearRouteRecords.length === 3, `expected 3 route records, found ${postClearRouteRecords.length}`);
assert(adaptationCompletionRecords.length === 4, `expected 4 adaptation records, found ${adaptationCompletionRecords.length}`);
assert(releaseReviewChecks.length === 6, `expected 6 release checks, found ${releaseReviewChecks.length}`);
assert(greedIslandCompletionStats.completionRecords === 23, `expected 23 total completion records, found ${greedIslandCompletionStats.completionRecords}`);

unique(completionQuizRecords, 'quiz');
unique(completionRewardRecords, 'reward');
unique(postClearRouteRecords, 'route');
unique(adaptationCompletionRecords, 'adaptation');
unique(releaseReviewChecks, 'release-check');

for (const [key, source] of Object.entries(GREED_ISLAND_COMPLETION_SOURCES)) {
  assert(source.id && source.label && source.verifiedAt, `source ${key} is incomplete`);
  assert(source.href.startsWith('https://hunterxhunter.fandom.com/wiki/'), `source ${key} is outside Hunterpedia/Fandom`);
}

const allRecords = [
  ...completionQuizRecords,
  ...completionRewardRecords,
  ...postClearRouteRecords,
  ...adaptationCompletionRecords,
  ...releaseReviewChecks,
];

for (const record of allRecords) {
  assert(record.title && record.summary.length >= 55, `${record.id} needs a readable title and summary`);
  assert(['verified', 'boundary', 'archive-simulation', 'release-gate'].includes(record.status), `${record.id} has unsupported status ${record.status}`);
  assert(resolveGreedIslandCompletionSource(record.sourceId).href, `${record.id} has unresolved source`);
  assert(record.tags.length > 0, `${record.id} needs tags`);
  for (const card of record.cards) assert(cardExists(card), `${record.id} references unknown card ${card}`);
  if (record.status !== 'release-gate') assert(record.steps.length >= 3, `${record.id} needs a three-step archive flow`);
  if (record.status === 'release-gate') assert(record.checks.length >= 3, `${record.id} needs release checks`);
}

assert(completionQuizRecords.some((record) => record.id === 'gon-87-score' && record.summary.includes('87 out of 100')), 'Gon 87/100 quiz record is missing');
assert(completionQuizRecords.some((record) => record.id === 'quiz-content-boundary' && record.status === 'boundary' && record.summary.includes('does not have a verified complete transcript')), 'quiz transcript boundary is missing');
assert(completionQuizRecords.some((record) => record.id === 'rulers-blessing-award' && record.cards.includes('000')), 'Ruler’s Blessing award must remain mapped to card 000');

assert(completionRewardRecords.some((record) => record.id === 'three-slot-holder' && record.summary.includes('exactly three')), 'three-card holder boundary is missing');
assert(completionRewardRecords.some((record) => record.id === 'paladins-necklace-conversion' && record.cards.includes('084') && record.cards.includes('1039') && record.summary.includes('Accompany')), 'Paladin’s Necklace / Accompany conversion record is missing');
assert(completionRewardRecords.some((record) => record.id === 'blue-planet-biscuit' && record.cards.includes('081')), 'Blue Planet / Biscuit reward record is missing');

const magnetic = postClearRouteRecords.find((record) => record.id === 'magnetic-force-to-ging');
const accompany = postClearRouteRecords.find((record) => record.id === 'accompany-to-kite');
const handoff = postClearRouteRecords.find((record) => record.id === 'chimera-ant-handoff');
assert(magnetic?.cards.includes('1005') && magnetic.destination.includes('Ging'), 'Magnetic Force route to Ging is missing');
assert(accompany?.cards.includes('1039') && accompany.destination.includes('Kite'), 'Accompany route to Kite is missing');
assert(handoff?.summary.includes('next major story route'), 'Kite handoff record is missing');

assert(adaptationCompletionRecords.some((record) => record.id === 'manga-chapter-183' && record.summary.includes('87/100')), 'Chapter 183 quiz adaptation record is missing');
assert(adaptationCompletionRecords.some((record) => record.id === 'manga-chapter-184' && record.cards.includes('002') && record.cards.includes('084')), 'Chapter 184 reward adaptation record is missing');
assert(adaptationCompletionRecords.some((record) => record.id === 'anime-endpoint-boundary' && record.status === 'boundary'), 'anime endpoint boundary is missing');

assert(releaseReviewChecks.some((record) => record.id === 'qa-evidence-required' && record.checks.includes('Browser QA passes')), 'QA evidence release gate is missing');
assert(releaseReviewChecks.some((record) => record.id === 'deployment-not-claimed' && record.summary.includes('not called live')), 'deployment non-claim gate is missing');

assert(Object.keys(completionArchiveCollections).join(',') === 'quiz,rewards,route,adaptation,release', 'completion archive collection order drifted');
assert(completionArchiveCollections.release.records === releaseReviewChecks, 'release collection does not reuse release checks');

console.log(`Greed Island completion audit passed: ${completionQuizRecords.length} quiz records, ${completionRewardRecords.length} reward records, ${postClearRouteRecords.length} route records, ${adaptationCompletionRecords.length} adaptation records, ${releaseReviewChecks.length} release checks.`);
