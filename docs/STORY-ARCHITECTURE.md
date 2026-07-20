# Story redesign architecture

Status: **locked for implementation**  
Version: **2026-07-20**  
Runtime status: **the current hash router remains live until Batch 2**  
Mobile status: **deferred**

This document is the design and routing contract for the Story redesign. The machine-readable companion is `architecture/storyArchitecture.mjs`; `npm run audit:story` blocks accidental drift from the decisions below.

## 1. Product direction

The Story area becomes a chronological library of independent route-level pages. It will no longer depend on one large workspace component to impersonate multiple pages through internal conditionals.

The approved identity is **The Black Archive**:

- dark near-black navigation, heroes, maps, diagrams, search and major transitions;
- warm ivory and paper surfaces for chronology, biography, source notes, tables and long-form reading;
- crimson as the global active color;
- antique gold as the structural and chronological accent;
- steel blue for neutral information and controlled purple for royal/Succession material;
- green used only when the subject itself justifies it, never as the site-wide brand color.

This is a desktop-first redesign. Mobile-specific layout, navigation, touch and acceptance work is deliberately postponed. New architecture must remain adaptable, but no batch may silently expand its scope to include mobile implementation.

## 2. Locked Story taxonomy

The Story hierarchy contains nine editorial destinations:

| Order | Destination | Classification | Depth |
|---:|---|---|---|
| 0 | Volume 0 · Kurapika’s Memories | Prologue | One comprehensive page |
| 1 | Hunter Exam | Official arc page | One comprehensive page |
| 2 | Zoldyck Family | Editorial Story page inside the official Hunter Exam boundary | One comprehensive page |
| 3 | Heavens Arena | Official arc page | One comprehensive page |
| 4 | Yorknew City | Official arc page and first prototype | One comprehensive page |
| 5 | Greed Island | Official arc page | One comprehensive page |
| 6 | Chimera Ant | Official arc page | Comprehensive landing page; nested pages only when justified |
| 7 | 13th Hunter Chairman Election | Official arc page | One comprehensive page |
| 8 | Succession Contest | Official ongoing arc archive | Landing page plus seven deep pages |

### Official versus editorial classification

Hunterpedia treats Chapters 1–43 and 2011 Episodes 1–26 as the official Hunter Exam arc. The redesign does not overwrite that classification. It creates a dedicated **Zoldyck Family editorial page** for Chapters 39–43 and Episodes 22–25, with Episode 26 retained as a recap/supplemental adaptation record.

The Hunter Exam page must therefore show both:

- its exam-focused editorial coverage;
- the complete official boundary that includes the Kukuroo Mountain conclusion.

Zoldyck Family must always display language equivalent to “editorial Story page within the official Hunter Exam arc.” It must never be represented as an eighth official arc.

Volume 0 is a prologue and Yorknew prerequisite, not a numbered official arc.

## 3. Locked route tree

```text
/story
/story/volume-0
/story/hunter-exam
/story/zoldyck-family
/story/heavens-arena
/story/yorknew-city
/story/greed-island
/story/chimera-ant
/story/chairman-election
/story/succession-contest
```

Succession Contest retains real subpages:

```text
/story/succession-contest/royal-family
/story/succession-contest/cast
/story/succession-contest/timeline
/story/succession-contest/black-whale
/story/succession-contest/nen-and-beasts
/story/succession-contest/power-blocs
/story/succession-contest/records
```

Story utilities remain beneath the Story destination without pretending to be arcs:

```text
/story?view=chronology
/story?view=chapters
/story?view=adaptation
```

## 4. Routing policy

Batch 2 will replace the current hash parser with clean history paths. The target router must provide:

1. direct opening and reloading of every clean route;
2. hosting fallback to the application document;
3. browser back/forward behavior;
4. explicit 404 handling;
5. scroll restoration;
6. preservation of query parameters;
7. preservation of the reading/spoiler boundary;
8. redirects from existing hash URLs;
9. updated search, bookmark, notebook and cross-record destinations;
10. route-level lazy loading.

