import { readFile, writeFile } from 'node:fs/promises';

const replaceOnce = async (path, before, after, label) => {
  const current = await readFile(path, 'utf8');
  if (current.includes(after)) return;
  if (!current.includes(before)) throw new Error(`Missing inline contrast target: ${label}`);
  await writeFile(path, current.replace(before, after));
};

await replaceOnce(
  'src/components/SuccessionTimeline.jsx',
  `return <button type="button" disabled={!count} onClick={() => jumpToDay(day.day)} key={day.day}><small>Day</small><strong>{day.day}</strong><span>{day.date.replace(', 2001', '')}</span><em>{count}</em></button>;`,
  `return <button type="button" disabled={!count} onClick={() => jumpToDay(day.day)} key={day.day}><small>Day</small><strong>{day.day}</strong><span>{day.date.replace(', 2001', '')}</span><em style={{ color: 'var(--timeline-paper)' }}>{count}</em></button>;`,
  'Timeline day-rail count badges',
);

await replaceOnce(
  'src/components/SuccessionTimeline.jsx',
  `<header><div className="timeline-day__number"><span>Day</span><b>{String(day.day).padStart(2, '0')}</b></div><div><span>{day.date} · Chapters {day.chapterRange}</span><h3>{day.headline}</h3><p>{day.summary}</p></div><em>{day.visibleEvents.length} events</em></header>`,
  `<header><div className="timeline-day__number"><span style={{ color: 'var(--timeline-ink)' }}>Day</span><b>{String(day.day).padStart(2, '0')}</b></div><div><span>{day.date} · Chapters {day.chapterRange}</span><h3>{day.headline}</h3><p>{day.summary}</p></div><em>{day.visibleEvents.length} events</em></header>`,
  'Timeline voyage-day labels',
);

await replaceOnce(
  'src/components/succession/SuccessionArchiveDeepWorkspaces.jsx',
  `<dl className="succession-queen-status-strip"><div><dt>Queens</dt><dd>{records.length}</dd></div><div><dt>Active</dt><dd>{counts.active}</dd></div><div><dt>Exceptional</dt><dd>{counts.exceptional}</dd></div><div><dt>Deceased</dt><dd>{counts.deceased}</dd></div><div><dt>Linked princes</dt><dd>{counts.children}</dd></div></dl>`,
  `<dl className="succession-queen-status-strip"><div><dt style={{ color: 'var(--succession-text-on-paper)' }}>Queens</dt><dd>{records.length}</dd></div><div><dt style={{ color: 'var(--succession-text-on-paper)' }}>Active</dt><dd>{counts.active}</dd></div><div><dt style={{ color: 'var(--succession-text-on-paper)' }}>Exceptional</dt><dd>{counts.exceptional}</dd></div><div><dt style={{ color: 'var(--succession-text-on-paper)' }}>Deceased</dt><dd>{counts.deceased}</dd></div><div><dt style={{ color: 'var(--succession-text-on-paper)' }}>Linked princes</dt><dd>{counts.children}</dd></div></dl>`,
  'Queen status labels',
);

await replaceOnce(
  'src/components/BlackWhaleGuide.jsx',
  `<dl className="ship-location-inspector__snapshot"><div><dt>Canonical record</dt><dd>{selectedCanonicalLocation?.name || selectedBridge.locationId}</dd></div><div><dt>Chapter</dt><dd>{snapshotChapter}</dd></div><div><dt>Occupants</dt><dd>{selectedCanonicalSnapshot?.occupants.length || 0}</dd></div><div><dt>Assignments</dt><dd>{selectedCanonicalSnapshot?.assignments.length || 0}</dd></div><div><dt>Events</dt><dd>{selectedCanonicalSnapshot?.events.length || 0}</dd></div><div><dt>Abilities</dt><dd>{selectedCanonicalSnapshot?.abilities.length || 0}</dd></div></dl>`,
  `<dl className="ship-location-inspector__snapshot"><div><dt style={{ color: 'var(--succession-text-strong)' }}>Canonical record</dt><dd>{selectedCanonicalLocation?.name || selectedBridge.locationId}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Chapter</dt><dd>{snapshotChapter}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Occupants</dt><dd>{selectedCanonicalSnapshot?.occupants.length || 0}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Assignments</dt><dd>{selectedCanonicalSnapshot?.assignments.length || 0}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Events</dt><dd>{selectedCanonicalSnapshot?.events.length || 0}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Abilities</dt><dd>{selectedCanonicalSnapshot?.abilities.length || 0}</dd></div></dl>`,
  'Black Whale inspector labels',
);

await replaceOnce(
  'src/components/BlackWhaleGuide.jsx',
  `<table><thead><tr><th>Group</th><th>Count</th><th>Distribution</th><th>Operational meaning</th></tr></thead><tbody>`,
  `<table><thead><tr><th style={{ color: 'var(--succession-text-on-paper)' }}>Group</th><th style={{ color: 'var(--succession-text-on-paper)' }}>Count</th><th style={{ color: 'var(--succession-text-on-paper)' }}>Distribution</th><th style={{ color: 'var(--succession-text-on-paper)' }}>Operational meaning</th></tr></thead><tbody>`,
  'Black Whale manifest headers',
);

await replaceOnce(
  'src/components/succession/SuccessionArchiveGuardianBeastWorkspace.jsx',
  `<div className="succession-gsb-command-card__visual"><EntityVisual entity={mode === 'host' ? host : beast} /><span>{host?.princeOrder ? String(host.princeOrder).padStart(2, '0') : 'K'}</span></div>`,
  `<div className="succession-gsb-command-card__visual"><EntityVisual entity={mode === 'host' ? host : beast} /><span style={{ color: 'var(--succession-text-on-paper)' }}>{host?.princeOrder ? String(host.princeOrder).padStart(2, '0') : 'K'}</span></div>`,
  'Guardian Beast card order badges',
);

console.log('Batch 5 deterministic inline contrast closure applied.');
