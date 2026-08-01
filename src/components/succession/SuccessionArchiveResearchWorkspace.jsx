import SuccessionArchiveEvidenceWorkspace from './SuccessionArchiveEvidenceWorkspace';
import { ArchiveCoverageReport } from './SuccessionCoverageCurrency';
import SuccessionIntelligenceWorkbench from './SuccessionIntelligenceWorkbench';

export default function SuccessionArchiveResearchWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  return <>
    <SuccessionIntelligenceWorkbench routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />
    <ArchiveCoverageReport boundary={spoilerLimit} onNavigate={onNavigate} compact />
    <SuccessionArchiveEvidenceWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />
  </>;
}
