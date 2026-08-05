const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_416';
const unique = (values) => [...new Set(values.filter(Boolean))];

export const succession416SourcePolicy = freeze({
  reviewedAt: '2026-08-05',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 416',
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
  confidence = 'Confirmed in the supplied Hunterpedia synopsis',
}) => freeze({
  id,
  time: 'After the Special Martial Law declaration',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 416,
  confidence,
  source,
});

export const succession416TimelineEvents = freeze([
  timelineEvent({
    id: 'day-12-416-martial-law-enforcement',
    title: 'Special Martial Law is enforced across the Black Whale',
    detail: 'Shipwide speakers announce Special Martial Law while soldiers herd civilians across the tiers. Benjamin personally leads an armed team through Tier 1 under a self-stated ten-hour limit before incapacitation.',
    location: 'Black Whale 1 · shipwide tiers and Tier 1 VVIP area',
    tracks: ['benjamin', 'justice', 'ship', 'ritual'],
  }),
  timelineEvent({
    id: 'day-12-416-camilla-room-assault',
    title: 'Benjamin enters Camilla’s residence',
    detail: 'Camilla’s guards stand down after being outmatched. Camilla shoots Benjamin, but the bullets fail against his Ken. Benjamin responds by killing Fukataki and another servant, while refusing to kill Camilla because he understands that her counteractive ability activates upon her death.',
    location: 'Tier 1 · Camilla’s residence',
    tracks: ['benjamin', 'camilla', 'nen', 'ritual'],
  }),
  timelineEvent({
    id: 'day-12-416-moswana-curse',
    title: 'Moswana completes the ten-year curse plan',
    detail: 'Moswana removes a knife from her throat and dies, activating Dust in the Wind: Hell Fruit. A post-mortem curse strikes Benjamin, darkens his body, and produces a face-like mark in his pupils. Camilla declares the curse complete and describes the plan as ten years in the making.',
    location: 'Tier 1 · Camilla’s residence',
    tracks: ['benjamin', 'camilla', 'nen', 'curse'],
  }),
  timelineEvent({
    id: 'day-12-416-camilla-infected',
    title: 'Benjamin infects Camilla with TSK-17',
    detail: 'Benjamin tests the logic of Camilla’s resurrection ability against death by disease and against his own possible earlier death. While speaking, he silently infects Camilla with TSK-17, then leaves after asking whether she fears death.',
    location: 'Tier 1 · Camilla’s residence',
    tracks: ['benjamin', 'camilla', 'nen', 'disease'],
    confidence: 'The infection is confirmed; the eventual interaction with Camilla’s ability is unresolved',
  }),
  timelineEvent({
    id: 'day-12-416-tserriednich-death-plan',
    title: 'Tserriednich prepares a staged-death contingency',
    detail: 'Inside Room 1004, Tserriednich maintains flawless Zetsu despite the martial-law announcements. A recent instruction is recalled in which he took Salkov’s gun and ordered Salkov to secure his body, report exactly what he observed, and keep Tserriednich’s ability secret as part of a plan to feign death.',
    location: 'Tier 1 · Room 1004 master bedroom',
    tracks: ['tserriednich', 'nen', 'benjamin'],
  }),
  timelineEvent({
    id: 'day-12-416-salkov-deduction',
    title: 'Salkov connects Zetsu to Tserriednich’s ability',
    detail: 'Salkov links Theta’s prior experience, Tserriednich’s focus on accelerating Zetsu, and his calm response to Benjamin’s approach. He infers that entering Zetsu activates the ability and prepares to study it for Theta’s sake.',
    location: 'Tier 1 · Room 1004 master bedroom',
    tracks: ['tserriednich', 'salkov', 'theta', 'nen'],
    confidence: 'Salkov’s inference, not an independently confirmed mechanics statement',
  }),
  timelineEvent({
    id: 'day-12-416-room-1004-breach',
    title: 'Benjamin breaches Room 1004',
    detail: 'Benjamin kicks in the locked door and enters with Furykov and Butch. Tserriednich’s personnel kneel calmly facing the walls. Benjamin identifies Danjin as a Room 1014 student, orders him taken to the central Ministry of Justice for questioning, and considers recruiting Kurapika to instruct his army.',
    location: 'Tier 1 · Room 1004 living quarters',
    tracks: ['benjamin', 'tserriednich', 'kurapika', 'justice'],
  }),
  timelineEvent({
    id: 'day-12-416-tserriednich-shot',
    title: 'Benjamin shoots Tserriednich',
    detail: 'Benjamin reaches the master bedroom, observes Tserriednich standing in Zetsu, and fires before Tserriednich can finish proposing a spar. Tserriednich is thrown across the room; the supplied synopsis does not resolve his condition afterward.',
    location: 'Tier 1 · Room 1004 master bedroom',
    tracks: ['benjamin', 'tserriednich', 'nen'],
    confidence: 'The shooting is confirmed; the immediate outcome remains unresolved',
  }),
]);

