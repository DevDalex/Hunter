const freeze = (value) => Object.freeze(value);

const view = (id, label, description, icon = 'map') => freeze({ id, label, description, icon });
const lens = (id, label) => freeze({ id, label });
const capability = (id, label, description) => freeze({ id, label, description });

const depthLevels = freeze([
  freeze({ id: 'pulse', label: 'Pulse', description: 'Only defining turns and current pressure.' }),
  freeze({ id: 'recap', label: 'Recap', description: 'Major beats, clusters, and concise context.' }),
  freeze({ id: 'study', label: 'Study', description: 'Supporting records, links, and mechanics.' }),
  freeze({ id: 'research', label: 'Research', description: 'Evidence-aware records with uncertainty and provenance.' }),
  freeze({ id: 'complete', label: 'Complete', description: 'Every chapter-safe record remains addressable.' }),
]);

const shared = freeze([
  capability('chapter-state', 'Time machine', 'A shared chapter state controls every chapter-aware instrument.'),
  capability('perspective', 'Perspective mode', 'Reader and in-universe viewpoints can constrain what information is visible.'),
  capability('comparison', 'Comparison tray', 'Selected entities persist across routes for side-by-side analysis.'),
  capability('watchlist', 'Watchlists', 'Save people, systems, locations, mysteries, and events into persistent collections.'),
  capability('history', 'Research history', 'Preserve the path taken through entities, chapters, and views.'),
  capability('deep-link', 'Deep links', 'Route, chapter, selected entities, lens, view, depth, and camera can be restored.'),
  capability('cross-route', 'Cross-route context', 'Selections and filters survive navigation between archive lenses.'),
]);

