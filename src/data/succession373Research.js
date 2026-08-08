const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_373';

export const succession373SourcePolicy = freeze({
  reviewedAt: '2026-08-08',
  soleStorySource: 'User-supplied Hunterpedia Chapter 373 synopsis and chapter-note text',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale · Tier 1', confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 2',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 373,
  confidence,
  source,
});

export const succession373TimelineEvents = freeze([
  event({ id: '373-musse-shoots-camilla', title: 'Musse shoots and kills Camilla after she refuses to stop', detail: 'Musse aims his gun at Camilla and orders her not to advance. When she ignores him, he fires repeatedly and leaves her apparently dead, believing lethal force is the best outcome against a prince he suspects has confidence in a Nen ability.', tracks: ['camilla', 'musse', 'benjamin', 'death'], location: 'Black Whale · Tier 1 · Room 1002 area' }),
  event({ id: '373-cats-name-revival', title: 'Cat’s Name kills Musse and resurrects Camilla', detail: 'After Camilla’s death, a large cat-like Nen construct appears behind Musse, crushes him, and delivers a liquid from its tail into Camilla’s mouth. The supplied notes identify this as Camilla’s counteractive ability Cat’s Name, which revives her in exchange for the life of the attacker who killed her.', tracks: ['camilla', 'musse', 'cats-name', 'counteractive-nen', 'revival'], location: 'Black Whale · Tier 1 · Room 1002 area' }),
  event({ id: '373-secret-window-condition', title: 'Musse completes Secret Window’s condition before dying', detail: 'The supplied notes state that Musse had touched Camilla before his death and thereby completed Secret Window’s condition, giving him telepathic knowledge of Camilla’s actions. His death does not erase the strategic value of the ability because Benjamin can inherit loyal soldiers’ abilities.', tracks: ['musse', 'camilla', 'secret-window', 'nen-condition'], location: 'Black Whale · Tier 1 · Room 1002 area', confidence: 'Condition/use description follows the supplied Chapter 373 notes; complete Secret Window mechanics remain only partially documented' }),
  event({ id: '373-camilla-incineration-order', title: 'Camilla orders Musse’s belongings incinerated', detail: 'After reviving, Camilla orders her personal guards to burn all of Musse’s belongings before she leaves to confront Benjamin.', tracks: ['camilla', 'musse', 'guards', 'evidence'], location: 'Black Whale · Tier 1 · Room 1002' }),
  event({ id: '373-camilla-forces-departure', title: 'Camilla leaves for Benjamin despite her guards’ objections', detail: 'Camilla announces she will pursue the Benjamin-aligned assassin who attacked her. Her own guards try to stop her, but she threatens to torture and kill their families if they disobey and proceeds toward Room 1001.', tracks: ['camilla', 'benjamin', 'guards', 'coercion'], location: 'Black Whale · Tier 1 · royal corridor' }),
  event({ id: '373-camilla-shoots-furykov-wolfe', title: 'Camilla shoots Furykov and Wolfe outside Benjamin’s quarters', detail: 'Benjamin orders his guards not to attack Camilla and to let her pass. Camilla exploits the non-retaliation order and shoots Furykov and Wolfe. Furykov survives because his Nen protects him from fatal damage; Wolfe is killed.', tracks: ['camilla', 'furykov', 'wolfe', 'benjamin', 'shooting'], location: 'Black Whale · Tier 1 · outside Room 1001' }),
  event({ id: '373-camilla-shoots-benjamin', title: 'Camilla shoots Benjamin, who defends with aura and refuses retaliation', detail: 'Inside Benjamin’s quarters, Camilla fires on Benjamin. He protects himself with aura but does not counterattack, preserving his order that she be taken alive rather than killed.', tracks: ['camilla', 'benjamin', 'aura', 'arrest'], location: 'Black Whale · Tier 1 · Room 1001' }),
  event({ id: '373-camilla-arrested', title: 'Furykov arrests Camilla and she is placed in solitary confinement', detail: 'Furykov arrests Camilla after the confrontation. She threatens his family, and Furykov replies that Benjamin is his only family. Camilla is placed in solitary confinement under Balsamilco and Furykov’s supervision.', tracks: ['camilla', 'furykov', 'balsamilco', 'benjamin', 'custody'], location: 'Black Whale · Tier 1 · Benjamin-controlled custody' }),
  event({ id: '373-benjamin-baton-reveal', title: 'Benjamin Baton is revealed as an inheritance ability', detail: 'The supplied notes identify Benjamin Baton as Benjamin’s Nen ability, allowing him to inherit the abilities of loyal soldiers when its conditions are satisfied. At this chapter boundary he has inherited Vincent’s Air Blow and Musse’s Secret Window.', tracks: ['benjamin', 'benjamin-baton', 'vincent', 'musse', 'air-blow', 'secret-window'], location: 'Black Whale · Tier 1 · Room 1001' }),
  event({ id: '373-third-star-unknown', title: 'A third inactive-looking star on Benjamin’s palm indicates another inherited ability slot/state', detail: 'Benjamin’s right palm shows a third star with no aura surrounding it. The supplied notes indicate a third ability but do not identify its owner, name, or current usability.', tracks: ['benjamin', 'benjamin-baton', 'mystery'], location: 'Black Whale · Tier 1 · Room 1001', confidence: 'Third star is observed and linked by the notes to a third ability; identity and mechanics remain unknown' }),
  event({ id: '373-dead-prince-room-seal', title: 'Dead princes’ quarters are sealed against all access', detail: 'Hanzo attempts to enter Momoze’s quarters but security blocks him. The chapter notes establish a hard shipboard rule that the quarters of dead princes are sealed and inaccessible even to King Nasubi.', tracks: ['hanzo', 'momoze', 'security', 'dead-prince-quarters'], location: 'Black Whale · Tier 1 · Room 1012' }),
  event({ id: '373-hanzo-seeks-marayam-contact', title: 'Hanzo asks Kurapika for a covert way to contact Marayam’s camp', detail: 'Unable to reach Marayam through ordinary movement and communications, Hanzo consults Kurapika. Kurapika judges the disappearance more likely to involve Nen than a simple phone malfunction.', tracks: ['hanzo', 'kurapika', 'marayam', 'room-1013', 'nen-investigation'], location: 'Black Whale · Tier 1 · Room 1014' }),
  event({ id: '373-communication-hierarchy', title: 'Hanzo describes a prince-rank communication restriction', detail: 'Hanzo explains that a lower prince and their personnel cannot directly contact a higher prince through the ordinary system, motivating his request for a more discreet communication route.', tracks: ['hanzo', 'marayam', 'communications', 'prince-rank'], location: 'Black Whale · Tier 1', confidence: 'Hanzo’s explanation of the shipboard communication arrangement as supplied in Chapter 373' }),
  event({ id: '373-vergei-calls-1014', title: 'Vergei contacts Room 1014 from Marayam’s actual occupied quarters', detail: 'Shimano receives a call from Marayam’s personnel. Vergei introduces himself to Kurapika while Marayam and Sevanti are physically present with him, proving that their household continues to occupy an accessible operational state even though Hanzo’s projected exploration encounters an empty version of Room 1013.', tracks: ['vergei', 'kurapika', 'shimano', 'marayam', 'sevanti', 'room-1013'], location: 'Black Whale · Tier 1 · Room 1013 / Room 1014 communication link' }),
  event({ id: '373-hanzo-missing-from-occupied-room', title: 'Hanzo is absent from the occupied Room 1013 state while Vergei speaks to Kurapika', detail: 'When Hanzo attempts to enter the Marayam side during the contact sequence, he remains missing from the perspective of Vergei, Marayam, and Sevanti despite their being present together. This advances the Chapter 372 spatial anomaly without establishing whether the mechanism is a barrier, duplicate space, displacement, or another Nen effect.', tracks: ['hanzo', 'vergei', 'marayam', 'sevanti', 'room-1013', 'spatial-anomaly'], location: 'Black Whale · Tier 1 · Room 1013', confidence: 'Observed state mismatch confirmed; mechanism unresolved' }),
]);

