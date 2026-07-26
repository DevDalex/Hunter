import { readFile, writeFile } from 'node:fs/promises';

const replaceRequired = (content, before, after, label) => {
  if (!content.includes(before)) throw new Error(`Missing repair target: ${label}`);
  return content.replace(before, after);
};

const update = async (path, transform) => {
  const current = await readFile(path, 'utf8');
  const next = transform(current);
  if (next !== current) await writeFile(path, next);
};

await update('src/components/succession/SuccessionArchiveNenWorkspace.jsx', (content) => replaceRequired(
  content,
  `<header><div role="tablist" aria-label="Nen archive mode"><button type="button" role="tab" aria-selected={mode === 'systems'} className={mode === 'systems' ? 'is-active' : ''} onClick={() => { setMode('systems'); resetFilters(); onNavigate('nen'); }}><Sparkles size={16} aria-hidden="true" /> Systems</button><button type="button" role="tab" aria-selected={mode === 'abilities'} className={mode === 'abilities' ? 'is-active' : ''} onClick={() => { setMode('abilities'); resetFilters(); onNavigate('nen', { view: 'abilities' }); }}><FlaskConical size={16} aria-hidden="true" /> Abilities</button><button type="button" onClick={() => onNavigate('guardian-spirit-beasts')}><BrainCircuit size={16} aria-hidden="true" /> Guardian Beasts</button></div><strong>{mode === 'systems' ? visibleSystems.length : visibleAbilities.length} visible records</strong></header>`,
  `<header><div className="succession-nen-command__mode-navigation"><div role="tablist" aria-label="Nen archive mode"><button type="button" role="tab" aria-selected={mode === 'systems'} className={mode === 'systems' ? 'is-active' : ''} onClick={() => { setMode('systems'); resetFilters(); onNavigate('nen'); }}><Sparkles size={16} aria-hidden="true" /> Systems</button><button type="button" role="tab" aria-selected={mode === 'abilities'} className={mode === 'abilities' ? 'is-active' : ''} onClick={() => { setMode('abilities'); resetFilters(); onNavigate('nen', { view: 'abilities' }); }}><FlaskConical size={16} aria-hidden="true" /> Abilities</button></div><button type="button" onClick={() => onNavigate('guardian-spirit-beasts')}><BrainCircuit size={16} aria-hidden="true" /> Guardian Beasts</button></div><strong>{mode === 'systems' ? visibleSystems.length : visibleAbilities.length} visible records</strong></header>`,
  'Nen tablist ownership',
));

await update('src/components/succession/SuccessionArchiveEvidenceWorkspace.jsx', (content) => replaceRequired(
  content,
  `<select value={sourceType} onChange={(event) => setSourceType(event.target.value)}><option value="all">All source types</option>{sourceTypes.map((type) => <option value={type} key={type}>{titleCase(type)}</option>)}</select>`,
  `<label><span className="sr-only">Filter evidence sources by type</span><select aria-label="Filter evidence sources by type" value={sourceType} onChange={(event) => setSourceType(event.target.value)}><option value="all">All source types</option>{sourceTypes.map((type) => <option value={type} key={type}>{titleCase(type)}</option>)}</select></label>`,
  'Research source type label',
));