const focus = 'Special Martial Law becomes an armed royal purge as Benjamin, operating under a ten-hour limit, confronts Camilla, receives Moswana’s post-mortem curse, infects Camilla with TSK-17, and then breaches Room 1004 and shoots Tserriednich during his Zetsu-based staged-death plan.';

export const succession416ChapterResearch = freeze([
  freeze({
    number: 416,
    title: 'Proclamation',
    japaneseTitle: '発令',
    phase: 'Current releases',
    voyageDay: 'Voyage Day 12',
    lanes: freeze([
      'Royal contest',
      'Benjamin emergency campaign',
      'Nen curses and counteractive abilities',
      'Tserriednich training',
      'Justice and military control',
    ]),
    focus,
    events: succession416TimelineEvents,
    prelude: freeze([]),
    locations: freeze([
      'Black Whale 1 · shipwide tiers',
      'Tier 1 · VVIP area',
      'Tier 1 · Camilla’s residence',
      'Tier 1 · Room 1004 living quarters',
      'Tier 1 · Room 1004 master bedroom',
      'Central Ministry of Justice',
    ]),
    threadLabels: freeze([
      'Benjamin',
      'Camilla',
      'Tserriednich',
      'Nen development',
      'Justice & military',
      'Ship operations',
    ]),
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 416 text',
      'Benjamin’s ten-hour limit is presented as his own remaining timeline before incapacitation',
      'Salkov’s conclusion that Zetsu activates Tserriednich’s ability remains an inference',
      'The supplied synopsis does not resolve Tserriednich’s condition after the gunshot',
      'The eventual interaction between TSK-17 and Camilla’s resurrection ability remains unresolved',
    ]),
    status: 'Maintained chapter summary and chronology sourced only to Hunterpedia Chapter 416',
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
    lastReviewed: 'August 5, 2026',
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
    crossChecks: freeze([succession416SourcePolicy.soleSource]),
  }),
]);

export const succession416ChapterFocus = freeze({ 416: focus });

export const patchSuccession416PrinceDossier = (record) => {
  if (record.order === 1) {
    return freeze({
      ...record,
      room: 'Tier 1 · active martial-law assault route',
      strategy: 'Uses Special Martial Law to personally confront rival princes, while applying military force, Nen defense, interrogation, and TSK-17 under a ten-hour deadline before incapacitation.',
      pressure: freeze(unique([
        ...(record.pressure || []),
        'Ten hours remaining before incapacitation',
        'Moswana’s completed post-mortem curse',
        'Need to finish the succession contest before the deadline',
      ])),
      statusDetail: 'Cursed by Moswana’s Dust in the Wind: Hell Fruit, still operational, and advancing through Tier 1 after infecting Camilla and shooting Tserriednich.',
      source,
    });
  }
  if (record.order === 2) {
    return freeze({
      ...record,
      room: 'Tier 1 · Camilla’s residence',
      status: 'alive; infected with TSK-17',
      strategy: 'Relies on her counteractive resurrection ability, Moswana’s completed curse plan, and her ability to slow her metabolism while challenging Benjamin to outlast her.',
      pressure: freeze(unique([
        ...(record.pressure || []),
        'TSK-17 infection',
        'Unresolved resurrection interaction with disease',
        'Benjamin’s ten-hour deadline',
      ])),
      statusDetail: 'Remains alive in her residence after Moswana curses Benjamin, but Benjamin silently infects her with TSK-17 and leaves the outcome unresolved.',
      source,
    });
  }
  if (record.order === 4) {
    return freeze({
      ...record,
      room: 'Tier 1 · Room 1004 master bedroom',
      status: 'shot; immediate condition unresolved',
      strategy: 'Maintains Zetsu and prepares a staged-death contingency, ordering Salkov to secure his body, report exactly what he witnesses, and conceal the ability’s mechanics.',
      pressure: freeze(unique([
        ...(record.pressure || []),
        'Benjamin’s armed breach of Room 1004',
        'Unfinished Zetsu-based technique',
        'Gunshot from Benjamin',
      ])),
      statusDetail: 'Shot by Benjamin while standing in Zetsu; the supplied Chapter 416 synopsis ends without confirming his immediate condition.',
      source,
    });
  }
  return record;
};

export const succession416Mysteries = freeze([
  freeze({
    question: 'How will TSK-17 interact with Camilla’s resurrection ability?',
    evidence: 'Benjamin infects Camilla after explicitly questioning whether death by disease would provide a valid killer and enough aura for her counteractive resurrection.',
    status: 'open',
    lastChapter: '416',
    source,
  }),
  freeze({
    question: 'What is Tserriednich’s condition after Benjamin shoots him?',
    evidence: 'Tserriednich is blasted across the master bedroom during a staged-death plan, but the supplied synopsis ends before confirming whether the plan or ability altered the outcome.',
    status: 'open',
    lastChapter: '416',
    source,
  }),
  freeze({
    question: 'What final effect will Moswana’s curse have on Benjamin?',
    evidence: 'Dust in the Wind: Hell Fruit visibly strikes Benjamin and Camilla declares the curse complete, while Benjamin remains active under his existing ten-hour deadline.',
    status: 'developing',
    lastChapter: '416',
    source,
  }),
]);
