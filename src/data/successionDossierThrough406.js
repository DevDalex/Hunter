import * as base from './successionDossierThrough405.js';
import {
  succession406ChapterResearch,
  succession406Mysteries,
  succession406RelationshipRecords,
  succession406ResolvedQuestions,
  succession406SourcePolicy,
} from './succession406Research.js';

export * from './successionDossierThrough405.js';

const freeze = (value) => Object.freeze(value);
const source406 = 'https://hunterxhunter.fandom.com/wiki/Chapter_406';

const loveDial406 = freeze({
  ability: 'Love Dial 6700 - Disgusting Telephone · Chapter 406 Skill Hunter phone search',
  user: 'Chrollo Lucilfer', owner: 'Original owner unresolved; demonstrated current user is Chrollo via Skill Hunter',
  type: 'Search / guidance ability · formal Nen category unresolved',
  category: 'Criteria-based conjured-cell-phone target search',
  chapters: '406', chapter: 406,
  conditions: 'The supplied translated page says criteria produce a 6–20 digit number which is dialed for guidance. Story use is affected by caller location/coordinates and a Nen signal range, and Chrollo has a finite number of calls for the day.',
  mechanics: 'A first call says the person is outside the current area. A later call during Halkenburg’s procession locates the person beyond the current Nen signal range and asks Chrollo to change coordinates. Chrollo concludes the target is above Tier 3.',
  knownAtChapterBoundary: 'The page label Love Dial 6700 - Disgusting Telephone is available from supplied trivia. Target identity, exact tier, daily count, signal radius, category, original owner, reset rules, and the meaning of “McGait Narumi” remain unresolved.',
  target: 'Unspecified person matching Chrollo’s selected criteria.',
  confidence: 'Basic translated page mechanics and demonstrated calls confirmed / full rules and original owner unresolved.',
  source: source406,
});

const biohazard406 = freeze({
  ability: 'Biohazard · Chapter 406 transmitter reversion',
  user: 'Hinrigh Biganduffno', owner: 'Hinrigh Biganduffno',
  type: 'Object-to-living-animal transformation',
  category: 'Transformed tracking-device persistence/reversion',
  chapters: '390, 391, 394, 398, 399, 406', chapter: 406,
  conditions: 'The transmitter transformed into a raw oyster in the prior operation remains hidden beneath the Heil-Ly cabinet and continues beeping before reversion.',
  mechanics: 'Chapter 406 shows the oyster form suddenly revert to the original transmitter. The exact elapsed duration, remaining aura, and universal persistence threshold are not supplied.',
  knownAtChapterBoundary: 'The original transmitter is physically present inside the hideout after reversion; the scene does not state that Hinrigh personally witnesses the moment.',
  target: 'Previously transformed transmitter.',
  confidence: 'Reversion confirmed / exact duration and awareness unresolved.',
  source: source406,
});

const lsdf406 = freeze({
  ability: 'A Battle of Wits: “LSDF” · Chapter 406 operational recap',
  user: 'Yokotani', owner: 'Yokotani',
  type: 'Conjuration hideout defense',
  category: 'Law-conditioned counteractive defensive guards',
  chapters: '399, 406', chapter: 406,
  conditions: 'The more specific Chapter 399 hideout/law/identity conditions remain canonical. Chapter 406 has Nobunaga summarize the practical consequence that attacking the guard can trigger an invincibility-like state and Nen-doll expulsion.',
  mechanics: 'No new activation occurs. Feitan proposes that a response made only after Heil-Ly attacks first may qualify as self-defense.',
  knownAtChapterBoundary: 'The prior defense remains a major tactical obstacle. Feitan’s self-defense idea is not tested and is not promoted to a confirmed loophole.',
  target: 'Qualifying law-breaking intruders at Morena’s hideout under the documented conditions.',
  confidence: 'Prior mechanics confirmed / Chapter 406 bypass theory unresolved.',
  source: source406,
});

const skillHunter406 = freeze({
  ability: 'Skill Hunter · Chapter 406 evolution prerequisite',
  user: 'Chrollo Lucilfer', owner: 'Chrollo Lucilfer',
  type: 'Ability theft/storage · Chapter 406 planned evolution state',
  category: 'National-treasure theft prerequisite before ordinary ability-theft/storage conditions',
  chapters: '406', chapter: 406,
  conditions: 'Chrollo states that before satisfying the usual conditions for stealing and storing the particular ability he wants, he first needs to steal an item comparable to a national treasure. He believes Kakin’s three sacred treasures can satisfy that extra requirement.',
  mechanics: 'The chapter identifies this as part of Chrollo’s planned Skill Hunter evolution for the Hisoka rematch. It does not show a sacred-treasure theft, the evolution itself, the desired ability, or altered post-evolution mechanics.',
  knownAtChapterBoundary: 'Seed Urn, Lotus Anchorite, and Sword of Good Omens are Chrollo’s theft targets; the desired ability remains unidentified.',
  target: 'A future unidentified ability Chrollo wants to steal/store after satisfying the prerequisite.',
  confidence: 'National-treasure prerequisite directly stated by Chrollo / outcome and desired ability unresolved.',
  source: source406,
});

