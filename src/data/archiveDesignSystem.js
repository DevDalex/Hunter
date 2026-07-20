export const ARCHIVE_DESIGN_SYSTEM_VERSION = 'Batch 12 · Design System Library · 2026-07-20';

export const archiveSemanticTones = Object.freeze([
  { id: 'confirmed', label: 'Confirmed', role: 'Canon fact', cssClass: 'is-confirmed', evidenceState: 'confirmed' },
  { id: 'inferred', label: 'Inferred', role: 'Reader-safe analysis', cssClass: 'is-inferred', evidenceState: 'inferred' },
  { id: 'unclear', label: 'Unclear', role: 'Unresolved or disputed', cssClass: 'is-unclear', evidenceState: 'unclear' },
  { id: 'deferred', label: 'Deferred', role: 'Known backlog item', cssClass: 'is-deferred', evidenceState: 'deferred' },
  { id: 'source-index-only', label: 'Source index', role: 'Indexed but not fully profiled', cssClass: 'is-source-index-only', evidenceState: 'source-index-only' },
  { id: 'manga-only', label: 'Manga only', role: 'Medium-specific record', cssClass: 'is-manga-only', evidenceState: 'manga-only' },
  { id: 'anime-only', label: 'Anime only', role: 'Adaptation-only record', cssClass: 'is-anime-only', evidenceState: 'anime-only' },
]);

export const archivePrimitiveContracts = Object.freeze([
  {
    id: 'section-shell',
    label: 'ArchiveSection',
    component: 'ArchiveSection',
    purpose: 'Reusable page/route section shell with kicker, title, description, actions, and region labelling.',
    owns: ['section heading', 'aria-labelledby wiring', 'compact/dense section rhythm'],
    requiredClass: 'archive-section',
  },
  {
    id: 'archive-card',
    label: 'ArchiveCard',
    component: 'ArchiveCard',
    purpose: 'Reusable card/linked-card primitive for records, gateways, review items, and source-aware summaries.',
    owns: ['paper panel', 'optional action semantics', 'metadata slot', 'tone styling'],
    requiredClass: 'archive-card',
  },
  {
    id: 'evidence-badge',
    label: 'EvidenceBadge',
    component: 'EvidenceBadge',
    purpose: 'Shared visual language for confirmed, inferred, unclear, deferred, source-index, and medium-specific states.',
    owns: ['evidence state label', 'semantic tone class', 'compact badge text'],
    requiredClass: 'evidence-badge',
  },
  {
    id: 'status-pill',
    label: 'StatusPill',
    component: 'StatusPill',
    purpose: 'Small status token for records, media states, blockers, and design debt without inventing new ad-hoc pills.',
    owns: ['status text', 'tone class', 'noninteractive token semantics'],
    requiredClass: 'status-pill',
  },
  {
    id: 'source-stack',
    label: 'SourceStack',
    component: 'SourceStack',
    purpose: 'Reusable Hunterpedia/Fandom source block with noreferrer links and compact notes.',
    owns: ['approved-source link stack', 'external-link safety', 'source-note grouping'],
    requiredClass: 'source-stack',
  },
  {
    id: 'archive-ledger',
    label: 'ArchiveLedger',
    component: 'ArchiveLedger',
    purpose: 'Reusable definition-list ledger for facts, budgets, counts, release gates, and route metadata.',
    owns: ['dl structure', 'label/value grouping', 'compact responsive columns'],
    requiredClass: 'archive-ledger',
  },
]);

export const archiveDesignSystemRules = Object.freeze([
  'Do not create one-off badges, pills, source blocks, or card shells when an ArchiveUI primitive fits.',
  'Evidence language must use the shared evidence-state vocabulary instead of decorative color alone.',
  'Source blocks must keep the Hunterpedia/Fandom-only boundary visible and use safe external-link attributes.',
  'Design-system debt may be labelled, but it must not be silently converted into a passed accessibility claim.',
  'The library is additive: it does not delete existing characters, routes, records, or source policy rules.',
]);

export const archiveDesignSystemStats = Object.freeze({
  semanticTones: archiveSemanticTones.length,
  primitives: archivePrimitiveContracts.length,
  rules: archiveDesignSystemRules.length,
});

export const toneForEvidenceState = (state = 'confirmed') => archiveSemanticTones.find((tone) => tone.id === state) || archiveSemanticTones[0];