await update('src/components/succession/SuccessionArchiveChapterStoryWorkspace.jsx', (content) => replaceRequired(
  content,
  `<dl className="succession-chapter-dossier__evidence-board">
            <div><dt>Direct sources</dt><dd>{dossier.sources.length}</dd><span>Available at or before the selected boundary</span></div>
            <div><dt>Research state</dt><dd>{labelize(selectedRecord?.researchState || 'pending')}</dd><span>{dossier.chapter.storyIntelligenceStatus}</span></div>
            <div><dt>Unresolved threads</dt><dd>{unresolvedThreadCount}</dd><span>Questions remain explicit rather than converted into conclusions</span></div>
            <div><dt>Boundary</dt><dd>Chapter {spoilerLimit}</dd><span>Later evidence and outcomes remain hidden</span></div>
          </dl>`,
  `<div className="succession-chapter-dossier__evidence-board" role="group" aria-label="Chapter evidence metrics">
            <div><span className="succession-chapter-dossier__evidence-label">Direct sources</span><strong>{dossier.sources.length}</strong><span>Available at or before the selected boundary</span></div>
            <div><span className="succession-chapter-dossier__evidence-label">Research state</span><strong>{labelize(selectedRecord?.researchState || 'pending')}</strong><span>{dossier.chapter.storyIntelligenceStatus}</span></div>
            <div><span className="succession-chapter-dossier__evidence-label">Unresolved threads</span><strong>{unresolvedThreadCount}</strong><span>Questions remain explicit rather than converted into conclusions</span></div>
            <div><span className="succession-chapter-dossier__evidence-label">Boundary</span><strong>Chapter {spoilerLimit}</strong><span>Later evidence and outcomes remain hidden</span></div>
          </div>`,
  'Chapter evidence metric semantics',
));

await update('src/components/succession/SuccessionArchiveAssignmentWorkspace.jsx', (content) => replaceRequired(
  content,
  `<dl className="succession-assignment-command__metrics"><div><dt>Total records</dt><dd>{assignments.length}</dd><span>published assignments</span></div><div><dt>Active snapshot</dt><dd>{chapterAssignments.length}</dd><span>Chapter {snapshotChapter}</span></div><div><dt>Personnel</dt><dd>{namedPersonnel}</dd><span>named operatives</span></div><div><dt>Covert</dt><dd>{covertCount}</dd><span>restricted records</span></div><div><dt>Ended</dt><dd>{endedCount}</dd><span>historical operations</span></div></dl>`,
  `<div className="succession-assignment-command__metrics" role="group" aria-label="Assignment archive metrics"><div><span className="succession-assignment-command__metric-label">Total records</span><strong>{assignments.length}</strong><span>published assignments</span></div><div><span className="succession-assignment-command__metric-label">Active snapshot</span><strong>{chapterAssignments.length}</strong><span>Chapter {snapshotChapter}</span></div><div><span className="succession-assignment-command__metric-label">Personnel</span><strong>{namedPersonnel}</strong><span>named operatives</span></div><div><span className="succession-assignment-command__metric-label">Covert</span><strong>{covertCount}</strong><span>restricted records</span></div><div><span className="succession-assignment-command__metric-label">Ended</span><strong>{endedCount}</strong><span>historical operations</span></div></div>`,
  'Assignment metric semantics',
));

await update('src/components/TimelineWorkspace.css', (content) => `${content.trimEnd()}\n\n.timeline-command__hero h2 {\n  max-width: 1000px;\n  margin-top: 16px;\n  color: var(--timeline-ink);\n  font-family: var(--succession-font-display, var(--serif));\n  font-size: clamp(46px, 7vw, 104px);\n  line-height: .87;\n  letter-spacing: -.062em;\n}\n\n.timeline-command__navigation > header > div > span {\n  color: var(--timeline-paper-ink);\n}\n`);

