const freeze = (values) => Object.freeze(values);
const freezeRecord = (record) => Object.freeze(record);

export const SUCCESSION_VISUAL_FOUNDATION_VERSION = '2026-07-25 · Batch 1 · v1';

export const successionVisualPrinciples = freeze([
  freezeRecord({ id: 'authority', rule: 'The interface should feel formal, controlled, political, and archival rather than decorative or game-like.' }),
  freezeRecord({ id: 'hierarchy', rule: 'Primary facts must dominate supporting evidence, metadata, and optional research depth.' }),
  freezeRecord({ id: 'restraint', rule: 'Atmosphere comes from composition, typography, spacing, and restrained color—not visual noise.' }),
  freezeRecord({ id: 'chapter-bounded', rule: 'Visual states must preserve chapter boundaries and must not imply unavailable knowledge.' }),
  freezeRecord({ id: 'evidence-aware', rule: 'Confirmed, inferred, uncertain, disputed, and pending information must remain visually distinct.' }),
  freezeRecord({ id: 'responsive', rule: 'Mobile layouts reorder by importance instead of shrinking desktop arrangements.' }),
  freezeRecord({ id: 'accessible', rule: 'Focus, contrast, zoom, reduced motion, and color-independent meaning are foundation requirements.' }),
]);

export const successionVisualTokenGroups = freeze([
  freezeRecord({ id: 'canvas', cssPrefix: '--succession-canvas', purpose: 'Page background and raised canvas levels' }),
  freezeRecord({ id: 'surface', cssPrefix: '--succession-surface', purpose: 'Panels, cards, overlays, inset records, and selected states' }),
  freezeRecord({ id: 'text', cssPrefix: '--succession-text', purpose: 'Primary, muted, subtle, and paper-surface ink' }),
  freezeRecord({ id: 'accent', cssPrefix: '--succession-gold', purpose: 'Royal and intelligence-document emphasis' }),
  freezeRecord({ id: 'border', cssPrefix: '--succession-border', purpose: 'Default, strong, selected, and focus boundaries' }),
  freezeRecord({ id: 'state', cssPrefix: '--succession-state', purpose: 'Evidence, status, allegiance, risk, and availability states' }),
  freezeRecord({ id: 'type', cssPrefix: '--succession-font', purpose: 'Display, body, and monospaced information roles' }),
  freezeRecord({ id: 'spacing', cssPrefix: '--succession-space', purpose: 'Shared page, section, and component rhythm' }),
  freezeRecord({ id: 'radius', cssPrefix: '--succession-radius', purpose: 'Controlled shape hierarchy' }),
  freezeRecord({ id: 'motion', cssPrefix: '--succession-motion', purpose: 'Restrained interaction timing with reduced-motion support' }),
]);

const semanticState = (id, category, label, description) => freezeRecord({ id, category, label, description });

export const successionSemanticStates = freeze([
  semanticState('confirmed', 'evidence', 'Confirmed', 'Directly supported by canonical material inside the active chapter boundary.'),
  semanticState('inferred', 'evidence', 'Inferred', 'Strongly supported interpretation that remains distinct from direct confirmation.'),
  semanticState('uncertain', 'evidence', 'Uncertain', 'Incomplete, ambiguous, or unresolved information.'),
  semanticState('disputed', 'evidence', 'Disputed', 'Conflicting interpretations or records require visible qualification.'),
  semanticState('pending', 'publication', 'Pending', 'The record or release is intentionally awaiting verified material.'),
  semanticState('active', 'status', 'Active', 'Currently operating or relevant at the selected chapter boundary.'),
  semanticState('deceased', 'status', 'Deceased', 'Confirmed dead at the selected chapter boundary.'),
  semanticState('missing', 'status', 'Missing', 'Location or condition is unresolved.'),
  semanticState('captured', 'status', 'Captured', 'Freedom or operational control is restricted.'),
  semanticState('compromised', 'status', 'Compromised', 'Security, loyalty, body state, or information integrity is impaired.'),
  semanticState('allied', 'relationship', 'Allied', 'Aligned or cooperating for the selected chapter state.'),
  semanticState('hostile', 'relationship', 'Hostile', 'Directly opposed or threatening.'),
  semanticState('neutral', 'relationship', 'Neutral', 'No confirmed alliance or hostility is asserted.'),
  semanticState('completed', 'objective', 'Completed', 'The documented objective has concluded successfully.'),
  semanticState('failed', 'objective', 'Failed', 'The documented objective did not succeed.'),
]);

export const successionVisualComponentContracts = freeze([
  freezeRecord({ id: 'archive-shell', selector: '.succession-archive', purpose: 'Owns scoped tokens and prevents styling leakage outside Succession.' }),
  freezeRecord({ id: 'page-header', selector: '.succession-page-header', purpose: 'Establishes title, description, actions, and chapter-bounded metadata hierarchy.' }),
  freezeRecord({ id: 'navigation', selector: '.succession-archive-nav', purpose: 'Provides consistent active, hover, focus, and grouped route states.' }),
  freezeRecord({ id: 'button', selector: '.succession-button', purpose: 'Defines primary, quiet, search, disabled, and focusable actions.' }),
  freezeRecord({ id: 'tabs', selector: '.succession-tabs', purpose: 'Defines selected and overflow behavior for local workspace navigation.' }),
  freezeRecord({ id: 'entity-visual', selector: '.succession-entity-visual', purpose: 'Defines portrait ratios, framing, and intentional fallback presentation.' }),
  freezeRecord({ id: 'entity-card', selector: '.succession-entity-grid > article', purpose: 'Provides the shared directory-card foundation.' }),
  freezeRecord({ id: 'state', selector: '.succession-state', purpose: 'Provides loading, empty, warning, and error presentation.' }),
  freezeRecord({ id: 'evidence', selector: '.evidence-badge', purpose: 'Communicates epistemic state without relying only on color.' }),
  freezeRecord({ id: 'status', selector: '.status-pill', purpose: 'Communicates operational and character state.' }),
]);

export const successionVisualFoundationReport = Object.freeze({
  version: SUCCESSION_VISUAL_FOUNDATION_VERSION,
  batch: 1,
  status: 'in-progress',
  scope: 'presentation-only',
  counts: Object.freeze({
    principles: successionVisualPrinciples.length,
    tokenGroups: successionVisualTokenGroups.length,
    semanticStates: successionSemanticStates.length,
    componentContracts: successionVisualComponentContracts.length,
  }),
  exclusions: freeze([
    'canonical-data',
    'research-conclusions',
    'chapter-records',
    'route-ownership',
    'search-logic',
    'import-workflows',
  ]),
});
