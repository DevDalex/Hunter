const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_345';

export const succession345SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 345',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  excluded: freeze(['All other websites and external cross-checks']),
});

const timelineEvent = ({
  id,
  title,
  detail,
  location,
  tracks,
  confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes',
}) => freeze({
  id,
  time: 'Pre-voyage · expedition preparation',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 345,
  confidence,
  source,
});

export const succession345TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-345-gon-calls-ging',
    title: 'Gon tells Ging that he cannot bring out aura',
    detail: 'Gon calls Ging and reports that he can no longer bring out aura. Ging answers that Gon’s aura is most probably still coming out but Gon simply cannot see it, interpreting the change as Gon having returned to normal. Ging tells him to be grateful that this was the extent of the cost and advises him to use the opportunity to search for something new.',
    location: 'Remote call · Gon and Ging',
    tracks: ['gon', 'ging', 'nen'],
    confidence: 'Gon being unable to use Nen is confirmed by the supplied notes; aura probably still being emitted and the idea that Gon has returned to normal are Ging’s interpretation in the chapter',
  }),
  timelineEvent({
    id: 'pre-voyage-345-gon-whale-island',
    title: 'Gon returns home to Whale Island',
    detail: 'Gon returns to Whale Island, reunites with Mito and his great-grandmother, and resumes ordinary home life while helping with chores and paperwork.',
    location: 'Whale Island · Freecss household',
    tracks: ['gon', 'mito'],
  }),
  timelineEvent({
    id: 'pre-voyage-345-gon-reframes-ging-goal',
    title: 'Gon admits that finding Ging mattered more than living beside him',
    detail: 'During dinner with Mito, Gon explains that his true goal had been finding Ging rather than establishing a conventional father-son relationship. He says he admired Ging’s strength directly and might have wanted to accompany him if he could still use Nen, but accepts that he would now only get in the way.',
    location: 'Whale Island · Freecss household',
    tracks: ['gon', 'ging', 'mito', 'nen'],
  }),
  timelineEvent({
    id: 'pre-voyage-345-team-splits-over-ging',
    title: 'Beyond’s team splits over Ging’s payment offer',
    detail: 'The expedition team divides between members who refuse Ging’s money and members who accept the offer and recognize his No. 2 position. To prevent internal conflict, the team makes clear that it will not obey a single order from Ging until every member accepts the arrangement, even though Pariston already recognizes him as second to Beyond.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'pariston', 'beyond', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-345-ging-identifies-temp-hunters',
    title: 'Ging identifies the expedition specialists as expert Temp Hunters',
    detail: 'Ging argues that the team members are specialists rather than ordinary hired muscle and concludes that many are expert Temp Hunters. He estimates that roughly 25 of the Hunter Association’s approximately 200 Temp Hunters are attached to Beyond’s group.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'temp-hunters', 'hunter-association', 'expedition'],
    confidence: 'The team being composed of expert Temp Hunters is Ging’s deduction in the supplied text; the approximately 25 out of 200 figure is Ging’s estimate rather than a confirmed roster count',
  }),
  timelineEvent({
    id: 'pre-voyage-345-pariston-hates-ging',
    title: 'Pariston realizes that he genuinely hates Ging',
    detail: 'While listening to Ging reason through the expedition team, Pariston recognizes a similarity between their thought processes and privately admits that this is the first time he has actually hated someone, wondering how he should deal with Ging.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'pariston'],
  }),
  timelineEvent({
    id: 'pre-voyage-345-tserriednich-debut',
    title: 'Tserriednich debuts through the murder of two invited women',
    detail: 'Two women accept an invitation to Tserriednich’s hotel. Later, Tserriednich speaks with Mark from a blood-covered bathroom, complains that the women were interested only in fashion and unaware of world affairs, and asks for another pair to be sent. The supplied synopsis identifies the blood-filled aftermath as showing that he killed the two women and suggests an established pattern of predation.',
    location: 'Tserriednich hotel · private suite',
    tracks: ['tserriednich', 'kakin'],
    confidence: 'Tserriednich’s killing of the two women is stated by the supplied synopsis; the idea that they were not his first victims is presented there as a strong implication rather than a separately documented count',
  }),
  timelineEvent({
    id: 'pre-voyage-345-ipa-contract-order',
    title: 'The IPA orders Cheadle to bind Beyond with a public-enforcement contract',
    detail: 'The IPA Director instructs Cheadle to make Beyond sign strict expedition terms. Any single violation is to carry lifetime imprisonment, and the Director wants any breach turned into a globally visible incident so Beyond cannot escape political accountability.',
    location: 'International Permit Agency / Cheadle office',
    tracks: ['beyond', 'cheadle', 'ipa', 'v6', 'zodiacs'],
  }),
  timelineEvent({
    id: 'pre-voyage-345-beyond-signs-contract',
    title: 'Beyond signs the six-clause surveillance contract',
    detail: 'Beyond reads and accepts the V6 and Zodiac restrictions, then signs the agreement. The contract places him under continuous supervision, tracking, monitored communications, nonresistance rules, V6 ownership of discoveries, and a disclosure ban. After signing, Beyond remarks that only three things remain: capacity, means, and contract.',
    location: 'Beyond detention area · contract signing',
    tracks: ['beyond', 'cheadle', 'v6', 'zodiacs', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-345-kurapika-scarlet-eyes-plan',
    title: 'Kurapika tells Mizaistom he intends to recover the Scarlet Eyes without killing Tserriednich',
    detail: 'Mizaistom asks what Kurapika plans to do with Tserriednich after recovering the Scarlet Eyes and what happens if the prince resists. Kurapika says he only cares about taking the eyes back and notes that two previous owners who claimed they would rather die than surrender Kurta eyes both survived after changing their minds. He expects Tserriednich can likewise be made to yield.',
    location: 'Vehicle carrying Kurapika and Mizaistom',
    tracks: ['kurapika', 'mizaistom', 'tserriednich', 'scarlet-eyes'],
  }),
]);

