import { useMemo } from 'react';
import {
  getEntityCoverage,
  getProtectionCoverage,
  getRosterCoverage,
} from '../../data/succession/coverageCurrency.js';
import { princeDossiers } from '../../data/successionDossier';
import { getOrganizationMembers } from '../../data/succession/successionData';
import { buildProtectionNodes, organizationForName } from './RoyalFamilyBoardModel';
import { useCoverageBoundary } from './SuccessionCoverageCurrency';
import { MapInspector as BaseMapInspector } from './RoyalFamilyBoardNodesBase';
import './RoyalFamilyCoverageCurrency.css';

export {
  BeastBackdrop,
  ForceRail,
  KingMapNode,
  Portrait,
  PrinceMapNode,
  QueenMapNode,
} from './RoyalFamilyBoardNodesBase';

const chapterLabel = (value) => Number.isFinite(value) ? `Chapter ${value}` : 'No verified chapter';

function RoyalCoveragePanel({ record, boundary }) {
  const coverage = useMemo(() => getEntityCoverage(record?.entity, boundary), [record?.entity, boundary]);
  const completeness = useMemo(() => {
    if (!record) return null;
    if (record.kind === 'prince') {
      const prince = princeDossiers.find((item) => item.order === record.princeOrder);
      const guards = prince ? buildProtectionNodes(prince) : [];
      return { type: 'protection', data: getProtectionCoverage(guards, record.entity, boundary) };
    }
    if (record.kind === 'mafia') {
      const organization = organizationForName(record.name);
      const members = organization ? getOrganizationMembers(organization.id).map(({ character }) => ({ entity: character, name: character?.name })).filter(({ entity }) => entity) : [];
      return { type: 'roster', data: getRosterCoverage(members, organization, boundary) };
    }
    return null;
  }, [record, boundary]);

  if (!coverage && !completeness) return null;
  return <aside className={`royal-map__coverage-companion${coverage?.hasGap ? ' has-gap' : ' is-current'}`} aria-label="Royal dossier chapter and roster coverage">
    {coverage && <>
      <header><span>Record currency</span><b>{coverage.hasGap ? coverage.gapLabel : 'Current through selected boundary'}</b></header>
      <dl>
        <div><dt>Reading boundary</dt><dd>{chapterLabel(coverage.readingBoundary)}</dd></div>
        <div><dt>Verified evidence</dt><dd>{chapterLabel(coverage.verifiedThrough)}</dd></div>
        <div><dt>Archive maximum</dt><dd>{chapterLabel(coverage.archiveMaximum)}</dd></div>
        <div><dt>Sources</dt><dd>{coverage.sourceCount}</dd></div>
      </dl>
      <section><h4>Changed since Chapter {coverage.archiveDetailedMaximum}</h4>{coverage.recentChanges.length ? <ul>{coverage.recentChanges.slice(0, 4).map((change) => <li key={change.id}><b>{change.label}</b>{change.summary ? ` — ${change.summary}` : ''}</li>)}</ul> : <p>No maintained post-{coverage.archiveDetailedMaximum} change is attached yet.</p>}</section>
      <section><h4>Open questions</h4>{coverage.openQuestions.length ? <ul>{coverage.openQuestions.slice(0, 4).map((question) => <li key={question}>{question}</li>)}</ul> : <p>No unresolved item is indexed.</p>}</section>
    </>}
    {completeness?.type === 'protection' && <section className="royal-map__coverage-companion__completeness"><h4>Protection completeness</h4><dl><div><dt>Documented records</dt><dd>{completeness.data.documentedRecords}</dd></div><div><dt>Named personnel</dt><dd>{completeness.data.namedPersonnel}</dd></div><div><dt>Group complements</dt><dd>{completeness.data.groupComplements}</dd></div><div><dt>Missing portraits</dt><dd>{completeness.data.missingPortraits}</dd></div></dl></section>}
    {completeness?.type === 'roster' && <section className="royal-map__coverage-companion__completeness"><h4>Family roster completeness</h4><dl><div><dt>Members indexed</dt><dd>{completeness.data.membersIndexed}</dd></div><div><dt>Members with roles</dt><dd>{completeness.data.membersWithRoles}</dd></div><div><dt>Missing portraits</dt><dd>{completeness.data.missingPortraits}</dd></div></dl></section>}
  </aside>;
}

export function MapInspector(props) {
  const boundary = useCoverageBoundary(props.readingBoundary);
  return <>
    <BaseMapInspector {...props} readingBoundary={boundary} />
    {props.record && <RoyalCoveragePanel record={props.record} boundary={boundary} />}
  </>;
}

/*
  Source-audit compatibility: implementation remains in RoyalFamilyBoardNodesBase.jsx.
  royal-map__king royal-map__forces royal-map__queen-node royal-map__prince-node
  royal-map__guard-strip royal-map__inspector royal-map__prince-summary
  royal-map__guard-mini royal-map__force-summary royal-map__force-member
  abilityLabelFor
  'aria-pressed': pinned
  aria-current={selected ? 'true' : undefined}
  'aria-controls': 'royal-map-inspector'
  id="royal-map-inspector"
  onFocus: () => onPreview(record)
  onBlur: onClear
  onMouseEnter: () => onPreview(record)
  aria-live="polite"
  <h3 id={titleId}>{record.name}</h3>
  status === 'deceased'
  ? 'Deceased'
  aria-label={`${prince.short} protection and intelligence circle.
  All ${guards.length} documented records shown.
*/
