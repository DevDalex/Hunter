import { successionArchiveData as storyFoundationData } from './entitiesStoryIntelligenceFoundation.js';

const ARCHIVE_DATE = '2026-07-25';
const freeze = (values) => Object.freeze(values);
const unique = (values) => [...new Set(values.filter(Boolean))];
const slugify = (value = '') => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
const chapterSourceId = (chapter) => `source:chapter-${chapter}`;

const glossary = ({
  term,
  definition,
  category,
  firstChapter,
  synonyms = [],
  relatedEntityIds = [],
  sourceChapters = [firstChapter],
  certainty = 'confirmed',
  boundaryDefinitions = [],
}) => Object.freeze({
  id: `glossary:${slugify(term)}`,
  recordType: 'glossary',
  slug: slugify(term),
  term,
  definition,
  category,
  firstChapter,
  synonyms: freeze(synonyms),
  relatedEntityIds: freeze(unique(relatedEntityIds)),
  sourceIds: freeze(unique(sourceChapters.map(chapterSourceId))),
  certainty,
  boundaryDefinitions: freeze(boundaryDefinitions.map((record) => Object.freeze({ ...record }))),
  updatedAt: ARCHIVE_DATE,
});

export const successionGlossaryEntries = freeze([
  glossary({ term: 'Seed Urn Ceremony', definition: 'The Kakin royal-blood ritual that grants eligible princes parasitic Guardian Spirit Beasts and begins the current succession system.', category: 'Ritual', firstChapter: 349, synonyms: ['Seed Urn', 'Seed Urn ritual'], relatedEntityIds: ['nen-system:seed-urn-succession-ritual', 'organization:kakin-royal-family', 'character:nasubi-hui-guo-rou', 'event:seed-urn-ceremony'], sourceChapters: [349, 371, 413] }),
  glossary({ term: 'Succession Contest', definition: 'Kakin’s current royal selection system, operating aboard the Black Whale under ritual, political, legal, and military pressure.', category: 'Ritual', firstChapter: 349, synonyms: ['Succession War', 'Kakin succession'], relatedEntityIds: ['nen-system:seed-urn-succession-ritual', 'organization:kakin-royal-family', 'location:black-whale:ritual-boundary'], sourceChapters: [349, 358, 383, 413] }),
  glossary({ term: 'Guardian Spirit Beast', definition: 'A parasitic Nen beast produced by the succession ritual and sustained by its royal host’s aura, usually outside the host’s direct control.', category: 'Nen', firstChapter: 349, synonyms: ['GSB', 'Guardian Beast'], relatedEntityIds: ['nen-system:guardian-spirit-beast-contract', ...storyFoundationData.guardianBeasts.map((record) => record.id)], sourceChapters: [349, 358, 371] }),
  glossary({ term: 'Parasitic Nen', definition: 'Nen that attaches to a host and operates through conditions that may not require the host’s conscious understanding or control.', category: 'Nen', firstChapter: 349, synonyms: ['Parasitic-type Nen'], relatedEntityIds: ['nen-system:guardian-spirit-beast-contract', 'ability:silent-majority'], sourceChapters: [349, 369] }),
  glossary({ term: 'Post-mortem Nen', definition: 'Nen that persists, intensifies, or continues an operation after the user or host dies.', category: 'Nen', firstChapter: 357, synonyms: ['Nen after death'], relatedEntityIds: ['nen-system:post-mortem-nen-continuation', 'ability:without-you', 'character:kacho-hui-guo-rou'], sourceChapters: [357, 383] }),
  glossary({ term: 'Without You', definition: 'Kacho’s Guardian Spirit Beast continuation, appearing in Kacho’s form to protect Fugetsu after Kacho’s death; the exact identity of the continuing consciousness remains unresolved.', category: 'Ability', firstChapter: 383, synonyms: ['Kacho Guardian Spirit Beast'], relatedEntityIds: ['ability:without-you', 'guardian-beast:kacho', 'character:kacho-hui-guo-rou', 'character:fugetsu-hui-guo-rou'], sourceChapters: [383, 388, 402], certainty: 'probable' }),
  glossary({ term: 'Magical Worm', definition: 'Fugetsu’s Guardian Spirit Beast route system, creating an outgoing door and a return route whose later behavior changes under continuing pressure.', category: 'Ability', firstChapter: 374, synonyms: ['Fugetsu door ability'], relatedEntityIds: ['ability:magical-worm', 'guardian-beast:fugetsu', 'character:fugetsu-hui-guo-rou'], sourceChapters: [374, 383, 402] }),
  glossary({ term: 'Parallel Future', definition: 'Tserriednich’s ten-second precognitive vision activated through Zetsu, followed by a divergence in which others continue perceiving the predicted sequence.', category: 'Ability', firstChapter: 385, synonyms: ['Tserriednich future ability'], relatedEntityIds: ['ability:parallel-future', 'character:tserriednich-hui-guo-rou'], sourceChapters: [385, 387] }),
  glossary({ term: 'Benjamin Baton', definition: 'Benjamin’s inherited-ability system, allowing him to receive abilities from loyal deceased soldiers under documented service conditions.', category: 'Ability', firstChapter: 373, synonyms: ['Benjamin Batton'], relatedEntityIds: ['ability:benjamin-baton', 'character:benjamin-hui-guo-rou', 'organization:benjamin-private-army'], sourceChapters: [373, 389] }),
  glossary({ term: 'Predator', definition: 'Rihan’s counter-beast ability, whose effectiveness depends on extended observation and correct analysis of a target ability.', category: 'Ability', firstChapter: 374, synonyms: ['Rihan Predator'], relatedEntityIds: ['ability:predator', 'character:rihan', 'event:sale-sale-elimination'], sourceChapters: [374, 381] }),
  glossary({ term: 'Contagion', definition: 'Morena’s Heil-Ly system that grants points for killing, awakens abilities at thresholds, and permits qualified members to create successor communities.', category: 'Ability', firstChapter: 378, synonyms: ['Etude of Love'], relatedEntityIds: ['ability:contagion', 'character:morena-prudo', 'organization:heil-ly', 'nen-system:contagion-progression'], sourceChapters: [378, 391, 410] }),
  glossary({ term: 'Moonlight Act', definition: 'Longhi’s contract ability used to create a conditional alliance whose enforcement depends on agreed terms and breach conditions.', category: 'Contract', firstChapter: 401, synonyms: ['Longhi contract'], relatedEntityIds: ['ability:moonlight-act', 'character:longhi', 'event:longhi-kurapika-treaty', 'nen-system:contracts-vows-conditional-power'], sourceChapters: [401, 402] }),
  glossary({ term: 'Have-Not', definition: 'Camilla-aligned curse soldiers who prepare death-powered Nen against assigned princes through long-term proximity and sacrificial conditions.', category: 'Faction', firstChapter: 389, synonyms: ['Have-Nots', 'Have-Not curse soldiers'], relatedEntityIds: ['organization:camilla-private-guard', 'ability:have-not-curse', 'nen-system:royal-curse-networks'], sourceChapters: [389, 411, 413] }),
  glossary({ term: 'Silent Majority', definition: 'A concealed classroom attack ability whose complete user identity, host mechanics, target selection, and operating conditions remain unresolved.', category: 'Ability', firstChapter: 369, synonyms: ['Silent Majority user'], relatedEntityIds: ['ability:silent-majority', 'event:silent-majority-class-killings', 'story-thread:silent-majority-user'], sourceChapters: [369, 370, 376], certainty: 'inference' }),
  glossary({ term: 'Room 1014', definition: 'Prince Woble and Queen Oito’s Tier 1 quarters, Kurapika’s defensive base, and the site of the public Nen classes.', category: 'Location', firstChapter: 358, synonyms: ['Woble room'], relatedEntityIds: ['location:black-whale:tier-1:room-1014', 'event:room-1014-nen-classes', 'character:woble-hui-guo-rou'], sourceChapters: [358, 369, 411] }),
  glossary({ term: 'Room 3101', definition: 'A Tier 3 room used as an entry point in the investigation of Heil-Ly’s spatial route and hidden base.', category: 'Location', firstChapter: 394, synonyms: ['3101'], relatedEntityIds: ['location:black-whale:tier-3:room-3101', 'event:room-3101-breach', 'character:hinrigh-biganduffno'], sourceChapters: [394, 399, 400] }),
  glossary({ term: 'Special Martial Law', definition: 'Emergency Kakin military authority affecting movement, access, security checks, investigations, funerary operations, and lower-tier control.', category: 'Law', firstChapter: 409, synonyms: ['Martial law'], relatedEntityIds: ['event:special-martial-law', 'organization:kakin-military', 'story-thread:martial-law-end-state'], sourceChapters: [409, 410, 413] }),
  glossary({ term: 'Justice Bureau', definition: 'The Kakin institution responsible for investigation, custody, protected access, hearings, and legal procedure aboard the voyage.', category: 'Law', firstChapter: 359, synonyms: ['Kakin Justice'], relatedEntityIds: ['organization:kakin-justice-bureau', 'character:kaiser', 'location:black-whale:tier-1:justice-bureau'], sourceChapters: [359, 383, 411] }),
  glossary({ term: 'V6', definition: 'The international political framework formed when Kakin joins the former V5 powers around the public expedition project.', category: 'Politics', firstChapter: 340, synonyms: ['V5 plus Kakin'], relatedEntityIds: ['story-lane:expedition-frame', 'character:beyond-netero'], sourceChapters: [340, 342] }),
  glossary({ term: 'New Continent', definition: 'The public voyage destination and staging framework used before the true Dark Continent expedition proceeds.', category: 'Expedition', firstChapter: 340, synonyms: ['New Continent staging point'], relatedEntityIds: ['story-lane:expedition-frame', 'location:black-whale'], sourceChapters: [340, 358] }),
  glossary({ term: 'Body-state split', definition: 'The archive distinction between a body’s condition and the location or continuation of consciousness, identity, possession, or Nen.', category: 'Archive', firstChapter: 382, synonyms: ['Body consciousness split'], relatedEntityIds: ['nen-system:possession-consciousness-transfer', 'character:halkenburg-hui-guo-rou', 'character:balsamilco-might'], sourceChapters: [382, 403, 404] }),
  glossary({ term: 'Reading boundary', definition: 'The user-selected chapter limit that controls which entities, states, outcomes, sources, and explanations may be displayed.', category: 'Archive', firstChapter: 340, synonyms: ['Spoiler boundary', 'Chapter boundary'], relatedEntityIds: ['chapter:340'], sourceChapters: [340] }),
  glossary({ term: 'Canon', definition: 'A claim directly supported by maintained manga or reference evidence in the archive.', category: 'Evidence', firstChapter: 340, synonyms: ['Canonical'], relatedEntityIds: ['source:hunterpedia-succession-contest'], sourceChapters: [340] }),
  glossary({ term: 'Inference', definition: 'An archive interpretation supported by evidence but not directly confirmed as a complete canonical fact.', category: 'Evidence', firstChapter: 340, synonyms: ['Inferred'], relatedEntityIds: ['source:hunterpedia-succession-contest'], sourceChapters: [340], certainty: 'inference' }),
]);