The current hash routes remain functional until that migration is complete. Batch 1 changes no live navigation behavior.

## 5. Page-depth rules

### Standard Story pages

Volume 0, Hunter Exam, Zoldyck Family, Heavens Arena, Yorknew City, Greed Island and Chairman Election each begin as one comprehensive route. Sections use anchors because they remain parts of the same subject.

Example:

```text
/story/yorknew-city#chronology
/story/yorknew-city#characters
/story/yorknew-city#conflicts
```

An anchor is appropriate for a section within one arc. It is not appropriate for hiding a different arc or major standalone archive.

### Chimera Ant

Chimera Ant begins as one route. It may gain nested pages only after the page’s factual and interactive depth proves a subject deserves an independently shareable destination. Possible future candidates include Palace Invasion, conflicts, and Meruem/Komugi, but none are pre-authorized merely because the arc is long.

### Succession Contest

Succession Contest remains a multi-page archive. Its current royal family, cast, timeline, Black Whale, Nen/beasts, power-bloc and record systems must not be collapsed into a normal single-page template.

## 6. Standard arc-page structure

Every standard arc page owns the following editorial sequence:

1. Overview
2. Context before the arc
3. Premise and objectives
4. Complete chronology divided into meaningful phases
5. Character roles in this arc
6. Factions and institutions
7. Locations and routes
8. Conflicts, including games, tests, pursuits, negotiations and operations
9. Nen development
10. Important objects and custody trails
11. Themes and interpretation
12. Ending and aftermath
13. 2011 adaptation layer
14. Sources, evidence boundaries and maintenance notes

Every page also provides:

- one `h1`;
- arc order and classification;
- manga and anime ranges;
- previous/next Story navigation;
- a desktop contents rail;
- a visible spoiler boundary;
- direct links to characters, locations, abilities, conflicts and organizations;
- a unique title, description and canonical route;
- one arc-specific primary interaction.

## 7. Factual and analytical separation

The manga is the factual spine. The 2011 anime is an inline adaptation layer rather than a competing page.

Content must visibly distinguish:

- **Factual record:** sourced events, participants, places, mechanics and outcomes.
- **Structural interpretation:** how an arc or phase is organized.
- **Thematic interpretation:** an explicitly analytical reading.
- **Unresolved question:** evidence that remains incomplete or ambiguous.
- **Adaptation note:** differences in the 2011 anime presentation.

Analytical text must not be styled or phrased as if it were a confirmed story fact.

## 8. Visual system

### Global shell

- Near-black header and footer.
- Dark arc heroes and interactive canvases.
- Warm paper main reading surfaces.
- Crimson active navigation and important actions.
- Gold numbering, chronology and structural lines.
- Square or subtly rounded editorial containers.
- Pills limited to statuses and compact controls.
- Open layouts, rules, numbered sections, timelines, diagrams and tables used before repetitive card grids.

### Arc accents

| Destination | Controlled accent |
|---|---|
| Volume 0 | Muted scarlet |
| Hunter Exam | Antique/burnt gold |
| Zoldyck Family | Deep violet and silver |
| Heavens Arena | Cobalt and steel |
| Yorknew City | Crimson and amber |
| Greed Island | Cyan/electric blue with magenta details; no green interface identity |
| Chimera Ant | Ochre, rust and pale bone |
| Chairman Election | Navy, red and silver |
| Succession Contest | Royal purple, black and gold |

Arc accents modify atmosphere, diagrams and highlights; they do not create nine unrelated websites.

## 9. Yorknew prototype contract

Yorknew City is the first implementation prototype because it exercises nearly every reusable system:

- a dense chronology;
- multiple factions;
- a large cast;
- locations and movement;
- Nen abilities and conditions;
- battles and non-battle conflicts;
- consequential objects;
- relationships and loyalties;
- manga/anime comparison;
- long-term consequences.

The prototype should establish:

