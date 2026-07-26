import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/components/succession/SuccessionArchiveFinalPolish.css';
const current = await readFile(path, 'utf8');
const marker = 'Batch 5 exact mobile contrast closure';

if (!current.includes(marker)) {
  const layer = `

/* Batch 5 exact mobile contrast closure — route-scoped to outrank legacy workspace rules. */
@media (max-width: 560px) {
  .succession-archive[data-archive-route='story'] .succession-story-command .succession-story-command__search > div > span {
    color: var(--succession-text-on-paper);
  }

  .succession-archive[data-archive-route='chapters'] .succession-chapter-command__controls > header > div:first-child > span,
  .succession-archive[data-archive-route='chapters'] .succession-chapter-dossier__phase > div:first-child > span,
  .succession-archive[data-archive-route='chapters'] .succession-chapter-dossier__boundary > div > span,
  .succession-archive[data-archive-route='chapters'] .succession-chapter-dossier__boundary > div > p,
  .succession-archive[data-archive-route='chapters'] .succession-chapter-intel__section-title > div > span,
  .succession-archive[data-archive-route='chapters'] .succession-chapter-intel__threads > p {
    color: var(--succession-text-on-paper);
  }

  .succession-archive[data-archive-route='chapters'] .succession-chapter-dossier__evidence-board > div > strong,
  .succession-archive[data-archive-route='chapters'] .succession-chapter-intel__dossier > footer > button {
    color: var(--succession-text-strong);
  }

  .succession-archive[data-archive-route='timeline'] .timeline-source-note__links > a,
  .succession-archive[data-archive-route='timeline'] .timeline-prelude > summary > span,
  .succession-archive[data-archive-route='timeline'] .timeline-command-voyage__controls header > b,
  .succession-archive[data-archive-route='timeline'] .timeline-command-voyage__selected > div:first-child > span,
  .succession-archive[data-archive-route='timeline'] .timeline-inspector > span {
    color: var(--succession-text-on-paper);
  }

  .succession-archive[data-archive-route='timeline'] .timeline-day-rail button > em {
    color: white;
  }

  .succession-archive[data-archive-route='timeline'] .timeline-day__number > span {
    color: var(--succession-text-strong);
  }

  .succession-archive[data-archive-route='queens'] .succession-queen-status-strip dt,
  .succession-archive[data-archive-route='queens'] .succession-queen-status-strip dd {
    color: var(--succession-text-on-paper);
  }

  .succession-archive[data-archive-route='bodyguards'] .succession-assignment-type-board > header > div > span,
  .succession-archive[data-archive-route='bodyguards'] .succession-assignment-filter-panel > header > div > span,
  .succession-archive[data-archive-route='bodyguards'] .succession-assignment-snapshot-board > header > div > span,
  .succession-archive[data-archive-route='bodyguards'] .succession-assignment-personnel > header > div > span {
    color: var(--succession-text-on-paper);
  }

  .succession-archive[data-archive-route='organizations'] .succession-institution-control-deck > header > div:first-child > span {
    color: var(--succession-text-on-paper);
  }

  .succession-archive[data-archive-route='relationships'] .succession-relationship-filter-panel > header > div > span,
  .succession-archive[data-archive-route='relationships'] .succession-relationship-filter-panel > header > b,
  .succession-archive[data-archive-route='relationships'] .succession-relationship-view-switcher > header > div > span,
  .succession-archive[data-archive-route='relationships'] .succession-relationship-connectivity > header > div > span,
  .succession-archive[data-archive-route='relationships'] .succession-relationship-accessible > header > div > span {
    color: var(--succession-text-on-paper);
  }

  .succession-archive[data-archive-route='locations'] .succession-location-command header > div > span,
  .succession-archive[data-archive-route='locations'] .succession-location-command header > b {
    color: var(--succession-text-on-paper);
  }

  .succession-archive[data-archive-route='black-whale'] .ship-temporal-command > header > b,
  .succession-archive[data-archive-route='black-whale'] .ship-temporal-command > footer > div > span,
  .succession-archive[data-archive-route='black-whale'] .ship-location-inspector__pager > span,
  .succession-archive[data-archive-route='black-whale'] .ship-location-inspector > header > span,
  .succession-archive[data-archive-route='black-whale'] .ship-visual-tour .section-kicker,
  .succession-archive[data-archive-route='black-whale'] .royal-room-plan > header > div > span,
  .succession-archive[data-archive-route='black-whale'] .royal-room-plan__side > span,
  .succession-archive[data-archive-route='black-whale'] .ship-movement-map > .subsection-title > span,
  .succession-archive[data-archive-route='black-whale'] .ship-manifest > .subsection-title > span,
  .succession-archive[data-archive-route='black-whale'] .ship-manifest th,
  .succession-archive[data-archive-route='black-whale'] .room-index__heading .section-kicker {
    color: var(--succession-text-on-paper);
  }

  .succession-archive[data-archive-route='black-whale'] .ship-location-inspector__snapshot dt,
  .succession-archive[data-archive-route='black-whale'] .ship-location-inspector__snapshot dd {
    color: var(--succession-text-strong);
  }

  .succession-archive[data-archive-route='guardian-spirit-beasts'] .succession-gsb-command-card__visual > span {
    color: var(--succession-text-on-paper);
  }
}
`;
  await writeFile(path, `${current.trimEnd()}${layer}`);
  console.log('Exact Batch 5 contrast closure appended.');
} else {
  console.log('Exact Batch 5 contrast closure already present.');
}
