import { archiveCoverageList, domainCoverage } from '../../data/archiveCoverage';

export default function SuccessionArchiveContextBar({ spoilerLimit, activeDomain = 'story', onSpoilerChange }) {
  const domain = domainCoverage[activeDomain] || domainCoverage.story;
  return <section className="succession-context-bar" aria-label="Archive reading and coverage context">
    <div>
      <span>Viewing</span>
      <strong>Chapter {spoilerLimit}</strong>
    </div>
    {archiveCoverageList.map((item) => <div key={item.id} title={item.description}>
      <span>{item.label}</span>
      <strong>Ch. {item.chapter}</strong>
    </div>)}
    <div>
      <span>{domain.label}</span>
      <strong>Indexed through Ch. {domain.chapter}</strong>
    </div>
    {onSpoilerChange && <label>
      <span className="sr-only">Change reading boundary</span>
      <input
        type="number"
        min="340"
        max={archiveCoverageList[0]?.chapter || spoilerLimit}
        value={spoilerLimit}
        onChange={(event) => onSpoilerChange(Number(event.target.value))}
      />
    </label>}
  </section>;
}
