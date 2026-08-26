import { guardianBeasts, princeDossiers, queenDossiers } from '../../data/successionDossier';
import { getProtectionNetworkSeed } from '../../data/successionProtectionNetworks';
import { getAbilitiesForOwner, getEntitiesByType, getEntityById } from '../../data/succession/successionData';

export const cleanBranchName = (name = '') => String(name)
  .replace(/[†*]/g, '')
  .replace(/\s+\((?:birth|raised).*\)$/i, '')
  .trim();

const slugify = (value = '') => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const normalizeLookup = (value = '') => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const queenFullNameByShort = new Map(queenDossiers.map((queen) => [queen.name, `${queen.name} Hui Guo Rou`]));
const princeFullNameByShort = new Map(princeDossiers.map((prince) => [prince.short, prince.name]));
export const dossierByShort = new Map(princeDossiers.map((prince) => [prince.short, prince]));
export const dossierByOrder = new Map(princeDossiers.map((prince) => [prince.order, prince]));
export const queenDossierByShort = new Map(queenDossiers.map((queen) => [queen.name, queen]));
const guardianBeastByHost = new Map(guardianBeasts.map((beast) => [normalizeLookup(beast.host), beast]));
const characterEntities = getEntitiesByType('character');
const organizationEntities = getEntitiesByType('organization');
export const intelligenceKinds = new Set(['observer', 'spy', 'hostile']);
export const placementKinds = new Set(['kurapika-placement', 'ally']);

export const mafiaConnections = Object.freeze([
  { key: 'xi-yu', name: 'Xi-Yu Family', leader: 'Onior Longbao', princeOrder: 3, relation: 'Political sponsorship and access through Zhang Lei’s branch.' },
  { key: 'heil-ly', name: 'Heil-Ly Family', leader: 'Morena Prudo', princeOrder: 4, relation: 'Former royal sponsorship tied to Tserriednich’s branch.' },
  { key: 'cha-r', name: 'Cha-R Family', leader: 'Brocco Li', princeOrder: 7, relation: 'Political sponsorship and lower-tier access through Luzurus.' },
]);

const canonicalName = (name) => queenFullNameByShort.get(name) || princeFullNameByShort.get(name) || name;
export const entityForName = (name) => {
  const canonical = canonicalName(name);
  const direct = getEntityById(`character:${slugify(canonical)}`);
  if (direct) return direct;
  const target = normalizeLookup(canonical);
  return characterEntities.find((entity) => [entity.name, ...(entity.aliases || [])].some((candidate) => normalizeLookup(candidate) === target)) || null;
};

const normalizeOrganizationName = (value) => normalizeLookup(value).replace(/\b(?:family|mafia)\b/g, ' ').replace(/\s+/g, ' ').trim();
export const organizationForName = (name) => {
  const target = normalizeOrganizationName(name);
  return organizationEntities.find((entity) => {
    const candidates = [entity.name, ...(entity.aliases || [])].map(normalizeOrganizationName);
    return candidates.some((candidate) => candidate === target || candidate.includes(target) || target.includes(candidate));
  }) || null;
};

export const initials = (name = '') => name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || '?';
export const personSummary = (entity, fallback) => entity?.summary || fallback;
export const abilityLabelFor = (entity) => {
  if (!entity) return 'Unknown';
  const abilities = getAbilitiesForOwner(entity.id).map((ability) => ability.name || ability.id).filter(Boolean);
  return abilities.length ? abilities.join(', ') : 'No documented personal ability';
};
const isRoyalEntity = (entity) => (entity?.roles || []).some((role) => ['king', 'queen', 'prince', 'royal-parent'].includes(role));
export const beastForHost = (host) => guardianBeastByHost.get(normalizeLookup(host)) || null;

export const statusLabel = (status) => status === 'deceased' ? 'Deceased' : status === 'exceptional' ? 'Exceptional state' : 'Active contender';
export const networkKindLabel = (kind) => ({
  'kurapika-placement': 'Kurapika placement', ally: 'Allied reinforcement', observer: 'Embedded observer',
  spy: 'Royal spy', hostile: 'Hostile infiltrator', complement: 'Household complement',
}[kind] || 'Direct protection');

export const buildProtectionNodes = (prince) => {
  const seed = getProtectionNetworkSeed(prince);
  const records = [];
  const seen = new Set();
  const addRecord = (name, supplied = {}) => {
    const normalized = normalizeLookup(name);
    if (!normalized || seen.has(normalized)) return;
    const entity = supplied.entity === undefined ? entityForName(name) : supplied.entity;
    if (entity && isRoyalEntity(entity)) return;
    seen.add(normalized);
    const isGroup = supplied.isGroup ?? !entity;
    const kind = supplied.kind || (isGroup ? 'complement' : 'protection');
    records.push({
      id: supplied.id || `${prince.order}-${slugify(name)}-${records.length}`, name, entity, isGroup, kind,
      count: supplied.count || null,
      eyebrow: supplied.eyebrow || networkKindLabel(kind) || (entity?.roles || []).slice(0, 2).join(' · '),
      description: supplied.description || personSummary(entity, `Documented member of ${prince.short}'s household network.`),
    });
  };
  for (const record of seed.categorizedActors) addRecord(record.name, record);
  for (const name of seed.dedicatedNames) addRecord(name, { kind: 'protection' });
  for (const name of seed.teamNames) addRecord(name, { kind: 'protection' });
  for (const group of seed.complementGroups) addRecord(group.name, { ...group, entity: null, isGroup: true });
  return records;
};
