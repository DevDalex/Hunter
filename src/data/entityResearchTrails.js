import { seriesChronology } from './seriesResearch';

const normalize = (value) => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const unique = (values) => [...new Set(values.filter(Boolean))];

const recordTerms = (record) => {
  const names = [record.name, ...record.related];
  if (record.category === 'relationships') names.push(...record.name.split(/↔|→/g));
  if (record.category === 'status') names.push(record.related[0]);
  if (record.category === 'nen') names.push(record.facts.find((fact) => fact.label === 'User')?.value);
  const normalized = unique(names.map(normalize)).filter((item) => item.length >= 3);
  const shortCharacterName = record.category === 'characters' ? normalize(record.name).split(' ')[0] : '';
  if (shortCharacterName.length >= 4) normalized.push(shortCharacterName);
  return unique(normalized);
};

const valuesForCategory = (entry, category) => {
  if (category === 'characters' || category === 'status' || category === 'relationships') return entry.people;
  if (category === 'factions') return entry.factions;
  if (category === 'locations') return entry.places;
  if (category === 'nen') return entry.nen;
  if (category === 'conflicts') return entry.conflicts;
  return [...entry.people, ...entry.factions, ...entry.places, ...entry.nen, ...entry.conflicts];
};

const matches = (value, terms) => {
  const candidate = normalize(value);
  return terms.some((term) => candidate === term || candidate.includes(term) || (term.length >= 5 && term.includes(candidate)));
};

export const getEntityResearchTrail = (record) => {
  if (!record) return [];
  const terms = recordTerms(record);
  if (!terms.length) return [];

  return seriesChronology.map((entry) => {
    const values = valuesForCategory(entry, record.category);
    const matched = values.filter((value) => matches(value, terms));
    if (!matched.length) return null;
    return {
      id: `${record.id}-${entry.id}`,
      arcId: entry.arcId,
      arcTitle: entry.arcTitle,
      phase: entry.title,
      chapters: entry.chapters,
      summary: entry.summary,
      consequence: entry.consequence,
      matched,
      source: entry.source,
      range: entry.range,
    };
  }).filter(Boolean).slice(0, 24);
};

export const summarizeEntityResearchTrail = (trail) => ({
  phases: trail.length,
  arcs: unique(trail.map((item) => item.arcTitle)),
  range: trail.length ? `${Math.min(...trail.map((item) => item.range[0]))}–${Math.max(...trail.map((item) => item.range[1]))}` : null,
});
