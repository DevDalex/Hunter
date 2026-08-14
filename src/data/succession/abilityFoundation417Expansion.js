import { abilityFoundation416Expansion } from './abilityFoundation416Expansion.js';

const freeze = (value) => Object.freeze(value);

const upgraded = abilityFoundation416Expansion.map((record) => {
  if (record.id === 'ability:secret-window') return freeze({
    ...record,
    summary: `${record.summary} Chapter 417 confirms Benjamin actively uses inherited Secret Window to observe Camilla contacting the medical department while planning his martial-law narrative.`,
    sourceIds: freeze([...new Set([...(record.sourceIds || []), 'source:chapter-417'])]),
    updatedAt: '2026-08-14',
    latestChapter: 417,
    sourceChapterNumbers: freeze([...new Set([...(record.sourceChapterNumbers || []), 417])].sort((a,b)=>a-b)),
    knownUses: freeze([...new Set([...(record.knownUses || []), 'Chapter 417: Benjamin uses inherited Secret Window to observe Camilla contacting the medical department.'])]),
    researchStatus: 'remote surveillance function confirmed / inherited use by Benjamin demonstrated through Chapter 417',
  });
  if (record.id === 'ability:benjamin-baton') return freeze({
    ...record,
    summary: `${record.summary} Chapter 417 reveals a future interaction with Benjamin’s Guardian Spirit Beast: after Benjamin dies, Gypsy Life: Bohemian Rhapsody fuses with Benjamin Baton before transferring as a Guardian Spirit Beast to a blood relative.`,
    sourceIds: freeze([...new Set([...(record.sourceIds || []), 'source:chapter-417'])]),
    updatedAt: '2026-08-14',
    latestChapter: 417,
    sourceChapterNumbers: freeze([...new Set([...(record.sourceChapterNumbers || []), 417])].sort((a,b)=>a-b)),
    knownUses: freeze([...new Set([...(record.knownUses || []), 'Chapter 417 mechanics reveal: Gypsy Life is stated to fuse with Benjamin Baton after Benjamin’s death before the Guardian Spirit Beast transfers to a blood relative.'])]),
    limitations: freeze([...new Set([...(record.limitations || []), 'Chapter 417 reveals the future Gypsy Life fusion/transfer interaction but does not show Benjamin’s death or an actual host transfer.'])]),
    researchStatus: 'core loyal-soldier inheritance confirmed / Gypsy Life post-death fusion interaction revealed / actual future transfer not observed',
  });
  if (record.id === 'ability:dust-in-the-wind-hell-fruit') return freeze({
    ...record,
    summary: `${record.summary} In Chapter 417 Benjamin explicitly tells Balsamilco and Coventoba that he remains afflicted by a Have-Not curse while continuing to operate.`,
    sourceIds: freeze([...new Set([...(record.sourceIds || []), 'source:chapter-417'])]),
    updatedAt: '2026-08-14',
    latestChapter: 417,
    sourceChapterNumbers: freeze([...new Set([...(record.sourceChapterNumbers || []), 417])].sort((a,b)=>a-b)),
    status: 'activated / Benjamin remains afflicted at Chapter 417 publication ceiling',
    knownUses: freeze([...new Set([...(record.knownUses || []), 'Chapter 417: Benjamin discloses to Balsamilco and Coventoba that he is afflicted by Camilla’s Have-Not curse.'])]),
    limitations: freeze([...new Set([...(record.limitations || []), 'Chapter 417 is the publication ceiling and does not show the curse’s final resolution.'])]),
    researchStatus: 'activation and ongoing affliction confirmed / final outcome unresolved at publication ceiling',
  });
  return record;
});

const gypsyLife = freeze({
  id: 'ability:gypsy-life-bohemian-rhapsody',
  entityType: 'ability',
  slug: 'gypsy-life-bohemian-rhapsody',
  name: 'Gypsy Life: Bohemian Rhapsody',
  aliases: freeze(['Gypsy Life','Bohemian Rhapsody']),
  summary: 'Benjamin’s Guardian Spirit Beast ability. Chapter 417 reveals that after Benjamin dies, the beast fuses with Benjamin Baton and becomes the Guardian Spirit Beast of one of Benjamin’s blood relatives; the side with the right to select each new host alternates between Benjamin and the Guardian Spirit Beast after the first selection right is determined between them.',
  sourceIds: freeze(['source:chapter-417']),
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: '2026-08-14',
  updatedAt: '2026-08-14',
  ownerIds: freeze(['character:benjamin-hui-guo-rou']),
  classification: freeze({ nenTypes: freeze(['unknown']), certainty: 'confirmed' }),
  category: 'Guardian Spirit Beast post-death succession / host transfer',
  activation: 'The supplied Chapter 417 mechanics describe the ability taking effect after Benjamin’s death; no actual activation occurs within the chapter.',
  conditions: freeze([
    'Benjamin dies.',
    'The Guardian Spirit Beast fuses with Benjamin Baton.',
    'The next host is one of Benjamin’s blood relatives.',
  ]),
  limitations: freeze([
    'Chapter 417 does not show Benjamin dying or the ability transferring to an actual host.',
    'The exact eligible-relative pool, transfer timing, refusal edge cases, and all failure states are not established by the supplied synopsis.',
    'The host-selection rule follows the supplied synopsis/translation note: after the initial selection right is determined between Benjamin and the Guardian Spirit Beast, the deciding side alternates for each later host selection.',
    'No Chapter 418+ outcome is invented.',
  ]),
  costs: freeze(['Benjamin’s death is the stated trigger for the fusion/transfer sequence.']),
  targets: freeze(['one of Benjamin Hui Guo Rou’s blood relatives']),
  range: 'post-death Guardian Spirit Beast succession; physical range not established',
  duration: 'potentially successive across future hosts; complete termination rule unknown',
  status: 'mechanics revealed / not yet activated',
  knownUses: freeze(['Chapter 417 reveals the post-death fusion, blood-relative transfer, and alternating future-host selection rule; no transfer is shown.']),
  firstChapter: 417,
  latestChapter: 417,
  sourceChapterNumbers: freeze([417]),
  researchStatus: 'core post-death transfer mechanics revealed / activation and edge cases unobserved',
});

export const abilityFoundation417Expansion = freeze([
  ...upgraded.filter((record) => record.id !== gypsyLife.id),
  gypsyLife,
]);
