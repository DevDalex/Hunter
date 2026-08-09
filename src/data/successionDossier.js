import * as base from './successionDossierThrough382.js';
import {
  succession383BanquetResearch,
  succession383BodyStates,
  succession383HunterCodeResearch,
  succession383KeeneyResearch,
  succession383MagicalWormResearch,
  succession383MarayamSpaceResearch,
  succession383MelodyPerformanceResearch,
  succession383Mysteries,
  succession383RelationshipRecords,
  succession383SourcePolicy,
  succession383TwinEscapeResearch,
  succession383WithoutYouResearch,
} from './succession383Research.js';

export * from './successionDossierThrough382.js';

const freeze = (value) => Object.freeze(value);
const source383 = 'https://hunterxhunter.fandom.com/wiki/Chapter_383';

const melody383Ability = freeze({
  ability: 'Melody’s Aura Performance',
  user: 'Melody',
  owner: 'Melody',
  type: 'Mass auditory entrancement / Nen classification unsupplied',
  category: 'Mass auditory entrancement',
  chapters: '383',
  chapter: 383,
  conditions: 'Melody plays sincerely and the listener hears the performance, directly or through the banquet loudspeakers in the Chapter 383 demonstration.',
  mechanics: 'Everyone who can hear the performance is entranced for three minutes and experiences a vivid scenic vision. The effect reaches absent princes through relayed banquet audio and creates the window for Keeney to move Kacho and Fugetsu to the lifeboat.',
  knownAtChapterBoundary: 'Three-minute duration, auditory targeting, scenic entrancement, and loudspeaker relay are directly demonstrated. Formal Nen category and broader immunity/range rules are not supplied.',
  target: 'Everyone who can hear the performance.',
  confidence: 'Core demonstrated effect confirmed / formal Nen classification and broader limits unresolved.',
  source: source383,
});

const magicalWorm383Ability = freeze({
  ability: 'Magical Worm',
  user: 'Fugetsu Hui Guo Rou Guardian Spirit Beast',
  owner: 'Fugetsu Hui Guo Rou Guardian Spirit Beast',
  type: 'Guardian Spirit Beast translocation tunnel',
  category: 'Translocation tunnel',
  chapters: '383',
  chapter: 383,
  conditions: 'The cooperative twin Guardian Spirit Beast system assigns the outward journey to Fugetsu and the return journey to Kacho. Fugetsu actively opens the emergency return door during the failed lifeboat escape.',
  mechanics: 'Magical Worm manifests the twins’ door/tunnel route. It works in cooperation with Kacho’s Without You. Exact range, destination rules, and post-Kacho return-control topology remain incomplete.',
  knownAtChapterBoundary: 'Official name, translocation function, twin directional roles, and cooperation with Without You are confirmed.',
  target: 'Fugetsu and Kacho / the Kacho-side cooperative counterpart.',
  confidence: 'Core route mechanics confirmed / complete range and post-death control topology unresolved.',
  source: source383,
});

const withoutYou383Ability = freeze({
  ability: 'Without You',
  user: 'Kacho Hui Guo Rou Guardian Spirit Beast',
  owner: 'Kacho Hui Guo Rou Guardian Spirit Beast',
  type: 'Death-triggered Guardian Spirit Beast protective continuation',
  category: 'Death-triggered protective continuation',
  chapters: '383',
  chapter: 383,
  conditions: 'One of the twins dies, causing the previously formless Guardian Spirit Beast to take the deceased twin’s form and remain with the surviving sister.',
  mechanics: 'After Kacho dies on the lifeboat, Without You appears in Kacho’s form and reunites with Fugetsu. The chapter identifies the entity as Kacho’s Guardian Spirit Beast and does not establish that Kacho’s human consciousness survives inside it.',
  knownAtChapterBoundary: 'Official name, death trigger, Kacho-form manifestation, protective purpose, and cooperation with Magical Worm are confirmed.',
  target: 'The surviving twin sister; Fugetsu in the Chapter 383 activation.',
  confidence: 'Core trigger and purpose confirmed / human-consciousness persistence explicitly unresolved.',
  source: source383,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !['Melody’s Aura Performance', 'Magical Worm', 'Without You'].includes(record.ability)),
  melody383Ability,
  magicalWorm383Ability,
  withoutYou383Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession383RelationshipRecords,
]);

