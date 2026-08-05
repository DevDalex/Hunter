const chapterOf = (record) => Number(record?.chapter ?? record?.introducedAtChapter ?? record?.validFromChapter ?? 0);

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => [key, stableValue(item)]));
  }
  return value;
};

const sameValue = (left, right) => JSON.stringify(stableValue(left)) === JSON.stringify(stableValue(right));

export const changeKindByField = Object.freeze({
  status: 'state-change',
  lifeStatus: 'state-change',
  bodyStatus: 'state-change',
  consciousnessStatus: 'state-change',
  assignment: 'assignment-change',
  assignments: 'assignment-change',
  assignedTo: 'assignment-change',
  location: 'location-change',
  locations: 'location-change',
  currentLocation: 'location-change',
  relationships: 'relationship-change',
  relationshipIds: 'relationship-change',
  abilities: 'ability-reveal',
  abilityIds: 'ability-reveal',
  openQuestions: 'question-opened',
  unresolvedQuestions: 'question-opened',
  resolvedQuestions: 'question-resolved',
  evidence: 'evidence-revised',
  sources: 'evidence-revised',
  confidence: 'evidence-revised',
  certainty: 'evidence-revised',
});

export const diffRecordFields = (before = {}, after = {}) => {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  return [...keys]
    .filter((field) => !sameValue(before?.[field], after?.[field]))
    .map((field) => Object.freeze({
      field,
      before: before?.[field],
      after: after?.[field],
      kind: changeKindByField[field] || 'confirmed',
    }));
};

export const diffChapterRecords = ({ before = [], after = [], getId = (item) => item.id }) => {
  const beforeById = new Map(before.map((item) => [getId(item), item]));
  const afterById = new Map(after.map((item) => [getId(item), item]));
  const added = [];
  const removed = [];
  const changed = [];
  const unchanged = [];

  for (const [id, next] of afterById) {
    const previous = beforeById.get(id);
    if (!previous) {
      added.push(Object.freeze({ record: next, kind: 'introduced' }));
      continue;
    }
    const fields = diffRecordFields(previous, next);
    if (!fields.length) unchanged.push(next);
    else changed.push(Object.freeze({ id, before: previous, after: next, fields, kinds: [...new Set(fields.map((field) => field.kind))] }));
  }
  for (const [id, previous] of beforeById) {
    if (!afterById.has(id)) removed.push(Object.freeze({ record: previous, kind: 'removed' }));
  }
  return Object.freeze({ added, removed, changed, unchanged });
};

export const collectChapterChanges = ({ records = [], fromChapter, toChapter }) => {
  const from = Number(fromChapter);
  const to = Number(toChapter);
  if (!Number.isInteger(from) || !Number.isInteger(to) || from > to) throw new Error('Invalid chapter comparison range.');
  return records.filter((record) => {
    const chapter = chapterOf(record);
    return chapter > from && chapter <= to;
  }).map((record) => Object.freeze({
    ...record,
    changeKind: record.changeKind || record.kind || (record.resolvedAtChapter ? 'question-resolved' : 'introduced'),
  }));
};

export const chapterChangeKinds = Object.freeze([
  'introduced', 'removed', 'confirmed', 'state-change', 'assignment-change', 'relationship-change',
  'location-change', 'ability-reveal', 'question-opened', 'question-resolved', 'evidence-revised',
]);
