import { characters } from './characters';
import { successionRoster } from './successionRoster';
import { confirmedDeceased, deathLedger, exceptionalStatus } from './successionStatus';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const aliases = new Map([
  ['Benjamin', 'Benjamin Hui Guo Rou'], ['Camilla', 'Camilla Hui Guo Rou'],
  ['Zhang Lei', 'Zhang Lei Hui Guo Rou'], ['Tserriednich', 'Tserriednich Hui Guo Rou'],
  ['Tubeppa', 'Tubeppa Hui Guo Rou'], ['Tyson', 'Tyson Hui Guo Rou'],
  ['Luzurus', 'Luzurus Hui Guo Rou'], ['Salé-salé', 'Salé-salé Hui Guo Rou'],
  ['Halkenburg', 'Halkenburg Hui Guo Rou'], ['Kacho', 'Kacho Hui Guo Rou'],
  ['Fugetsu', 'Fugetsu Hui Guo Rou'], ['Momoze', 'Momoze Hui Guo Rou'],
  ['Marayam', 'Marayam Hui Guo Rou'], ['Woble', 'Woble Hui Guo Rou'],
]);

export const normalizeEntityName = (value = '') => value.replace('*', '').trim();
export const canonicalEntityName = (value = '') => aliases.get(normalizeEntityName(value)) || normalizeEntityName(value);

const records = new Map();
const mergeRecord = (record, priority) => {
  const canonicalName = canonicalEntityName(record.name);
  const current = records.get(canonicalName) || { id: canonicalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), name: canonicalName, priority: -1 };
  const next = {
    ...current,
    name: canonicalName,
    aliases: [...new Set([...(current.aliases || []), ...(canonicalName !== record.name ? [record.name] : [])])],
    group: record.group || current.group || 'Unclassified',
    role: record.role || current.role || 'Indexed Hunterpedia character',
    scope: record.scope || current.scope || 'succession',
    source: priority >= current.priority && record.source ? record.source : current.source,
    image: priority >= current.priority && record.image ? record.image : current.image,
    imageSource: priority >= current.priority && record.imageSource ? record.imageSource : current.imageSource,
    media: priority >= current.priority && record.media ? record.media : current.media,
    status: record.status || current.status || 'active',
    statusNote: record.statusNote || current.statusNote || null,
    priority: Math.max(priority, current.priority),
  };
  records.set(canonicalName, next);
};

successionRoster.forEach((record) => mergeRecord(record, 1));
characters.forEach((record) => mergeRecord(record, 2));

confirmedDeceased.forEach((name) => {
  const canonicalName = canonicalEntityName(name);
  mergeRecord({ name: canonicalName, status: 'deceased', statusNote: 'Confirmed deceased' }, 3);
});

Object.entries(exceptionalStatus).forEach(([name, note]) => {
  const canonicalName = canonicalEntityName(name);
  const status = confirmedDeceased.has(canonicalName) ? 'deceased' : 'exceptional';
  mergeRecord({ name: canonicalName, status, statusNote: note }, 3);
});

deathLedger.forEach((entry) => {
  if (entry.name.endsWith('’s body')) return;
  const canonicalName = canonicalEntityName(entry.name);
  mergeRecord({ name: canonicalName, status: 'deceased', statusNote: entry.cause }, 3);
});

export const entityRegistry = [...records.values()].map(({ priority, ...record }) => ({
  ...record,
  source: record.source || wiki(encodeURIComponent(record.name.replaceAll(' ', '_'))),
}));

const byName = new Map();
entityRegistry.forEach((record) => {
  byName.set(record.name, record);
  record.aliases.forEach((alias) => byName.set(alias, record));
});

export const resolveCharacter = (name) => byName.get(name) || byName.get(canonicalEntityName(name)) || {
  id: canonicalEntityName(name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name: canonicalEntityName(name), aliases: [], group: 'Unclassified', role: 'Indexed character', scope: 'unknown',
  status: 'unknown', statusNote: 'No maintained local status record', image: null,
  source: wiki(encodeURIComponent(canonicalEntityName(name).replaceAll(' ', '_'))),
};

export const characterPortrait = (name) => resolveCharacter(name).image || null;
export const characterMedia = (name) => resolveCharacter(name).media || null;
export const characterSource = (name) => resolveCharacter(name).source;
export const characterStatus = (name) => resolveCharacter(name).status;
export const characterStatusNote = (name) => resolveCharacter(name).statusNote;
export const isCharacterDeceased = (name) => characterStatus(name) === 'deceased';

export const entityRegistryStats = {
  records: entityRegistry.length,
  pictured: entityRegistry.filter((record) => record.image).length,
  deceased: entityRegistry.filter((record) => record.status === 'deceased').length,
  exceptional: entityRegistry.filter((record) => record.status === 'exceptional').length,
  unknown: entityRegistry.filter((record) => record.status === 'unknown').length,
};
