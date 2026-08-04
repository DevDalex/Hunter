const chapterOf = (record) => Number(record?.chapter ?? record?.introducedAtChapter ?? record?.validFromChapter ?? 0);

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
      added.push(next);
      continue;
    }
    if (JSON.stringify(previous) === JSON.stringify(next)) unchanged.push(next);
    else changed.push({ id, before: previous, after: next });
  }
  for (const [id, previous] of beforeById) if (!afterById.has(id)) removed.push(previous);
  return Object.freeze({ added, removed, changed, unchanged });
};

export const collectChapterChanges = ({ records = [], fromChapter, toChapter }) => {
  const from = Number(fromChapter);
  const to = Number(toChapter);
  if (!Number.isInteger(from) || !Number.isInteger(to) || from > to) throw new Error('Invalid chapter comparison range.');
  return records.filter((record) => {
    const chapter = chapterOf(record);
    return chapter > from && chapter <= to;
  });
};

export const chapterChangeKinds = Object.freeze([
  'introduced', 'confirmed', 'state-change', 'assignment-change', 'relationship-change',
  'location-change', 'ability-reveal', 'question-opened', 'question-resolved', 'evidence-revised',
]);
