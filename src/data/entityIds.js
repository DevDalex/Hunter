export const ENTITY_ID_VERSION = 'Batch 11 / 2026-07-20';

export const archiveEntityNamespaces = [
  { prefix: 'arc', label: 'Story arc', example: 'arc.chimera-ant', owns: ['route-level story pages', 'arc chronology', 'arc aftermath'] },
  { prefix: 'char', label: 'Character', example: 'char.gon-freecss', owns: ['character directory records', 'profile dossiers', 'relationship graph nodes'] },
  { prefix: 'nen', label: 'Nen / ability', example: 'nen.jajanken', owns: ['Nen principles', 'named abilities', 'conditions and restrictions'] },
  { prefix: 'faction', label: 'Faction / organization', example: 'faction.hunter-association', owns: ['institutions', 'families', 'states', 'criminal groups'] },
  { prefix: 'conflict', label: 'Conflict case', example: 'conflict.netero-vs-meruem', owns: ['fights', 'operations', 'hostage exchanges', 'information conflicts'] },
  { prefix: 'location', label: 'Location / atlas record', example: 'location.east-gorteau-palace', owns: ['countries', 'cities', 'rooms', 'routes', 'map nodes'] },
  { prefix: 'object', label: 'Object / evidence', example: 'object.poor-mans-rose', owns: ['weapons', 'documents', 'cards', 'ritual objects'] },
  { prefix: 'chapter', label: 'Chapter record', example: 'chapter.318', owns: ['future chapter ledger', 'timeline spine'] },
  { prefix: 'status', label: 'Death or exceptional state', example: 'status.gon-comatose', owns: ['death ledger', 'body-state records', 'exceptional states'] },
  { prefix: 'source', label: 'Bibliography source', example: 'source.src-arc-chimera-ant', owns: ['bibliography registry', 'source ledgers'] },
  { prefix: 'mystery', label: 'Open question', example: 'mystery.gyro', owns: ['future mystery tracker', 'unknown-state records'] },
  { prefix: 'operation', label: 'Operation / plan', example: 'operation.palace-invasion', owns: ['multi-character missions', 'faction operations'] },
];

export const entityNamespacePrefixes = archiveEntityNamespaces.map((item) => item.prefix);
export const entityIdPattern = '^(arc|char|nen|faction|conflict|location|object|chapter|status|source|mystery|operation)\\.[a-z0-9]+(?:-[a-z0-9]+)*$';
export const entityIdRegex = new RegExp(entityIdPattern);

export const slugifyEntityPart = (value = '') => String(value)
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const makeArchiveEntityId = (prefix, value) => `${prefix}.${slugifyEntityPart(value)}`;
export const isArchiveEntityId = (value) => entityIdRegex.test(value);

export const canonicalEntityIds = [
  { id: 'arc.volume-0', label: 'Volume 0 / Kurapika’s Memories', route: '/story/volume-0', status: 'active' },
  { id: 'arc.hunter-exam', label: 'Hunter Exam', route: '/story/hunter-exam', status: 'active' },
  { id: 'arc.zoldyck-family', label: 'Zoldyck Family', route: '/story/zoldyck-family', status: 'active' },
  { id: 'arc.heavens-arena', label: 'Heavens Arena', route: '/story/heavens-arena', status: 'active' },
  { id: 'arc.yorknew-city', label: 'Yorknew City', route: '/story/yorknew-city', status: 'active' },
  { id: 'arc.greed-island', label: 'Greed Island', route: '/story/greed-island', status: 'active' },
  { id: 'arc.chimera-ant', label: 'Chimera Ant', route: '/story/chimera-ant', status: 'active' },
  { id: 'arc.chairman-election', label: '13th Hunter Chairman Election', route: '/story/chairman-election', status: 'active' },
  { id: 'arc.succession-contest', label: 'Succession Contest', route: '/story/succession-contest', status: 'active' },
  { id: 'char.gon-freecss', label: 'Gon Freecss', route: '/reference/encyclopedia?category=characters&record=character-gon-freecss', status: 'profile-prototype' },
  { id: 'char.killua-zoldyck', label: 'Killua Zoldyck', route: '/reference/encyclopedia?category=characters&record=character-killua-zoldyck', status: 'profile-prototype' },
  { id: 'char.kurapika', label: 'Kurapika', route: '/reference/encyclopedia?category=characters&record=character-kurapika', status: 'profile-prototype' },
  { id: 'char.meruem', label: 'Meruem', route: '/reference/encyclopedia?category=characters&record=character-meruem', status: 'profile-prototype' },
  { id: 'char.neferpitou', label: 'Neferpitou', route: '/reference/encyclopedia?category=characters&record=character-neferpitou', status: 'profile-prototype' },
  { id: 'char.chrollo-lucilfer', label: 'Chrollo Lucilfer', route: '/reference/encyclopedia?category=characters&record=character-chrollo-lucilfer', status: 'profile-prototype' },
  { id: 'nen.core-system', label: 'Nen', route: '/reference/nen', status: 'backbone' },
  { id: 'faction.hunter-association', label: 'Hunter Association', route: '/reference/systems', status: 'backbone' },
  { id: 'faction.chimera-ant-colony', label: 'Chimera Ant colony', route: '/reference/systems', status: 'backbone' },
  { id: 'conflict.netero-vs-meruem', label: 'Netero vs Meruem', route: '/reference/conflicts', status: 'backbone' },
  { id: 'location.ngl', label: 'NGL', route: '/reference/atlas?location=ngl', status: 'backbone' },
  { id: 'location.east-gorteau', label: 'East Gorteau', route: '/reference/atlas?location=east-gorteau', status: 'backbone' },
  { id: 'object.poor-mans-rose', label: "Poor Man's Rose", route: '/reference/encyclopedia?category=objects', status: 'backbone' },
  { id: 'operation.palace-invasion', label: 'Palace Invasion', route: '/story/chimera-ant#palace-clock', status: 'future-expandable' },
  { id: 'source.src-arc-chimera-ant', label: 'Chimera Ant arc source', route: '', status: 'bibliography' },
];

export const entityIdStats = {
  version: ENTITY_ID_VERSION,
  namespaces: archiveEntityNamespaces.length,
  canonicalIds: canonicalEntityIds.length,
  prefixes: entityNamespacePrefixes.length,
};
