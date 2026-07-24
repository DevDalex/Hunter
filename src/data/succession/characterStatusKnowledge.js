import { deathLedger, exceptionalStatus } from '../successionStatus.js';

const slugify = (value = '') => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const characterId = (name) => `character:${slugify(name)}`;
const chapterSourceId = (number) => `source:chapter-${number}`;
const directorySourceId = 'source:hunterpedia-current-arc-character-directory';

const deathKnowledge = deathLedger
  .filter((record) => /^\d{3}$/.test(String(record.chapter)) && !/body$/i.test(record.name))
  .map((record) => [
    characterId(record.name),
    Object.freeze({
      life: 'dead',
      knownFromChapter: Number(record.chapter),
      bodyState: 'deceased body',
      consciousnessState: 'ended or unknown unless a separate continuation record is published',
      note: record.cause,
      sourceIds: Object.freeze([chapterSourceId(Number(record.chapter))]),
    }),
  ]);

const historicalDeathKnowledge = [
  ['Uvogin', 'Confirmed deceased before the Succession Contest chapter range.'],
  ['Pakunoda', 'Confirmed deceased before the Succession Contest chapter range.'],
].map(([name, note]) => [
  characterId(name),
  Object.freeze({
    life: 'dead',
    knownFromChapter: 340,
    bodyState: 'deceased before the current arc',
    consciousnessState: 'ended; no current-arc consciousness continuation is established',
    note,
    sourceIds: Object.freeze([directorySourceId]),
  }),
]);

const exceptionalKnowledge = [
  ['character:balsamilco-might', 403, 'unknown', 'living body under an apparent possession and identity crisis', 'original consciousness displaced or unresolved'],
  ['character:halkenburg-hui-guo-rou', 404, 'unknown', 'original body treated as dead', 'consciousness strongly indicated to continue in Balsamilco’s body'],
].map(([id, knownFromChapter, life, bodyState, consciousnessState]) => [
  id,
  Object.freeze({
    life,
    knownFromChapter,
    bodyState,
    consciousnessState,
    note: exceptionalStatus[id === 'character:balsamilco-might' ? 'Balsamilco Might' : 'Halkenburg Hui Guo Rou'],
    sourceIds: Object.freeze([chapterSourceId(knownFromChapter)]),
  }),
]);

export const characterStatusKnowledge = Object.freeze(Object.fromEntries([
  ...deathKnowledge,
  ...historicalDeathKnowledge,
  ...exceptionalKnowledge,
]));
