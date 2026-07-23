import archive000024 from './specifiedCardArchive000-024.js';
import archive025049 from './specifiedCardArchive025-049.js';
import archive050074 from './specifiedCardArchive050-074.js';
import archive075099 from './specifiedCardArchive075-099.js';

export const SPECIFIED_CARD_ARCHIVE_SOURCE = Object.freeze({
  id: 'hunterpedia-specified-archive',
  label: 'Greed Island Card Lists — Specified Slot table',
  href: 'https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists#List_of_the_100_Specified_Slot_Cards',
  verifiedAt: '2026-07-21',
  license: 'CC BY-SA',
});

const DEFAULT_ACQUISITION = Object.freeze({
  status: 'undocumented',
  summary: 'Hunterpedia’s Specified Slot table verifies this card’s identity and effect, but does not document a complete acquisition route in that table.',
  location: null,
  source: 'https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists',
});

const DEFAULT_STORY = Object.freeze({
  status: 'undocumented',
  importance: 'archive-only',
  summary: 'No card-specific owner, chapter, or episode mapping is documented in the Specified Slot table.',
  owners: Object.freeze([]),
  chapters: Object.freeze([]),
  episodes2011: Object.freeze([]),
  source: 'https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists',
});

const records = [...archive000024, ...archive025049, ...archive050074, ...archive075099];

function normalizeRecord(record) {
  const acquisition = record.acquisition || DEFAULT_ACQUISITION;
  const story = record.story || DEFAULT_STORY;
  return Object.freeze({
    ...record,
    acquisition: Object.freeze({ ...acquisition }),
    story: Object.freeze({
      ...story,
      owners: Object.freeze([...(story.owners || [])]),
      chapters: Object.freeze([...(story.chapters || [])]),
      episodes2011: Object.freeze([...(story.episodes2011 || [])]),
    }),
  });
}

if (records.length !== 100) throw new Error(`Expected 100 Specified Slot archive records; found ${records.length}.`);
if (new Set(records.map((record) => record.id)).size !== 100) throw new Error('Specified Slot archive ids must be unique.');

records.forEach((record, index) => {
  const expected = String(index).padStart(3, '0');
  if (record.id !== expected) throw new Error(`Specified Slot archive is missing or misorders ${expected}.`);
  if (!record.effect || !record.materializedAs || !record.kind) throw new Error(`Specified Slot ${record.id} is missing a verified archive field.`);
});

export const specifiedCardArchive = Object.freeze(records.map(normalizeRecord));
specifiedCardArchive.forEach((record) => {
  if (!['verified', 'unknown', 'undocumented'].includes(record.acquisition.status)) throw new Error(`Specified Slot ${record.id} has an invalid acquisition status.`);
  if (!['verified', 'undocumented'].includes(record.story.status)) throw new Error(`Specified Slot ${record.id} has an invalid story status.`);
});

export const specifiedCardArchiveById = new Map(specifiedCardArchive.map((record) => [record.id, record]));
export const getSpecifiedCardArchive = (id) => specifiedCardArchiveById.get(String(id).padStart(3, '0')) || null;
export const SPECIFIED_CARD_KINDS = Object.freeze([...new Set(specifiedCardArchive.map((record) => record.kind))].sort());