export const succession373CamillaAbilityResearch = freeze({
  ability: "Cat's Name",
  owner: 'Camilla Hui Guo Rou',
  type: 'Counteractive-type Nen ability',
  triggerObserved: 'Camilla is killed by an attacker.',
  effectObserved: 'A large cat-like Nen construct kills the attacker and uses a liquid from its tail to revive Camilla.',
  exchange: 'Camilla’s revival is paid for with the life of the attacker who killed her.',
  confirmedVictim: 'Musse',
  unresolved: freeze(['complete valid-attacker definition', 'range', 'whether non-direct or shared responsibility changes the trigger', 'all failure conditions']),
  source,
});

export const succession373BenjaminBatonResearch = freeze({
  ability: 'Benjamin Baton',
  owner: 'Benjamin Hui Guo Rou',
  establishedFunction: 'Allows Benjamin to inherit the Nen abilities of loyal soldiers under conditions not fully enumerated by the supplied Chapter 373 text.',
  inheritedAtBoundary: freeze([
    freeze({ soldier: 'Vincent', ability: 'Air Blow', state: 'inherited' }),
    freeze({ soldier: 'Musse', ability: 'Secret Window', state: 'inherited' }),
  ]),
  thirdStar: 'A third star without surrounding aura is visible on Benjamin’s right palm and is described by the notes as indicating a third ability; identity and current state are unresolved.',
  source,
});

