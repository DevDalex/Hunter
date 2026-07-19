import { useMemo, useState } from 'react';
import { BookOpenCheck, Check, CheckCircle2, Download, ExternalLink, FileJson2, PackageCheck, RotateCcw, ShieldCheck, Wrench } from 'lucide-react';
import {
  IMPLEMENTATION_NOTES_VERSION,
  completionCriteria,
  implementationSections,
  implementationStats,
  maintenanceMatrix,
  releaseChecklist,
} from '../data/implementationNotes';
import {
  CURRENT_RELEASE_DATE,
  CURRENT_RELEASE_VERSION,
  RELEASE_MANIFEST_PATH,
  SITES_SOURCE_PACKAGE_PATH,
  STANDALONE_PACKAGE_PATH,
  phaseSixSequence,
  releaseBoundaries,
  releaseGates,
  releaseStats,
} from '../data/releaseReadiness';
import { readStoredJson, removeStoredValue, writeStoredJson } from '../lib/browserStorage';

const STORAGE_KEY = 'hxh-maintenance-checks';

function readChecked() {
  const stored = readStoredJson(STORAGE_KEY, []);
  return new Set(Array.isArray(stored) ? stored : []);
}

export default function ImplementationNotes({ onOpenSources }) {
  const [activeId, setActiveId] = useState(implementationSections[0].id);
  const [checked, setChecked] = useState(readChecked);
  const active = implementationSections.find((section) => section.id === activeId) || implementationSections[0];
  const checklistTotal = implementationStats.checklistItems;
  const checklistProgress = Math.round((checked.size / checklistTotal) * 100);
  const canonicalFiles = useMemo(() => new Set(maintenanceMatrix.map((item) => item.canonical)).size, []);
  const standaloneBuild = typeof window !== 'undefined' && window.__HXH_STANDALONE_BUILD__ === true;

  const toggleCheck = (id) => setChecked((current) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    writeStoredJson(STORAGE_KEY, [...next]);
    return next;
  });

  const resetChecks = () => {
    setChecked(new Set());
    removeStoredValue(STORAGE_KEY);
  };

  return (
    <section className="implementation-notes" aria-labelledby="implementation-notes-title">
      <header className="implementation-notes__heading">
        <div><span className="section-kicker">{IMPLEMENTATION_NOTES_VERSION}</span><h2 id="implementation-notes-title">How this archive is built—and kept honest.</h2></div>
        <p>This is the project-owner view: architecture, evidence rules, canonical data owners, repeatable update paths, and the release definition of done. It documents the site without turning the reader-facing archive into a development dashboard.</p>
      </header>

      <dl className="implementation-notes__summary">
        <div><dt>System notes</dt><dd>{implementationStats.sections}</dd></div>
        <div><dt>Update runbooks</dt><dd>{implementationStats.runbooks}</dd></div>
        <div><dt>Release checks</dt><dd>{implementationStats.checklistItems}</dd></div>
        <div><dt>Canonical owners</dt><dd>{canonicalFiles}</dd></div>
      </dl>

      <div className="implementation-notes__workspace">
        <nav className="implementation-notes__rail" aria-label="Implementation note topics">
          {implementationSections.map((section, index) => <button type="button" className={active.id === section.id ? 'is-active' : ''} aria-current={active.id === section.id ? 'true' : undefined} onClick={() => setActiveId(section.id)} key={section.id}><i>{String(index + 1).padStart(2, '0')}</i><span>{section.label}</span></button>)}
        </nav>
        <article className="implementation-notes__detail" aria-labelledby="implementation-topic-title">
          <header><span>{active.owner}</span><h3 id="implementation-topic-title">{active.title}</h3><p>{active.summary}</p></header>
          <div className="implementation-notes__decisions">{active.decisions.map(([title, detail]) => <div key={title}><CheckCircle2 size={16} /><span><b>{title}</b><p>{detail}</p></span></div>)}</div>
          <section><h4>Canonical implementation files</h4><div className="implementation-notes__files">{active.files.map((file) => <code key={file}>{file}</code>)}</div></section>
          <section><h4>Verification contract</h4><ul>{active.checks.map((check) => <li key={check}>{check}</li>)}</ul></section>
        </article>
      </div>

      <section className="maintenance-matrix" aria-labelledby="maintenance-matrix-title">
        <header><div><span className="section-kicker">Change map</span><h3 id="maintenance-matrix-title">What changes where</h3></div><p>Start with the trigger, update the canonical owner, then reconcile its visual and research consumers.</p></header>
        <div className="maintenance-matrix__scroll" tabIndex="0" role="region" aria-label="Maintenance runbook table">
          <table><thead><tr><th>Archive area</th><th>Review trigger</th><th>Canonical owner</th><th>Required action</th><th>Verify</th></tr></thead><tbody>{maintenanceMatrix.map((item) => <tr key={item.id}><th>{item.area}<small>{item.companions}</small></th><td>{item.trigger}</td><td><code>{item.canonical}</code></td><td>{item.action}</td><td>{item.verify}</td></tr>)}</tbody></table>
        </div>
      </section>

      <section className="release-checklist" aria-labelledby="release-checklist-title">
        <header><div><span className="section-kicker">Private browser checklist</span><h3 id="release-checklist-title">Release inspection</h3><p>These marks stay on this browser only. They help conduct a review; they are not presented as proof that a deployment passed.</p></div><div><strong>{checked.size} / {checklistTotal}</strong><progress max={checklistTotal} value={checked.size} aria-label={`${checked.size} of ${checklistTotal} release checks marked`} /><button type="button" onClick={resetChecks}><RotateCcw size={13} /> Reset</button></div></header>
        <div className="release-checklist__groups">{releaseChecklist.map((group) => <fieldset key={group.id}><legend>{group.label}</legend>{group.items.map(([id, label]) => <label key={id}><input type="checkbox" checked={checked.has(id)} onChange={() => toggleCheck(id)} /><i><Check size={12} /></i><span>{label}</span></label>)}</fieldset>)}</div>
        <p className="release-checklist__status" role="status" aria-live="polite">{checklistProgress}% of this local inspection marked complete.</p>
      </section>

      <section className="implementation-completion" aria-labelledby="implementation-completion-title">
        <header><span className="section-kicker">Phase 6F completion contract</span><h3 id="implementation-completion-title">What “implemented” means</h3></header>
        <div>{completionCriteria.map(([title, detail]) => <article key={title}><CheckCircle2 size={17} /><span><b>{title}</b><p>{detail}</p></span></article>)}</div>
      </section>

      <section className="release-readiness" aria-labelledby="release-readiness-title">
        <header>
          <div><span className="section-kicker">{CURRENT_RELEASE_VERSION}</span><h3 id="release-readiness-title">Current release, audited from first load to final interaction.</h3><p>Phase 8A retains the reading, deterministic-media, layout, accessibility, performance, and whole-site release contracts. It adds a calmer editorial home, clearer reading scopes, and two verified handoff editions: a maintainable Sites-ready project and a direct-open standalone website. It remains a responsive website—not an installable or native app.</p></div>
          <span><ShieldCheck size={18} /> Updated {CURRENT_RELEASE_DATE}</span>
        </header>
        <dl className="release-readiness__stats">
          <div><dt>Phase 6 stages</dt><dd>{releaseStats.phases}</dd></div>
          <div><dt>Reader screens</dt><dd>{releaseStats.routes}</dd></div>
          <div><dt>Final gates</dt><dd>{releaseStats.gates}</dd></div>
          <div><dt>Manga boundary</dt><dd>Ch. {releaseStats.chapterBoundary}</dd></div>
        </dl>
        <div className="release-readiness__sequence" aria-label="Phase 6 delivery sequence">{phaseSixSequence.map(([phase, label]) => <div className={phase === '6G' ? 'is-final' : ''} key={phase}><i>{phase}</i><span>{label}</span></div>)}</div>
        <div className="release-readiness__gates">{releaseGates.map((gate) => <article key={gate.id}><CheckCircle2 size={16} /><span><b>{gate.label}</b><p>{gate.detail}</p></span></article>)}</div>
        <div className="release-readiness__handoff">
          <div><PackageCheck size={22} /><span><b>Two downloadable website editions</b><p>The Sites-ready archive contains the maintainable project and hosting identity. The standalone archive contains a direct-open built website without that connection. Neither contains credentials, repository history, or browser-local study data.</p></span></div>
          <span>{!standaloneBuild && <><a href={SITES_SOURCE_PACKAGE_PATH} download><Download size={14} /> Sites-ready source</a><a href={STANDALONE_PACKAGE_PATH} download><Download size={14} /> Standalone website</a></>}<a href={RELEASE_MANIFEST_PATH} target="_blank" rel="noreferrer"><FileJson2 size={14} /> Release manifest</a></span>
        </div>
        <dl className="release-readiness__boundaries">{releaseBoundaries.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl>
      </section>

      <footer className="implementation-notes__footer">
        <div><Wrench size={18} /><p><b>The handbook is the canonical maintainer handoff.</b><br />It contains the detailed schemas, update sequences, failure rules, and release procedure summarized on this page.</p></div>
        <span><a href="/implementation-notes.md" target="_blank" rel="noreferrer"><BookOpenCheck size={14} /> Open maintainer handbook <ExternalLink size={12} /></a><button type="button" onClick={onOpenSources}>Open source registry</button></span>
      </footer>
    </section>
  );
}
