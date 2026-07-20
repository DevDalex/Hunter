import { hunterpediaArticle } from './sourcePolicy';

export const BIBLIOGRAPHY_VERSION = 'Batch 11 / 2026-07-20';

const record = ({ id, title, href, category, recordTypes, usedBy, status = 'approved', notes }) => ({
  id,
  title,
  href,
  category,
  recordTypes,
  usedBy,
  status,
  notes,
});

export const bibliographyCollections = [
  {
    id: 'story-arcs',
    title: 'Story arc records',
    purpose: 'Canonical arc pages used by Story routes, arc prototypes, chronology records, and after/before context.',
    records: [
      record({ id: 'src-arc-hunter-exam', title: 'Hunter Exam arc', href: hunterpediaArticle('Hunter_Exam_arc'), category: 'arc', recordTypes: ['arc', 'chronology', 'characters'], usedBy: ['story.hunter-exam', 'chapter-ledger.future'], notes: 'Arc identity and transition source.' }),
      record({ id: 'src-arc-zoldyck-family', title: 'Zoldyck Family arc', href: hunterpediaArticle('Zoldyck_Family_arc'), category: 'arc', recordTypes: ['arc', 'location', 'family'], usedBy: ['story.zoldyck-family'], notes: 'Arc identity and estate context.' }),
      record({ id: 'src-arc-heavens-arena', title: 'Heavens Arena arc', href: hunterpediaArticle('Heavens_Arena_arc'), category: 'arc', recordTypes: ['arc', 'nen', 'conflict'], usedBy: ['story.heavens-arena', 'reference.nen'], notes: 'Nen introduction and tower context.' }),
      record({ id: 'src-arc-yorknew-city', title: 'Yorknew City arc', href: hunterpediaArticle('Yorknew_City_arc'), category: 'arc', recordTypes: ['arc', 'faction', 'auction', 'conflict'], usedBy: ['story.yorknew-city'], notes: 'Crime/conspiracy prototype source.' }),
      record({ id: 'src-arc-greed-island', title: 'Greed Island arc', href: hunterpediaArticle('Greed_Island_arc'), category: 'arc', recordTypes: ['arc', 'game', 'cards', 'conflict'], usedBy: ['story.greed-island'], notes: 'Game manual and card binder source.' }),
      record({ id: 'src-arc-chimera-ant', title: 'Chimera Ant arc', href: hunterpediaArticle('Chimera_Ant_arc'), category: 'arc', recordTypes: ['arc', 'species', 'operation', 'conflict'], usedBy: ['story.chimera-ant', 'reference.backbone'], notes: 'Flagship stress-test arc source.' }),
      record({ id: 'src-arc-election', title: '13th Hunter Chairman Election arc', href: hunterpediaArticle('13th_Hunter_Chairman_Election_arc'), category: 'arc', recordTypes: ['arc', 'organization', 'status'], usedBy: ['story.chairman-election'], notes: 'Aftermath and institutional transition source.' }),
      record({ id: 'src-arc-succession', title: 'Succession Contest arc', href: hunterpediaArticle('Succession_Contest_arc'), category: 'arc', recordTypes: ['arc', 'succession', 'current'], usedBy: ['succession.overview'], notes: 'Current-arc structure source.' }),
    ],
  },
  {
    id: 'characters-and-groups',
    title: 'Characters and organizations',
    purpose: 'Primary identity records for profile dossiers, relationship links, factions, and organization hierarchy work.',
    records: [
      record({ id: 'src-char-gon', title: 'Gon Freecss', href: hunterpediaArticle('Gon_Freecss'), category: 'character', recordTypes: ['character', 'profile', 'nen'], usedBy: ['character.gon-freecss'], notes: 'Flagship profile prototype source.' }),
      record({ id: 'src-char-killua', title: 'Killua Zoldyck', href: hunterpediaArticle('Killua_Zoldyck'), category: 'character', recordTypes: ['character', 'profile', 'nen'], usedBy: ['character.killua-zoldyck'], notes: 'Flagship profile prototype source.' }),
      record({ id: 'src-char-kurapika', title: 'Kurapika', href: hunterpediaArticle('Kurapika'), category: 'character', recordTypes: ['character', 'profile', 'scarlet-eyes'], usedBy: ['character.kurapika'], notes: 'Yorknew/Succession bridge profile source.' }),
      record({ id: 'src-char-meruem', title: 'Meruem', href: hunterpediaArticle('Meruem'), category: 'character', recordTypes: ['character', 'profile', 'chimera-ant'], usedBy: ['character.meruem', 'story.chimera-ant'], notes: 'Chimera Ant profile source.' }),
      record({ id: 'src-char-neferpitou', title: 'Neferpitou', href: hunterpediaArticle('Neferpitou'), category: 'character', recordTypes: ['character', 'profile', 'royal-guard'], usedBy: ['character.neferpitou', 'story.chimera-ant'], notes: 'Royal Guard profile source.' }),
      record({ id: 'src-char-chrollo', title: 'Chrollo Lucilfer', href: hunterpediaArticle('Chrollo_Lucilfer'), category: 'character', recordTypes: ['character', 'profile', 'phantom-troupe'], usedBy: ['character.chrollo-lucilfer'], notes: 'Troupe profile source.' }),
      record({ id: 'src-faction-hunter-association', title: 'Hunter Association', href: hunterpediaArticle('Hunter_Association'), category: 'faction', recordTypes: ['organization', 'institution'], usedBy: ['reference.organizations', 'story.election'], notes: 'Institutional source.' }),
      record({ id: 'src-faction-phantom-troupe', title: 'Phantom Troupe', href: hunterpediaArticle('Phantom_Troupe'), category: 'faction', recordTypes: ['organization', 'conflict'], usedBy: ['reference.organizations', 'story.yorknew-city'], notes: 'Spider organization source.' }),
      record({ id: 'src-faction-chimera-ants', title: 'Chimera Ants', href: hunterpediaArticle('Chimera_Ants'), category: 'faction', recordTypes: ['species', 'hierarchy'], usedBy: ['story.chimera-ant', 'reference.organizations'], notes: 'Species and hierarchy source.' }),
    ],
  },
  {
    id: 'systems-and-world',
    title: 'Systems, world, and conflict references',
    purpose: 'Primary pages for Nen, geography, abilities, conflicts, and future backbone expansion.',
    records: [
      record({ id: 'src-system-nen', title: 'Nen', href: hunterpediaArticle('Nen'), category: 'system', recordTypes: ['nen', 'ability', 'mechanic'], usedBy: ['reference.nen', 'batch18.future'], notes: 'Core Nen source.' }),
      record({ id: 'src-world-hxh', title: 'World of Hunter × Hunter', href: hunterpediaArticle('World_of_Hunter_%C3%97_Hunter'), category: 'world', recordTypes: ['location', 'atlas'], usedBy: ['reference.atlas'], notes: 'World/atlas source.' }),
      record({ id: 'src-location-ngl', title: 'Neo-Green Life', href: hunterpediaArticle('Neo-Green_Life'), category: 'location', recordTypes: ['location', 'state', 'chimera-ant'], usedBy: ['story.chimera-ant', 'reference.atlas'], notes: 'NGL source.' }),
      record({ id: 'src-location-east-gorteau', title: 'East Gorteau', href: hunterpediaArticle('East_Gorteau'), category: 'location', recordTypes: ['location', 'state', 'chimera-ant'], usedBy: ['story.chimera-ant', 'reference.atlas'], notes: 'Palace/selection context.' }),
      record({ id: 'src-object-poor-mans-rose', title: "Poor Man's Rose", href: hunterpediaArticle("Poor_Man's_Rose"), category: 'object', recordTypes: ['object', 'weapon', 'aftermath'], usedBy: ['story.chimera-ant', 'reference.conflicts'], notes: 'Rose weapon source.' }),
      record({ id: 'src-conflict-netero-meruem', title: 'Isaac Netero vs. Meruem', href: hunterpediaArticle('Isaac_Netero_vs._Meruem'), category: 'conflict', recordTypes: ['conflict', 'nen', 'chimera-ant'], usedBy: ['reference.conflicts', 'story.chimera-ant'], notes: 'Conflict case source.' }),
      record({ id: 'src-conflict-hisoka-chrollo', title: 'Chrollo Lucilfer vs. Hisoka Morow', href: hunterpediaArticle('Chrollo_Lucilfer_vs._Hisoka_Morow'), category: 'conflict', recordTypes: ['conflict', 'nen', 'manga'], usedBy: ['reference.conflicts'], notes: 'Detailed conflict dossier source.' }),
      record({ id: 'src-list-volumes-chapters', title: 'List of Volumes and Chapters', href: hunterpediaArticle('List_of_Volumes_and_Chapters'), category: 'chapter-index', recordTypes: ['chapter', 'volume', 'ledger'], usedBy: ['chapter-ledger.future'], notes: 'Future Chapter Encyclopedia seed.' }),
    ],
  },
];

export const bibliographyRecords = bibliographyCollections.flatMap((collection) => collection.records.map((item) => ({
  ...item,
  collectionId: collection.id,
  collectionTitle: collection.title,
})));

export const bibliographyById = new Map(bibliographyRecords.map((item) => [item.id, item]));

export const bibliographyStats = {
  version: BIBLIOGRAPHY_VERSION,
  collections: bibliographyCollections.length,
  records: bibliographyRecords.length,
  categories: new Set(bibliographyRecords.map((item) => item.category)).size,
  approvedRecords: bibliographyRecords.filter((item) => item.status === 'approved').length,
  usedByTargets: new Set(bibliographyRecords.flatMap((item) => item.usedBy)).size,
};

export const getBibliographyRecord = (id) => bibliographyById.get(id) || null;
