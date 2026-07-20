# Dedicated Story arc pages

Status: active Story contract

## Reader-facing rule

One arc owns one complete route and one complete page. Arc content is no longer inserted into a shared three-column Story workspace.

The routes are:

- `/story/volume-0`
- `/story/hunter-exam`
- `/story/zoldyck-family`
- `/story/heavens-arena`
- `/story/yorknew-city`
- `/story/greed-island`
- `/story/chimera-ant`
- `/story/chairman-election`
- `/story/succession-contest`

The Story reference tools remain separate:

- `/story?view=chronology`
- `/story?view=chapters`
- `/story?view=adaptation`

## Canonical owners

- `src/data/storyArcPages.js` owns all nine arc records and their visual identities.
- `src/components/StoryHub.jsx` owns the chronological directory.
- `src/components/ArcPage.jsx` owns the dedicated arc renderer.
- `src/components/ArcPage.css` owns the shared editorial layout.
- `src/components/StoryHub.css` owns the directory layout.
- `src/components/StoryUtilities.css` owns separate chronology, chapter, and anime-reference presentation.
- `src/lib/appRouter.js` owns direct-reload routes and the split between the Succession arc page and its seven deep subpages.

## Arc-page anatomy

Each arc page contains:

1. full-width arc hero;
2. before-the-arc context;
3. premise, objective, stakes, structure, and central question;
4. phased chronology;
5. arc-specific characters;
6. factions and power groups;
7. locations and movement;
8. Nen development;
9. conflicts and operations;
10. consequential objects;
11. explicitly labelled thematic interpretation;
12. before-and-after state changes;
13. ending;
14. transition to the next arc;
15. manga and 2011-anime comparison;
16. scoped chapter directory;
17. direct Hunterpedia/Fandom sources.

## Visual identities

The pages share typography, spacing, accessibility, and record components without becoming recoloured clones.

- Volume 0: memory, parchment, scarlet, restrained forest green.
- Hunter Exam: examination documents, cream, muted orange, natural green.
- Zoldyck Family: stone, grey-blue, restrained violet.
- Heavens Arena: ivory, steel blue, quiet gold.
- Yorknew City: charcoal, burgundy, antique gold.
- Greed Island: warm card paper, muted green, amber.
- Chimera Ant: ash, military green, restrained royal red.
- Chairman Election: paper white, navy, muted red.
- Succession Contest: ivory, charcoal, subdued purple and crimson.

No arc page uses neon glows, cyberpunk borders, or permanent sidebars.

## Succession Contest

`/story/succession-contest` is the complete dedicated arc page. The seven deep archive destinations remain available beneath it:

- royal family;
- cast and assignments;
- voyage timeline;
- Black Whale atlas;
- Nen and Guardian Spirit Beasts;
- power blocs;
- records.

## Responsive rule

Desktop remains the primary canvas, but every dedicated page has a logical tablet and phone collapse:

- one dominant reading column;
- horizontally scrollable section navigation;
- no permanent sidebars;
- stacked metadata and comparisons;
- responsive grids;
- tables contained in named scroll regions;
- no information available only through hover.

## Source and analysis rule

The manga remains the factual spine. The 2011 anime is an adaptation layer. Themes are visibly labelled as interpretation. Arc and chapter sources remain Hunterpedia/Fandom only.
