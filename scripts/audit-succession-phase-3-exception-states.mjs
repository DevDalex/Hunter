import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 3 exceptional-state audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const state404 = archive.getCharacterStateAtChapter('character:halkenburg-hui-guo-rou', 404);
  const state405 = archive.getCharacterStateAtChapter('character:halkenburg-hui-guo-rou', 405);

  assert(state404, 'Halkenburg must expose the exact Chapter 404 exceptional state');
  assert(state404.bodyStateCode === 'deceased', `expected Chapter 404 deceased original body, received ${state404.bodyStateCode}`);
  assert(state404.identityStateCode === 'transferred', `expected Chapter 404 transferred identity, received ${state404.identityStateCode}`);
  assert(state404.consciousnessStateCode === 'active', `expected Chapter 404 active transferred consciousness, received ${state404.consciousnessStateCode}`);
  assert((state404.impossibleStateReasons || []).length === 0, `Halkenburg Chapter 404 state tuple is impossible: ${(state404.impossibleStateReasons || []).join(' · ')}`);

  assert(state405, 'Halkenburg must retain a Chapter 405 carry-forward state');
  assert(state405.bodyStateCode === 'deceased' && state405.identityStateCode === 'transferred', 'Chapter 405 must preserve the deceased-body / transferred-identity facts');
  assert(['active', 'displaced', 'unknown'].includes(state405.consciousnessStateCode), `Chapter 405 must not invent a contradictory consciousness state, received ${state405.consciousnessStateCode}`);
  assert((state405.impossibleStateReasons || []).length === 0, `Halkenburg Chapter 405 carry-forward tuple is impossible: ${(state405.impossibleStateReasons || []).join(' · ')}`);

  console.log('Succession Phase 3 exceptional-state audit passed: Chapter 404 preserves Halkenburg’s deceased original body, transferred identity, and directly demonstrated active consciousness, while Chapter 405 may carry unresolved later control without rewriting the Chapter 404 fact.');
} finally {
  await vite.close();
}