export const succession373AirBlowCorrection = freeze({
  ability: 'Air Blow',
  owner: 'Vincent',
  chapter373Evidence: 'The supplied notes explicitly identify Air Blow as Vincent’s ability and state that Benjamin has inherited it through Benjamin Baton.',
  archiveCorrection: 'Remove the stale Chapter 361 attribution as a maintained source. Chapters 361–364 supplied in this upgrade run never name or demonstrate Air Blow. Chapter 373 is the first supplied maintained source that confirms the ability name and owner.',
  mechanics: 'Not established by the supplied Chapter 373 text.',
  source,
});

export const succession373SecretWindowResearch = freeze({
  ability: 'Secret Window',
  owner: 'Musse',
  chapter366State: 'Named as a surveillance/evidence-gathering ability Musse planned to use against Camilla.',
  chapter373Expansion: 'The notes state that touching Camilla completed a condition and gave Musse telepathic knowledge of her actions. After Musse’s death, Benjamin inherits Secret Window through Benjamin Baton.',
  archiveCaution: 'Do not extrapolate additional bird-agent mechanics or exact persistence rules beyond maintained supplied evidence.',
  source,
});

export const succession373MarayamSpatialResearch = freeze({
  chapter372Observation: 'Hanzo’s projected state encounters an empty Room 1013 with his physical body, Biscuit, Marayam, Sevanti, and normal personnel absent while Marayam’s Guardian Spirit Beast remains.',
  chapter373Observation: 'Vergei successfully calls Room 1014 while Marayam and Sevanti are physically present with him, but Hanzo remains absent from their occupied room state.',
  implication: 'The anomaly is not explained by the Marayam household simply disappearing or evacuating. Two incompatible room-presence states are now observed.',
  unresolved: freeze(['mechanism', 'access condition', 'whether Guardian Spirit Beast creates or controls the state', 'relationship between physical Room 1013 and Hanzo’s observed empty state']),
  source,
});

export const succession373SecurityRules = freeze({
  deadPrinceQuarterRule: 'The quarters of a deceased prince are sealed against all access, including access by King Nasubi.',
  communicationObservation: 'Hanzo says lower-prince personnel cannot ordinarily contact a higher prince directly, while Vergei can call Room 1014 from Marayam’s household.',
  source,
});

export const succession373BodyStates = freeze([
  freeze({ person: 'Musse', state: 'deceased', detail: 'Killed by Cat’s Name after Musse shoots and kills Camilla.', chapter: 373, source }),
  freeze({ person: 'Wolfe', state: 'deceased', detail: 'Shot and killed by Camilla outside Benjamin’s quarters.', chapter: 373, source }),
  freeze({ person: 'Camilla Hui Guo Rou', state: 'alive / revived / detained', detail: 'Killed by Musse, revived through Cat’s Name, then arrested after confronting Benjamin and placed in solitary confinement.', chapter: 373, source }),
]);

export const succession373RelationshipRecords = freeze([
  freeze({ from: 'Camilla Hui Guo Rou', to: 'Benjamin Hui Guo Rou', type: 'Direct armed confrontation', note: 'Camilla forces her way toward Benjamin, shoots his personnel and Benjamin himself, and is captured after Benjamin refuses lethal retaliation.', phase: 'Active contest and voyage', chapters: '373', state: 'open hostility / Camilla detained', source }),
  freeze({ from: 'Benjamin Hui Guo Rou', to: 'Vincent / Musse', type: 'Post-mortem Nen inheritance', note: 'Benjamin Baton has inherited Air Blow from Vincent and Secret Window from Musse by the Chapter 373 boundary.', phase: 'Active contest and voyage', chapters: '373–current', state: 'inherited abilities active/available subject to ability conditions', source }),
  freeze({ from: 'Hanzo / Kurapika', to: 'Marayam household', type: 'Spatial-anomaly investigation and communication bridge', note: 'Hanzo asks Kurapika to help contact Marayam’s camp; Vergei’s successful call proves the household remains occupied even while Hanzo cannot access that occupied state.', phase: 'Active contest and voyage', chapters: '372–373', state: 'active investigation', source }),
]);