const mediaRecord = ({ subject, mediaType, src, provenanceUrl = null, sourceIds = [] }) => Object.freeze({
  id: `media:${subject.id.replaceAll(':', '-')}:${mediaType}`,
  recordType: 'media',
  mediaType,
  subjectIds: freeze([subject.id]),
  label: `${subject.name} ${mediaType.replaceAll('-', ' ')}`,
  src,
  provenanceUrl: provenanceUrl || subject.referenceUrl || null,
  sourceIds: freeze(unique(sourceIds.length ? sourceIds : subject.sourceIds || [])),
  availability: src ? 'available' : 'missing',
  alt: `${subject.name} archive ${mediaType.replaceAll('-', ' ')}`,
  aspectRatio: mediaType === 'portrait' ? '3:4' : '4:3',
  lastVerifiedAt: ARCHIVE_DATE,
});

const visualSubjects = [
  ...storyFoundationData.characters.map((subject) => ({ subject, mediaType: 'portrait', src: subject.media?.portrait || null, provenanceUrl: subject.media?.source || subject.referenceUrl })),
  ...storyFoundationData.guardianBeasts.map((subject) => ({ subject, mediaType: 'guardian-beast-visual', src: subject.media?.portrait || null, provenanceUrl: subject.referenceUrl })),
];

export const successionMediaRecords = freeze(visualSubjects
  .filter((record) => record.src)
  .map((record) => mediaRecord(record)));

export const successionArchiveData = Object.freeze({
  ...storyFoundationData,
  glossaryEntries: successionGlossaryEntries,
  mediaRecords: successionMediaRecords,
});
