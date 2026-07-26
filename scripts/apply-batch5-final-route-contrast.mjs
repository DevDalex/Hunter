import { readFile, writeFile } from 'node:fs/promises';

const appendOnce = async (path, marker, css) => {
  const current = await readFile(path, 'utf8');
  if (current.includes(marker)) return;
  await writeFile(path, `${current.trimEnd()}\n\n${css.trim()}\n`);
};

await appendOnce('src/components/TimelineCommand.css', 'Batch 5 final timeline contrast specificity', `
/* Batch 5 final timeline contrast specificity. */
@media (max-width: 560px) {
  #succession-timeline.timeline-command-voyage .timeline-day-rail button em {
    color: var(--timeline-paper);
  }

  #succession-timeline.timeline-command-voyage .timeline-day .timeline-day__number span {
    color: var(--timeline-ink);
  }
}
`);

await appendOnce('src/components/succession/SuccessionArchiveRoyalFamilyRedesign.css', 'Batch 5 final queen contrast specificity', `
/* Batch 5 final queen contrast specificity. */
@media (max-width: 560px) {
  .succession-queen-status-strip.succession-queen-status-strip > div > dt {
    color: var(--succession-text-on-paper);
  }
}
`);

await appendOnce('src/components/BlackWhaleIntelligenceCommand.css', 'Batch 5 final Black Whale contrast specificity', `
/* Batch 5 final Black Whale contrast specificity. */
@media (max-width: 560px) {
  #black-whale.black-whale-intelligence .ship-location-inspector__snapshot > div > dt {
    color: var(--succession-text-strong);
  }

  #black-whale.black-whale-intelligence .ship-manifest table thead th {
    color: var(--succession-text-on-paper);
  }
}
`);

await appendOnce('src/components/succession/SuccessionArchiveGuardianBeastCommand.css', 'Batch 5 final Guardian Beast contrast specificity', `
/* Batch 5 final Guardian Beast contrast specificity. */
@media (max-width: 560px) {
  .succession-gsb-command-card.succession-gsb-command-card .succession-gsb-command-card__visual > span {
    color: var(--succession-text-on-paper);
  }
}
`);

console.log('Batch 5 final route contrast fixes applied.');
