# Succession Visual Redesign — Batch 4 Guardian Spirit Beasts

## Hour 49 — Guardian Spirit Beasts, rituals, and system pages

This task redesigns the Guardian Spirit Beast archive without changing canonical beast records, host identities, ability knowledge states, chapter boundaries, evidence, or unresolved questions.

### Royal Nen command

- Present all fifteen host-linked ritual records through a Seed Urn-centered status orbit.
- Preserve a complete semantic host index alongside the visual orbit.
- Distinguish known, suspected, inactive, and unresolved mechanic states with text and structure rather than color alone.
- Allow host-first and beast-first browsing without duplicating canonical records.
- Add search, knowledge-state filtering, host-state filtering, active-filter controls, and a full reset.
- Show known ability, suspected ability, unresolved-question, visibility, and host-state context on each record.

### Guardian Beast dossiers

- Add a cinematic beast identity stage with host, chapter, visibility, certainty, operational state, and knowledge classification.
- Keep host body, host consciousness, beast activity, and Nen continuation as separate presentation fields.
- Separate demonstrated and suspected abilities while retaining direct links into the Nen mechanics laboratory.
- Present unresolved questions as numbered research records.
- Convert the existing chapter-bounded beast timeline into a readable knowledge-history sequence.
- Present Seed Urn and related ritual systems as navigable system records.
- Preserve the complete source trail at the authorized chapter boundary.

### desktop and accessible behavior

- Keep all controls at least 44px high.
- Preserve keyboard navigation and visible focus states.
- Pair the decorative orbit with an ordinary interactive list.
- Remove the large orbit stage on narrow unsupported narrow-width layouts while retaining every host record.
- Disable motion and transitions when reduced motion is requested.
- Avoid raw color values and route-level `!important` overrides.

## Validation

```bash
node scripts/audit-succession-batch-4-guardian-beasts.mjs
npm run audit:succession-visual-foundation
npm run audit:succession-shell-redesign
npm run audit:succession-page-header-redesign
npm run audit:succession-breadcrumb-redesign
npm run audit:succession-batch-2
npm run audit:succession-character-command
npm run audit:succession-royal-command
npm run audit:succession-batch-3
npm run audit:css
npm run audit:readability
npm run audit:accessibility
npm run prepare:eta-assets
npx vite build
```

The dedicated workflow renders `succession/guardian-spirit-beasts` at desktop, unsupported narrow-width, and unsupported narrow-width sizes and publishes screenshots and logs for manual review.
