import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  getAliasResolution,
  getCanonicalCharacterState,
  getCharacterAuthorityProfile,
  getCharacterLoyaltyProfile,
  getEntitiesByType,
  getInformationConsistencyReport,
  getRoyalDossierConsistencyProfile,
  successionArchiveData,
  successionArchiveValidation,
} from '../src/data/succession/successionData.js';
import {
  BODY_STATE_VALUES,
  CONSCIOUSNESS_STATE_VALUES,
  IDENTITY_STATE_VALUES,
  LOYALTY_STATE_VALUES,
  OFFICIAL_ROLE_KIND_VALUES,
} from '../src/data/succession/registries.js';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 3 information consistency audit failed: ${message}`);
};

const expectedRoyalSections = Object.freeze([
  'identity',
  'successionStatus',
  'household',
  'officialAuthority',
  'operationalLoyalty',
  'embodiedState',
  'location',
  'assignments',
  'relationships',
  'nenAndGuardian',
  'evidence',
  'openQuestions',
]);

const [shellSource, panelSource, panelCss] = await Promise.all([
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionInformationConsistencyPanel.jsx'),
  read('src/components/succession/SuccessionInformationConsistencyPanel.css'),
]);

assert(shellSource.includes('SuccessionInformationConsistencyPanel'), 'the shared shell must mount the Phase 3 dossier panel');
assert(panelSource.includes('getCanonicalCharacterState') && panelSource.includes('getCharacterAuthorityProfile') && panelSource.includes('getCharacterLoyaltyProfile'), 'the panel must consume structured state, authority, and loyalty selectors');
assert(panelSource.includes('Private intent') && panelSource.includes('Not inferred'), 'the panel must state that private intent is not inferred');
assert(panelSource.includes('getRoyalDossierConsistencyProfile'), 'royal dossiers must expose the shared section contract');
assert(panelCss.includes('@media (min-width: 1024px)'), 'the Phase 3 panel must remain desktop and laptop only');
assert(!panelCss.includes('@media (max-width:'), 'the Phase 3 panel must not introduce tablet or mobile rules');

assert(successionArchiveData.informationConsistencyVersion === 'phase-3-v1', 'the normalized Phase 3 data layer must be the active predecessor');
assert(successionArchiveValidation.valid, `canonical validation failed: ${successionArchiveValidation.errors.join(' · ')}`);

const report = getInformationConsistencyReport();
assert(report.version === 'phase-3-v1', 'the information consistency report must identify the active Phase 3 model');
assert(report.hardErrorCount === 0, `the consistency report contains ${report.hardErrorCount} hard error(s)`);
assert(report.aliasCollisions.length === 0, `ambiguous aliases remain: ${report.aliasCollisions.map((record) => record.key).join(', ')}`);
assert(report.impossibleStates.length === 0, `impossible character state tuples remain: ${report.impossibleStates.map((record) => record.characterId).join(', ')}`);
assert(report.crossLinkErrors.length === 0, `broken information cross-links remain: ${report.crossLinkErrors.join(', ')}`);
assert(report.unresolvedRoyalMothers.length === 0, `unresolved maternal branches remain: ${report.unresolvedRoyalMothers.map((record) => record.characterId).join(', ')}`);

const characters = getEntitiesByType('character');
assert(characters.length > 0, 'the character archive must remain available');
for (const character of characters) {
  const state = getCanonicalCharacterState(character.id);
  assert(state, `${character.id} must expose a canonical chapter-bounded state`);
  assert(BODY_STATE_VALUES.includes(state.bodyStateCode), `${character.id} has an unregistered body state`);
  assert(IDENTITY_STATE_VALUES.includes(state.identityStateCode), `${character.id} has an unregistered identity state`);
  assert(CONSCIOUSNESS_STATE_VALUES.includes(state.consciousnessStateCode), `${character.id} has an unregistered consciousness state`);
  assert(LOYALTY_STATE_VALUES.includes(state.loyaltyStateCode), `${character.id} has an unregistered loyalty evidence state`);
  assert(state.impossibleStateReasons.length === 0, `${character.id} exposes an impossible state tuple`);

  const authority = getCharacterAuthorityProfile(character.id);
  const loyalty = getCharacterLoyaltyProfile(character.id);
  assert(authority && loyalty, `${character.id} must expose separate authority and loyalty profiles`);
  assert(OFFICIAL_ROLE_KIND_VALUES.includes(authority.officialRoleKind), `${character.id} has an unregistered official role kind`);
  assert(Array.isArray(authority.officialRoles), `${character.id} official roles must remain a separate list`);
  assert(Array.isArray(loyalty.declaredAffiliations), `${character.id} declared affiliations must remain separate from official roles`);
  assert(Array.isArray(loyalty.operationalAlignments), `${character.id} operational alignments must remain separate from official roles`);
  assert(loyalty.privateIntent === 'not inferred', `${character.id} loyalty profile must not claim private intent`);

  const resolution = getAliasResolution(character.name);
  assert(resolution.status === 'resolved' && resolution.entity?.id === character.id, `${character.id} canonical name must resolve uniquely`);
}

const royals = characters.filter((character) => (character.roles || []).some((role) => ['prince', 'queen'].includes(role)));
assert(royals.length >= 22, 'the royal dossier contract must cover fourteen princes and eight queens');
for (const royal of royals) {
  const profile = getRoyalDossierConsistencyProfile(royal.id);
  assert(profile, `${royal.id} must expose a royal consistency profile`);
  assert(profile.completeness.total === expectedRoyalSections.length, `${royal.id} must expose all ${expectedRoyalSections.length} dossier sections`);
  for (const section of expectedRoyalSections) {
    assert(Object.hasOwn(profile.sections, section), `${royal.id} is missing the ${section} dossier section`);
  }
  assert(profile.sections.officialAuthority.value !== profile.sections.operationalLoyalty.value, `${royal.id} must not conflate authority and loyalty records`);
}

console.log(`Succession Phase 3 information consistency audit passed: ${characters.length} characters, ${royals.length} royal dossiers, structured body/identity/consciousness states, separated authority and loyalty evidence, normalized aliases, contradiction-safe cross-links, and desktop dossier integration verified.`);
