// Compatibility path retained for the Through401+ overlay chain.
// The Chapter 400 payload lives outside the manual Chapter-400 chunk filename
// so Rolldown can split historical overlay dependencies from direct 400 leaves.
export * from './successionArchiveBoundary400.js';
