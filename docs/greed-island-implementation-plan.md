# Greed Island dedicated page — implementation and data plan

## Objective

Replace the generic `/story/greed-island` arc record with an interactive archive that behaves like entering Greed Island: Eta introduces the rules, the player summons a Binder, cards can be examined and organized, and later systems share one verified data backbone.

Primary research source: Hunterpedia / Hunter × Hunter Fandom until the project owner changes that rule.

## Non-negotiable verification rules

1. Do not invent facts, card records, quests, players, locations, or media.
2. Do not derive Hunterpedia image URLs by guessing filenames.
3. A visual is registered only after its remote URL is confirmed and an appropriate local WebP fallback is committed.
4. Important media may not fall back to an unrelated portrait. Missing card artwork uses a designed card back.
5. Every factual record carries a source reference and field-level verification state.
6. Drag-and-drop always has tap/click and keyboard alternatives.
7. Reduced-motion, desktop layout, focus visibility, screen-reader status, and non-image descriptions are release requirements.
8. The pull request stays unmerged until production build and Browser Verification pass.
9. A successful repository build is not evidence that a Workers deployment is live. Deployment requires an independent public-route check.

## Canonical data model

### Specified Slot card

```js
{
  id: '002',
  number: 2,
  name: 'Plot of Beach',
  rank: 'SS',
  conversionLimit: 3,
  category: 'specified',
  border: 'red',
  description: null,
  acquisition: null,
  story: null,
  sourceRef: 'hunterpedia-card-list',
  verification: {
    core: 'verified',
    description: 'pending',
    acquisition: 'pending',
    story: 'pending',
    media: 'pending',
  },
  media: {
    remote: null,
    local: null,
    fallback: 'generated-card-back',
  },
}
```

The initial registry validates all 100 entries at module load: continuous numbering from `000` to `099`, unique names, supported ranks, and positive integer conversion limits.

### Planned extensions

- `descriptions`: exact effect and materialized-object text with source trace.
- `acquisition`: quest, location, participants, conditions, repeatability, and result.
- `storyUses`: user, action, consequence, chapter range, episode range.
- `media`: verified remote URL, local WebP, dimensions, crop, alt text, source page.
- `relationships`: card-to-location, card-to-quest, card-to-player, and counter-card links.
- `adaptation`: manga, 2011 anime, 1999 OVA, and G.I Tutorial references.

## Staged implementation

### Stage 1 — canonical registry and Binder foundation

Status: in this pull request.

- Register cards `000–099` with verified core fields.
- Reject missing, duplicate, misordered, or invalid records.
- Create a dedicated `GreedIslandPage` route.
- Create an original CSS/SVG-like Starting Point, Eta mechanism, ring, Binder, and card-back visual language without external media.
- Implement ten Binder pages with ten Specified Slots each.
- Persist inserted cards in local storage.
- Support hold, insert, lift, matching-number rejection, search, reset, and completion progress.
- Lock card `000` until `001–099` are inserted.
- Provide drag, tap/click, and keyboard paths.
- Label Eta's analysis device as an archive reconstruction.

### Stage 2 — Eta's complete tutorial and card anatomy

- Expand the tutorial to all twelve agreed chapters.
- Add replay, source, episode, skip, related-rule, and try-interaction controls.
- Build card-anatomy highlighting.
- Build rank H–SS ladder and conversion-limit simulation.
- Add the reversible website-only `Gain` demonstration.

### Stage 3 — complete card records and verified visual archive

- Verify descriptions, objects, acquisition methods, story use, chapters, and episodes for `000–099`.
- Validate every image URL individually.
- Produce optimized local WebP fallbacks.
- Add an automated 100-card media audit.
- Add search and filters without hiding information behind hover.

### Stage 4 — Spell, Free Slot, and Game Master cards

- Register the forty Spell Cards.
- Register every documented Free Slot card; leave undocumented records absent.
- Register confirmed Game Master-only cards.
- Build the terminal targeting simulator and spell interaction graph.

### Stage 5 — island map, locations, and quests

- Build the island map and progressive reveal.
- Add verified location records, NPCs, players, cards, quests, conflicts, chapters, episodes, and travel links.
- Connect both `Card → Quest → Location` and `Location → Quests → Cards` browsing paths.

### Stage 6 — players and Game Masters

- Build the encountered-player Binder.
- Add alliance, goal, encounters, cards, spells, locations, conflicts, and status.
- Build the Game Master control room.
- Keep known identities and roles separate from speculation.
- Keep Eta and Elena clearly distinguished.

### Stage 7 — training and tactical systems

- Build Biscuit's aura-allocation and Ryu training laboratory.
- Build Razor's dodgeball court and turn-by-turn replay.
- Build the Bomber-system explainer and synchronized final battles.
- Treat Gon’s injury decisions as analysis, not uncomplicated heroism.

### Stage 8 — completion and archive

- Build the canonical completion record and playable verified quiz.
- Build the three-card reward sequence with spoiler controls.
- Add chapters 120–185, episodes 59–75, 1999 OVA comparison, chapter covers, episode visuals, omissions, reordered explanations, and G.I Tutorial index.

## QA gates

Every merge candidate must pass:

- `npm run build`
- `npm run qa:browser`
- route load for `/story/greed-island`
- Binder summon, close, page navigation, search, hold, valid insert, invalid insert, lift, reset, and persistence checks
- card `000` lock and unlock checks
- keyboard-only flow
- tap/unsupported narrow-width flow at narrow viewport
- reduced-motion flow
- screen-reader names and live announcements
- focus visibility and no hover-only content
- horizontal overflow and layout inspection
- media audit after verified media is introduced

## Pull request strategy

The first pull request is intentionally a foundation, not a claim that the complete redesign is finished. It should remain draft while automated and browser QA are incomplete. Later commits and pull requests can extend the same canonical model without replacing the foundation blindly.
