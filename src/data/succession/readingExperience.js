import { archiveCoverage, domainCoverage } from '../archiveCoverage.js';

const mission = (id, label, description, target, params = {}) => Object.freeze({
  id,
  label,
  description,
  target,
  params: Object.freeze({ ...params }),
});

export const archiveEntryMissions = Object.freeze([
  mission(
    'continue-reading',
    'Continue reading',
    'Open the manga reader at your saved chapter without revealing later archive knowledge.',
    'reader',
    { useSavedBoundary: true },
  ),
  mission(
    'refresh-story',
    'Refresh the story',
    'Review the story, active lanes, and unresolved threads through your reading boundary.',
    'story',
    { mode: 'recap', useSavedBoundary: true },
  ),
  mission(
    'research-topic',
    'Research a topic',
    'Search characters, organizations, Nen, locations, events, relationships, and glossary terms.',
    'search',
    { useSavedBoundary: true },
  ),
  mission(
    'open-complete-archive',
    'Open the complete archive',
    'Use the latest fully indexed chapter as the archive boundary.',
    'story',
    { chapter: archiveCoverage.research.chapter },
  ),
]);

export const explanationModes = Object.freeze([
  Object.freeze({ id: 'brief', label: '60-second recap', description: 'Essential events and the minimum context needed to continue.' }),
  Object.freeze({ id: 'standard', label: 'Normal explanation', description: 'Scene-by-scene context, motives, and immediate consequences.' }),
  Object.freeze({ id: 'deep', label: 'Deep analysis', description: 'Mechanics, causal links, implications, uncertainty, and unresolved threads.' }),
  Object.freeze({ id: 'evidence', label: 'Evidence mode', description: 'Claim-level sources, certainty, translation notes, and contradictions.' }),
]);

export const archiveContextModel = Object.freeze({
  officialPublication: archiveCoverage.publication,
  readableChapter: archiveCoverage.reader,
  fullyIndexedChapter: archiveCoverage.research,
  domains: domainCoverage,
});

export const getArchiveContextForBoundary = (boundary) => {
  const chapter = Number(boundary);
  if (!Number.isInteger(chapter) || chapter <= 0) throw new TypeError('Archive boundary must be a positive integer.');

  return Object.freeze({
    chapter,
    isFullyIndexed: chapter <= archiveCoverage.research.chapter,
    isReadable: chapter <= archiveCoverage.reader.chapter,
    hasVerifiedPublicationMetadata: chapter <= archiveCoverage.publication.chapter,
    laterInformationHidden: chapter < Math.max(archiveCoverage.reader.chapter, archiveCoverage.research.chapter),
  });
};