export const successionAbilities = freeze([
  ...base.successionAbilities,
  loveDial406,
  biohazard406,
  lsdf406,
  skillHunter406,
]);

const asLegacyRelationship = (record) => {
  if (record.from && record.to && record.chapters) return record;
  const [subjectFrom = '', subjectTo = ''] = String(record.subject || '').split(/\s*(?:↔|→)\s*/, 2);
  const source = record.sourceUrl || (/^https?:\/\//.test(String(record.source || '')) ? record.source : source406);
  const chapter = String(record.chapter || String(source).match(/Chapter_(\d+)/)?.[1] || '406');
  const people = Array.isArray(record.people) ? record.people : [];
  return freeze({
    ...record,
    from: record.from || (record.sourceUrl ? record.source : '') || people[0] || subjectFrom || record.subject || 'Unknown',
    to: record.to || record.target || people.slice(1).join(' / ') || subjectTo || 'Unknown',
    type: record.type || record.relation || record.relationship || 'documented relationship',
    note: record.note || record.detail || record.boundary || record.evidence || record.status || '',
    phase: record.phase || `Voyage Chapter ${chapter}`,
    chapters: record.chapters || chapter,
    state: record.state || record.status || 'documented',
    source,
  });
};

export const successionRelationships = freeze([...(base.successionRelationships || []), ...succession406RelationshipRecords].map(asLegacyRelationship));
export const bodyStateLedger = base.bodyStateLedger;
export const successionMysteries = freeze([...(base.successionMysteries || []), ...succession406Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession406ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter406: source406, sourcePolicy406: succession406SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 406 outer-route / Lynch investigation / Chrollo regalia modernization',
    description: 'Chapter 406 resolves Tajao’s route cliffhanger, separates the outer/waste infrastructure from the Heil-Ly processing area, preserves the contractor and self-defense ideas as theories, records Biohazard’s transmitter reversion and Lynch’s body recovery without leaking Bonolenov’s identity to Xi-Yu, then adds Chrollo’s phone search, three-regalia objective, Skill Hunter prerequisite, Spider continuity statement, and funeral-start boundary.',
    records: freeze([
      freeze({ subject: 'Outer route', people: 'Tajao, Nobunaga, Phinks, Feitan', notes: 'The final Chapter 405 door opens to the Black Whale’s outermost pipe-and-stair chamber leading toward Tier 2.', status: 'destination resolved / full topology still partial', source: source406 }),
      freeze({ subject: 'Waste-processing plant', people: 'Cha-R, Xi-Yu', notes: 'Facility lies between Tiers 4 and 5 and is controlled by the two established families.', status: 'confirmed / distinct from Heil-Ly processing area', source: source406 }),
      freeze({ subject: 'Heil-Ly subcontractor pipeline', people: 'Nobunaga, Phinks, Feitan, Tajao', notes: 'Waste contractors could be used to summon, kill, and dispose of victims.', status: 'theory only / no direct proof', source: source406 }),
      freeze({ subject: 'Biohazard transmitter', people: 'Hinrigh', notes: 'The hidden oyster form returns to the original transmitter beneath the cabinet.', status: 'reversion confirmed / exact duration unknown', source: source406 }),
      freeze({ subject: 'Lynch recovery', people: 'Lynch, Hinrigh, Zakuro', notes: 'Body is found during funeral patrol with the neck twisted and broken.', status: 'body recovered / exact killing act still unseen', source: source406 }),
      freeze({ subject: 'Xi-Yu culprit knowledge', people: 'Hinrigh, Zakuro', notes: 'They infer a fake-Hisoka-linked culprit searching for Hisoka but do not know Bonolenov.', status: 'inference active / actual identity unknown to them', source: source406 }),
      freeze({ subject: 'Love Dial 6700', people: 'Chrollo', notes: 'Criteria-based phone guidance; page gives a 6–20 digit number and story use shows area/signal limits.', status: 'basic mechanics confirmed / full rules and original owner unresolved', source: source406 }),
      freeze({ subject: 'Three sacred treasures', people: 'Chrollo', notes: 'Seed Urn, Lotus Anchorite, and Sword of Good Omens become explicit theft targets.', status: 'identities/objective confirmed / system and Tier 1 storage remain Chrollo theories', source: source406 }),
      freeze({ subject: 'Skill Hunter evolution prerequisite', people: 'Chrollo', notes: 'A national-treasure-level theft must precede the usual conditions for stealing/storing the desired ability.', status: 'prerequisite stated / no theft, evolution, or desired ability revealed', source: source406 }),
      freeze({ subject: 'Spider continuity', people: 'Chrollo, Phantom Troupe', notes: 'Chrollo says an alternative is already in place so the Spider can continue if he dies.', status: 'alternative existence stated / successor and procedure unknown', source: source406 }),
      freeze({ subject: 'Funeral / final call', people: 'Halkenburg, Chrollo', notes: 'The procession begins and Chrollo’s final call places the unknown target above his Tier 3 position but beyond current signal range.', status: 'relative position narrowed / identity and exact tier unknown', source: source406 }),
    ]),
  }),
]);

export const chapter406Research = succession406ChapterResearch;
export const relationshipsChapter406Research = succession406RelationshipRecords;
