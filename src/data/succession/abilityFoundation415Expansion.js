import { abilityFoundation414Expansion } from './abilityFoundation414Expansion.js';

const freeze = (value) => Object.freeze(value);

export const abilityFoundation415Expansion = freeze(abilityFoundation414Expansion.map((record) => {
  if (record.id !== 'ability:combo-master') return record;
  return freeze({
    ...record,
    summary: 'Furykov conjures Combo Master as a laptop-like Nen interface. In Chapter 415 it detects that he is under attack, identifies a curse on him, shows another affected person only as a silhouette, supports investigation of the curse and target, and returns curse-specific time estimates for deciphering and antidote creation.',
    sourceIds: freeze([...new Set([...(record.sourceIds || []), 'source:chapter-415'])]),
    updatedAt: '2026-08-14',
    category: 'analysis / diagnostic / conjuration interface',
    activation: 'Furykov activates Combo Master and conjures a laptop between his hands; a great-tree design is visible on the back of the monitor.',
    conditions: freeze([
      'Chapter 415 demonstrates the interface analyzing the curse currently affecting Furykov.',
      'The interface can display another affected person while obscuring that person as a silhouette in this case.',
    ]),
    limitations: freeze([
      'The 365-day deciphering estimate and approximately 700 additional days to create and conjure an antidote apply to the detected curse in Chapter 415 and are not universal Combo Master timings.',
      'The interface does not reveal the fellow cursee’s identity during the demonstrated sequence.',
      'The supplied synopsis does not establish a complete menu/function list, universal detection range, universal antidote rules, or the result of Furykov’s longer investigation.',
      'Chapter 416+ information is excluded from the Chapter 415 mechanics boundary.',
    ]),
    costs: freeze([]),
    targets: freeze(['Furykov’s own detected curse in the demonstrated Chapter 415 analysis', 'the unidentified fellow cursee / curse target investigation']),
    range: 'analysis range not fully established; demonstrated on Furykov’s active curse state',
    duration: 'interface persists during the demonstrated analysis; complete duration rule unknown',
    status: 'demonstrated',
    knownUses: freeze([
      'Chapter 415: flags Furykov as under attack, identifies the curse, and shows a second affected person as a silhouette.',
      'Chapter 415: supports investigation of the curse target and Beyond’s ability.',
      'Chapter 415: estimates 365 days to decipher this curse and approximately 700 additional days to create and conjure an antidote.',
    ]),
    firstChapter: Math.min(Number(record.firstChapter || 415), 413),
    latestChapter: 415,
    sourceChapterNumbers: freeze([...new Set([...(record.sourceChapterNumbers || []), 415])].sort((a, b) => a - b)),
    researchStatus: 'Chapter 415 interface and curse-analysis functions demonstrated / complete mechanics unresolved',
  });
}));
