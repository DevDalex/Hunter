# Homepage verification contract

The production application is currently a homepage-only runtime. Release verification must protect the behavior that is actually shipped rather than require retired archive UI implementations to remain mounted.

## Blocking release checks

`npm run verify` protects:

- generated build identity and generated documentation consistency
- unit tests
- homepage-only runtime ownership and navigation normalization
- route registry, archive coverage, spoiler-boundary, and QA-contract integrity
- archive data schema integrity
- Succession research reachability through the current chapter boundary
- hosted chapter-admin syntax and import/submit contracts
- media derivative consistency
- Vite production build
- startup JavaScript/CSS and asset performance budgets
- Cloudflare artifact structure and Worker routing

`npm run qa:browser:ci` additionally runs a focused Chromium check against the built homepage. It verifies URL normalization, the primary content landmark, internal navigation staying on `/`, keyboard skip-link behavior, WCAG A/AA axe checks, and uncaught browser exceptions.

## Non-blocking legacy checks

Historical Succession redesign, Timeline, route-shell, Phase 5, and other implementation-specific audit/QA scripts remain in the repository for reference and targeted legacy work. They are intentionally not part of the homepage release gate because they encode retired component names, JSX shapes, CSS selectors, or route architecture.

When a legacy area becomes live again, migrate the relevant behavioral checks into the current release contract instead of restoring exact-source assertions wholesale.
