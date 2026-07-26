import { readFile, writeFile } from 'node:fs/promises';

const appendOnce = async (path, marker, css) => {
  const current = await readFile(path, 'utf8');
  if (current.includes(marker)) return;
  await writeFile(path, `${current.trimEnd()}\n\n${css.trim()}\n`);
};

await appendOnce('src/components/TimelineCommand.css', 'Batch 5 route-owned timeline contrast closure', `
/* Batch 5 route-owned timeline contrast closure. */
@media (max-width: 560px) {
  .succession-archive .timeline-command-voyage .timeline-day-rail button > em {
    color: white;
  }

  .succession-archive .timeline-command-voyage .timeline-day > header .timeline-day__number > span {
    color: var(--succession-text-strong);
  }
}
`);

await appendOnce('src/components/succession/SuccessionArchiveRoyalFamilyRedesign.css', 'Batch 5 route-owned queen contrast closure', `
/* Batch 5 route-owned queen contrast closure. */
@media (max-width: 560px) {
  .succession-archive .succession-queen-status-strip > div > dt,
  .succession-archive .succession-queen-status-strip > div > dd {
    color: var(--succession-text-on-paper);
  }
}
`);

await appendOnce('src/components/succession/SuccessionArchiveLocationCommand.css', 'Batch 5 route-owned location contrast closure', `
/* Batch 5 route-owned location contrast closure. */
@media (max-width: 560px) {
  .succession-archive .succession-location-filter-panel > header > div > span,
  .succession-archive .succession-location-filter-panel > header > b {
    color: var(--succession-text-on-paper);
  }
}
`);

await appendOnce('src/components/BlackWhaleIntelligenceCommand.css', 'Batch 5 route-owned Black Whale contrast closure', `
/* Batch 5 route-owned Black Whale contrast closure. */
@media (max-width: 560px) {
  .succession-archive .black-whale-intelligence .ship-location-inspector__snapshot > div > dt,
  .succession-archive .black-whale-intelligence .ship-location-inspector__snapshot > div > dd {
    color: var(--succession-text-strong);
  }

  .succession-archive .black-whale-intelligence .ship-manifest table thead th {
    color: var(--succession-text-on-paper);
  }
}
`);

await appendOnce('src/components/succession/SuccessionArchiveGuardianBeastCommand.css', 'Batch 5 route-owned Guardian Beast contrast closure', `
/* Batch 5 route-owned Guardian Beast contrast closure. */
@media (max-width: 560px) {
  .succession-archive .succession-gsb-command-card .succession-gsb-command-card__visual > span {
    color: var(--succession-text-on-paper);
  }
}
`);

console.log('Batch 5 route-owned contrast closure applied.');
