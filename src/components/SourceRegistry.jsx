import { CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';
import { archiveChangelog, sourceRegistry } from '../data/referenceEntities';
import { researchStandards } from '../data/referenceLibrary';
import { archiveBoundaryLabel, coverageLabels } from '../data/archiveMeta';
import { integrityChecks, integritySummary } from '../data/contentIntegrity';
import { mediaCoverageByCategory, mediaRegistryStats } from '../data/mediaRegistry';
import { primarySources } from '../data/reference';

export default function SourceRegistry() {
  return (
    <section className="source-registry" id="source-registry">
      <div className="section-heading"><div><span className="section-kicker">Hunterpedia only</span><h2>Sources, confidence & maintenance</h2></div><p>Every research layer states where it comes from, how it is maintained, and whether the current record is settled, developing, inferred, or unknown.</p></div>
      <section className="archive-health" aria-labelledby="archive-health-title">
        <header><div><span><ShieldCheck size={15} /> Phase 1 integrity layer</span><h3 id="archive-health-title">Archive health</h3><p>{archiveBoundaryLabel}. Stored content is checked before every production build.</p></div><strong>{integritySummary.passed}/{integritySummary.total}<small>checks passed</small></strong></header>
        <div className="archive-health__checks">{integrityChecks.map((check) => <article className={`is-${check.status}`} key={check.id}><CheckCircle2 size={16} /><div><b>{check.label}</b><p>{check.detail}</p></div><span>{check.status}</span></article>)}</div>
        <dl className="archive-health__coverage"><div><dt>Chapter catalogue</dt><dd>{integritySummary.chapterCatalogue}</dd></div><div><dt>Locally structured records</dt><dd>{integritySummary.locallyStructuredChapters}</dd></div><div><dt>Chapter-specific accounts</dt><dd>{integritySummary.detailedChapters}</dd></div><div><dt>Arc-phase context records</dt><dd>{integritySummary.phaseContextChapters}</dd></div><div><dt>Catalogue-only records</dt><dd>{integritySummary.catalogueOnlyChapters}</dd></div><div><dt>Stored source links</dt><dd>{integritySummary.sourceUrls}</dd></div></dl>
        <div className="archive-health__truth"><b>Coverage language</b>{Object.entries(coverageLabels).map(([area, label]) => <p key={area}><span>{area}</span>{label}</p>)}</div>
      </section>
      <section className="media-registry-report" aria-labelledby="media-registry-title">
        <header><div><span className="section-kicker">Phase 7B media stabilization</span><h3 id="media-registry-title">Local, explicit, or text-only</h3></div><p><b>{mediaRegistryStats.local}</b> records use locally stored Hunterpedia media with crop metadata. <b>{mediaRegistryStats.verifiedRemote}</b> use an explicit approved remote image, while <b>{mediaRegistryStats.textOnly}</b> intentionally omit media. Runtime image resolution: <b>{mediaRegistryStats.runtimeResolution}</b>.</p></header>
        <div>{mediaCoverageByCategory.map((record) => <article key={record.id}><span>{record.label}</span><strong>{record.local}<small> / {record.total}</small></strong><progress value={record.local} max={Math.max(1, record.total)} aria-label={`${record.label}: ${record.local} of ${record.total} images stored locally`} /><p>{record.verifiedRemote} verified remote · {record.textOnly} intentionally text-only</p></article>)}</div>
        <footer>No visible placeholders or hidden image lookups are used. A record without a stable image simply renders as text.</footer>
      </section>
      <div className="source-registry__standards">{researchStandards.map(([term, description]) => <article key={term}><span>{term}</span><p>{description}</p></article>)}</div>
      <div className="source-registry__table"><table><thead><tr><th>Archive area</th><th>Method</th><th>State</th><th>Review cadence</th><th>Source</th></tr></thead><tbody>{sourceRegistry.map((item) => <tr key={item.area}><th>{item.area}</th><td>{item.method}</td><td><span>{item.state}</span></td><td>{item.cadence}</td><td><a href={item.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={10} /></a></td></tr>)}</tbody></table></div>
      <div className="source-registry__primary">{primarySources.map((source) => <a key={source.name} href={source.url} target="_blank" rel="noreferrer">{source.name}<ExternalLink size={12} /></a>)}</div>
      <div className="archive-changelog"><div><span className="section-kicker">Maintenance history</span><h3>Change log</h3></div><ol>{archiveChangelog.map(([date, title, note]) => <li key={`${date}-${title}`}><time>{date}</time><div><strong>{title}</strong><p>{note}</p></div></li>)}</ol></div>
    </section>
  );
}
