import { readFile, writeFile } from 'node:fs/promises';

const replaceAllRequired = async (path, before, after, label) => {
  const current = await readFile(path, 'utf8');
  if (!current.includes(before)) {
    if (current.includes(after)) return;
    throw new Error(`Missing final contrast target: ${label}`);
  }
  await writeFile(path, current.replaceAll(before, after));
};

await replaceAllRequired(
  'src/components/SuccessionTimeline.jsx',
  "style={{ color: 'var(--timeline-paper)' }}",
  "style={{ color: 'white' }}",
  'Timeline count badges',
);
await replaceAllRequired(
  'src/components/SuccessionTimeline.jsx',
  "style={{ color: 'var(--timeline-ink)' }}",
  "style={{ color: 'white' }}",
  'Timeline day labels',
);
await replaceAllRequired(
  'src/components/succession/SuccessionArchiveDeepWorkspaces.jsx',
  "style={{ color: 'var(--succession-text-on-paper)' }}",
  "style={{ color: 'black' }}",
  'Queen status labels',
);
await replaceAllRequired(
  'src/components/BlackWhaleGuide.jsx',
  "style={{ color: 'var(--succession-text-strong)' }}",
  "style={{ color: 'white' }}",
  'Black Whale dark snapshot labels',
);
await replaceAllRequired(
  'src/components/BlackWhaleGuide.jsx',
  "style={{ color: 'var(--succession-text-on-paper)' }}",
  "style={{ color: 'black' }}",
  'Black Whale paper table labels',
);
await replaceAllRequired(
  'src/components/succession/SuccessionArchiveGuardianBeastWorkspace.jsx',
  "style={{ color: 'var(--succession-text-on-paper)' }}",
  "style={{ color: 'black' }}",
  'Guardian Beast order badges',
);

console.log('Applied deterministic final contrast values.');
