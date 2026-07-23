import { readdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });

// Portable release archives belonged to the retired handoff system. Remove any
// stale local copies before Vite copies public/ into the Cloudflare asset tree.
for (const file of await readdir('public')) {
  if (/^hxh-archive-phase-[^/]+-(?:source|sites-source|standalone)\.zip$/.test(file)) {
    await rm(`public/${file}`, { force: true });
  }
}
