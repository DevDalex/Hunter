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
  getCompletionReport,
} = successionContentCompletion;
