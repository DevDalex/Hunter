# Hunter × Hunter Archive information architecture

## Core navigation rule

Every primary navigation item owns one stable page shell. Tabs and filters may change the view inside that shell, but they must not silently replace the page with a different application.

Primary domains:

```text
Story
Characters
World
Nen
Organizations
Fights
Timeline
```

## Story

Story owns arc-specific editorial pages and content that only makes sense inside one arc.

```text
/story
/story/<arc>
/story/succession-contest/chapters
/story/succession-contest/records
```

The Succession Contest chapter reader remains inside the illustrated arc page. Records remains a separate research workspace for chapter records, deaths and body states, consequential objects, and unresolved questions.

## Timeline

Timeline is global. Succession provides the deepest available timeline data, but does not own the Timeline domain.

```text
/timeline
/timeline?arc=yorknew-city&scope=arc
/timeline?arc=succession-contest&scope=arc
/timeline?arc=succession-contest&scope=events
```

Depth model:

- `overview`: whole-series arc sequence;
- `arc`: structural phases for the selected arc;
- `events`: detailed chronology where the archive has sufficient evidence.

Earlier arcs remain phase-based. The interface must not invent exact times merely to imitate the Succession voyage ledger.

Legacy chronology routes normalize into Timeline:

```text
/story?view=chronology
/story/succession-contest/timeline
#/series/chronology
#/succession/succession-timeline
```

## Nen

Nen owns supernatural rules and ability mechanics:

- aura and aura nodes;
- Ten, Zetsu, Ren, and Hatsu;
- advanced techniques;
- six categories;
- named abilities;
- conditions, restrictions, vows, costs, and curses;
- Nen beasts as a general phenomenon;
- ability users and confirmed mechanics.

Organization pages may link to a Nen record, but must not reproduce the complete ability explanation.

## Organizations

Organizations owns social and political structures:

```text
/organizations?view=overview
/organizations?view=institutions
/organizations?view=factions
/organizations?view=members
/organizations?view=relations
/organizations?view=operations
```

All views render inside `OrganizationWorkspace`.

Ownership includes:

- institutions and formal authority;
- factions and organizational identity;
- leadership and membership;
- sponsorship and territory;
- typed relationships;
- organizational plans and operations.

It does not own Nen mechanics, conflict anatomy, or object-state trails.

## Fights

Fights owns conflict-level analysis:

- battles and duels;
- assassinations and pursuits;
- tactical operations;
- games, trials, and negotiations;
- objectives, methods, turning points, outcomes, and consequences.

Legacy `/organizations?view=conflicts` requests normalize to Fights.

## Characters and object records

The encyclopedia owns individual records, including consequential objects and their current documented state.

Legacy `/organizations?view=objects` requests normalize to the object category in the encyclopedia.

## Cross-link rule

Related domains connect rather than duplicate one another.

Example:

```text
Heil-Ly organization dossier
└── Associated Nen system: Contagion
    └── Open Nen record

Contagion Nen record
└── Associated organization: Heil-Ly
    └── Open organization dossier
```

## Acceptance contract

The architecture is valid only when:

1. Timeline always highlights the Timeline primary-navigation item.
2. Succession chronology opens Timeline already scoped to Succession.
3. Early chronology and voyage chronology share one route and shell.
4. Organizations always renders one `OrganizationWorkspace` shell.
5. Organization view changes preserve that shell and update the URL.
6. Nen remains a separate primary domain.
7. Conflict anatomy never renders inside Organizations.
8. Object records never render as an Organizations view.
9. Browser back and forward restore route-driven scope, view, filters, and selected records.
10. Legacy URLs resolve to their new canonical owners instead of becoming dead links.

The repeatable browser contract is implemented in:

```text
scripts/architecture-navigation-qa.mjs
```
