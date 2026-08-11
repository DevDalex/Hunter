import * as base from './successionDossierThrough404.js';
import {
  succession405ChapterResearch,
  succession405Mysteries,
  succession405RelationshipRecords,
  succession405ResolvedQuestions,
  succession405SourcePolicy,
} from './succession405Research.js';

export * from './successionDossierThrough404.js';

const freeze = (value) => Object.freeze(value);
const source405 = 'https://hunterxhunter.fandom.com/wiki/Chapter_405';

const mysteryChapter = (record) => {
  const idMatch = String(record?.id || '').match(/^(\d{3})-/);
  const sourceMatch = String(record?.source || '').match(/Chapter_(\d+)/);
  const chapter = Number(idMatch?.[1] || sourceMatch?.[1]);
  return Number.isFinite(chapter) ? chapter : null;
};

const baseMysteriesThrough405 = freeze((base.successionMysteries || []).filter((record) => {
  const chapter = mysteryChapter(record);
  return chapter === null || chapter <= 405;
}));

const metamorphorsen405 = freeze({
  ability: 'Battle Cantabile: Metamorphorsen · Chapter 405 identity-operation update',
  user: 'Bonolenov', owner: 'Bonolenov',
  type: 'Transformation / disguise · formal Nen category unresolved',
  category: 'Previously contacted-person transformation with conversation-time duration',
  chapters: '377, 405', chapter: 405,
  conditions: 'Bonolenov can copy a person he has talked to in person. Available transformation time equals time spent talking with that person. Narration states no body-size limit; Bonolenov believes much smaller forms shorten practical duration.',
  mechanics: 'Chapter 405 reveals the false-Hisoka operation and shows Bonolenov using Hisoka, Zakuro, Lynch, and Owl appearances. The exact aura cost, cancellation, copied supernatural properties, and smaller-body formula are not supplied.',
  knownAtChapterBoundary: 'The earlier apparent Hisoka is Bonolenov. After spotting the real Hisoka on Tier 1, Bonolenov changes into Owl and avoids direct engagement.',
  target: 'Self transformation into previously contacted people.',
  confidence: 'Contact and base duration rules confirmed / smaller-body formula and formal category unresolved.',
  source: source405,
});

const bodyAndSoul405 = freeze({
  ability: 'Body and Soul · Chapter 405 retrospective resolution',
  user: 'Lynch Fullbokko', owner: 'Lynch Fullbokko',
  type: 'Close-range interrogation · formal Nen category unresolved',
  category: 'Punch-and-question inner-answer extraction',
  chapters: '390, 392, 405', chapter: 405,
  conditions: 'The supplied successful cases pair Lynch’s question with a close-range punch. Against disguised Bonolenov, the inner answer says he is only pretending to be Hisoka.',
  mechanics: 'The Chapter 392 apparent failure is resolved as a successful identity exposure. Zakuro’s continued uncertainty shows he did not hear the compelled answer in that demonstrated scene; complete audience rules remain unresolved.',
  knownAtChapterBoundary: 'Body and Soul penetrated Bonolenov’s disguise before Bonolenov killed Lynch.',
  target: 'Close-range questioned targets.',
  confidence: 'Bonolenov identity exposure confirmed / universal audience, resistance, and Nen category unresolved.',
  source: source405,
});

const dogman405 = freeze({
  ability: 'Dogman’s Nen Scent Identification · descriptive archive label',
  user: 'Dogman', owner: 'Dogman',
  type: 'Sensory identification · official name and formal Nen category unresolved',
  category: 'Scent-based Nen type / training-state identification',
  chapters: '405', chapter: 405,
  conditions: 'Dogman states 5 m for Nen type, 2 m for whether the target has learned Nen, and a close head sniff for 100% certainty.',
  mechanics: 'The chapter does not provide obstruction rules, target throughput, cost, duration, or the identity of the funeral-search target.',
  knownAtChapterBoundary: 'Dogman is level 62 and preparing to search the upcoming funeral crowd.',
  target: 'People inspected for Nen type or Nen-training status.',
  confidence: 'Three range thresholds confirmed / official name, category, and complete mechanism unresolved.',
  source: source405,
});

