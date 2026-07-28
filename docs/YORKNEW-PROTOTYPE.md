# Yorknew prototype page

Status: **Batch 4 prototype**  
unsupported narrow-width status: **deferred**

Batch 4 makes `/story/yorknew-city` the first full Story redesign prototype.

## What this batch owns

1. a dedicated `YorknewPrototypePage.jsx` route body inside the Batch 3 Story foundation shell;
2. a dark Black Archive Yorknew hero with sourced character portraits and route actions;
3. a local section rail for overview, chronology, factions, Troupe board, Kurapika/Nen, conflicts, fortunes, objects, aftermath, adaptation, and sources;
4. a structured Yorknew data owner in `src/data/yorknewPrototype.js`;
5. reusable presentation patterns for later arc pages: chronology ledger, faction board, organization board, Nen inspector, conflict ledger, object ledger, and adaptation/source panels;
6. audit coverage ensuring Yorknew no longer falls back to the old generic `PreSuccessionExperience` renderer.

## What this batch does not own

Batch 4 does not redesign Hunter Exam, Zoldyck Family, Heavens Arena, Greed Island, Chimera Ant, Chairman Election, Succession, Characters, Nen, World, Organizations, or Fights. It also does not perform a full unsupported narrow-width implementation pass.

## Source boundary

The factual source perimeter remains Hunterpedia/Fandom. The prototype page stores approved source links in `yorknewPrototype.sources`, while the page structure and analysis layers remain editorial archive design.

## Runtime files

- `src/components/YorknewPrototypePage.jsx`
- `src/components/YorknewPrototypePage.css`
- `src/data/yorknewPrototype.js`
- `src/components/SeriesWorkspace.jsx`
- `scripts/audit-story-architecture.mjs`

## Acceptance rule

`npm run audit:story` now checks that Yorknew has a dedicated prototype component and data owner, that the component imports its stylesheet, that the data contains all prototype content groups, that every Yorknew source URL follows the approved source policy, and that `SeriesWorkspace` routes Yorknew to `YorknewPrototypePage` instead of the old generic arc renderer.
