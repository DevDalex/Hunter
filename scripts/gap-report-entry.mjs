import { chapters } from '../src/data/chapters';
import { mediaCoverageByCategory, mediaRegistry } from '../src/data/mediaRegistry';

export const gapReport = () => ({
  chapters: {
    total: chapters.length,
    chapterSpecific: chapters.filter((chapter) => !['Catalogue record', 'Arc-phase study record'].includes(chapter.researchStatus)).map((chapter) => chapter.number),
    phaseContext: chapters.filter((chapter) => chapter.researchStatus === 'Arc-phase study record').map((chapter) => ({ number: chapter.number, title: chapter.title, arc: chapter.arcTitle })),
  },
  media: {
    coverage: mediaCoverageByCategory,
    textOnly: mediaRegistry.filter((record) => record.state === 'text-only').map(({ entityId, category, name, articleSource }) => ({ entityId, category, name, articleSource })),
    verifiedRemote: mediaRegistry.filter((record) => record.state === 'verified-remote').map(({ entityId, category, name, image, imageSource }) => ({ entityId, category, name, image, imageSource })),
  },
});
