import { succession418TimelineEvents } from './succession418EventPacket.js';

const freeze = (value) => Object.freeze(value);
const source418 = 'https://hunterxhunter.fandom.com/wiki/Chapter_418';
const viz418 = 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-418/chapter/51055';

export { succession418TimelineEvents };

export const succession418SourcePolicy = freeze({
  reviewedAt:'2026-08-23',
  soleSubstantiveSource:freeze({
    label:'User-supplied Chapter 418 synopsis',
    basis:'The synopsis supplied directly in chat is the sole substantive Chapter 418 story source for this integration. VIZ is used only to verify publication date and official-reader identity.',
    referenceUrl:source418,
  }),
  titleRule:'The supplied synopsis did not provide an official English or Japanese chapter title. Keep generic Chapter 418 labelling until maintained title metadata is verified.',
  publicationCeiling:'Chapter 418 is the current publication ceiling at this integration boundary.',
  chronologyRule:'The chapter begins shortly before Benjamin’s Room 1004 assault, overlaps events previously presented in Chapters 416–417, then continues through Tserriednich’s post-assault escape preparations. Preserve that non-linear presentation without inventing clock times beyond the known Special Martial Law declaration and the stated next-day 6 a.m. funeral plan.',
  inferenceRule:'The antenna, spherical area, static-as-range signal, boundary-collapse behavior, outside-observer behavior, result-only vision rule, and one-eleventh aura-duration model remain Tserriednich’s hypotheses/self-models unless the supplied synopsis directly demonstrates them.',
  abilityRule:'Chapter 418 confirms that sustained Zetsu can extend affected observers’ perception beyond the original ten-second playback and resolves the apparent Tserriednich death as a perception effect rather than actual fatal trauma to the concealed prince.',
  stoppingPoint:'Theta passes the concealed Tserriednich without reacting and Tserriednich leaves Room 1004 to begin his escape, having selected Route A as his preferred path.',
  futureRule:'Do not invent a successful Route A traversal, Theta detection, an outside-observer test, final aura duration, or Chapter 419+ consequence.',
});

const focus = 'Chapter 418 rewinds to shortly before Benjamin’s Room 1004 assault and turns Tserriednich’s Parallel Future from a ten-second counterattack trick into a sustained perception-and-escape system: he experimentally maps its object/person interaction limits, discovers that remaining in Zetsu keeps affected observers following the predicted future, theorizes an area-of-effect and aura battery, survives Benjamin’s apparent execution unseen, engineers a no-viewing coffin deception, arms and disguises himself, evaluates Tier 1 escape routes, and leaves Room 1004 under the still-active effect.';

export const succession418ChapterResearch = freeze([freeze({
  number:418,
  title:'Chapter 418',
  japaneseTitle:null,
  phase:'Current releases',
  voyageDay:'Voyage Day 12',
  lanes:freeze([
    'Royal contest',
    'Tserriednich ability development',
    'Room 1004 staged death',
    'Special Martial Law',
    'Perception / reality mechanics',
    'Tier 1 escape planning',
  ]),
  focus,
  events:succession418TimelineEvents,
  prelude:freeze([]),
  locations:freeze([
    'Black Whale · Tier 1 · Room 1004 master bedroom',
    'Black Whale · Tier 1 · Room 1004',
    'Black Whale · Tier 1',
    'Tier 1 Route A',
    'Tier 1 Route B',
    'Tier 1 Route C',
  ]),
  characters:freeze([
    'Tserriednich Hui Guo Rou','Salkov','Benjamin Hui Guo Rou','Vantine','Danjin','Theta','Melody','Nasubi Hui Guo Rou',
  ]),
  threadLabels:freeze(['Tserriednich','Salkov','Theta','Benjamin','Parallel Future','Zetsu','Room 1004','Staged death','Escape routes','Special Martial Law']),
  confidence:freeze([
    '64 chapter-bounded beats are taken only from the user-supplied Chapter 418 synopsis.',
    'VIZ independently verifies Chapter 418 publication on August 23, 2026 and the official reader URL; no VIZ story content is imported.',
    'The apparent death uncertainty from Chapter 417 is resolved: Tserriednich remains alive and mobile while affected observers follow the predicted/staged future.',
    'Area-of-effect, antenna, static/range, boundary collapse, outside-observer, result-only vision, and one-eleventh battery rules remain Tserriednich hypotheses or estimates where the supplied synopsis does not complete a controlled test.',
    'Theta’s final glance is preserved as ambiguous; she walks past without confirmed recognition.',
    'Route A is Tserriednich’s chosen plan, not a confirmed successful escape route.',
    'Chapter 418 is the current publication ceiling; no Chapter 419+ consequence is invented.',
  ]),
  status:'Strict maintained Chapter 418 packet: 64 chapter-bounded beats, pre-assault Parallel Future experiments, sustained-Zetsu perception extension, Chapter 417 death-resolution, staged coffin deception, Room 1004 military inspection, Tier 1 route analysis, Theta ambiguity, and current-publication-ceiling firewall',
  coverage:freeze({ identity:true,publication:true,summary:true,sceneSummary:true,chronology:true,appearances:true,locations:true,relationships:true,assignments:true,nen:true,source:true }),
  lastReviewed:'August 23, 2026',
  releaseDate:'August 23, 2026',
  titleStatus:'official-title-not-supplied',
  officialReaderUrl:viz418,
  source:source418,
  crossChecks:freeze([
    succession418SourcePolicy.soleSubstantiveSource,
    freeze({ label:'VIZ Chapter 418 publication metadata', basis:'Official VIZ page verifies chapter number, release date, and reader identity only.', referenceUrl:viz418 }),
  ]),
})]);

