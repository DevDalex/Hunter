export const SUCCESSION_COMPREHENSION_DESIGN_SYSTEM_VERSION = 'Succession comprehension v1 · Chapter 417';

export const successionSemanticStates = Object.freeze([
  { id: 'canon', label: 'Canon', role: 'Explicitly maintained canonical fact', icon: 'check', cssClass: 'is-canon' },
  { id: 'inference', label: 'Inference', role: 'Speaker- or evidence-bounded analysis', icon: 'brain', cssClass: 'is-inference' },
  { id: 'theory', label: 'Theory', role: 'Explicitly separated theory or candidate interpretation', icon: 'spark', cssClass: 'is-theory' },
  { id: 'editorial', label: 'Editorial', role: 'Archive-maintenance information, not story canon', icon: 'edit', cssClass: 'is-editorial' },
  { id: 'translation', label: 'Translation', role: 'Translation wording or mechanics-impacting variant', icon: 'languages', cssClass: 'is-translation' },
  { id: 'changed', label: 'Changed', role: 'Material state delta at the selected chapter boundary', icon: 'delta', cssClass: 'is-changed' },
  { id: 'unresolved', label: 'Unresolved', role: 'Maintained unknown, dispute, or open question', icon: 'question', cssClass: 'is-unresolved' },
]);

export const successionSemanticStateMap = Object.freeze(Object.fromEntries(successionSemanticStates.map((state) => [state.id, state])));

export const normalizeSuccessionSemanticState = (value = 'canon') => {
  const raw = String(value || '').trim().toLocaleLowerCase().replaceAll('_', '-');
  if (['confirmed', 'fact', 'canonical'].includes(raw)) return 'canon';
  if (['inferred', 'probable', 'approximate'].includes(raw)) return 'inference';
  if (['unclear', 'unknown', 'disputed', 'open', 'unresolved'].includes(raw)) return 'unresolved';
  if (['translation-variant', 'translation-note'].includes(raw)) return 'translation';
  return successionSemanticStateMap[raw] ? raw : 'canon';
};

export const semanticStateForCanonLevel = (canonLevel = 'canon') => normalizeSuccessionSemanticState(canonLevel);

export const successionInformationHierarchy = Object.freeze([
  { id: 'briefing', label: 'Briefing', purpose: 'Five-second orientation: current state, material change, evidence, unknowns.' },
  { id: 'intelligence', label: 'Intelligence', purpose: 'Relationships, pressure, causality, comparisons, knowledge asymmetry, spatial and Nen systems.' },
  { id: 'research', label: 'Research', purpose: 'Canonical records, sources, provenance, translation variants, contradictions, notes and exports.' },
]);

export const successionPresentationRules = Object.freeze([
  'Color never carries semantic meaning alone; labels, borders, icons, or text states remain visible.',
  'Canon, inference, theory, editorial, translation, changed, and unresolved states use one shared vocabulary.',
  'Every selected major entity enters through Briefing before deeper Intelligence and Research surfaces.',
  'Unknown or absent maintained data remains unresolved rather than being inferred for presentation completeness.',
  'Top-N subsets disclose visible and total record counts or provide a complete drill-down path.',
  'Motion may explain state transitions but must obey prefers-reduced-motion and never hide information.',
  'Comfortable, compact, and analyst density modes change presentation only, never the underlying data set.',
]);
