import { getArcByChapter } from './arcs';
import { chapterTitles } from './chapterTitles';
import { getVolumeByChapter } from './volumes';
import { chapterFocus } from './successionDossier';
import { getSeriesPhaseByChapter } from './seriesArcDossiers';
import { getPreSuccessionResearch } from './seriesResearch';
import { hunterExamChapterDetails } from './hunterExamChapterDetails';
import {
  getChapterCatalogueTitle,
  getLatestChapterMetadata,
  LATEST_PUBLISHED_CHAPTER,
} from './latestChapterMetadata';

export const LATEST_CHAPTER = LATEST_PUBLISHED_CHAPTER;
export const FANDOM_BASE = 'https://hunterxhunter.fandom.com/wiki';

const verifiedDetails = {
  411: {
    pages: 20,
    releaseDate: 'June 29, 2026',
    summary: 'On Voyage Day 12, Halkenburg—acting through Balsamilco’s body—confirms the funeral schedule with Benjamin. Kaiser, Melody, and Kacho’s Guardian Spirit Beast monitor Fugetsu, while Sarahell prepares to infiltrate Room 1014 and Kurapika opens the expanded second round of Nen lessons.',
    characters: ['Halkenburg Hui Guo Rou', 'Balsamilco Might', 'Benjamin Hui Guo Rou', 'Kaiser', 'Melody', 'Fugetsu Hui Guo Rou', 'Kacho Hui Guo Rou', 'Sarahell', 'Kurapika', 'Bill', 'Shimano'],
    locations: ['Black Whale', 'Tier 2 Ministry of Justice', 'Room 302', 'Room 1014'],
    notes: ['Current Succession Contest material.', 'Hunterpedia source checked July 12, 2026.'],
    researchStatus: 'Verified detail',
  },
  412: {
    summary: 'With five hours left before special martial law, Kurapika explains the ritual logic behind the Succession Contest and why the voyage must produce a successor. The chapter later returns to the period forty-eight hours before martial law as Kurapika and Bill review Longhi’s warning after the day’s Nen lessons.',
    characters: ['Kurapika', 'Bill', 'Shimano', 'Longhi'], locations: ['Black Whale', 'Room 1014'], notes: ['Title: Question.', 'Hunterpedia source checked July 13, 2026; the page remains a developing current-arc record.'],
    researchStatus: 'Source-checked current detail',
  },
  413: {
    pages: 19,
    releaseDate: 'July 13, 2026',
    summary: 'On Voyage Day 12, Halkenburg\'s guards carry his casket to the guarded entrance of Nasubi\'s quarters, where Nugui and a group of priests await the funeral procession.',
    characters: ['Halkenburg Hui Guo Rou', 'Nugui', 'Nasubi Hui Guo Rou'],
    locations: ['Black Whale', 'Tier 1', 'King\'s Living Quarters Gate'],
    notes: ['Title: Loyalty.', 'Hunterpedia source checked July 13, 2026; current-arc material remains subject to source-page updates.'],
    researchStatus: 'Source-checked current detail',
    lastReviewed: 'July 13, 2026',
  },
  414: {
    releaseDate: 'July 19, 2026',
    summary: 'Chapter 414 is published and indexed as “Friends.” Detailed scene, appearance, location, and consequence claims remain pending maintained Hunterpedia research review.',
    notes: ['Publication identity verified July 27, 2026.', 'Detailed research intentionally remains pending rather than importing unverified scene claims.'],
    researchStatus: 'Catalogue record',
    lastReviewed: 'July 27, 2026',
  },
  415: {
    releaseDate: 'July 26, 2026',
    summary: 'Chapter 415 is published. The Japanese title is 真偽; “Truth and Falsehood” is used as a provisional English rendering while detailed scene, appearance, location, and consequence claims remain pending maintained Hunterpedia research review.',
    notes: ['Publication identity verified July 27, 2026.', 'English title rendering remains provisional until the maintained English reference record is available.', 'Detailed research intentionally remains pending rather than importing unverified scene claims.'],
    researchStatus: 'Catalogue record',
    lastReviewed: 'July 27, 2026',
  },
};