export const succession418ChapterFocus = freeze({ 418:focus });

export const succession418NenFindings = freeze([
  freeze({ subject:'Parallel Future · activation', finding:'Tserriednich states that the ability activates while he is in Zetsu with his eyes shut; the ten-second vision is experienced subjectively while effectively no ordinary time passes for outside observers.', status:'confirmed by Tserriednich repeated use/self-observation', source:source418 }),
  freeze({ subject:'Parallel Future · person/object interaction', finding:'Tserriednich cannot directly alter another person’s location or physical state, but can alter objects and himself. Affected people continue perceiving/interacting with objects according to the predicted future even when Tserriednich has moved the real object.', status:'confirmed by water-bottle experiment within supplied synopsis', source:source418 }),
  freeze({ subject:'Parallel Future · sustained Zetsu extension', finding:'Remaining in Zetsu after the original ten-second playback keeps affected observers following the predicted Tserriednich/world-state while the real Tserriednich acts elsewhere.', status:'confirmed by Salkov experiment and Room 1004 assault overlap', source:source418 }),
  freeze({ subject:'Parallel Future · area/range model', finding:'Tserriednich theorizes an activation-point “antenna,” spherical influence, worsening static with distance, collapse at the boundary, and unaffected outside observers.', status:'Tserriednich hypothesis / incomplete range test', source:source418 }),
  freeze({ subject:'Parallel Future · aura battery', finding:'Tserriednich believes the continuing perception effect draws from stored aura and estimates usable time at roughly one-eleventh of charging time, giving him just under four hours remaining.', status:'Tserriednich estimate / exact formula unverified', source:source418 }),
  freeze({ subject:'Zetsu · stability', finding:'The Special Martial Law alarm does not break Tserriednich’s Zetsu. He believes he can now maintain it through everything except pain.', status:'alarm resistance demonstrated / pain limit remains Tserriednich self-assessment', source:source418 }),
]);

export const succession418Mysteries = freeze([
  freeze({ question:'What is the exact area of effect of Tserriednich’s sustained future perception?', evidence:'Tserriednich experiences stronger static with distance and proposes an antenna/sphere model, but does not complete a measured boundary test.', status:'open', lastChapter:'418', source:source418 }),
  freeze({ question:'What happens when an observer enters the effect from outside?', evidence:'Tserriednich explicitly wonders about the coffin-delivery men and says this edge case still needs testing.', status:'open at publication ceiling', lastChapter:'418', source:source418 }),
  freeze({ question:'Is the one-eleventh aura battery estimate exact?', evidence:'Tserriednich derives a just-under-four-hour estimate from his own assumed charge-to-operation ratio.', status:'open / self-model only', lastChapter:'418', source:source418 }),
  freeze({ question:'Did Theta actually perceive Tserriednich at the end of the chapter?', evidence:'Her gaze briefly appears to meet him, but she walks directly past without reacting.', status:'open / ambiguous', lastChapter:'418', source:source418 }),
  freeze({ question:'Can Tserriednich successfully leave the effect area and reach Route A?', evidence:'He chooses Route A and leaves Room 1004, but the supplied chapter ends before the traversal or boundary crossing is shown.', status:'open at publication ceiling', lastChapter:'418', source:source418 }),
]);

export const succession418ResolvedQuestions = freeze([
  freeze({ question:'Was Tserriednich actually killed by Benjamin in Room 1004?', answer:'No. Chapter 418 reveals that Tserriednich is alive and observing the assault from elsewhere while affected observers continue perceiving the predicted/staged Tserriednich.', chapter:418, source:source418 }),
  freeze({ question:'Can Tserriednich keep the perception effect running after the initial ten-second future?', answer:'Yes, while he continues maintaining Zetsu in the demonstrated Room 1004 sequence.', chapter:418, source:source418 }),
  freeze({ question:'Does the Special Martial Law alarm break Tserriednich’s Zetsu?', answer:'No. He remains in Zetsu through the alarm.', chapter:418, source:source418 }),
  freeze({ question:'What is the purpose of the no-viewing will and gun-filled coffin?', answer:'They are components of Tserriednich’s staged-death escape plan, intended to delay discovery that he is alive and provide plausible coffin weight.', chapter:418, source:source418 }),
  freeze({ question:'Which Tier 1 route does Tserriednich prefer for escape?', answer:'Route A, the royalty-reserved starboard route; this is a plan, not a completed traversal.', chapter:418, source:source418 }),
  freeze({ question:'What is the strict Chapter 418 endpoint?', answer:'Theta passes the concealed Tserriednich without confirmed recognition, and he heads out of Room 1004 to begin his escape.', chapter:418, source:source418 }),
]);