const sodom405 = freeze({
  ability: 'Sodom’s Non-Nen-Target Kidnapping Ability · descriptive archive label',
  user: 'Sodom', owner: 'Sodom',
  type: 'Kidnapping / transport · official name and formal Nen category unresolved',
  category: 'Kidnapping restricted to a target who does not know Nen',
  chapters: '405', chapter: 405,
  conditions: 'Sodom explicitly says his target must not know Nen.',
  mechanics: 'Sodom plans to act after Dogman points the target out. Contact, range, transport method, cost, duration, and additional restrictions remain unsupplied.',
  knownAtChapterBoundary: 'The pair is preparing to depart; no target is identified and no kidnapping has occurred.',
  target: 'A target who does not know Nen.',
  confidence: 'Non-Nen target restriction confirmed / all other mechanics unresolved.',
  source: source405,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !/Metamorphorsen|Body and Soul.*Chapter 405|Dogman’s Nen Scent|Sodom’s Non-Nen/.test(record.ability || '')),
  metamorphorsen405,
  bodyAndSoul405,
  dogman405,
  sodom405,
]);

const asLegacyRelationship = (record) => {
  if (record.from && record.to && record.chapters) return record;
  const [subjectFrom = '', subjectTo = ''] = String(record.subject || '').split(/\s*(?:↔|→)\s*/, 2);
  const source = record.sourceUrl || (/^https?:\/\//.test(String(record.source || '')) ? record.source : source405);
  const chapter = String(record.chapter || String(source).match(/Chapter_(\d+)/)?.[1] || '405');
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

export const successionRelationships = freeze([...(base.successionRelationships || []), ...succession405RelationshipRecords].map(asLegacyRelationship));
export const bodyStateLedger = base.bodyStateLedger;
export const successionMysteries = freeze([...baseMysteriesThrough405, ...succession405Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession405ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter405: source405, sourcePolicy405: succession405SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 405 real/fake Hisoka / Bonolenov retrospective / mafia–Heil-Ly convergence',
    description: 'Chapter 405 confirms the real Hisoka on Tier 1, resolves Bonolenov’s mafia decoy and Lynch’s death, expands Metamorphorsen and Body and Soul, then joins the Troupe/mafia anti-Heil-Ly route with Morena’s funeral-crowd Dogman/Sodom operation without importing Chapter 406 outcomes.',
    records: freeze([
      freeze({ subject: 'Real Hisoka', people: 'Hisoka', notes: 'Confirmed in the Tier 1 VIP casino.', status: 'real identity confirmed / prince sponsor unnamed', source: source405 }),
      freeze({ subject: 'False Hisoka', people: 'Bonolenov, Chrollo', notes: 'Bonolenov was assigned to draw mafia containment away from the real Hisoka.', status: 'decoy identity resolved / direct Hisoka fight not begun', source: source405 }),
      freeze({ subject: 'Metamorphorsen', people: 'Bonolenov', notes: 'Copies people he talked to in person; base duration equals conversation time.', status: 'core copy-duration rule confirmed / size effect remains belief', source: source405 }),
      freeze({ subject: 'Body and Soul', people: 'Lynch, Bonolenov, Zakuro', notes: 'The earlier punch exposed Bonolenov as a fake; Zakuro did not hear the answer.', status: 'retrospective success confirmed', source: source405 }),
      freeze({ subject: 'Lynch', people: 'Lynch, Bonolenov', notes: 'Bonolenov directly says he killed Lynch after she discovered his disguise.', status: 'deceased / exact method unsupplied', source: source405 }),
      freeze({ subject: 'Chrollo rematch preparation', people: 'Chrollo, Bonolenov, Hisoka', notes: 'Bonolenov believes Chrollo is seeking an unidentified ability needed for the rematch.', status: 'attributed plan / ability unidentified and unacquired', source: source405 }),
      freeze({ subject: 'Ken’i hidden plan', people: 'Ken’i, Morena', notes: 'Ken’i privately references Morena, an accelerated schedule, and an unidentified joker.', status: 'concealed link confirmed / exact relationship unresolved', source: source405 }),
      freeze({ subject: 'Dogman', people: 'Dogman, Morena', notes: 'Level 62 with stated 5 m Nen-type, 2 m learned-Nen, and close-head certainty thresholds.', status: 'thresholds confirmed / target and formal ability unresolved', source: source405 }),
      freeze({ subject: 'Sodom', people: 'Sodom, Dogman', notes: 'Kidnapping ability requires a target who does not know Nen.', status: 'condition confirmed / no completed kidnapping', source: source405 }),
      freeze({ subject: 'Tajao route', people: 'Tajao, Nobunaga, Phinks, Feitan', notes: 'Cha-R/Xi-Yu support is declared and a final door is opened.', status: 'route active / unseen destination quarantined', source: source405 }),
    ]),
  }),
]);

export const chapter405Research = succession405ChapterResearch;
export const relationshipsChapter405Research = succession405RelationshipRecords;
