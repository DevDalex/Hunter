import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 3 exceptional-state audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const state = archive.getCanonicalCharacterState('character:halkenburg-hui-guo-rou');
  assert(state, 'Halkenburg must expose a canonical state');
  assert(state.bodyStateCode === 'deceased', `expected deceased original body, received ${state.bodyStateCode}`);
  assert(state.identityStateCode === 'transferred', `expected transferred identity, received ${state.identityStateCode}`);
  assert(state.consciousnessStateCode === 'active', `expected active consciousness, received ${state.consciousnessStateCode}`);
  assert(state.impossibleStateReasons.length === 0, `Halkenburg state tuple is impossible: ${state.impossibleStateReasons.join(' · ')}`);
  console.log('Succession Phase 3 exceptional-state audit passed: Halkenburg preserves a deceased original body, transferred identity, and active consciousness as separate chapter-bounded facts.');
} finally {
  await vite.close();
}