export const succession345BeyondContract = freeze({
  parties: freeze(['Beyond Netero', 'Zodiacs', 'V6']),
  clauses: freeze([
    freeze({ number: 1, rule: 'Beyond remains in a room under 24-hour watch; chaperones accompany him whenever he goes out.' }),
    freeze({ number: 2, rule: 'Beyond’s whereabouts are monitored through an anklet containing a tracking device.' }),
    freeze({ number: 3, rule: 'All communication with other people is managed and monitored.' }),
    freeze({ number: 4, rule: 'Any form of resistance toward the Hunter Association is forbidden.' }),
    freeze({ number: 5, rule: 'Anything discovered through Beyond’s actions belongs to V6.' }),
    freeze({ number: 6, rule: 'Disclosure of information through any medium is forbidden.' }),
  ]),
  breachPenalty: 'Lifetime imprisonment if Beyond violates any clause even once',
  enforcementPlan: 'The IPA Director wants any violation turned into a globally broadcast public incident',
  beyondClosingRemark: 'Capacity, means, and contract',
  source,
});

export const succession345TeamAlignment = freeze({
  refuseGingMoney: freeze([
    'Mascher',
    'Marione',
    'Maid',
    'Curly',
    'Usamen',
    'Golem',
  ]),
  acceptMoneyAndNo2Position: freeze([
    'Pekotero',
    'Unnamed first recipient',
    'Chef',
    'Pariston Hill',
  ]),
  qualification: 'The maid later agrees to take the money if the offer is disclosed to everyone. The team will recognize Ging as No. 2 but will not follow his orders until all members accept the arrangement, in order to avoid infighting.',
  source,
});

export const succession345TempHunterEstimate = freeze({
  assessment: 'Beyond’s expedition team contains expert Temp Hunters',
  gingEstimateInBeyondTeam: 25,
  suppliedAssociationTempHunterCount: 200,
  confidence: 'Ging’s deduction and estimate, not an independently confirmed roster count',
  source,
});

export const succession345BodyStates = freeze([
  freeze({
    state: 'Nen inaccessible after return to normal',
    examples: 'Gon Freecss',
    rule: 'Gon confirms he cannot use Nen. Ging says Gon’s aura is most probably still coming out but Gon cannot see it and describes this as returning to normal. The explanation is Ging’s interpretation; the chapter does not establish the complete mechanism or permanence.',
    className: 'exceptional',
    source,
  }),
]);

export const succession345RelationshipRecords = freeze([
  freeze({
    from: 'Beyond Netero',
    to: 'Zodiacs & V6',
    type: 'Surveillance contract / expedition custody',
    note: 'Beyond accepts six restrictions governing confinement, tracking, communications, resistance, ownership of discoveries, and disclosure, with lifetime imprisonment for a single breach.',
    phase: 'Pre-voyage expedition preparation',
    chapters: '345–current',
    state: 'active',
    source,
  }),
  freeze({
    from: 'Ging Freecss',
    to: 'Pariston Hill',
    type: 'Internal expedition rivalry',
    note: 'Pariston privately recognizes Ging as the first person he has genuinely hated after seeing how closely Ging can mirror and expose his reasoning.',
    phase: 'Pre-voyage expedition preparation',
    chapters: '345–current',
    state: 'hostile',
    source,
  }),
]);

