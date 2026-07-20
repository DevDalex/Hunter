# Character profile dossiers

Status: Batch 9
Mobile status: deferred
Source boundary: Hunterpedia/Fandom only

Batch 9 upgrades the Characters section without deleting the broad cast directory. The design rule is a directory/dossier split:

- every existing character remains searchable in the character encyclopedia;
- only selected flagship characters receive dossier-grade profile modules first;
- minor and source-index characters display an explicit retained-directory state rather than disappearing;
- future characters can be promoted to dossier status without changing the base record model.

## What Batch 9 owns

1. `src/data/characterProfilePrototype.js` defines the directory preservation policy, directory lanes, and flagship profile prototype records.
2. `src/components/CharacterProfileDossier.jsx` renders either a full dossier or a retained-directory boundary panel.
3. `src/components/CharacterProfileDossier.css` styles the profile layer with Black Archive dark hero plus warm-paper record sections.
4. `src/components/EntityEncyclopedia.jsx` surfaces the profile layer inside the selected character record while preserving portrait gallery, research index, story groups, filters, alphabet controls, bookmarks, related records, source links, and study trails.
5. `scripts/audit-character-profiles.mjs` verifies the no-deletion policy, profile coverage, approved source links, component wiring, and complete-directory indicators.
6. `npm run build` runs `audit:characters` after the reference backbone audit.

## Initial profile prototypes

The first six profiles are deliberately chosen to stress the character system:

- Gon Freecss: protagonist, friendship, Kite, Chimera Ant vow, body-state aftermath.
- Killua Zoldyck: family pressure, friendship, Godspeed, Alluka/Nanika rescue route.
- Kurapika: Volume 0, Yorknew revenge, Scarlet Eyes, chains, Emperor Time, Succession politics.
- Meruem: Ant hierarchy, East Gorteau, Komugi, Netero, Rose, final death.
- Neferpitou: Royal Guard role, Kite, Komugi healing, Gon confrontation, post-mortem Nen.
- Chrollo Lucilfer: Phantom Troupe leadership, Skill Hunter, Yorknew hostage logic, Hisoka conflict.

## Explicit non-goals

- Does not remove characters.
- Does not create separate clean URL routes such as `/characters/gon-freecss` yet.
- Does not make every character a long biography in this batch.
- Does not copy long Hunterpedia biography text.
- Does not reopen mobile layout work.

## Future route candidates

A later batch may promote profiles into clean routes such as:

- `/characters/gon-freecss`
- `/characters/killua-zoldyck`
- `/characters/kurapika`
- `/characters/meruem`
- `/characters/chrollo-lucilfer`

For now, profile modules live inside the existing character encyclopedia selected-record view.

## Acceptance rule

The character page must be able to answer two user-facing questions at the same time:

1. “Can I still find obscure/minor characters?” Yes: the complete directory remains searchable and filterable.
2. “Can major characters feel like real dossiers?” Yes: selected characters receive profile-grade Story, Nen, relationship, conflict, organization, location, object, status, and source sections.
