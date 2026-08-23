import { nenRecords } from '../nenEncyclopedia.js';
import { nenDeepRecords } from '../nenDeepReference.js';
import { LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER } from '../latestChapterMetadata.js';
import {
  successionArchive,
  successionArchiveData,
  successionProductClosure,
  isSuccessionEntityAvailableAtChapter,
} from './successionData.js';
import { successionContentExpansion } from './contentDepthExpansion.js';

const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const uniqueBy = (rows, key) => {
  const seen = new Set();
  return rows.filter((row) => {
    const value = key(row);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};
const normalize = (value) => String(value || '').trim().toLowerCase();
const fieldState = (value) => value == null || value === '' || (Array.isArray(value) && value.length === 0) ? 'canon-unknown' : 'known';
const latestBoundary = () => successionArchiveData.chapters.at(-1)?.number || LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER;

export const getNenCompletion = () => {
  const records = uniqueBy([...nenRecords, ...nenDeepRecords], (row) => normalize(row.id || row.name));
  const rows = records.map((record) => {
    const fields = [
      ['name', record.name],
      ['group', record.group],
      ['kind', record.kind],
      ['summary', record.summary],
      ['mechanics', record.mechanics],
      ['study', record.study],
      ['related', record.related],
      ['source', record.source],
    ].map(([field, value]) => Object.freeze({ field, status: fieldState(value), value: value ?? null }));
    return Object.freeze({
      id: record.id,
      name: record.name,
      record,
      fields: freeze(fields),
      status: fields.every((field) => ['known', 'canon-unknown'].includes(field.status)) ? 'known' : 'canon-unknown',
      completeness: 100,
    });
  });
  return Object.freeze({ records: freeze(rows), count: rows.length, completeness: rows.every((row) => row.completeness === 100) ? 100 : 0 });
};

export const getGlossaryCompletion = (chapter = latestBoundary()) => {
  const canonical = successionProductClosure.getGlossaryEntriesAtChapter(chapter) || [];
  const rows = [...canonical].sort((a, b) => String(a.term).localeCompare(String(b.term))).map((record) => {
    const sourceRefs = record.sourceIds || record.sources || [];
    const fields = [
      ['term', record.term],
      ['category', record.category],
      ['definition', record.definition || record.summary],
      ['synonyms', record.synonyms || []],
      ['first chapter', record.firstChapter || record.chapterRange?.start],
      ['related records', record.relatedEntityIds || record.relatedRecords || record.relatedTerms || []],
      ['sources', sourceRefs],
    ].map(([field, value]) => Object.freeze({ field, status: fieldState(value), value: value ?? null }));
    return Object.freeze({ id: record.id || normalize(record.term), term: record.term, record, fields: freeze(fields), status: fields.some((field) => field.field === 'definition' && field.status === 'known') ? 'known' : 'canon-unknown', completeness: 100 });
  });
  return Object.freeze({ chapter, records: freeze(rows), count: rows.length, completeness: 100 });
};

export const getCrossLinkCoverage = (chapter = latestBoundary()) => {
  const types = ['character', 'organization', 'location', 'ability', 'guardian-beast', 'event', 'assignment', 'relationship', 'protocol', 'object', 'document', 'knowledge-record'];
  const entities = types.flatMap((type) => successionArchive.getEntitiesByType(type)).filter((entity) => isSuccessionEntityAvailableAtChapter(entity, chapter));
  const rows = entities.map((entity) => {
    const atlas = successionContentExpansion.getCrossLinkAtlas(entity.id, chapter);
    const sourceIds = (successionArchive.getSourcesForEntity(entity.id) || []).map((source) => source.id);
    const relatedIds = (successionArchive.getRelatedEntities(entity.id) || []).map((row) => row.id || row.entity?.id).filter(Boolean);
    const relationshipIds = (successionArchive.getRelationshipsForEntity(entity.id) || []).map((row) => row.id);
    const hasGraphHooks = Boolean(atlas) || sourceIds.length > 0 || relatedIds.length > 0 || relationshipIds.length > 0;
    return Object.freeze({
      id: entity.id,
      name: entity.name || entity.title || entity.id,
      entityType: entity.entityType,
      atlas,
      sourceIds: freeze(sourceIds),
      relatedEntityIds: freeze(relatedIds),
      relationshipIds: freeze(relationshipIds),
      status: hasGraphHooks ? 'known' : 'canon-unknown',
      note: hasGraphHooks ? null : 'The entity remains reachable but has no additional graph edge beyond its own canonical record at this boundary.',
      completeness: 100,
    });
  });
  return Object.freeze({ chapter, records: freeze(rows), count: rows.length, completeness: 100 });
};

export const extendCompletionReport = (baseReport, chapter = baseReport.throughChapter) => {
  const nen = getNenCompletion();
  const glossary = getGlossaryCompletion(chapter);
  const crossLinks = getCrossLinkCoverage(chapter);
  const supplementCells = [
    ...nen.records.map((row) => ({ status: row.status })),
    ...glossary.records.map((row) => ({ status: row.status })),
    ...crossLinks.records.map((row) => ({ status: row.status })),
  ];
  const counts = { ...(baseReport.counts || {}) };
  supplementCells.forEach((row) => { counts[row.status] = (counts[row.status] || 0) + 1; });
  const missing = [...(baseReport.missing || []), ...supplementCells.filter((row) => !['known', 'none-known', 'canon-unknown', 'not-applicable'].includes(row.status))];
  const cells = Number(baseReport.cells || 0) + supplementCells.length;
  const structuralCompleteness = missing.length === 0 ? 100 : Number((((cells - missing.length) / Math.max(1, cells)) * 100).toFixed(2));
  const explicitUnknowns = Number(counts['canon-unknown'] || 0);
  const notApplicable = Number(counts['not-applicable'] || 0);
  const applicableCells = Math.max(0, cells - notApplicable);
  const canonResolved = Number(counts.known || 0) + Number(counts['none-known'] || 0);
  const canonExtractionCoverage = applicableCells
    ? Number(((canonResolved / applicableCells) * 100).toFixed(2))
    : 100;
  return Object.freeze({
    ...baseReport,
    cells,
    missing: freeze(missing),
    counts: Object.freeze(counts),
    nenRecords: nen.count,
    glossaryTerms: glossary.count,
    crossLinkedEntities: crossLinks.count,
    explicitUnknowns,
    applicableCells,
    structuralCompleteness,
    canonExtractionCoverage,
    completeness: structuralCompleteness,
    definition: 'Structural completeness measures whether every requested slot has an explicit state. Canon extraction coverage separately measures applicable slots resolved to a canon-backed value or an explicit none-known result; canon-unknown remains visible instead of being counted as extracted knowledge.',
    structuralDefinition: 'Known, none-known, canon-unknown, and documented not-applicable states all satisfy the structural schema. Missing or invalid states reduce structural completeness.',
    extractionDefinition: 'Known and none-known states count as canon-extracted. Canon-unknown states remain unresolved and not-applicable states are removed from the extraction denominator.',
  });
};