const profiles = {
  archive: {
    title: 'Succession Command Center',
    defaultView: 'command',
    defaultLens: 'world',
    views: [
      view('command', 'Command', 'Whole-arc state, pressure, active threads, and fast entry points.'),
      view('world', 'World', 'Miniatures of time, people, space, systems, and evidence in one field.'),
      view('resume', 'Resume', 'Return to recent research paths, bookmarks, and collections.'),
    ],
    lenses: [lens('world', 'Whole archive'), lens('pressure', 'Current pressure'), lens('changes', 'Recent changes')],
    capabilities: [
      capability('state-overview', 'Current state', 'Summarize active threads, operations, mysteries, systems, and coverage.'),
      capability('miniatures', 'Linked miniatures', 'Timeline, ship, people, Nen, and evidence previews open their full instruments.'),
      capability('resume', 'Resume research', 'Continue from a recent entity, chapter, camera, or saved collection.'),
    ],
  },
  story: {
    title: 'Narrative Braid', defaultView: 'braid', defaultLens: 'story',
    views: [
      view('braid', 'Braid', 'Parallel plotlines weave, split, and collide across chapter space.'),
      view('phases', 'Phases', 'Zoom from arc phases into threads, beats, and evidence.'),
      view('guided', 'Guided', 'Curated visual explanations fly through the minimum context needed.'),
      view('pressure', 'Pressure', 'Show open threats, pending operations, and unresolved story pressure.'),
      view('causality', 'Causality', 'Trace causes and consequences through narrative events.'),
    ],
    lenses: [lens('story', 'Story lanes'), lens('character', 'Characters'), lens('organization', 'Factions'), lens('location', 'Locations')],
    capabilities: [
      capability('story-braid', 'Story braid', 'Plot threads cross only where the underlying records connect.'),
      capability('semantic-story-zoom', 'Semantic story zoom', 'Arc → phase → thread → beat → evidence.'),
      capability('previously', 'Previously in', 'Build causal prerequisite context for a selected chapter or thread.'),
      capability('guided-tours', 'Guided tours', 'Curated visual tours illuminate only the route needed to understand a storyline.'),
      capability('pressure', 'Narrative pressure', 'Evidence-backed open threats and unresolved work remain visible without inventing power scores.'),
    ],
  },
  timeline: {
    title: 'Temporal Atlas', defaultView: 'atlas', defaultLens: 'story',
    views: [
      view('atlas', 'Atlas', 'Pan and zoom freely through the complete chronology.'),
      view('braid', 'Braid', 'See plot threads merge and separate across time.'),
      view('matrix', 'Matrix', 'Chapter × subject activity matrix and heatmap.'),
      view('causality', 'Causality', 'Trace causes and consequences from a selected record.'),
      view('heatmap', 'Heatmap', 'Aggregate activity by chapter, thread, Nen, conflict, mystery, or location.'),
      view('playback', 'Playback', 'Advance chapter by chapter and watch archive state change.'),
      view('diff', 'Diff', 'Isolate what changed between two chapter states.'),
      view('trails', 'Trails', 'Follow one person, system, location, organization, or mystery over time.'),
    ],
    lenses: [lens('story', 'Story threads'), lens('character', 'Characters'), lens('organization', 'Factions'), lens('location', 'Locations'), lens('knowledge', 'Knowledge'), lens('nen', 'Nen'), lens('evidence', 'Evidence')],
    capabilities: [
      capability('pan-zoom', 'Infinite-canvas navigation', 'Drag, zoom, fit, jump, minimap, and camera history.'),
      capability('semantic-zoom', 'Semantic zoom', 'The same 1,555-record chronology changes representation by camera depth.'),
      capability('clustering', 'Dynamic clustering', 'Dense regions collapse into countable clusters until zoomed.'),
      capability('duration', 'Duration objects', 'Operations, threats, presences, mysteries, and deadlines can occupy ranges instead of dots.'),
      capability('playback', 'Time playback', 'Advance through chapters while stateful overlays update.'),
      capability('chapter-diff', 'Chapter diff', 'Hide unchanged state and show only additions, removals, and changes.'),
      capability('causality', 'Causal trails', 'Trace backward prerequisites or forward consequences.'),
      capability('spatial-search', 'Spatial search', 'Search dims the world and frames every relevant record.'),
    ],
  },
  reader: {
    title: 'Synchronized Research Reader', defaultView: 'sync', defaultLens: 'chapter',
    views: [view('sync', 'Sync', 'Keep reading quiet while synchronizing chapter state.'), view('context', 'Context', 'Open current people, place, Nen, story phase, and glossary context.'), view('annotations', 'Notes', 'Attach personal notes and bookmarks.'), view('research', 'Research', 'Split manga reading from evidence and archive context.')],
    lenses: [lens('chapter', 'Current chapter'), lens('page', 'Current page'), lens('research', 'Research context')],
    capabilities: [
      capability('reader-sync', 'Archive synchronization', 'Timeline, characters, locations, and systems can inherit the current chapter.'),
      capability('context-drawer', 'Context drawer', 'Open dossiers without abandoning the reader.'),
      capability('annotations', 'Annotations', 'Save chapter/page/entity notes locally.'),
      capability('research-split', 'Research split', 'Optional side intelligence while the manga remains visually dominant.'),
    ],
  },
  search: {
    title: 'Archive Spotlight', defaultView: 'spotlight', defaultLens: 'all',
    views: [view('spotlight', 'Spotlight', 'Universal entity and concept search.'), view('timeline', 'On timeline', 'Project results into temporal space.'), view('ship', 'On ship', 'Project spatial results onto Black Whale context.'), view('graph', 'As graph', 'Explore result relationships.'), view('matrix', 'As matrix', 'Compare result activity across chapters.')],
    lenses: [lens('all', 'Everything'), lens('people', 'People'), lens('systems', 'Systems'), lens('space', 'Space'), lens('evidence', 'Evidence')],
    capabilities: [
      capability('command-palette', 'Universal command palette', 'One query reaches every canonical domain.'),
      capability('structured-query', 'Structured queries', 'Filter by entity type, chapter, place, organization, certainty, and system.'),
      capability('natural-query', 'Natural query parsing', 'Translate common-language requests into deterministic archive filters where possible.'),
      capability('project-results', 'Project results', 'Render the same result set on Timeline, Ship, Graph, or Matrix.'),
      capability('persistent-query', 'Persistent query lens', 'Carry the active result context into other routes.'),
    ],
  },
  characters: {
    title: 'Human Atlas', defaultView: 'atlas', defaultLens: 'affiliation',
    views: [view('atlas', 'Atlas', 'Explore the complete named cast spatially.'), view('activity', 'Activity', 'Character × chapter activity matrix.'), view('relationships', 'Network', 'Focused social neighborhoods.'), view('knowledge', 'Knowledge', 'Known, believed, unknown, and reader-only information.'), view('compare', 'Compare', 'Side-by-side character intelligence.'), view('timeline', 'Timeline', 'One character’s state ribbon across the arc.')],
    lenses: [lens('affiliation', 'Affiliation'), lens('role', 'Role'), lens('royal', 'Royal proximity'), lens('location', 'Location'), lens('activity', 'Activity')],
    capabilities: [
      capability('human-atlas', 'Human atlas', 'People cluster by role, affiliation, location, or story activity.'),
      capability('temporal-dossier', 'Temporal dossier', 'Inspect a character exactly as the archive knows them at a selected chapter.'),
      capability('neighborhood', 'Relationship neighborhood', 'Progressively reveal one-, two-, and three-hop connections.'),
      capability('knowledge-state', 'Knowledge state', 'Separate confirmed knowledge, beliefs, unknowns, and reader-only facts.'),
      capability('activity-matrix', 'Activity matrix', 'Characters × chapters reveal where each person becomes narratively active.'),
      capability('character-compare', 'Character compare', 'Compare resources, assignments, affiliations, systems, evidence, and current state.'),
    ],
  },
  princes: {
    title: 'Succession Board', defaultView: 'board', defaultLens: 'rank',
    views: [view('board', 'Board', 'Fourteen-prince status board.'), view('dynasty', 'Dynasty', 'Regroup princes under their queens.'), view('protection', 'Protection', 'Protection, surveillance, infiltration, and threat rings.'), view('pressure', 'Pressure', 'Evidence-backed operational pressure by prince.'), view('compare', 'Compare', 'Compare prince situations without inventing power levels.'), view('timeline', 'Timeline', 'Follow one prince’s changing campaign state.')],
    lenses: [lens('rank', 'Succession order'), lens('queen', 'Maternal branch'), lens('status', 'Status'), lens('pressure', 'Pressure')],
    capabilities: [
      capability('succession-board', 'Fourteen-piece board', 'A bounded portrait-rich strategic view of all princes.'),
      capability('maternal-tree', 'Maternal hierarchy', 'Regroup the succession under the eight queens.'),
      capability('protection-rings', 'Protection circles', 'Show inner protection, surveillance, infiltration, and external threats around a selected prince.'),
      capability('royal-compare', 'Royal comparison', 'Compare personnel, systems, evidence, objectives, and current operational state.'),
    ],
  },
  queens: {
    title: 'Maternal Power Map', defaultView: 'dynasty', defaultLens: 'branch',
    views: [view('dynasty', 'Dynasty', 'Queens and children as a living family structure.'), view('influence', 'Influence', 'Political and operational links.'), view('guards', 'Personnel', 'Queen-associated guards and assignments.'), view('timeline', 'Timeline', 'Queen branch activity over time.'), view('compare', 'Compare', 'Compare maternal branches.')],
    lenses: [lens('branch', 'Maternal branch'), lens('children', 'Children'), lens('personnel', 'Personnel')],
    capabilities: [capability('queen-tree', 'Dynastic tree', 'Queen → children → personnel hierarchy.'), capability('queen-influence', 'Influence map', 'Connect queen branches to political and operational records.'), capability('queen-compare', 'Branch comparison', 'Compare documented resources, children, personnel, and pressure.')],
  },
  bodyguards: {
    title: 'Operational Command Map', defaultView: 'command', defaultLens: 'assignment',
    views: [view('command', 'Command', 'Who sent whom where.'), view('assignments', 'Assignments', 'Protection, surveillance, infiltration, custody, instruction, and other operational records.'), view('reporting', 'Reporting', 'Command and reporting chains.'), view('targets', 'Targets', 'Target-centric view of everyone acting on one subject.'), view('timeline', 'Timeline', 'Assignment ranges across chapters.'), view('matrix', 'Matrix', 'People × assignments × chapter state.')],
    lenses: [lens('assignment', 'Assignment type'), lens('principal', 'Principal'), lens('subject', 'Subject'), lens('location', 'Location'), lens('allegiance', 'Allegiance')],
    capabilities: [
      capability('assignment-flow', 'Assignment flow', 'Principal → operative → subject as a readable operational graph.'),
      capability('temporal-assignments', 'Temporal assignments', 'Assignments occupy their actual chapter ranges.'),
      capability('reporting-chain', 'Reporting chains', 'Trace command structure without flattening it into a list.'),
      capability('target-view', 'Target-centric view', 'Ask who is protecting, watching, infiltrating, teaching, holding, or targeting a subject.'),
    ],
  },
  organizations: {
    title: 'Power Atlas', defaultView: 'power', defaultLens: 'type',
    views: [view('power', 'Power', 'Faction universe and operating overlap.'), view('hierarchy', 'Hierarchy', 'Internal organization structure.'), view('territory', 'Territory', 'Project organizations onto ship space.'), view('objectives', 'Objectives', 'Current goals, operations, blockers, and pressure.'), view('dependencies', 'Dependencies', 'People, territory, information, authority, and Nen dependencies.'), view('compare', 'Compare', 'Side-by-side institution analysis.'), view('timeline', 'Timeline', 'Organization state over time.')],
    lenses: [lens('type', 'Organization type'), lens('territory', 'Territory'), lens('alignment', 'Relationship'), lens('activity', 'Activity')],
    capabilities: [
      capability('power-map', 'Power map', 'Organizations occupy a strategic field based on type and operating overlap.'),
      capability('adaptive-hierarchy', 'Adaptive hierarchy', 'Military, mafia, royal, political, and expedition bodies can use different internal structures.'),
      capability('territory-overlay', 'Territory overlay', 'Project institutional presence onto Black Whale locations.'),
      capability('dependency-graph', 'Dependency graph', 'Expose which people, resources, territory, legitimacy, systems, and information sustain an organization.'),
    ],
  },
  'black-whale': {
    title: 'Living Ship Atlas', defaultView: 'atlas', defaultLens: 'tiers',
    views: [view('atlas', 'Atlas', 'Zoom from whole vessel to tier, zone, and room.'), view('occupancy', 'Occupancy', 'Who is where at the selected chapter.'), view('events', 'Events', 'Event markers on the vessel.'), view('paths', 'Paths', 'Movement histories and route traces.'), view('heatmap', 'Heatmap', 'Conflict, activity, Nen, faction, death, or investigation density.'), view('control', 'Access', 'Public, restricted, royal, military, legal, criminal, and unknown access.'), view('playback', 'Playback', 'Advance time and watch the ship state change.')],
    lenses: [lens('tiers', 'Tiers'), lens('people', 'People'), lens('events', 'Events'), lens('nen', 'Nen'), lens('faction', 'Faction control'), lens('access', 'Access')],
    capabilities: [
      capability('nested-map', 'Nested ship map', 'Whole ship → tier → zone → room with semantic zoom.'),
      capability('temporal-geography', 'Temporal geography', 'Occupancy, incidents, assignments, and threats update by chapter.'),
      capability('movement-trails', 'Movement trails', 'Follow a character through documented locations.'),
      capability('ship-heatmaps', 'Ship heatmaps', 'Aggregate events, conflict, Nen, organizations, and investigations spatially.'),
    ],
  },
  locations: {
    title: 'Spatial History Engine', defaultView: 'tree', defaultLens: 'hierarchy',
    views: [view('tree', 'Hierarchy', 'Nested ship and room hierarchy.'), view('history', 'History', 'Biography of a selected place.'), view('occupancy', 'Occupancy', 'Who occupied it and when.'), view('routes', 'Routes', 'Connections, access, and movement.'), view('events', 'Events', 'What happened here.'), view('abilities', 'Nen', 'Abilities and Nen-mediated movement associated with the place.')],
    lenses: [lens('hierarchy', 'Hierarchy'), lens('chapter', 'Chapter state'), lens('occupancy', 'Occupancy'), lens('activity', 'Activity')],
    capabilities: [
      capability('location-biography', 'Location biography', 'Treat rooms and tiers as historical entities with changing state.'),
      capability('occupancy-history', 'Occupancy history', 'Answer who was here at a selected chapter or across a range.'),
      capability('route-graph', 'Route graph', 'Show parent, child, adjacent, legal, criminal, and inferred movement connections where documented.'),
    ],
  },
  nen: {
    title: 'Nen Systems Laboratory', defaultView: 'systems', defaultLens: 'system',
    views: [view('systems', 'Systems', 'Ability, ritual, curse, possession, and training universe.'), view('mechanics', 'Mechanics', 'Activation → conditions → mechanism → effect → cost.'), view('taxonomy', 'Taxonomy', 'Classic Nen type plus Succession-specific system categories.'), view('conditions', 'Conditions', 'Visual condition circuitry.'), view('interactions', 'Interactions', 'Ability and system interaction network.'), view('timeline', 'Timeline', 'When each mechanic became known.'), view('threat', 'Threat map', 'Project active Nen systems into ship space.'), view('compare', 'Compare', 'Compare mechanics without collapsing uncertainty.'), view('hypotheses', 'Hypotheses', 'Explore explicit known/inferred/speculative interpretations.')],
    lenses: [lens('system', 'System family'), lens('nen-type', 'Nen type'), lens('owner', 'Owner'), lens('mechanic', 'Mechanic'), lens('certainty', 'Certainty')],
    capabilities: [
      capability('mechanics-diagram', 'Mechanics diagrams', 'Render activation, conditions, restrictions, costs, targets, range, duration, and uncertainty as structure.'),
      capability('dependency-diagram', 'Dependency diagrams', 'Show which prerequisites a mechanic relies upon.'),
      capability('taxonomy', 'Multidimensional taxonomy', 'Classic type plus ritual, curse, possession, parasitic, collaborative, inherited, post-mortem, and other documented categories.'),
      capability('interaction-matrix', 'Interaction matrix', 'Connect systems that directly interact or share documented mechanisms.'),
      capability('knowledge-timeline', 'Knowledge timeline', 'Separate when something occurred from when the reader can know its mechanics.'),
      capability('hypothesis-sandbox', 'Hypothesis sandbox', 'Toggle clearly labelled interpretations without presenting speculation as canon.'),
    ],
  },
  'guardian-spirit-beasts': {
    title: 'Ritual Ecology', defaultView: 'ecology', defaultLens: 'host',
    views: [view('ecology', 'Ecology', 'All royal beast records in one ritual field.'), view('hosts', 'Hosts', 'Host ↔ beast ↔ ability structure.'), view('ritual', 'Ritual', 'Shared Seed Urn rules and unresolved mechanics.'), view('mechanics', 'Mechanics', 'Demonstrated and suspected abilities.'), view('compare', 'Compare', 'Compare all beasts as a bounded matrix.'), view('timeline', 'Timeline', 'When each beast and mechanic becomes known.')],
    lenses: [lens('host', 'Host'), lens('status', 'Host state'), lens('ability', 'Ability state'), lens('certainty', 'Certainty')],
    capabilities: [capability('host-orbit', 'Host orbit', 'Keep prince, beast, ability, and ritual context visually bound.'), capability('ritual-rules', 'Ritual rules graph', 'Central Seed Urn mechanics branch into documented rules and unresolved questions.'), capability('beast-compare', 'All-beast comparison', 'Small bounded dataset supports rich side-by-side comparison.')],
  },
  events: {
    title: 'Operations Atlas', defaultView: 'constellation', defaultLens: 'story',
    views: [view('constellation', 'Constellation', 'Cluster operations by story, faction, place, people, or evidence.'), view('anatomy', 'Anatomy', 'Causes + people + location + Nen + decision + consequences.'), view('operations', 'Operations', 'Planning → deployment → contact → execution → outcome.'), view('causality', 'Causality', 'Trace connected event chains.'), view('compare', 'Compare', 'Compare objectives, personnel, mechanics, outcomes, and consequences.'), view('density', 'Density', 'Event activity heatmap.')],
    lenses: [lens('story', 'Story'), lens('organization', 'Organization'), lens('location', 'Location'), lens('people', 'People'), lens('evidence', 'Evidence')],
    capabilities: [capability('event-anatomy', 'Event anatomy', 'Events become structured operations rather than prose cards.'), capability('operation-chain', 'Operation chains', 'Group planning, execution, and aftermath when records support it.'), capability('event-compare', 'Event comparison', 'Compare operations on objective, participants, location, system use, evidence, and consequences.')],
  },
  relationships: {
    title: 'Living Social Graph', defaultView: 'graph', defaultLens: 'type',
    views: [view('graph', 'Graph', 'Interactive relationship universe.'), view('temporal', 'Temporal', 'Watch edges appear, change, and expire by chapter.'), view('neighborhood', 'Neighborhood', 'Progressive one-, two-, and three-hop views.'), view('path', 'Path', 'Find documented connection paths between entities.'), view('compare', 'Compare', 'Shared contacts, overlap, and opposing networks.'), view('timeline', 'Timeline', 'Give each relationship edge its own biography.')],
    lenses: [lens('type', 'Relationship type'), lens('sentiment', 'Sentiment'), lens('direction', 'Direction'), lens('activity', 'Activity')],
    capabilities: [
      capability('typed-edges', 'Typed edges', 'Family, alliance, protection, command, surveillance, hostility, deception, and other links use distinct structure.'),
      capability('temporal-graph', 'Temporal graph', 'Relationships obey chapter boundaries instead of behaving as eternal facts.'),
      capability('progressive-neighborhood', 'Progressive neighborhood', 'Reveal graph depth gradually to avoid spaghetti.'),
      capability('pathfinding', 'Connection pathfinding', 'Find a documented route between two entities through canonical edges.'),
      capability('edge-biography', 'Edge biography', 'Inspect how one relationship changes across its supporting records.'),
    ],
  },
  chapters: {
    title: 'Chapter Intelligence Matrix', defaultView: 'matrix', defaultLens: 'changes',
    views: [view('matrix', 'Matrix', 'Every chapter as an information-density cell.'), view('dossier', 'Dossier', 'What changed, active stories, people, systems, places, causes, consequences, and open questions.'), view('diff', 'Diff', 'Compare any two chapter states.'), view('previously', 'Previously', 'Only the prerequisites needed before a chapter.'), view('impact', 'Impact', 'Forward consequences and affected story lanes.'), view('density', 'Density', 'Switch heatmap metric between events, people, Nen, relationships, mysteries, and change volume.')],
    lenses: [lens('changes', 'Change volume'), lens('events', 'Events'), lens('characters', 'Characters'), lens('nen', 'Nen'), lens('relationships', 'Relationships'), lens('mysteries', 'Mysteries')],
    capabilities: [capability('chapter-matrix', 'Chapter matrix', 'Turn the chapter list into a readable density landscape.'), capability('state-diff', 'State difference engine', 'Compare additions, removals, and changed records between chapters.'), capability('previously', 'Causal prerequisites', 'Build a concise prerequisite chain rather than dumping all earlier events.'), capability('forward-impact', 'Forward impact', 'Show which later records explicitly depend on or follow the selected chapter.')],
  },
  research: {
    title: 'Evidence Workstation', defaultView: 'evidence', defaultLens: 'certainty',
    views: [view('evidence', 'Evidence', 'Claim → source → event/dialogue → confidence.'), view('claims', 'Claims', 'Claim ledger with status, chapter, evidence, contradiction, and affected entities.'), view('certainty', 'Certainty', 'Canonical, demonstrated, inferred, theory, contradicted, and unknown states.'), view('contradictions', 'Tensions', 'Potentially conflicting records presented side by side.'), view('coverage', 'Coverage', 'Map archive research depth across chapters and domains.'), view('gaps', 'Gaps', 'Actionable research gaps and missing provenance.')],
    lenses: [lens('certainty', 'Certainty'), lens('source', 'Source'), lens('domain', 'Domain'), lens('chapter', 'Chapter'), lens('gap', 'Research gap')],
    capabilities: [
      capability('evidence-graph', 'Evidence graph', 'Trace important claims back through supporting canonical records and sources.'),
      capability('claim-ledger', 'Claims ledger', 'Treat consequential statements as explicit reviewable research objects.'),
      capability('certainty-language', 'Shared certainty language', 'Use one visual grammar for canonical, demonstrated, inferred, theory, contradicted, and unknown.'),
      capability('tension-review', 'Contradiction review', 'Surface records in tension without automatically declaring canon contradictions.'),
      capability('coverage-map', 'Coverage map', 'See which chapters and domains are deeply researched and which are thin.'),
      capability('research-gaps', 'Research gaps', 'Prioritize missing evidence, state, media provenance, and unresolved claims.'),
    ],
  },
  glossary: {
    title: 'Concept Universe', defaultView: 'concepts', defaultLens: 'domain',
    views: [view('concepts', 'Concepts', 'Semantic groups rather than an alphabetical cemetery.'), view('graph', 'Graph', 'Concepts connect to entities, systems, events, and evidence.'), view('context', 'Context', 'Definitions adapt to selected reading depth.'), view('examples', 'Examples', 'Canonical connected examples.'), view('evidence', 'Evidence', 'Definition provenance and certainty.')],
    lenses: [lens('domain', 'Domain'), lens('certainty', 'Certainty'), lens('connections', 'Connections')],
    capabilities: [capability('semantic-groups', 'Semantic groups', 'Ritual, Nen, politics, ship, legal, status, and archive vocabulary cluster conceptually.'), capability('concept-graph', 'Concept graph', 'Terms connect directly to canonical records.'), capability('contextual-definition', 'Contextual definitions', 'Pulse, study, and research depths expose progressively more detail without changing the underlying definition.')],
  },
};

export const successionExplorerDepthLevels = depthLevels;
export const successionExplorerSharedCapabilities = shared;
export const successionExplorerProfiles = freeze(Object.fromEntries(Object.entries(profiles).map(([id, profile]) => [id, freeze({
  ...profile,
  views: freeze(profile.views),
  lenses: freeze(profile.lenses),
  capabilities: freeze([...shared, ...profile.capabilities]),
})])));

export const successionExplorerRouteIds = freeze(Object.keys(successionExplorerProfiles));

export const getSuccessionExplorerProfile = (routeId = 'story') => successionExplorerProfiles[routeId] || successionExplorerProfiles.story;

export const isSuccessionExplorerDepth = (value) => depthLevels.some((depth) => depth.id === value);
