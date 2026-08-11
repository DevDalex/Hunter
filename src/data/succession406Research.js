import { succession406TimelineEvents } from './succession406ResearchEvents.js';
import { succession406Mysteries, succession406RelationshipRecords, succession406ResolvedQuestions, succession406SourcePolicy } from './succession406ResearchBoundary.js';

const freeze = (value) => Object.freeze(value);
const source406 = 'https://hunterxhunter.fandom.com/wiki/Chapter_406';

export { succession406TimelineEvents, succession406Mysteries, succession406RelationshipRecords, succession406ResolvedQuestions, succession406SourcePolicy };

export const succession406ChapterResearch = freeze([freeze({
  number: 406,
  title: null,
  titleStatus: 'not-supplied-no-title-backfilled',
  phase: 'outer-route reveal / Lynch recovery and Xi-Yu deduction / Chrollo regalia and Skill Hunter preparation / Halkenburg funeral begins',
  voyageDay: 'Voyage Day 12 · funeral-procession period',
  chronology: freeze({
    frame: 'Tajao route continues from Chapter 405 → outer pipe/waste infrastructure reveal → Nobunaga splits off → Biohazard transmitter reverts → Hinrigh/Zakuro recover Lynch and reconstruct deception → Chrollo phone search and regalia plan → Halkenburg funeral procession begins → final phone call places target above Tier 3',
    exactClockTime: 'No exact minute supplied; maintained prior scheduling and the Chapter 406 funeral start place the sequence during Voyage Day 12’s funeral-procession period',
    presentDay: true,
    flashback: false,
    presentationOrderNonLinear: false,
    spansDays: freeze([12]),
  }),
  lanes: freeze([
    'Tajao / Nobunaga / Phinks / Feitan outer route',
    'Black Whale waste infrastructure',
    'Heil-Ly hideout defense recap',
    'Biohazard transmitter',
    'Hinrigh / Zakuro / Lynch recovery',
    'fake-Lynch / fake-Hisoka deduction',
    'Chrollo phone search',
    'Kakin sacred treasures',
    'Skill Hunter evolution preparation',
    'Phantom Troupe continuity',
    'Halkenburg funeral procession',
  ]),
  focus: 'Chapter 406 resolves Tajao’s route cliffhanger into the Black Whale’s outer pipe structure, introduces the established-mafia waste-processing network without confirming the Troupe’s Heil-Ly subcontractor theory, recovers Lynch’s body while preserving Hinrigh and Zakuro’s knowledge gap about Bonolenov, and has Chrollo use a translated phone-search ability while targeting Kakin’s three sacred treasures as the prerequisite step in his Skill Hunter preparation before Halkenburg’s funeral procession begins.',
  events: succession406TimelineEvents,
  prelude: freeze([]),
  locations: freeze([
    'restricted inter-building route toward Tier 2',
    'outermost interior pipe/stair chamber',
    'waste/sewage processing plant between Tiers 4 and 5',
    'Tier 2 Heil-Ly hidden base',
    'Tier 3 funeral-procession crowd',
    'Tier 3 Lynch body-recovery site',
    'Tier 3 funeral procession',
  ]),
  threadLabels: freeze([
    'Black Whale infrastructure',
    'Cha-R',
    'Xi-Yu',
    'Heil-Ly subcontractor theory',
    'LSDF',
    'Biohazard',
    'Lynch death',
    'fake Hisoka',
    'Hinrigh deduction',
    'Love Dial 6700',
    'Skill Hunter',
    'Seed Urn',
    'Lotus Anchorite',
    'Sword of Good Omens',
    'Spider continuity',
    'Halkenburg funeral',
  ]),
  confidence: freeze([
    'current user-supplied Hunterpedia-style synopsis and supplied trivia block are the sole substantive Chapter 406 source',
    'no current-packet title is backfilled from the older 406 catalog',
    'waste-subcontractor killing pipeline remains Troupe theory',
    'Hinrigh/Zakuro knowledge is kept separate from the archive’s Chapter 405 knowledge that Bonolenov killed Lynch',
    'Love Dial translated page text is retained without assigning McGait Narumi an invented role',
    'Chrollo’s regalia-system and Tier 1 storage claims remain theories',
    'no Chapter 407+ tracked-person identity, treasure theft, Skill Hunter evolution result, Hisoka encounter, or mafia war backfill',
  ]),
  status: 'Maintained Chapter 406 summary + 32 chapter beats + Day 12 funeral chronology + outer-route infrastructure + Lynch recovery/epistemic split + Biohazard/LSDF updates + Love Dial/regalia/Skill Hunter boundaries linked',
  coverage: freeze({ identity: true, publication: true, summary: true, sceneSummary: true, chronology: true, appearances: true, locations: true, relationships: true, assignments: true, nen: true, source: true }),
  lastReviewed: 'August 11, 2026',
  releaseDate: null,
  officialReaderUrl: null,
  source: source406,
})]);

export const succession406ChapterFocus = freeze({ 406: succession406ChapterResearch[0].focus });
