import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/components/succession/SuccessionArchiveNenFixes.css';
const marker = 'Batch 5 final legacy contrast exceptions';
const current = await readFile(path, 'utf8');

if (!current.includes(marker)) {
  const rules = `

/* Batch 5 final legacy contrast exceptions.
   The shell loads this compatibility layer after route styles, so these narrow
   declarations neutralize older broad !important rules without changing layout. */
@media (max-width: 560px) {
  .succession-archive #succession-timeline .timeline-day-rail button em,
  .succession-archive #succession-timeline .timeline-day .timeline-day__number span {
    color: white !important;
  }

  .succession-archive .succession-queen-status-strip > div > dt {
    color: black !important;
  }

  .succession-archive #black-whale .ship-location-inspector__snapshot > div > dt {
    color: white !important;
  }

  .succession-archive #black-whale .ship-manifest table thead th {
    color: black !important;
  }

  .succession-archive .succession-gsb-command-card .succession-gsb-command-card__visual > span {
    color: black !important;
  }
}
`;
  await writeFile(path, `${current.trimEnd()}${rules}`);
  console.log('Legacy contrast exceptions appended.');
} else {
  console.log('Legacy contrast exceptions already present.');
}
