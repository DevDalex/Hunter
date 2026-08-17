# Succession Visual Redesign — Final Audit

## Closure objective

The final six tasks close the redesign as a desktop product rather than adding another content domain. The acceptance target is a coherent, keyboard-complete, stable, and cross-browser Succession Archive whose presentation remains separate from canonical data and research ownership. The supported interface contract is desktop-only with an 1180px minimum application width; narrow-screen and touch-device layouts are intentionally outside scope.

## Hour 59 — Interaction and motion states

- Add consistent pressed feedback, focus-visible treatment, and disabled treatment for desktop interaction.
- Restrict hover-dependent elevation and translation to fine-pointer devices that support hover.
- Add route-change focus management and a polite workspace announcement.
- Add complete Arrow Left, Arrow Right, Home, and End keyboard behavior to shared archive tabs with roving `tabIndex`.
- Add a global reduced-motion contract that removes meaningful transitions, animation repetition, and smooth scrolling.
- Add stable image-loading transitions without replacing the existing lazy loading, IntersectionObserver prefetch, async decoding, fetch priority, fallback, and intrinsic-size behavior.

## Hour 60 — Complete desktop review

- Render every curated Succession release route at 1440×1000.
- Include the global Timeline in addition to the Succession Archive release routes.
- Check page errors, failed local requests, uncontained spill, body overflow, tiny text, broken images, duplicate IDs, heading structure, and workspace landmarks.
- Preserve intentional horizontal navigation only inside labelled and keyboard-focusable scroll regions.
- Save one desktop screenshot for every route check.

## Hour 61 — Accessibility review

- Run axe against every curated Succession route at the supported desktop viewport using WCAG 2.0/2.1 A and AA tags.
- Treat color contrast as part of the final gate rather than a deferred warning.
- Verify route-change focus, assignment result-mode keyboard operation, reduced-motion behavior, and forced-colors focus visibility.
- Preserve skip navigation, semantic headings, labelled regions, current-page state, selected-tab state, accessible tables, and text alternatives for graphs and maps.

## Hour 62 — Performance and visual stability

- Retain route-level dynamic imports and the existing startup, stylesheet, chunk, portrait, and portrait-library budgets.
- Run the production performance audit after the final Vite build.
- Add `content-visibility: auto` and `contain-intrinsic-size` to long repeated intelligence records while keeping print output fully visible.
- Stabilize horizontal scroll regions with overscroll containment and scrollbar gutters.
- Measure cumulative layout shift for every final Chromium desktop route render and reject any route above 0.18.
- Keep `SafeImage` lazy loading, near-viewport prefetch, async decoding, fetch priority, width/height support, and failure fallback intact.

## Hour 63 — Legacy cleanup and cross-browser regression

- Remove the obsolete Assignment workspace declarations and retain only an import-only compatibility entry for the stable component import.
- Prevent duplicate loading of the Assignment command stylesheet.
- Keep the final shared interaction layer last in the Succession style chain.
- Run representative high-complexity routes in Firefox and WebKit at 1440×1000 desktop size.
- Check runtime errors, console errors, failed local requests, body overflow, uncontained spill, broken images, heading structure, workspace landmarks, visible focus, Assignment table interaction, and Black Whale mode interaction.

## Hour 64 — Final visual audit and release record

- Run every Batch 1–5 structural audit and inherited visual contract.
- Run CSS ownership, readability, desktop layout, accessibility, performance, and production-build checks.
- Run the complete desktop accessibility/stability matrix and representative desktop Firefox/WebKit matrix.
- Review generated desktop screenshots and reports.
- Record non-critical debt explicitly rather than hiding it.
- Update Issue #49 and PR #54 only after the latest branch head passes the complete gate.

## Desktop-only support contract

- Minimum supported application width: **1180px**.
- Canonical automated browser viewport: **1440×1000**.
- The product does not maintain a narrow-screen alternate navigation, drawer, touch layout, phone/tablet breakpoint matrix, safe-area layout, or coarse-pointer mode.
- Changes that reintroduce those systems should fail the desktop-only structural audits.

## Final command set

```bash
node scripts/audit-succession-batch-5-final.mjs
npm run audit:css
npm run audit:readability
npm run audit:layout
npm run audit:accessibility
npm run prepare:eta-assets
npx vite build
npm run audit:performance
node scripts/succession-final-release-qa.mjs
node scripts/succession-cross-browser-qa.mjs
```

Tasks 59–64 remain incomplete until the latest PR head passes this desktop-only gate and the generated artifacts are reviewed.