const contrastLayer = `

/* Batch 5 final WCAG contrast repairs discovered by the complete Chromium matrix. */
.succession-nen-command__mode-navigation,
.succession-nen-command__mode-navigation [role='tablist'] {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.succession-assignment-command__metric-label,
.succession-chapter-dossier__evidence-label {
  font-family: var(--succession-font-mono);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

@media (max-width: 560px) {
  .succession-archive :where(
    .succession-story-command__metrics dd,
    .succession-story-command__search > div > span,
    .succession-story-command__search > div > b,
    .succession-story-command__causal-index,
    .succession-queen-status-strip dt,
    .succession-queen-status-strip dd,
    .succession-assignment-type-board > header > div > span,
    .succession-assignment-filter-panel > header > div > span,
    .succession-assignment-snapshot-board > header > div > span,
    .succession-assignment-personnel > header > div > span,
    .succession-organization-command header > div > span,
    .succession-relationship-filter-panel > header > div > span,
    .succession-relationship-view-switcher > header > div > span,
    .succession-relationship-connectivity > header > div > span,
    .succession-relationship-accessible > header > div > span,
    .succession-location-command header > div > span,
    .black-whale-intelligence header > b,
    .ship-location-inspector__pager > span,
    .ship-location-inspector > header > span,
    .black-whale-intelligence .section-kicker,
    .royal-room-plan > header > div > span,
    .ship-movement-map > .subsection-title > span,
    .ship-manifest > .subsection-title > span,
    .room-index__heading .section-kicker,
    .black-whale-intelligence th,
    .royal-room-plan__side > span,
    .ship-location-inspector footer span
  ) {
    color: var(--succession-text-on-paper);
  }

  .succession-archive .succession-story-command__search > div,
  .succession-archive .succession-story-command__metrics,
  .succession-archive .succession-queen-status-strip {
    color: var(--succession-text-on-paper);
  }

  .succession-archive .succession-chapter-intel__dossier,
  .succession-archive .succession-chapter-dossier__phase,
  .succession-archive .succession-chapter-dossier__boundary,
  .succession-archive #chapter-dossier-pressure,
  .succession-archive .succession-chapter-intel__entity-columns > section,
  .succession-archive .succession-chapter-dossier__evidence {
    background: var(--succession-surface-paper-raised);
    color: var(--succession-text-on-paper);
  }

  .succession-archive :where(
    .succession-chapter-dossier__phase span,
    .succession-chapter-dossier__boundary span,
    .succession-chapter-dossier__boundary p,
    .succession-chapter-intel__section-title span,
    .succession-chapter-intel__threads > p,
    .succession-chapter-intel__entity-columns p
  ) {
    color: var(--succession-text-on-paper);
  }

  .succession-archive .succession-chapter-dossier__sequence-grid > section,
  .succession-archive .succession-chapter-dossier__evidence-note {
    color: var(--succession-text-strong);
  }

  .succession-archive .succession-chapter-dossier__sequence-grid > section p,
  .succession-archive .succession-chapter-dossier__evidence-note p {
    color: var(--succession-text-strong);
  }

  .succession-archive :where(
    .timeline-command__navigation > header > div > span,
    .timeline-source-note__links a,
    .timeline-prelude > summary > span,
    .timeline-command-voyage__controls header > b,
    .timeline-command-voyage__selected > div:first-child > span,
    .timeline-inspector > span
  ) {
    color: var(--succession-text-on-paper);
  }

  .succession-archive .timeline-day__number > span {
    color: var(--succession-gold-strong);
  }

  .succession-archive .timeline-day > header > em {
    color: var(--succession-text-on-paper);
  }

  .succession-archive .timeline-day-rail button em {
    background: color-mix(in srgb, var(--succession-crimson-strong) 78%, var(--succession-surface-inset));
    color: white;
  }

  .succession-archive .succession-assignment-load-more {
    background: color-mix(in srgb, var(--succession-crimson-strong) 78%, var(--succession-surface-inset));
    color: white;
  }

  .succession-archive .ship-location-inspector__snapshot :where(dt, dd) {
    color: var(--succession-text-strong);
  }

  .succession-archive .succession-gsb-command-card__visual > span {
    color: var(--succession-text-on-paper);
  }

  .succession-archive .succession-evidence-workspace,
  .succession-archive .succession-evidence-workspace :where(
    section,
    article,
    div,
    p,
    span,
    small,
    dt,
    dd,
    b,
    strong,
    button,
    label,
    input,
    select
  ) {
    color: var(--succession-text-on-paper);
  }

  .succession-archive .succession-evidence-workspace :where(button, input, select) {
    background: var(--succession-surface-paper-raised);
  }
}
`;

await update('src/components/succession/SuccessionArchiveFinalPolish.css', (content) => {
  if (content.includes('Batch 5 final WCAG contrast repairs')) return content;
  return `${content.trimEnd()}${contrastLayer}`;
});

console.log('Batch 5 accessibility repairs applied.');
