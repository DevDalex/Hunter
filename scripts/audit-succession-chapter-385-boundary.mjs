import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Chapter 385 boundary audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');

  const maintainedNumbers = maintained.maintainedSuccessionChapterNumbers;
  const index384 = maintainedNumbers.indexOf(384);
  const index385 = maintainedNumbers.indexOf(385);
  assert(index384 >= 0 && index385 === index384 + 1, 'Chapter 385 must sit directly after Chapter 384 in the maintained research chain');

  const chapter385 = maintained.maintainedSuccessionChapterResearch.find((record) => record.number === 385);
  assert(chapter385?.coverage?.chronology && chapter385?.coverage?.abilities && chapter385?.coverage?.guardianBeastState, 'Chapter 385 maintained research must cover chronology, ability evidence, and Guardian Spirit Beast state');
  assert(chapter385.voyageDay === 'Voyage Day 8', 'Chapter 385 must remain on Voyage Day 8 banquet night');
  assert(chapter385.events.some((event) => event.id === '385-zetsu-temporal-anomaly'), 'Chapter 385 maintained timeline must include the time-skip anomaly');

  const parallel385 = archive.getAbilityDossier('ability:parallel-future', 385);
  assert(parallel385?.known, 'Parallel Future entity must become available at Chapter 385');
  assert(parallel385.knowledgeState === 'partially documented', 'Chapter 385 must expose Parallel Future as only partially documented');
  assert(!String(parallel385.mechanics?.activation || '').toLowerCase().includes('ten-second'), 'Chapter 385 activation must not leak the later ten-second rule');
  assert(String(parallel385.mechanics?.duration || '').toLowerCase().includes('unknown'), 'Chapter 385 duration must remain unresolved');
  assert(parallel385.sources.length === 1 && parallel385.sources[0]?.chapter === 385, 'Chapter 385 ability knowledge must source only Chapter 385 at this boundary');
  assert(parallel385.mechanics.knownUses.some((use) => use.includes('Theta') && use.includes('time skipped')), 'Chapter 385 ability knowledge must preserve the observed assassination/time-skip sequence');

  const beast385 = archive.getGuardianBeastStateAtChapter('guardian-beast:tserriednich', 385);
  assert(beast385?.chapterRange?.start === 385 && beast385?.chapterRange?.end === 385, 'Tserriednich Guardian Spirit Beast must have an explicit Chapter 385-only state');
  assert(beast385.operationalState.includes('disappears') && beast385.operationalState.includes('returns'), 'Chapter 385 beast state must preserve disappearance during Zetsu and return afterward');
  assert(beast385.unresolved.some((item) => item.includes('pawn')), 'Salkov pawn-conversion concern must remain unresolved rather than confirmed');

  const tserriednich385 = archive.getEntityById('character:tserriednich-hui-guo-rou');
  assert(tserriednich385?.status?.life !== 'dead', 'Theta’s apparent headshot must not mark Tserriednich dead');

  const chapter385Events = archive.getEventsForChapter(385);
  assert(chapter385Events.some((event) => event.id === 'event:theta-attempts-tserriednich-assassination'), 'canonical Chapter 385 events must include Theta’s assassination attempt');
  assert(chapter385Events.some((event) => event.id === 'event:tserriednich-zetsu-time-skip-anomaly'), 'canonical Chapter 385 events must include the unresolved time-skip anomaly');
  assert(chapter385Events.some((event) => event.id === 'event:tserriednich-orders-melody-formal-invitation'), 'canonical Chapter 385 events must include the Melody invitation order');

  const relationships385 = archive.getRelationshipsForChapter(385);
  assert(relationships385.some((record) => record.id === 'relationship:theta-tserriednich-active-assassination-hostility'), 'Chapter 385 relationship graph must include Theta’s active assassination hostility');
  assert(relationships385.some((record) => record.id === 'relationship:salkov-theta-post-assassination-alliance'), 'Chapter 385 relationship graph must include Salkov and Theta’s counterplanning alliance');
  assert(relationships385.some((record) => record.id === 'relationship:tserriednich-melody-formal-contact-interest'), 'Chapter 385 relationship graph must include Tserriednich’s formal Melody contact interest');

  console.log('Succession Chapter 385 boundary audit passed: maintained ordering, Day 8 chronology, partial temporal mechanics, Guardian Spirit Beast escalation, body-state safety, canonical events, and relationships are chapter-bounded.');
} finally {
  await vite.close();
}