export const bodyStateLedger = freeze([
  ...(base.bodyStateLedger || []),
  ...succession383BodyStates,
]);

const superseded383Mystery = (record) => {
  const question = String(record.question || '');
  return (question.includes('Fugetsu') && (question.includes('lower') || question.includes('route') || question.includes('reach')))
    || (question.includes('Kacho') && question.includes('Guardian Spirit Beast') && !question.includes('consciousness'));
};

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !superseded383Mystery(record)),
  ...succession383Mysteries,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter383: source383,
  sourcePolicy383: succession383SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 383 Sunday banquet escape, twin-beast reveal, and Kacho death',
    description: 'Melody turns the Sunday banquet into a three-minute escape window, Keeney launches the twins’ lifeboat and then dies by suicide, the succession boundary prevents Kacho and Fugetsu from leaving, Kacho dies, and Without You continues her protective role beside Fugetsu. Room 1013 also reveals a one-way re-entry problem for departing servants, while the Hunter Code finally decodes Mizaistom’s Chapter 381 call.',
    records: freeze([
      freeze({ subject: 'Sunday banquet escape window', people: 'Melody, Keeney, Kacho Hui Guo Rou, Fugetsu Hui Guo Rou', notes: 'Melody’s sincere flute performance entrances everyone who can hear it for three minutes, including through loudspeakers. Keeney uses the window to escort the twins to a lifeboat.', status: 'escape launched / auditory Nen mechanics materially clarified', source: source383 }),
      freeze({ subject: 'Keeney final operation', people: 'Keeney, Melody, Hunter Association', notes: 'Keeney explains his family loss and concern that exposed accomplices could implicate the Hunter Association. After launching the twins’ lifeboat, he kills himself.', status: 'Keeney deceased / route-lead role ended', source: source383 }),
      freeze({ subject: 'Twin escape boundary', people: 'Kacho Hui Guo Rou, Fugetsu Hui Guo Rou', notes: 'A mass of hands attacks the twins as the lifeboat approaches open water. Fugetsu opens an emergency return door, survives, and returns toward the ship; Kacho remains behind and dies on the lifeboat.', status: 'physical escape failed / Kacho deceased / exact ritual-enforcement mechanism unresolved', source: source383 }),
      freeze({ subject: 'Magical Worm and Without You', people: 'Fugetsu Hui Guo Rou, Kacho Hui Guo Rou Guardian Spirit Beast', notes: 'Magical Worm is revealed as the twins’ translocation tunnel system. Without You activates after Kacho’s death, takes Kacho’s form, and remains beside Fugetsu as protection.', status: 'cooperative twin Guardian Spirit Beast system confirmed / Kacho-form entity distinct from deceased human Kacho', source: source383 }),
      freeze({ subject: 'Room 1013 isolated-space staffing', people: 'Marayam Hui Guo Rou, Vergei, Biscuit Krueger', notes: 'Servants who leave the isolated Nen space for the banquet are stated to be unable to return. Biscuit proposes staffing the real room with Hunters while she remains inside with Marayam.', status: 're-entry restriction confirmed for departing servants / complete spatial rule unresolved', source: source383 }),
      freeze({ subject: 'Hunter Code retrospective', people: 'Mizaistom Nana, Melody', notes: 'Chapter 383 reveals the numerical Hunter Code rule and decodes the Chapter 381 call as “Assist Princes escape fully.” The decode is recorded as Chapter 383 knowledge rather than backdated into Chapter 381.', status: 'Chapter 381 covert message resolved retrospectively', source: source383 }),
    ]),
  }),
]);

export const banquetChapter383Research = succession383BanquetResearch;
export const marayamChapter383SpaceResearch = succession383MarayamSpaceResearch;
export const melodyChapter383PerformanceResearch = succession383MelodyPerformanceResearch;
export const keeneyChapter383Research = succession383KeeneyResearch;
export const twinEscapeChapter383Research = succession383TwinEscapeResearch;
export const magicalWormChapter383Research = succession383MagicalWormResearch;
export const withoutYouChapter383Research = succession383WithoutYouResearch;
export const hunterCodeChapter383Research = succession383HunterCodeResearch;
