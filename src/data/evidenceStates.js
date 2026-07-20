export const EVIDENCE_STATES_VERSION = 'Batch 11 / 2026-07-20';

export const evidenceStateGroups = [
  {
    id: 'confirmed-records',
    title: 'Confirmed records',
    description: 'Use when the local copy should present the item as directly supported by approved source material.',
    states: ['confirmed', 'manga-confirmed', 'anime-confirmed'],
  },
  {
    id: 'interpretive-records',
    title: 'Interpretive records',
    description: 'Use when the archive is summarizing implications or connecting records without pretending the wording is directly quoted.',
    states: ['inferred', 'local-summary', 'analytical-link'],
  },
  {
    id: 'boundary-records',
    title: 'Boundary records',
    description: 'Use when a record should stay visible but not overclaim certainty or completion.',
    states: ['unclear', 'source-index-only', 'not-yet-reviewed', 'deferred'],
  },
  {
    id: 'medium-specific-records',
    title: 'Medium-specific records',
    description: 'Use when the manga/anime distinction matters for maintenance and spoiler control.',
    states: ['manga-only', 'anime-only', 'adaptation-note'],
  },
];

export const evidenceStates = [
  { id: 'confirmed', label: 'Confirmed', tone: 'solid', summary: 'Directly supported by an approved source page or maintained local record.', display: 'Show as fact', allowedOn: ['arc', 'character', 'chapter', 'conflict', 'location', 'organization', 'object', 'nen'] },
  { id: 'manga-confirmed', label: 'Manga-confirmed', tone: 'solid', summary: 'Confirmed by manga/source-index data and safe to show in manga-current views.', display: 'Show as manga fact', allowedOn: ['chapter', 'character', 'conflict', 'status', 'nen'] },
  { id: 'anime-confirmed', label: 'Anime-confirmed', tone: 'solid', summary: 'Confirmed in adaptation material or anime-page coverage, but not used to override manga records.', display: 'Show as adaptation fact', allowedOn: ['arc', 'character', 'adaptation', 'episode'] },
  { id: 'inferred', label: 'Inferred', tone: 'caution', summary: 'Reasonable conclusion from connected records, but not phrased as directly stated fact.', display: 'Mark as inference', allowedOn: ['relationship', 'mystery', 'timeline', 'analysis'] },
  { id: 'local-summary', label: 'Local summary', tone: 'neutral', summary: 'Original archive wording that summarizes sourced events without copying source text.', display: 'Show with source link', allowedOn: ['arc', 'chapter', 'character', 'conflict', 'location'] },
  { id: 'analytical-link', label: 'Analytical link', tone: 'neutral', summary: 'A site-created connection between records such as character to conflict or object to aftermath.', display: 'Show as archive link', allowedOn: ['cross-link', 'graph', 'timeline', 'study'] },
  { id: 'unclear', label: 'Unclear', tone: 'warning', summary: 'Known uncertainty exists; do not present as settled.', display: 'Show uncertainty badge', allowedOn: ['mystery', 'status', 'relationship', 'current-arc'] },
  { id: 'source-index-only', label: 'Source-index only', tone: 'muted', summary: 'The identity exists in the directory, but no local biography/dossier is complete yet.', display: 'Keep visible; do not expand', allowedOn: ['character', 'location', 'organization', 'object'] },
  { id: 'not-yet-reviewed', label: 'Not yet reviewed', tone: 'muted', summary: 'Record is present but has not been checked against the current archive standard.', display: 'Queue for review', allowedOn: ['any'] },
  { id: 'deferred', label: 'Deferred', tone: 'muted', summary: 'Intentionally out of current batch scope.', display: 'Show as future work', allowedOn: ['feature', 'mobile', 'deep-profile', 'nested-route'] },
  { id: 'manga-only', label: 'Manga-only', tone: 'medium', summary: 'Information should not be displayed as anime coverage.', display: 'Keep manga boundary', allowedOn: ['chapter', 'current-arc', 'succession'] },
  { id: 'anime-only', label: 'Anime-only', tone: 'medium', summary: 'Information belongs to adaptation coverage and should not override manga structure.', display: 'Keep adaptation boundary', allowedOn: ['episode', 'adaptation'] },
  { id: 'adaptation-note', label: 'Adaptation note', tone: 'medium', summary: 'A difference or presentation detail from the anime adaptation.', display: 'Show in adaptation layer', allowedOn: ['arc', 'episode', 'character'] },
];

export const evidenceStateById = new Map(evidenceStates.map((state) => [state.id, state]));
export const evidenceStateIds = evidenceStates.map((state) => state.id);
export const isEvidenceState = (value) => evidenceStateById.has(value);

export const evidenceStateStats = {
  version: EVIDENCE_STATES_VERSION,
  groups: evidenceStateGroups.length,
  states: evidenceStates.length,
  warningStates: evidenceStates.filter((state) => ['warning', 'caution'].includes(state.tone)).length,
};
