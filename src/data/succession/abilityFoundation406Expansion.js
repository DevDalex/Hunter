import { abilityFoundation399Expansion } from './abilityFoundation399Expansion.js';

const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;
const priorBiohazard = abilityFoundation399Expansion.find((ability) => ability.id === 'ability:hinrigh-object-animal-transformation');
const priorLsdf = abilityFoundation399Expansion.find((ability) => ability.id === 'ability:yokotani-battle-of-wits-lsdf');

export const abilityFoundation406Expansion = freeze([
  freeze({
    ...priorBiohazard,
    summary: 'Hinrigh Biganduffno’s formally named object-to-living-animal transformation ability. Chapters 390–399 establish its object-animal transformations, transmitter-to-oyster tracking use, size/aura-duration statements, concealment of the transmitter-oyster in the Heil-Ly hideout, and Hinrigh’s rest-of-day unavailability after that operation. Chapter 406 shows the hidden oyster continuing to emit the transmitter signal before suddenly reverting to the original device beneath the cabinet.',
    sourceIds: freeze([...(priorBiohazard?.sourceIds || []), chapterSourceId(406)]),
    updatedAt: '2026-08-11',
    conditions: freeze([
      ...(priorBiohazard?.conditions || []),
      'Chapter 406: the concealed transmitter-oyster remains under the Heil-Ly cabinet, continues beeping, and then reverts to the original transmitter device.',
    ]),
    limitations: freeze([
      ...(priorBiohazard?.limitations || []),
      'Chapter 406 demonstrates eventual reversion of this transformed transmitter but does not establish the exact elapsed transformation time, remaining aura at reversion, a universal timer, or whether all transformed objects end at the same threshold.',
      'The chapter does not state that Hinrigh witnesses the reversion or learns its exact timing in the shown scene.',
    ]),
    knownUses: freeze([
      ...(priorBiohazard?.knownUses || []),
      'Chapter 406: the concealed raw-oyster form of Hinrigh’s transmitter reverts to the original electronic device inside the Heil-Ly hideout.',
    ]),
    latestChapter: 406,
    sourceChapterNumbers: freeze([...new Set([...(priorBiohazard?.sourceChapterNumbers || []), 406])]),
    status: 'active ability / Chapter 406 confirms eventual reversion of the hidden transmitter-oyster',
    researchStatus: 'formal name, multiple transformations, transmitter tracking, Chapter 399 concealment/rest-of-day limit, and Chapter 406 transmitter reversion documented / Nen category, exact aura cost, exact persistence timer, and complete limits unresolved',
  }),
  freeze({
    ...priorLsdf,
    summary: 'Yokotani’s Conjuration defense A Battle of Wits: “LSDF”. Chapter 399 directly establishes its Morena-hideout restriction, lawbreaking/identity activation, crime-severity guard scaling, defensive invulnerability behavior, restraint, weapon confiscation, and expulsion. Chapter 406 does not add a new activation demonstration; Nobunaga summarizes the counteractive defense for Phinks and Feitan, describing an invincibility-like state and Nen security dolls. Feitan proposes that responding only after Heil-Ly attacks may count as self-defense, but that proposed loophole is not tested.',
    sourceIds: freeze([...(priorLsdf?.sourceIds || []), chapterSourceId(406)]),
    updatedAt: '2026-08-11',
    conditions: freeze([
      ...(priorLsdf?.conditions || []),
      'Chapter 406: Nobunaga’s operational warning preserves the practical rule that attacking the hideout guard can trigger the counteractive defensive state and expulsion constructs.',
    ]),
    limitations: freeze([
      ...(priorLsdf?.limitations || []),
      'Feitan’s Chapter 406 suggestion that self-defense might avoid or bypass the counteractive restriction is an untested tactical hypothesis, not a confirmed LSDF mechanic.',
      'The Chapter 406 shorthand “invincibility switch” and “security robots/dolls” is Nobunaga’s practical description and does not replace the more specific Chapter 399 conditions already recorded.',
    ]),
    knownUses: freeze([
      ...(priorLsdf?.knownUses || []),
      'Chapter 406: Nobunaga briefs Phinks and Feitan on the hideout’s counteractive defense before the group splits; no new LSDF activation occurs.',
    ]),
    latestChapter: 406,
    sourceChapterNumbers: freeze([...new Set([...(priorLsdf?.sourceChapterNumbers || []), 406])]),
    researchStatus: 'Chapter 399 mechanics remain canonical; Chapter 406 adds operational recap and an explicitly untested self-defense bypass theory',
  }),
  freeze({
    id: 'ability:love-dial-6700-disgusting-telephone',
    entityType: 'ability',
    slug: 'love-dial-6700-disgusting-telephone',
    name: 'Love Dial 6700 - Disgusting Telephone',
    aliases: freeze(['Translated Skill Hunter page label from the supplied Chapter 406 trivia']),
    summary: 'A phone-search ability Chrollo accesses from Skill Hunter in Chapter 406. He conjures a cell phone and uses it to search for an unspecified person. The supplied translated page text says criteria are entered, a 6–20 digit number is displayed, and dialing the number provides guidance. In the story, calls can report that a target is outside the current area or beyond the current Nen signal range, and Chrollo is told he has a limited number of calls remaining that day.',
    sourceIds: freeze([chapterSourceId(406)]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-11',
    updatedAt: '2026-08-11',
    ownerIds: freeze(['character:chrollo-lucilfer']),
    classification: freeze({ nenTypes: freeze(['unknown']), certainty: 'unknown' }),
    category: 'search / guidance via conjured cell phone',
    activation: 'The translated page says the user inputs criteria, receives a 6–20 digit number, and dials it for guidance. Chapter 406 shows Chrollo opening Skill Hunter, conjuring the phone, and dialing during his search.',
    conditions: freeze([
      'Search criteria are input before a 6–20 digit number is generated, according to the translated page text supplied as trivia.',
      'The demonstrated story use has a limited number of calls available for the day, but the exact count is not supplied.',
      'Guidance is sensitive to the caller’s current area/coordinates and to a Nen signal range in the demonstrated calls.',
    ]),
    limitations: freeze([
      'The exact daily call count, reset time, signal radius, valid criteria, target eligibility, aura cost, and Nen category are not supplied.',
      'Chrollo considers changing coordinates or loosening conditions, but Chapter 406 does not define the exact tradeoff or procedure for editing those conditions.',
      'The identity and exact tier of Chrollo’s tracked person remain unknown; the final call only places the person above Chrollo and beyond the current signal range.',
      'The supplied translated text “McGait Narumi” appears on the page, but its role is not defined and is not treated as proof of the ability’s original owner.',
      'Chrollo is the demonstrated Skill Hunter user of this stored ability; the archive does not infer the original owner from Chapter 406 alone.',
    ]),
    costs: freeze(['A finite daily number of calls is stated; exact count and aura cost remain unresolved.']),
    targets: freeze(['an unspecified person matching the selected search criteria']),
    range: 'area- and Nen-signal-bounded guidance; exact radius unknown',
    duration: 'per-call guidance; persistence between calls and daily reset details unknown',
    status: 'active stored ability used by Chrollo through Skill Hunter',
    knownUses: freeze([
      'Chapter 406: a first call says the sought person is not in the current area and advises Chrollo to wait or try from another location.',
      'Chapter 406: during Halkenburg’s procession, a later call says the target has been located but is beyond the current Nen signal range and asks Chrollo to change coordinates; he concludes the target is above him.',
    ]),
    firstChapter: 406,
    latestChapter: 406,
    sourceChapterNumbers: freeze([406]),
    researchStatus: 'translated page label/basic criteria-number-dial guidance and two demonstrated Chapter 406 calls documented / original owner, exact counts, range, category, target identity, and condition-editing rules unresolved',
  }),
]);
