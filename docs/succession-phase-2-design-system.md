# Succession Contest — Phase 2 shared design system

## Purpose

Phase 2 converts the approved monochrome architecture board into the shared production language for every Succession Contest route. It does not redesign the individual Story Intelligence, People & Power, Black Whale, Nen Systems, Search, Research, or Glossary workspaces; those information-design decisions remain reserved for Phases 3A–3E and require explicit discussion.

## Included

- strict black, white, and grayscale token system
- serif display hierarchy and technical sans-serif interface hierarchy
- square editorial panels and restrained document rules
- monochrome active, hover, focus, disabled, and evidence states
- shared desktop sidebar, route context, hub tabs, page header, controls, and metadata surfaces
- shared mobile command bar and modal navigation drawer
- compatibility aliases that remove gold and colored accents from the common shell
- forced-colors and reduced-motion behavior
- preserved deep links, stable IDs, chapter boundary, Reader separation, and route contracts

## Architecture canvas acceptance fix

On large desktop screens, the Phase 1 architecture board owns the complete browser canvas:

- the surrounding browser canvas is paper white rather than the retired dark background
- the board is fitted proportionally into the available viewport
- the page does not create a vertical or horizontal desktop scrollbar
- the complete document remains visible rather than being clipped

On smaller laptop, tablet, and mobile viewports, normal document scrolling is retained so text is not reduced below a useful reading size.

## Explicitly deferred

- Story, Chapters, Timeline, and Events information design
- Characters, Royal Family, Assignments, Organizations, and Relationships information design
- Ship Atlas and Locations information design
- Nen & Rituals and Guardian Spirit Beasts information design
- Search, Research, and Glossary information design
- final section-specific illustrations, layouts, filters, dossiers, and micro-interactions

## Release gates

Phase 2 is not complete until the production build, runtime audits, browser verification, responsive visual suite, accessibility suite, keyboard flows, and Chromium/Firefox/WebKit matrices pass on one exact commit.
