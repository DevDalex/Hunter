import { createContext, useContext } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Database,
  RefreshCw,
} from 'lucide-react';
import {
  getArchiveCoverageReport,
  getEntityCoverage,
} from '../../data/succession/coverageCurrency.js';
import './SuccessionCoverageCurrency.css';

const chapterValue = (value) => Number.isFinite(value) ? `Ch. ${value}` : 'No verified chapter';

const CoverageBoundaryContext = createContext(undefined);

export function CoverageBoundaryProvider({ boundary, children }) {
  return <CoverageBoundaryContext.Provider value={boundary}>{children}</CoverageBoundaryContext.Provider>;
}

export function useCoverageBoundary(explicitBoundary) {
  const contextualBoundary = useContext(CoverageBoundaryContext);
  return explicitBoundary ?? contextualBoundary;
}

export function RecordCurrencyStrip({ entity, boundary, compact = false }) {
  const resolvedBoundary = useCoverageBoundary(boundary);
  const coverage = getEntityCoverage(entity, resolvedBoundary);
  if (!coverage) return null;
  return <section className={`succession-currency-strip${compact ? ' is-compact' : ''}${coverage.hasGap ? ' has-gap' : ' is-current'}`} aria-label="Record chapter currency">
    <div><span>Reading boundary</span><b>{chapterValue(coverage.readingBoundary)}</b></div>
    <div><span>Record verified through</span><b>{chapterValue(coverage.verifiedThrough)}</b></div>
    <div><span>Archive maximum</span><b>{chapterValue(coverage.archiveMaximum)}</b></div>
    <div className="succession-currency-strip__state">
      {coverage.hasGap ? <AlertTriangle size={15} aria-hidden="true" /> : <CheckCircle2 size={15} aria-hidden="true" />}
      <span>{coverage.hasGap ? 'Coverage gap' : 'Current'}</span>
      <b>{coverage.hasGap ? coverage.gapLabel : 'No missing chapters'}</b>
    </div>
  </section>;
}

export function RecordCoverageSections({ entity, boundary }) {
  const resolvedBoundary = useCoverageBoundary(boundary);
  const coverage = getEntityCoverage(entity, resolvedBoundary);
  if (!coverage) return null;
  const recentChanges = coverage.recentChanges || [];
  const openQuestions = coverage.openQuestions || [];
  const detailedMaximum = coverage.archiveDetailedMaximum ?? coverage.verifiedThrough ?? coverage.identityVerifiedThrough;
  return <div className="succession-record-coverage">
    <section className="succession-record-coverage__recent" aria-labelledby={`recent-${entity.id}`}>
      <header><RefreshCw size={16} aria-hidden="true" /><div><span>Recent changes</span><h3 id={`recent-${entity.id}`}>Changed since Chapter {detailedMaximum}</h3></div><b>{recentChanges.length}</b></header>
      {recentChanges.length ? <ol>{recentChanges.map((change) => <li key={change.id}>
        <span>{change.chapterRange?.start ? `Ch. ${change.chapterRange.start}` : 'Unbounded'}</span>
        <div><b>{change.label}</b>{change.summary && <p>{change.summary}</p>}<small>{change.kind} · {change.certainty}{change.active ? ' · active' : ''}</small></div>
      </li>)}</ol> : <p>No maintained change record after Chapter {detailedMaximum} is attached yet. This does not claim that the manga contains no change; it marks the archive gap honestly.</p>}
    </section>
    <section className="succession-record-coverage__questions" aria-labelledby={`questions-${entity.id}`}>
      <header><CircleHelp size={16} aria-hidden="true" /><div><span>Open questions</span><h3 id={`questions-${entity.id}`}>Unresolved intelligence</h3></div><b>{openQuestions.length}</b></header>
      {openQuestions.length ? <ul>{openQuestions.map((question) => <li key={question}>{question}</li>)}</ul> : <p>No unresolved question is currently indexed for this record.</p>}
    </section>
  </div>;
}

export function ArchiveCoverageReport({ boundary, onNavigate, compact = false }) {
  const resolvedBoundary = useCoverageBoundary(boundary);
  const report = getArchiveCoverageReport(resolvedBoundary);
  return <section className={`succession-coverage-report${compact ? ' is-compact' : ''}`} aria-labelledby="succession-coverage-report-title">
    <header>
      <Database size={19} aria-hidden="true" />
      <div><span>Generated coverage census</span><h2 id="succession-coverage-report-title">Publication, detailed research, and record currency are tracked separately</h2><p>The report is derived from chapter ranges and source links. It does not use hardcoded domain totals.</p></div>
      <dl>
        <div><dt>Reading boundary</dt><dd>{report.readingBoundary}</dd></div>
        <div><dt>Detailed through</dt><dd>{report.detailedMaximum}</dd></div>
        <div><dt>Pending chapters</dt><dd>{report.pendingChapterCount}</dd></div>
      </dl>
    </header>
    {report.pendingChapterNumbers.length > 0 && <div className="succession-coverage-report__warning">
      <AlertTriangle size={17} aria-hidden="true" />
      <div><b>Detailed research is pending for Chapters {report.pendingChapterNumbers.join(' and ')}</b><span>Publication identity is indexed, but scene, cast, location, assignment, relationship, Nen, and consequence claims remain unpromoted.</span></div>
      {onNavigate && <button type="button" onClick={() => onNavigate('chapters', { chapter: report.pendingChapterNumbers[0] })}>Open pending record <ArrowRight size={13} aria-hidden="true" /></button>}
    </div>}
    <div className="succession-coverage-report__domains">
      {report.domains.map((domain) => <article key={domain.id}>
        <header><span>{domain.label}</span><b>{domain.recordCount}</b></header>
        <dl>
          <div><dt>Latest evidence</dt><dd>{chapterValue(domain.latestIndexed)}</dd></div>
          <div><dt>At boundary</dt><dd>{domain.currentAtBoundary}</dd></div>
          <div><dt>Earlier evidence</dt><dd>{domain.behindBoundary}</dd></div>
          <div><dt>No chapter evidence</dt><dd>{domain.noChapterEvidence}</dd></div>
          <div><dt>Missing direct sources</dt><dd>{domain.missingSources}</dd></div>
        </dl>
      </article>)}
    </div>
    <footer>
      <Clock3 size={14} aria-hidden="true" /> Last reviewed {report.lastReviewed}
      {onNavigate && <button type="button" onClick={() => onNavigate('research', { chapter: report.readingBoundary })}><BookOpen size={13} aria-hidden="true" /> Open evidence graph</button>}
    </footer>
  </section>;
}
