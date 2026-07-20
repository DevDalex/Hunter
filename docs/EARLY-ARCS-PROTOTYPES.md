# Early Arc prototype pages

Status: **Batch 5 Story redesign**  
Mobile status: **deferred**

Batch 5 applies the Yorknew prototype pattern to the early Story stretch without starting Greed Island, Chimera Ant, the Character redesign, or a mobile redesign pass.

## What this batch owns

1. `Hunter Exam` receives a dedicated prototype page for hidden screening, exam phases, applicant roles, tests, objects, final bracket pressure, aftermath, and adaptation notes.
2. `Zoldyck Family` stops using the temporary Story bridge and receives a dedicated editorial Story page while remaining explicitly inside the official Hunter Exam boundary.
3. `Heaven’s Arena` receives a dedicated prototype page for tower progression, 200th-floor rules, fighter roles, matches, Nen curriculum, aftermath, and adaptation notes.
4. The shared early-page component keeps the Black Archive direction: dark hero, warm paper sections, chronology ledger, role board, conflict ledger, mechanics inspector, aftermath/adaptation panels, and source grid.
5. Portraits continue to use the canonical character owner. If a stored portrait is unavailable, the page renders a stable initials token instead of probing remote images at runtime.
6. `npm run audit:story` now checks the early prototype data, routing, module coverage, approved source hosts, and the removal of the temporary Zoldyck bridge from the Story workspace.

## What this batch does not own

Batch 5 does not migrate Greed Island, Chimera Ant, Chairman Election, Volume 0, Succession, or Character profiles. It also does not promote Zoldyck into the legacy release route manifest; the clean `/story/zoldyck-family` route is already live, while the legacy release inventory remains stable until the broader release accounting pass.

## Runtime files

- `src/data/earlyArcPrototypes.js`
- `src/components/EarlyArcPrototypePage.jsx`
- `src/components/EarlyArcPrototypePage.css`
- `src/components/SeriesWorkspace.jsx`
- `scripts/audit-story-architecture.mjs`

## Acceptance rule

`npm run audit:story` must confirm that Hunter Exam, Zoldyck Family, and Heaven’s Arena route through `EarlyArcPrototypePage`, that the early arc data groups are complete, that all early arc source links pass the approved Hunterpedia/Fandom source policy, and that the temporary Zoldyck bridge no longer renders inside `SeriesWorkspace`.
