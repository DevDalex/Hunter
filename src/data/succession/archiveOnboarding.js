import { readStoredJson, removeStoredValue, writeStoredJson } from '../../lib/browserStorage.js';

export const SUCCESSION_ONBOARDING_KEY = 'hxh-succession-onboarding-v1';
export const SUCCESSION_ONBOARDING_VERSION = 1;

export const successionOnboardingSteps = Object.freeze([
  Object.freeze({ id: 'orient', title: 'Orient to the current state', description: 'Open Story Intelligence and read the chapter-bounded current-state briefing before diving into records.', target: 'story', params: Object.freeze({ mode: 'workspace' }) }),
  Object.freeze({ id: 'people', title: 'Trace a person through the graph', description: 'Open People & Power and inspect a character, household, assignment, relationship, and current location.', target: 'characters', params: Object.freeze({}) }),
  Object.freeze({ id: 'evidence', title: 'Check the evidence boundary', description: 'Open Research to see provenance, uncertainty, source links, and what the archive deliberately leaves unresolved.', target: 'research', params: Object.freeze({ mode: 'overview' }) }),
  Object.freeze({ id: 'reader', title: 'Bridge research back to the manga', description: 'Open the Reader. Page progress is saved separately and can be resumed from the archive controls.', target: 'reader', params: Object.freeze({}) }),
]);

export const defaultSuccessionOnboarding = Object.freeze({
  version: SUCCESSION_ONBOARDING_VERSION,
  status: 'active',
  stepIndex: 0,
  completedStepIds: Object.freeze([]),
  updatedAt: null,
});

const normalizeStatus = (value) => ['active', 'completed', 'skipped'].includes(value) ? value : 'active';
const nowIso = (now = new Date()) => new Date(now).toISOString();

export function normalizeSuccessionOnboarding(value = {}) {
  const completed = [...new Set((Array.isArray(value.completedStepIds) ? value.completedStepIds : []).filter((id) => successionOnboardingSteps.some((step) => step.id === id)))];
  const requestedIndex = Number(value.stepIndex);
  const stepIndex = Math.max(0, Math.min(successionOnboardingSteps.length - 1, Number.isInteger(requestedIndex) ? requestedIndex : completed.length));
  const status = completed.length === successionOnboardingSteps.length ? 'completed' : normalizeStatus(value.status);
  return Object.freeze({
    version: SUCCESSION_ONBOARDING_VERSION,
    status,
    stepIndex,
    completedStepIds: Object.freeze(completed),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null,
  });
}

export const readSuccessionOnboarding = () => normalizeSuccessionOnboarding(readStoredJson(SUCCESSION_ONBOARDING_KEY, defaultSuccessionOnboarding));

export function writeSuccessionOnboarding(value) {
  const normalized = normalizeSuccessionOnboarding(value);
  writeStoredJson(SUCCESSION_ONBOARDING_KEY, normalized);
  return normalized;
}

export function completeSuccessionOnboardingStep(stepId, now = new Date()) {
  const current = readSuccessionOnboarding();
  const step = successionOnboardingSteps.find((record) => record.id === stepId);
  if (!step) return current;
  const completedStepIds = [...new Set([...current.completedStepIds, step.id])];
  const remainingIndex = successionOnboardingSteps.findIndex((record) => !completedStepIds.includes(record.id));
  return writeSuccessionOnboarding({
    ...current,
    status: completedStepIds.length === successionOnboardingSteps.length ? 'completed' : 'active',
    stepIndex: remainingIndex === -1 ? successionOnboardingSteps.length - 1 : remainingIndex,
    completedStepIds,
    updatedAt: nowIso(now),
  });
}

export function skipSuccessionOnboarding(now = new Date()) {
  const current = readSuccessionOnboarding();
  return writeSuccessionOnboarding({ ...current, status: 'skipped', updatedAt: nowIso(now) });
}

export function resetSuccessionOnboarding() {
  removeStoredValue(SUCCESSION_ONBOARDING_KEY);
  return defaultSuccessionOnboarding;
}