1. the dark hero and paper-body composition;
2. desktop contents and context rails;
3. shared arc facts and previous/next navigation;
4. event and phase schemas;
5. character-in-arc records;
6. source/evidence presentation;
7. arc-specific module boundaries;
8. performance budgets for independently loaded pages.

Yorknew-specific modules may include an auction chronology, Phantom Troupe board, Kurapika chain inspector, fortune matrix, power map and hostage-exchange sequence.

## 10. Data ownership target

The redesign must not replace the canonical registries completed in the previous cleanup work.

An arc page owns only its arc-specific structure and relationships. Shared entities remain canonical elsewhere:

- characters in the character registry;
- portraits in the canonical portrait-source pipeline;
- locations in the world hierarchy;
- Nen abilities in the Nen/encyclopedia records;
- organizations in organization/system records;
- conflicts in the conflict registry;
- chapter titles and chapter records in their existing owners.

Arc data should reference stable IDs instead of copying complete character, location or ability records.

Expected future layout:

```text
src/data/story/
  manifest.js
  volumeZero.js
  hunterExam.js
  zoldyckFamily.js
  heavensArena.js
  yorknewCity.js
  greedIsland.js
  chimeraAnt.js
  chairmanElection.js
  successionContest.js
```

Large arc domains may split into independently loaded files only after the route-level page exists and a measured bundle or maintenance need justifies the split.

## 11. Legacy route mapping

The router migration must map, at minimum:

```text
#/series                    → /story
#/series/volume-0           → /story/volume-0
#/series/hunter-exam        → /story/hunter-exam
#/series/heavens-arena      → /story/heavens-arena
#/series/yorknew-city       → /story/yorknew-city
#/series/greed-island       → /story/greed-island
#/series/chimera-ant        → /story/chimera-ant
#/series/chairman-election  → /story/chairman-election
#/series/chronology         → /story?view=chronology
#/series/chapters           → /story?view=chapters
#/series/adaptation         → /story?view=adaptation
```

Current Succession routes map to their new nested Story destinations. Query parameters such as selected chapter, panel, prince, focus or mode must be translated rather than discarded.

## 12. Nine implementation batches

1. **Architecture lock** — this contract, taxonomy, routes, visual direction and audit.
2. **Router migration** — clean paths, redirects, history, reload fallback and 404 behavior.
3. **Story foundation** — `/story`, shared arc shell, breadcrumbs, timeline, spoiler and desktop navigation primitives.
4. **Yorknew prototype** — first complete route-level arc page and final reusable design language.
5. **Early arcs** — Hunter Exam, Zoldyck Family and Heavens Arena.
6. **Greed Island** — game, cards, map, training and conflicts.
7. **Chimera Ant** — large arc implementation and measured nested-page decision.
8. **Final pre-Succession material** — Chairman Election and Volume 0.
9. **Integration and cleanup** — Succession relocation, search/cross-links, metadata, redirects, tests and removal of the old monolithic workspace.

One major batch is completed at a time.

## 13. Batch 1 acceptance criteria

Batch 1 is complete when:

- the taxonomy contains exactly nine editorial Story destinations;
- all seven official arcs are represented once;
- Volume 0 is explicitly a prologue;
- Zoldyck Family is explicitly an editorial page inside the official Hunter Exam boundary;
- every destination has a planned clean route and reciprocal previous/next relationship;
- Succession retains seven planned subpages;
- manga/anime and factual/analytical policies are machine-readable;
- The Black Archive hybrid design and crimson primary accent are locked;
- mobile is explicitly deferred;
- Yorknew is locked as the prototype;
- the build runs `audit:story`;
- this document and the machine-readable contract agree.

## 14. Out of scope for Batch 1

This patch does **not**:

- change the live router;
- change existing URLs;
- redesign current pages;
- add Zoldyck Family to live navigation;
- move Succession pages;
- add responsive/mobile layouts;
- replace current Story components;
- expand arc prose or research.

Those changes begin in Batch 2 and later batches against this locked contract.
