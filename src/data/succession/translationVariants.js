const normalizeVariant = (value, index, preferredTerm) => {
  if (!value) return null;
  if (typeof value === 'string') return {
    id: `variant-${index}`,
    term: value,
    source: 'Archive alias',
    preferred: value === preferredTerm,
    note: '',
  };
  const term = value.term || value.name || value.label || value.value;
  if (!term) return null;
  return {
    id: value.id || `variant-${index}`,
    term,
    source: value.source || value.edition || 'Archive alias',
    preferred: Boolean(value.preferred || term === preferredTerm),
    note: value.note || value.notes || value.description || '',
  };
};

export const getTranslationVariants = (entity) => {
  if (!entity) return [];
  const preferredTerm = entity.name || entity.title || entity.label || entity.id;
  const raw = [
    ...(Array.isArray(entity.translationVariants) ? entity.translationVariants : []),
    ...(Array.isArray(entity.aliases) ? entity.aliases : []),
    ...(Array.isArray(entity.alternateNames) ? entity.alternateNames : []),
  ];
  const records = [
    { id: 'preferred', term: preferredTerm, source: 'Archive preferred term', preferred: true, note: '' },
    ...raw.map((value, index) => normalizeVariant(value, index, preferredTerm)).filter(Boolean),
  ];
  const seen = new Set();
  return records.filter((record) => {
    const key = record.term.trim().toLocaleLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const translationVariantSchema = Object.freeze({
  required: ['term', 'source', 'preferred'],
  optional: ['id', 'note'],
});
