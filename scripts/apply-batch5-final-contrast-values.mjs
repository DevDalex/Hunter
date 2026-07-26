import { readFile, writeFile } from 'node:fs/promises';

const replacements = [
  ['src/components/SuccessionTimeline.jsx', "style={{ color: 'var(--timeline-paper)' }}", "style={{ color: 'white' }}", 'Timeline count badges'],
  ['src/components/SuccessionTimeline.jsx', "style={{ color: 'var(--timeline-ink)' }}", "style={{ color: 'white' }}", 'Timeline day labels'],
  ['src/components/succession/SuccessionArchiveDeepWorkspaces.jsx', "style={{ color: 'var(--succession-text-on-paper)' }}", "style={{ color: 'black' }}", 'Queen status labels'],
  ['src/components/BlackWhaleGuide.jsx', "style={{ color: 'var(--succession-text-strong)' }}", "style={{ color: 'white' }}", 'Black Whale inspector labels'],
  ['src/components/BlackWhaleGuide.jsx', "style={{ color: 'var(--succession-text-on-paper)' }}", "style={{ color: 'black' }}", 'Black Whale manifest headers'],
  ['src/components/succession/SuccessionArchiveGuardianBeastWorkspace.jsx', "style={{ color: 'var(--succession-text-on-paper)' }}", "style={{ color: 'black' }}", 'Guardian Beast order badges'],
];

for (const [path, before, after, label] of replacements) {
  const current = await readFile(path, 'utf8');
  if (current.includes(after) && !current.includes(before)) continue;
  if (!current.includes(before)) throw new Error(`Missing final contrast target: ${label}`);
  await writeFile(path, current.replaceAll(before, after));
}

console.log('Batch 5 deterministic final contrast values applied.');