export const succession345ObjectRecords = freeze([
  freeze({
    name: 'Beyond surveillance contract',
    note: 'Six-clause V6/Zodiac agreement signed by Beyond Netero in Chapter 345. It controls confinement, tracking, communication, resistance, ownership of discoveries, and information disclosure; any single violation carries lifetime imprisonment.',
    source,
  }),
]);

const focus = 'Ging interprets Gon’s inability to use Nen as a return to normal and urges him to find a new goal; Gon returns to Whale Island and reframes his relationship with Ging; Beyond’s expedition team divides over Ging’s No. 2 payment arrangement while Ging identifies expert Temp Hunters; Pariston privately comes to hate Ging; Tserriednich debuts through the murder of two women; Beyond signs a six-clause V6/Zodiac surveillance contract; and Kurapika tells Mizaistom he intends to recover the Scarlet Eyes by forcing Tserriednich to yield rather than by killing him.';

export const succession345ChapterResearch = freeze([
  freeze({
    number: 345,
    title: 'Signature',
    japaneseTitle: 'しょめい',
    romanizedTitle: 'Shomei',
    phase: 'Expedition setup',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Gon / Nen state',
      'Ging & Pariston',
      'Beyond expedition team',
      'Temp Hunters',
      'Tserriednich',
      'Beyond custody contract',
      'Kurapika / Scarlet Eyes',
    ]),
    focus,
    events: succession345TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Gon Freecss',
      'Ging Freecss',
      'Mito Freecss',
      'Ging and Mito’s Grandmother',
      'Mascher',
      'Marione',
      'Curly',
      'Usamen',
      'Golem',
      'Pekotero',
      'Pariston Hill',
      'Beyond Netero',
      'Tserriednich Hui Guo Rou',
      'Mark',
      'Cheadle Yorkshire',
      'IPA Director',
      'Kurapika',
      'Mizaistom Nana',
      'Dark Continent Expedition Team',
    ]),
    locations: freeze([
      'Remote call · Gon and Ging',
      'Whale Island · Freecss household',
      'Beyond Netero expedition team · base',
      'Tserriednich hotel · private suite',
      'International Permit Agency / Cheadle office',
      'Beyond detention area · contract signing',
      'Vehicle carrying Kurapika and Mizaistom',
    ]),
    threadLabels: freeze([
      'Gon',
      'Nen development',
      'Ging & Pariston',
      'Beyond expedition team',
      'Temp Hunters',
      'Tserriednich',
      'Beyond Netero',
      'V6 / Zodiacs',
      'Kurapika & Scarlet Eyes',
    ]),
    beyondContract: succession345BeyondContract,
    teamAlignment: succession345TeamAlignment,
    tempHunterEstimate: succession345TempHunterEstimate,
    relationships: succession345RelationshipRecords,
    bodyStates: succession345BodyStates,
    objects: succession345ObjectRecords,
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 345 text',
      'Gon’s inability to use Nen is confirmed; the claim that his aura is probably still coming out and that he has returned to normal is Ging’s interpretation',
      'Ging’s estimate of about 25 Temp Hunters in Beyond’s team out of roughly 200 in the Association is stored as an estimate, not a confirmed roster count',
      'The team’s No. 2 arrangement distinguishes recognition of Ging’s title from willingness to obey his orders',
      'Tserriednich’s killing of the two women is retained from the supplied synopsis; the implication of earlier victims is not converted into a numeric victim count',
      'The six Beyond contract clauses and lifetime-imprisonment penalty are preserved individually from the supplied chapter notes',
      'Kurapika states an intention to make Tserriednich yield the Scarlet Eyes without killing him; this is Kurapika’s plan, not a guarantee of the later outcome',
    ]),
    status: 'Maintained chapter summary, scene chronology, appearances, locations, Gon Nen-state update, expedition-team alignment, Temp Hunter estimate, Tserriednich debut profile, six-clause Beyond contract, Scarlet Eyes strategy, relationships, objects, and source confidence linked',
    coverage: freeze({
      identity: true,
      publication: false,
      summary: true,
      sceneSummary: true,
      chronology: true,
      appearances: true,
      locations: true,
      relationships: true,
      assignments: true,
      nen: true,
      source: true,
    }),
    lastReviewed: 'August 7, 2026',
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
    crossChecks: freeze([succession345SourcePolicy.soleSource]),
  }),
]);

export const succession345ChapterFocus = freeze({ 345: focus });

export const succession345Mysteries = freeze([
  freeze({
    question: 'What does Beyond mean by “capacity, means, and contract”?',
    evidence: 'After signing the V6/Zodiac restrictions in Chapter 345, Beyond says that only three things remain: capacity, means, and contract, but the chapter does not fully unpack the phrase.',
    status: 'open',
    lastChapter: '345',
    source,
  }),
]);