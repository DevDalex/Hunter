import { namedAbilityProfiles } from './nenSpectrumExpansion';

// The map intentionally shows only four ability cards per pinned category. Profiles
// that are relevant through supporting categories can otherwise consume those slots
// before the renderer confirms that their users are visible in the current focus.
// Keep the complete mechanics metadata, but defer the two broad cross-category
// profiles until after the locally representative category rails have been selected.
const deferredIds = ['guanyin', 'rage-blast'];
const deferred = [];

for (const id of deferredIds) {
  const index = namedAbilityProfiles.findIndex((profile) => profile.id === id);
  if (index < 0) continue;
  deferred.push(...namedAbilityProfiles.splice(index, 1));
}

namedAbilityProfiles.push(...deferred);