export const succession373Mysteries = freeze([
  freeze({ question: 'What is Benjamin Baton’s unidentified third inherited ability?', evidence: 'Benjamin’s right palm shows a third star with no aura surrounding it. Chapter 373 does not name the ability or its source soldier.', status: 'open', lastChapter: '373', source }),
  freeze({ question: 'What mechanism creates the incompatible occupied and empty states of Room 1013?', evidence: 'Hanzo’s projected exploration sees an empty Room 1013, while Chapter 373 shows Vergei, Marayam, and Sevanti together in an occupied state capable of calling Room 1014. Hanzo is absent from their perspective.', status: 'open / spatial anomaly strongly confirmed', lastChapter: '373', source }),
  freeze({ question: 'What are the complete trigger and failure conditions of Cat’s Name?', evidence: 'Musse kills Camilla and is then killed by the cat construct, whose action revives Camilla. The supplied notes define the life-for-life counteractive exchange but not every edge case.', status: 'open mechanics boundary', lastChapter: '373', source }),
]);

const focus = 'Camilla reveals Cat’s Name by dying to Musse and reviving after the counteractive cat kills him; she kills Wolfe, attacks Benjamin, and is arrested. Benjamin Baton is revealed, confirming inherited Air Blow and Secret Window and finally correcting Air Blow’s stale Chapter 361 attribution. Meanwhile Hanzo’s inability to access Marayam’s occupied quarters, contrasted with Vergei successfully calling Room 1014 while Marayam and Sevanti sit with him, deepens the Room 1013 spatial anomaly, and the ship establishes that dead princes’ quarters are sealed even from the king.';

export const succession373ChapterResearch = freeze([
  freeze({
    number: 373,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 2',
    lanes: freeze(['Camilla vs Benjamin', 'Cat’s Name', 'Benjamin Baton', 'Secret Window', 'Air Blow', 'Room 1013 anomaly', 'dead-prince security']),
    focus,
    events: succession373TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Camilla Hui Guo Rou', 'Musse', 'Benjamin Hui Guo Rou', 'Furykov', 'Wolfe', 'Balsamilco Might', 'Hanzo', 'Kurapika', 'Shimano', 'Vergei', 'Marayam Hui Guo Rou', 'Sevanti Hui Guo Rou']),
    appearances: freeze(['Camilla Hui Guo Rou', 'Musse', 'Benjamin Hui Guo Rou', 'Furykov', 'Wolfe', 'Balsamilco Might', 'Hanzo', 'Kurapika', 'Shimano', 'Vergei', 'Marayam Hui Guo Rou', 'Sevanti Hui Guo Rou']),
    relationships: succession373RelationshipRecords,
    bodyStates: succession373BodyStates,
    mysteries: succession373Mysteries,
    abilities: freeze([succession373CamillaAbilityResearch, succession373BenjaminBatonResearch, succession373AirBlowCorrection, succession373SecretWindowResearch]),
    locations: freeze(['Black Whale · Tier 1 · Room 1002', 'Black Whale · Tier 1 · Room 1001', 'Black Whale · Tier 1 · Room 1012', 'Black Whale · Tier 1 · Room 1014', 'Black Whale · Tier 1 · Room 1013']),
    objects: freeze([]),
    organizations: freeze(['Kakin Royal Army']),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, bodyStates: true, abilities: true, mysteries: true, locations: true, securityRules: true }),
    confidence: freeze([
      'Cat’s Name’s life-for-life revival function and Musse’s death are explicit in the supplied notes.',
      'Benjamin Baton’s inheritance function is explicit, but its complete eligibility/transfer conditions are not supplied and are not reconstructed here.',
      'Air Blow is finally confirmed by name as Vincent’s ability in Chapter 373; no attack mechanics are backfilled into Chapters 361–364.',
      'The Room 1013 state mismatch is confirmed, but no spatial mechanism is named.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession373SourcePolicy,
  }),
]);

export const succession373ChapterFocus = freeze({ 373: focus });