const makeStudyPrompt = (arc, number, title) => {
  const lens = arc.focus[(number - arc.chapters[0]) % arc.focus.length];
  return `While reading “${title},” track ${lens.toLowerCase()} and note what changes between the chapter’s opening and closing scene.`;
};

const chapterCatalogueTitles = Array.from(
  { length: LATEST_CHAPTER },
  (_, index) => getChapterCatalogueTitle(index + 1, chapterTitles),
);

export const chapters = chapterCatalogueTitles.map((title, index) => {
  const number = index + 1;
  const arc = getArcByChapter(number);
  const volume = getVolumeByChapter(number);
  const studyPhase = getSeriesPhaseByChapter(number);
  const preSuccessionResearch = number <= 339 ? getPreSuccessionResearch(number) : null;
  const phaseContextDetail = preSuccessionResearch ? {
    summary: `“${title}” sits in the ${preSuccessionResearch.phaseTitle} study phase. ${preSuccessionResearch.phaseSummary} This local account supplies verified arc-phase context; the chapter page remains the source for exact scene order and appearance data.`,
    notes: ['Phase-grounded local study record.', 'Chapter-specific source evidence is kept separate from arc-phase context.'],
    researchStatus: 'Arc-phase study record',
    lastReviewed: 'July 14, 2026',
  } : {};
  const successionDetail = number >= 340 ? {
    summary: chapterFocus[number],
    notes: ['Locally maintained current-arc study summary.', 'Hunterpedia chapter record linked; chronology is cross-indexed in the Succession dossier.'],
    researchStatus: 'Locally summarized Succession record',
    lastReviewed: 'July 14, 2026',
  } : {};
  const releaseMetadata = getLatestChapterMetadata(number);
  const detail = { ...phaseContextDetail, ...successionDetail, ...(hunterExamChapterDetails[number] || {}), ...(verifiedDetails[number] || {}) };

  return {
    number,
    label: `Chapter ${String(number).padStart(3, '0')}`,
    title,
    arcId: arc.id,
    arcTitle: arc.title,
    volume: volume?.number || null,
    volumeStatus: volume?.number === 39 ? 'Fandom lists chapters 401–410 for Volume 39' : volume ? `Collected in Volume ${volume.number}` : 'Not yet listed in a collected volume',
    sourceUrl: `${FANDOM_BASE}/Chapter_${number}`,
    officialReaderUrl: releaseMetadata?.officialReaderUrl || null,
    titleStatus: releaseMetadata?.titleStatus || 'maintained-reference-title',
    detailStatus: releaseMetadata?.detailStatus || (detail.researchStatus === 'Catalogue record' ? 'catalogue' : 'maintained-research'),
    summary: detail.summary || `${title} is Chapter ${number} of the ${arc.title} arc${volume ? ` and is collected in Volume ${volume.number}` : ''}. Use the linked Hunterpedia entry for the full community synopsis and appearance list.`,
    studyPrompt: makeStudyPrompt(arc, number, title),
    pages: detail.pages || null,
    releaseDate: detail.releaseDate || releaseMetadata?.releaseDate || null,
    tankobonDate: detail.tankobonDate || null,
    adaptations: detail.adaptations || [],
    characters: detail.characters || [],
    locations: detail.locations || [],
    notes: detail.notes || [],
    tags: [arc.short, volume ? `Volume ${volume.number}` : 'Uncollected', preSuccessionResearch?.phaseTitle, preSuccessionResearch?.beat].filter(Boolean),
    studyPhase: studyPhase?.title || null,
    phaseContext: studyPhase?.summary || null,
    phaseLens: studyPhase?.shift || null,
    phaseSource: studyPhase?.source || null,
    researchStatus: detail.researchStatus || 'Catalogue record',
    lastReviewed: detail.lastReviewed || (detail.researchStatus ? 'July 12, 2026' : null),
    research: preSuccessionResearch,
  };
});
