import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const target = path.join(process.cwd(), 'src/components/TimelineIntelligencePanels.css');
const source = await readFile(target, 'utf8');
const replacements = [
  [
    '.timeline-intelligence__causality > div > span { color: var(--timeline-gold); font-size: 10px;',
    '.timeline-intelligence__causality > div > span { color: var(--timeline-gold); font-size: 11px;',
  ],
  [
    '.timeline-intelligence__princes > article > div > a span { color: var(--timeline-muted); font-size: 10px; }',
    '.timeline-intelligence__princes > article > div > a span { color: var(--timeline-muted); font-size: 11px; }',
  ],
];

let next = source;
for (const [from, to] of replacements) {
  if (!next.includes(from) && !next.includes(to)) throw new Error(`Timeline readability selector missing: ${from}`);
  next = next.replace(from, to);
}

if (next !== source) {
  await writeFile(target, next);
  console.log('Timeline intelligence readability floor raised to 11px.');
}
