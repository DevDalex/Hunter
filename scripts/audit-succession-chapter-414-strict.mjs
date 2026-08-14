import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 414 strict audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-414.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapter = await vite.ssrLoadModule('/src/data/succession414Research.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen413 = await vite.ssrLoadModule('/src/data/successionArchiveThrough413.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const research = chapter.succession414ChapterResearch?.[0];
  assert(research?.number === 414 && research?.title === 'Friends', 'strict Chapter 414 Friends record must load');
  assert(research?.voyageDay === 'Voyage Day 12' && research?.chronology?.exactClockTime === null, 'Voyage Day 12 must not gain an invented clock minute');
  assert(chapter.succession414TimelineEvents.length === 55, 'research must contain 55 curated beats');
  assert(research?.characters?.includes('Shimanu'), 'Chapter 414 character appearance index must include Shimanu');

  const shimanuResearchIds = new Set(['414-room1014-planning-group', '414-shimanu-boy-discovery', '414-shimanu-duty-future-treatment']);
  const shimanuResearchEvents = chapter.succession414TimelineEvents.filter((event) => shimanuResearchIds.has(event.id));
  assert(shimanuResearchEvents.length === 3 && shimanuResearchEvents.every((event) => event.people?.includes('Shimanu')), 'all three Chapter 414 Shimanu beats must preserve participant indexing');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index410 = numbers.indexOf(410);
  assert(numbers.slice(index410, index410 + 7).join(',') === '410,411,412,413,414,415,416', 'maintained 410–416 chain must remain continuous');

  const events = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 414 && event.chapterRange?.end === 414);
  const projected = events.filter((event) => event.maintainedResearch === true);
  const dedicated = events.filter((event) => String(event.id || '').startsWith('event:chapter414-') && !event.maintainedResearch);
  assert(projected.length === 55, 'all 55 maintained beats must project into story intelligence');
  assert(dedicated.length === 55, 'all 55 dedicated Chapter 414 events must exist');

  const shimanuCanonicalIds = new Set(['event:chapter414-room1014-planning-group', 'event:chapter414-shimanu-boy-discovery', 'event:chapter414-shimanu-duty-future-treatment']);
  const shimanuCanonicalEvents = dedicated.filter((event) => shimanuCanonicalIds.has(event.id));
  assert(archive.getEntityById('character:shimano'), 'canonical Shimano/Shimanu entity must resolve');
  assert(shimanuCanonicalEvents.length === 3 && shimanuCanonicalEvents.every((event) => event.participantIds?.includes('character:shimano')), 'canonical Shimanu events must point to character:shimano');
  assert(shimanuCanonicalEvents.every((event) => !event.participantIds?.includes('character:shimanu')), 'no duplicate character:shimanu id may be created');

  assert(!frozen413.publicationBoundary414, 'Through413 must stay frozen');
  assert(activeArchive.publicationBoundary414?.chapter === 414 && /Yamato/i.test(text(activeArchive.publicationBoundary414)), 'active archive must advance through the Yamato endpoint');
  assert((dossier.successionChapterResearch || []).filter((record) => record.number === 414).length === 1, 'active dossier must expose exactly one Chapter 414 record');

  assert(archive.getEntityById('character:chiyamasi')?.name === 'Chiyamasi', 'Chiyamasi must be canonical');
  const muteking = archive.getEntityById('ability:muteking');
  assert(muteking?.latestChapter === 414 && /chiyamasi/i.test(text(muteking.ownerIds)) && /accumulat|invincib|protection/i.test(text(muteking)), 'Muteking must preserve owner and demonstrated Chapter 414 boundary');
  const standByMe = archive.getAbilityKnowledgeAtChapter('ability:stinger-ball', 414);
  assert(/Stand By Me|stinger/i.test(text(standByMe)) && /impractical|no longer needed/i.test(text(standByMe)) && /Prince/i.test(text(standByMe)), 'Stand By Me must preserve Yushohi’s Prince-target strategic reassessment');
  const moonlight = archive.getAbilityKnowledgeAtChapter('ability:moonlight-act', 414);
  assert(/propos|counter-trap/i.test(text(moonlight)) && /not activated|No Chapter 414 activation/i.test(text(moonlight)), 'Moonlight Act must remain proposed rather than activated');
  const dolphin = archive.getAbilityKnowledgeAtChapter('ability:stealth-dolphin', 414);
  assert(/too dangerous|life-threatening|rejected/i.test(text(dolphin)), 'Stealth Dolphin curse verification must remain rejected as too risky');

  const researchText = text(chapter.succession414TimelineEvents);
  assert(/unnamed nephew/i.test(researchText) && /daughter Woble/i.test(researchText) && /boy/i.test(researchText), 'daughter Woble and aboard nephew must remain separate identities');
  assert(/Pyon/i.test(researchText) && /no official match/i.test(researchText), 'Pyon search must remain unresolved');
  assert(/Gon and Killua/i.test(researchText) && /Yamato/i.test(researchText), 'trusted-friends and Yamato endpoint must be present');
  assert(/one person inside/i.test(researchText) && /Muteking/i.test(researchText), 'Room 1009 setup must stop before a later result');
  assert(/result is unresolved|without a Chapter 414 result|fight result is unresolved/i.test(researchText), 'Room 1007 confrontation must remain unresolved');

  const relationshipIds = [
    'relationship:luzurus-ridge-ch414-delay-kanjidol',
    'relationship:ridge-kanjidol-ch414-unresolved-confrontation',
    'relationship:chiyamasi-yushohi-ch414-muteking-support',
    'relationship:bill-kurapika-ch414-beyond-planning',
    'relationship:oito-kurapika-ch414-yamato-trust',
  ];
  assert(relationshipIds.every((id) => archive.getEntityById(id)), 'five canonical Chapter 414 relationships must exist');
  assert(['kanjidol', 'ridge', 'yushohi', 'chiyamasi'].every((slug) => archive.getCharacterStateAtChapter(`character:${slug}`, 414)), 'four Chapter 414 character-state snapshots must resolve');

  const publicTimeline = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 414 && event.maintainedResearch);
  assert(publicTimeline.length === 55, 'public timeline must expose 55 maintained Chapter 414 beats');
  assert(/sole substantive Chapter 414 story source/i.test(sourceNote) && /55 chapter-bounded events/i.test(sourceNote), 'source note must preserve source policy and corrected count');
  assert(/strict Chapter 414 endpoint/i.test(sourceNote) && /Yamato/i.test(sourceNote), 'source note must preserve the Yamato stopping point');

  const laterOnly = /14:15|13:50|coded postcards|Tubeppa.*relocat|Luzurus.*missing|Marayam.*isolated|Oito.*confin|365-day|700-day/i;
  assert(!laterOnly.test(researchText), 'Chapter 415+ outcomes must stay outside the 414 event packet');

  console.log(`Chapter 414 boundary audit passed: ${dedicated.length} dedicated events plus ${projected.length} maintained projections preserve Room 1007/1009 uncertainty, bounded Nen knowledge, Shimanu appearance indexing, Woble identity and curse-search logic, trusted-friends/Yamato endpoint, and the Chapter 415+ firewall.`);
} finally {
  await vite.close();
}
