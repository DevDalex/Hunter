import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 414 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-414.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession414Research.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen413Archive = await vite.ssrLoadModule('/src/data/successionArchiveThrough413.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index410 = numbers.indexOf(410);
  assert(index410 >= 0 && numbers.slice(index410, index410 + 7).join(',') === '410,411,412,413,414,415,416', 'maintained chain must remain continuous from 410 through 416');

  const chapter414 = chapterModule.succession414ChapterResearch?.[0];
  assert(chapter414?.number === 414, 'Chapter 414 maintained research must load');
  assert(chapter414?.title === 'Friends', 'retained Chapter 414 title must be Friends');
  assert(chapter414?.voyageDay === 'Voyage Day 12', 'Chapter 414 must remain on Voyage Day 12');
  assert(chapter414?.chronology?.exactClockTime === null, 'Chapter 414 must not invent a new exact clock minute');
  assert(chapterModule.succession414TimelineEvents.length === 54, 'maintained research must preserve 54 curated Chapter 414 beats');

  const events414 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 414 && event.chapterRange?.end === 414);
  const projected414 = events414.filter((event) => event.maintainedResearch === true);
  const dedicated414 = events414.filter((event) => String(event.id || '').startsWith('event:chapter414-') && !event.maintainedResearch);
  assert(projected414.length === 54, 'story intelligence must project all 54 maintained beats');
  assert(dedicated414.length === 54, 'canonical graph must expose all 54 dedicated events');

  assert(!frozen413Archive.publicationBoundary414, 'frozen Through413 archive must remain unaware of Chapter 414');
  assert(activeArchive.publicationBoundary414?.chapter === 414, 'active archive must advance to Through414');
  assert(/Yamato/i.test(text(activeArchive.publicationBoundary414)) && /no new exact clock/i.test(text(activeArchive.publicationBoundary414)), 'active boundary must preserve Yamato endpoint and no-new-clock rule');

  const researchText = text(chapterModule.succession414TimelineEvents);
  assert(/lower-bunk guard raises an arm|raises an arm behind Kanjidol/i.test(researchText), 'Room 1007 lower-bunk cliff edge must remain visible');
  assert(/result is unresolved|fight result is unresolved|without a Chapter 414 result/i.test(researchText), 'Ridge–Kanjidol confrontation must remain unresolved');
  assert(/speculat|inference|prediction/i.test(researchText), 'Luzurus conclusions must retain speaker-bounded uncertainty');

  const chiyamasi = archive.getEntityById('character:chiyamasi');
  assert(chiyamasi?.name === 'Chiyamasi', 'Chiyamasi must exist as a canonical Chapter 414 participant');
  const muteking = archive.getEntityById('ability:muteking');
  assert(muteking?.name === 'Muteking' && /chiyamasi/i.test(text(muteking.ownerIds)), 'Muteking must exist with Chiyamasi ownership');
  assert(muteking?.latestChapter === 414 && /accumulat|invincib/i.test(text(muteking)), 'Muteking must preserve the demonstrated accumulating-invincibility boundary');
  assert(!/guaranteed survival|unlimited|permanent invincibility/i.test(text(muteking)), 'Muteking must not invent later or unlimited mechanics');

  const standByMe = archive.getAbilityKnowledgeAtChapter('ability:stinger-ball', 414);
  assert(/Stand By Me|stinger/i.test(text(standByMe)) && /impractical|no longer needed/i.test(text(standByMe)), 'Stand By Me knowledge must preserve Yushohi’s Chapter 414 strategic reassessment');
  assert(/Prince/i.test(text(standByMe)) && !/Princess|Queen/i.test(text(standByMe)), 'Stand By Me Chapter 414 referent must normalize to Prince without importing later story');
  const moonlight = archive.getAbilityKnowledgeAtChapter('ability:moonlight-act', 414);
  assert(/propos|counter-trap/i.test(text(moonlight)) && /not activated|No Chapter 414 activation/i.test(text(moonlight)), 'Moonlight Act must remain a proposed counter-trap, not a demonstrated Chapter 414 use');
  const dolphin = archive.getAbilityKnowledgeAtChapter('ability:stealth-dolphin', 414);
  assert(/too dangerous|life-threatening|rejected/i.test(text(dolphin)) && /not used|No Chapter 414 activation/i.test(text(dolphin)), 'Stealth Dolphin curse verification must remain rejected and unused');

  const yushohi = archive.getCharacterStateAtChapter('character:yushohi', 414);
  const chiyamasiState = archive.getCharacterStateAtChapter('character:chiyamasi', 414);
  const ridge = archive.getCharacterStateAtChapter('character:ridge', 414);
  const kanjidol = archive.getCharacterStateAtChapter('character:kanjidol', 414);
  assert(/Muteking/i.test(text(yushohi)) && /Room 1009/i.test(text(yushohi)), 'Yushohi Chapter 414 state must preserve Muteking and Room 1009 operation');
  assert(/Muteking/i.test(text(chiyamasiState)), 'Chiyamasi Chapter 414 state must preserve Muteking ownership/use');
  assert(/confrontation/i.test(text(ridge)) && /confrontation/i.test(text(kanjidol)), 'Ridge and Kanjidol states must preserve the unresolved confrontation');

  const relationshipIds = [
    'relationship:luzurus-ridge-ch414-delay-kanjidol',
    'relationship:ridge-kanjidol-ch414-unresolved-confrontation',
    'relationship:chiyamasi-yushohi-ch414-muteking-support',
    'relationship:bill-kurapika-ch414-beyond-planning',
    'relationship:oito-kurapika-ch414-yamato-trust',
  ];
  assert(relationshipIds.every((id) => archive.getEntityById(id)), 'all five Chapter 414 canonical relationships must be present');

  assert(/daughter Woble/i.test(researchText) && /unnamed nephew/i.test(researchText) && /boy/i.test(researchText), 'Room 1014 must preserve daughter-Woble versus aboard-nephew identity separation');
  assert(/no official match/i.test(researchText) && /Pyon/i.test(researchText), 'Pyon search must remain no-official-match and daughter Woble location unresolved');
  assert(/Gon and Killua/i.test(researchText) && /Yamato/i.test(researchText), 'trusted-friends thought and Yamato relay endpoint must remain present');
  assert(/no letter dispatch|No letter is sent|no outside contact/i.test(`${researchText} ${sourceNote}`), 'trusted-friends/Yamato plan must stop before completed outside contact');

  const laterOnly = /14:15|13:50|coded postcards|Tubeppa.*relocat|Luzurus.*missing|Marayam.*isolated|Oito.*confin|365-day|700-day/i;
  assert(!laterOnly.test(researchText), 'Chapter 414 maintained events must not import Chapter 415+ outcomes');

  const publicTimeline414 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 414 && event.maintainedResearch);
  assert(publicTimeline414.length === 54, 'public timeline must expose all 54 maintained Chapter 414 beats');
  assert(dossier.chapter414Research?.[0]?.number === 414, 'active dossier must expose strict Chapter 414 research');
  assert((dossier.successionChapterResearch || []).filter((record) => record.number === 414).length === 1, 'active dossier must expose Chapter 414 exactly once');

  assert(/sole substantive Chapter 414 story source/i.test(sourceNote) && /54 chapter-bounded events/i.test(sourceNote), 'source note must preserve source policy and event density');
  assert(/Yamato/i.test(sourceNote) && /strict Chapter 414 endpoint/i.test(sourceNote), 'source note must preserve Yamato stopping point');
  assert(/Prince/i.test(sourceNote) && /wording provenance|wording|semantic referent/i.test(sourceNote), 'source note must preserve the translation correction as wording provenance only');

  console.log(`Chapter 414 boundary audit passed: ${dedicated414.length} dedicated events plus ${projected414.length} maintained projections preserve Room 1007 and Room 1009 unresolved operations, Muteking and Stand By Me boundaries, the Woble identity/curse search, trusted-friends/Yamato endpoint, and Chapter 415+ spoiler firewall.`);
} finally {
  await vite.close();
}
