import { getArchiveCoverageReport } from './coverageCurrency.js';

const freeze = (value) => Object.freeze(value);

const routeByDomain = Object.freeze({
  chapters: 'chapters',
  characters: 'characters',
  organizations: 'organizations',
  nen: 'nen',
  events: 'events',
  assignments: 'bodyguards',
  relationships: 'relationships',
  locations: 'locations',
  sources: 'research',
});

const describeDomain = (domain) => {
  const reasons = [];
  if (domain.missingSources > 0) reasons.push(`${domain.missingSources} record${domain.missingSources === 1 ? '' : 's'} missing direct source links`);
  if (domain.noChapterEvidence > 0) reasons.push(`${domain.noChapterEvidence} record${domain.noChapterEvidence === 1 ? '' : 's'} without chapter evidence`);
  if (domain.behindBoundary > 0) reasons.push(`${domain.behindBoundary} record${domain.behindBoundary === 1 ? '' : 's'} last evidenced before the selected boundary`);
  const status = domain.missingSources > 0
    ? 'needs-sources'
    : domain.noChapterEvidence > 0
      ? 'needs-chapter-evidence'
      : domain.behindBoundary > 0
        ? 'behind-boundary'
        : 'current';
  const nextAction = status === 'needs-sources'
    ? 'Attach or verify direct source records.'
    : status === 'needs-chapter-evidence'
      ? 'Resolve records without chapter-bounded evidence.'
      : status === 'behind-boundary'
        ? 'Review whether later chapters materially update these records.'
        : 'Maintain current coverage as new chapters are added.';
  return freeze({
    ...domain,
    route: routeByDomain[domain.id] || 'research',
    status,
    reasons: freeze(reasons),
    nextAction,
    attentionCount: domain.missingSources + domain.noChapterEvidence + domain.behindBoundary,
  });
};

export const getArchiveCoverageRoadmap = (readingBoundary) => {
  const report = getArchiveCoverageReport(readingBoundary);
  const domains = report.domains.map(describeDomain).sort((left, right) => (
    Number(right.status !== 'current') - Number(left.status !== 'current')
    || right.missingSources - left.missingSources
    || right.noChapterEvidence - left.noChapterEvidence
    || right.behindBoundary - left.behindBoundary
    || left.label.localeCompare(right.label)
  ));
  return freeze({
    readingBoundary: report.readingBoundary,
    detailedMaximum: report.detailedMaximum,
    archiveMaximum: report.archiveMaximum,
    lastReviewed: report.lastReviewed,
    pendingChapterNumbers: report.pendingChapterNumbers,
    domains: freeze(domains),
    summary: freeze({
      domains: domains.length,
      currentDomains: domains.filter((domain) => domain.status === 'current').length,
      attentionDomains: domains.filter((domain) => domain.status !== 'current').length,
      pendingChapters: report.pendingChapterCount,
      missingSources: report.totals.missingSources,
      noChapterEvidence: report.totals.noChapterEvidence,
      behindBoundary: report.totals.behindBoundary,
    }),
  });
};
