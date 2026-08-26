import {
  successionArchiveData,
  successionArchive,
  successionInformationConsistency,
  successionHighValueIntelligence,
  successionNenSystems,
  successionStoryIntelligence,
  successionContentDepth,
} from './successionData.js';
import { createContentDepthExpansionSelectors } from './contentDepthExpansionSelectors.js';

export const successionContentExpansion = createContentDepthExpansionSelectors({
  data: successionArchiveData,
  archive: successionArchive,
  informationConsistency: successionInformationConsistency,
  highValueIntelligence: successionHighValueIntelligence,
  nenSystems: successionNenSystems,
  storyIntelligence: successionStoryIntelligence,
  contentDepth: successionContentDepth,
});

export const {
  getChapterForensicDossier,
  getFullPrinceDossiers,
  getSpecialPrinceTracker,
  getInvestigationDossiers,
  getBeyondIntelligenceDossier,
  getTroupeHisokaDeepDossier,
  getMafiaDeepDossier,
  getKakinRoyalSystemReference,
  getInformationWarExpansion,
  getMysteryEvidenceFiles,
  getCrossLinkAtlas,
  getArchiveLedgers,
  getReaderOrientation,
  getEvidenceQualityAudit,
  getReferenceAppendices,
  getContentExpansionSummary,
} = successionContentExpansion;
