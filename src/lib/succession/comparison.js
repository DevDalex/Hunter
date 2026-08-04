export const comparisonDomains = Object.freeze({
  characters: ['affiliations', 'assignments', 'abilities', 'status', 'objectives', 'relationships'],
  princes: ['queen', 'rank', 'household', 'guards', 'beast', 'strategy', 'status'],
  organizations: ['leadership', 'members', 'benefactor', 'territory', 'objectives', 'rivals', 'operations'],
  abilities: ['type', 'activation', 'conditions', 'cost', 'range', 'target', 'counters', 'certainty'],
  chapters: ['storyPhase', 'lanes', 'events', 'stateChanges', 'questions', 'evidence'],
});

export const compareEntities = (domain, entities = []) => {
  const fields = comparisonDomains[domain];
  if (!fields) throw new Error(`Unsupported comparison domain: ${domain}`);
  if (entities.length < 2) throw new Error('A comparison requires at least two entities.');
  return Object.freeze({
    domain,
    entityIds: entities.map((entity) => entity.id),
    rows: fields.map((field) => Object.freeze({
      field,
      values: entities.map((entity) => entity[field] ?? null),
    })),
  });
};

export const comparisonHref = (domain, entityIds, chapter) => {
  const ids = entityIds.map(encodeURIComponent).join('/');
  const query = chapter ? `?chapter=${encodeURIComponent(chapter)}` : '';
  return `/compare/${encodeURIComponent(domain)}/${ids}${query}`;
};
