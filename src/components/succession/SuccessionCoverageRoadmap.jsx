import { AlertTriangle, ArrowRight, CheckCircle2, Map, SearchCheck } from 'lucide-react';
import { getArchiveCoverageRoadmap } from '../../data/succession/coverageRoadmap';
import './SuccessionCoverageRoadmap.css';

const labelize = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function SuccessionCoverageRoadmap({ chapter = 417, onNavigate }) {
  const roadmap = getArchiveCoverageRoadmap(chapter);
  return <section className="succession-coverage-roadmap" aria-labelledby="succession-coverage-roadmap-title">
    <header>
      <Map size={17} aria-hidden="true" />
      <div><span>Public coverage roadmap</span><h2 id="succession-coverage-roadmap-title">What is current, what still needs evidence, and where to inspect it</h2><p>This roadmap is derived from the same coverage census used by record currency. It does not invent a completion percentage or hide domains with weak evidence.</p></div>
      <dl><div><dt>Domains</dt><dd>{roadmap.summary.domains}</dd></div><div><dt>Need attention</dt><dd>{roadmap.summary.attentionDomains}</dd></div><div><dt>Pending chapters</dt><dd>{roadmap.summary.pendingChapters}</dd></div></dl>
    </header>

    {!!roadmap.pendingChapterNumbers.length && <section className="succession-coverage-roadmap__pending" aria-label="Pending chapter research">
      <AlertTriangle size={15} aria-hidden="true" /><div><b>Pending detailed chapter research</b><span>{roadmap.pendingChapterNumbers.map((number) => `Ch. ${number}`).join(' · ')}</span></div><button type="button" onClick={() => onNavigate('chapters', { chapter: roadmap.pendingChapterNumbers[0] })}>Inspect first pending chapter <ArrowRight size={12} aria-hidden="true" /></button>
    </section>}

    <div className="succession-coverage-roadmap__domains">{roadmap.domains.map((domain) => <article data-status={domain.status} key={domain.id}>
      <header><span>{domain.status === 'current' ? <CheckCircle2 size={13} aria-hidden="true" /> : <AlertTriangle size={13} aria-hidden="true" />}{domain.label}</span><b>{labelize(domain.status)}</b></header>
      <dl><div><dt>Records</dt><dd>{domain.recordCount}</dd></div><div><dt>Missing sources</dt><dd>{domain.missingSources}</dd></div><div><dt>No chapter evidence</dt><dd>{domain.noChapterEvidence}</dd></div><div><dt>Earlier evidence</dt><dd>{domain.behindBoundary}</dd></div></dl>
      <div className="succession-coverage-roadmap__why"><b>{domain.nextAction}</b>{domain.reasons.length ? <ul>{domain.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul> : <p>No census gap is published for this domain at Chapter {roadmap.readingBoundary}.</p>}</div>
      <footer><button type="button" onClick={() => onNavigate(domain.route, domain.route === 'research' ? { mode: 'overview' } : {})}><SearchCheck size={12} aria-hidden="true" /> Open {domain.label} <ArrowRight size={12} aria-hidden="true" /></button></footer>
    </article>)}</div>

    <footer>Priority ordering is transparent: missing direct sources first, then records without chapter evidence, then records whose latest maintained evidence is earlier than the selected boundary. Last reviewed {roadmap.lastReviewed}.</footer>
  </section>;
}
