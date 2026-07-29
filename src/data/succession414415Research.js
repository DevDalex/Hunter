import * as base from './succession414415ResearchBase.js';

export * from './succession414415ResearchBase.js';

const freeze = (value) => Object.freeze(value);
const chapterSource = (number) => `https://hunterxhunter.fandom.com/wiki/Chapter_${number}`;

export const succession414415SourcePolicy = freeze({
  reviewedAt: '2026-07-29',
  primary: freeze([
    freeze({ label: 'VIZ Chapter 414', url: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-414/chapter/50800' }),
    freeze({ label: 'VIZ Chapter 415', url: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829' }),
  ]),
  structuredReference: freeze([
    freeze({ label: 'Hunterpedia Chapter 414', url: chapterSource(414) }),
    freeze({ label: 'Hunterpedia Chapter 415', url: chapterSource(415) }),
  ]),
  translationCrossCheck: freeze([
    freeze({ label: 'VoraciousDrake Chapter 414 notes', url: 'https://voraciousdrake.wordpress.com/2026/07/17/hxh-414-friends/' }),
    freeze({ label: 'VoraciousDrake translation archive', url: 'https://voraciousdrake.wordpress.com/category/hunter-x-hunter/translations/' }),
  ]),
  communityContextOnly: freeze([
    freeze({
      label: 'Succession Contest Encyclopedia V2',
      url: 'https://www.reddit.com/r/HunterXHunter/comments/1uhy42i/the_succession_contest_encyclopedia_v2_full/',
      boundary: 'Background cast, household, and system orientation only; it predates Chapters 414–415 and does not control current-event claims.',
    }),
    freeze({
      label: 'HunterxNen',
      url: 'https://www.hunterxnen.com/',
      boundary: 'Community Nen-system orientation only; manga and chapter-specific sources remain controlling.',
    }),
  ]),
  excluded: freeze([
    'Comic Watch reviews',
    'Unapproved Japanese-language analysis pages',
    'nen.ca/mangahelpers',
  ]),
});

export const succession414415CrossChecks = freeze([
  freeze({
    id: 'viz-414',
    chapter: 414,
    label: 'VIZ official Chapter 414 release',
    role: 'Official English publication identity and release verification',
    url: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-414/chapter/50800',
  }),
  freeze({
    id: 'viz-415',
    chapter: 415,
    label: 'VIZ official Chapter 415 release',
    role: 'Official English publication identity and release verification',
    url: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829',
  }),
  freeze({
    id: 'hunterpedia-414',
    chapter: 414,
    label: 'Hunterpedia Chapter 414',
    role: 'Project-standard chapter reference and structured cross-link target',
    url: chapterSource(414),
  }),
  freeze({
    id: 'hunterpedia-415',
    chapter: 415,
    label: 'Hunterpedia Chapter 415',
    role: 'Project-standard chapter reference and structured cross-link target',
    url: chapterSource(415),
  }),
  freeze({
    id: 'voracious-drake-414',
    chapter: 414,
    label: 'VoraciousDrake translation notes · Chapter 414',
    role: 'Independent translation and terminology cross-check',
    url: 'https://voraciousdrake.wordpress.com/2026/07/17/hxh-414-friends/',
  }),
  freeze({
    id: 'voracious-drake-415',
    chapter: 415,
    label: 'VoraciousDrake translation archive · Chapter 415 review boundary',
    role: 'Independent translation and mechanics cross-check where a current entry is available',
    url: 'https://voraciousdrake.wordpress.com/category/hunter-x-hunter/translations/',
  }),
]);

const forbiddenActiveSourceFragments = ['comic-watch.com', 'skypenguin.net', 'nen.ca/mangahelpers'];
for (const source of succession414415CrossChecks) {
  if (forbiddenActiveSourceFragments.some((fragment) => source.url.includes(fragment))) {
    throw new Error(`Disallowed Chapter 414–415 source remained active: ${source.url}`);
  }
}

const confidenceByChapter = freeze({
  414: freeze([
    'official publication verified',
    'chapter sequence cross-checked with Hunterpedia and VoraciousDrake',
    'actual Woble location remains unresolved',
    'outside contacts are prospective, not confirmed participants',
  ]),
  415: freeze([
    'official publication verified',
    'chapter sequence and terminology cross-checked with Hunterpedia and VoraciousDrake',
    'Furykov’s 365-day and 700-day figures are specific estimates for the detected curse',
    'Luzurus responsibility and Benjamin’s deeper emergency objective remain unresolved',
  ]),
});

export const succession414415ChapterResearch = freeze(base.succession414415ChapterResearch.map((record) => freeze({
  ...record,
  confidence: confidenceByChapter[record.number] || record.confidence,
  crossChecks: freeze(succession414415CrossChecks.filter((source) => source.chapter === record.number)),
  lastReviewed: 'July 29, 2026',
})));

export const succession414415ChapterFocus = freeze(Object.fromEntries(
  succession414415ChapterResearch.map((record) => [record.number, record.focus]),
));
