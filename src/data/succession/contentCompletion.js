import {
  successionArchiveData,
  successionArchive,
  successionInformationConsistency,
  successionHighValueIntelligence,
  successionNenSystems,
  successionStoryIntelligence,
  successionContentDepth,
} from './successionData.js';
import { successionContentExpansion } from './contentDepthExpansion.js';
import { createContentCompletionSelectors } from './contentCompletionSelectors.js';
import {
  getNenCompletion,
  getGlossaryCompletion,
  getCrossLinkCoverage,
  extendCompletionReport,
} from './contentCompletionSupplement.js';

export const successionContentCompletion = createContentCompletionSelectors({
  data: successionArchiveData,
  archive: successionArchive,
  informationConsistency: successionInformationConsistency,
  highValueIntelligence: successionHighValueIntelligence,
  nenSystems: successionNenSystems,
  storyIntelligence: successionStoryIntelligence,
  contentDepth: successionContentDepth,
  contentExpansion: successionContentExpansion,
});

export const {
  getChapterCompletionDossier,
  getAllChapterCompletionDossiers,
  getPrinceCompletionDossiers,
  getSpecialTrackerCompletion,
  getInvestigationCompletion,
  getKakinCompletion,
  getKnowledgeCompletion,
  getMysteryCompletion,
  getCrossLinkCompletion,
  getLedgerCompletion,
  getOrientationCompletion,
  getEvidenceCompletion,
  getAppendixCompletion,
} = successionContentCompletion;

export { getNenCompletion, getGlossaryCompletion, getCrossLinkCoverage };
export const getCompletionReport = (chapter) => extendCompletionReport(successionContentCompletion.getCompletionReport(chapter), chapter);
