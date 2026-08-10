import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Cloudflare serves static files from dist/client and executes the
  // worker from dist/server. Keeping those concerns separate prevents the
  // host-level 404 that occurs when index.html is written to dist/ itself.
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    manifest: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20000,
          groups: [
            { name: 'vendor', test: /node_modules/ },
            // The maintained chapter archive grows every time a dedicated
            // research module is added. Keep the older 340–368 records in a
            // stable data chunk so later chapter upgrades do not repeatedly
            // push the active maintained-research chunk over its CI budget.
            { name: 'succession-maintained-340-368', test: /src\/data\/succession(?:34\d|35\d|36[0-8])\d*Research\.js$/ },
            // Keep this split deliberately narrow. Information consistency is
            // a leaf runtime selector used inside the on-demand Succession
            // data graph, so extracting it relieves the per-chunk ceiling
            // without promoting the much larger product/search graph into the
            // startup dependency closure.
            { name: 'succession-information-consistency', test: /src\/data\/succession\/informationConsistency\.js$/ },
            // Parallel Future's reveal is distributed across the 385–387
            // chapter-bounded knowledge corrections plus the 387 ability and
            // event foundations. Keep those temporal-mechanics leaves together
            // so the main Succession graph stays under 750 kB without raising
            // the budget or moving a broad selector family into startup.
            { name: 'succession-parallel-future-385-387', test: /src\/data\/succession\/(?:abilityFoundation387Expansion|eventFoundation387Expansion|nenSystemFoundation38[5-7]Corrections)\.js$/ },
            // Chapter 388 is a coherent Room 1014/system-expansion slice:
            // Bill's growth ability, Stealth Dolphin lending, the accelerated
            // awakening class, Tubeppa's negotiation state, and the fourth aura
            // pulse. Pull the dedicated research and its direct foundation
            // leaves out together now instead of letting the core graph sit at
            // ~749 kB and fail as soon as Chapter 389 adds another record.
            { name: 'succession-chapter-388-system-expansion', test: /src\/data\/(?:succession388Research|succession\/(?:abilityFoundation388Expansion|eventFoundation388Expansion|relationshipFoundation388Expansion))\.js$/ },
            // Chapter 389 adds the Have-Not curse system, Vict/Tackle Shield,
            // Halkenburg's custody operation, organization-state corrections,
            // and Zhang Lei's coin progression. Keep those chapter-bounded
            // leaves together so continued canon integration preserves the
            // existing 750 kB performance ceiling instead of raising it.
            { name: 'succession-chapter-389-system-expansion', test: /src\/data\/(?:succession389Research|succession\/(?:abilityFoundation389Expansion|eventFoundation389Expansion|relationshipFoundation389Expansion|organizationFoundation389Expansion|organizationState389Corrections|nenSystemFoundation389Corrections))\.js$/ },
            // Chapter 390 modernizes a formerly legacy-only chapter and adds
            // Zhang Lei coin continuity, Xi-Yu/Heil-Ly state boundaries, three
            // field ability records, and a Tier 3 event/relationship layer.
            // Keep the whole lower-tier operation together as an on-demand
            // chapter slice instead of feeding another ~50 kB into the already
            // large Succession core chunk.
            { name: 'succession-chapter-390-lower-tier-operation', test: /src\/data\/(?:succession390Research|succession\/(?:abilityFoundation390Expansion|eventFoundation390Expansion|relationshipFoundation390Expansion|organizationState390Corrections|nenSystemFoundation390Corrections))\.js$/ },
            // Chapter 391 expands the same lower-tier conflict into timed Bloody
            // Mary search drops, Biohazard surveillance/restraint, Contagion's
            // Nen-user reward rule, Fistful of Weapons, exact character states,
            // and a corrected Padaille battle boundary. Keep those leaves in a
            // dedicated lazy chunk so canon density can grow without raising
            // the 750 kB hard ceiling on the central Succession data graph.
            { name: 'succession-chapter-391-biohazard-contagion', test: /src\/data\/(?:succession391Research|succession\/(?:abilityFoundation391Expansion|eventFoundation391Expansion|eventFoundation391Corrections|relationshipFoundation391Expansion|organizationState391Corrections|characterState391Corrections|nenSystemFoundation391Corrections))\.js$/ },
            // Chapter 392 resolves Misha's post-mortem cleanup role, extends
            // Body and Soul/Bloody Mary search mechanics, adds Maizan's
            // unverified infrastructure lead, and moves the Cha-R/Troupe/Luini
            // lower-tier conflict forward. Keep the chapter-specific research
            // and correction leaves together instead of consuming the small
            // amount of headroom remaining in the central Succession chunk.
            { name: 'succession-chapter-392-misha-apparent-hisoka', test: /src\/data\/(?:succession392Research|succession\/(?:abilityFoundation392Expansion|eventFoundation392Expansion|relationshipFoundation392Expansion|organizationState392Corrections|characterState392Corrections|nenSystemFoundation392Corrections))\.js$/ },
            // Chapter 393 kills Luini, expands Heil-Ly ability-development
            // information, adds Voconte's descriptive door technique, advances
            // the apparent-Hisoka truce, and opens the Room 3101 disappearance
            // mystery. Keep the whole chapter boundary together so these new
            // records do not consume the ~15 kB remaining in the core chunk.
            { name: 'succession-chapter-393-room3101-heilly', test: /src\/data\/(?:succession393Research|succession\/(?:abilityFoundation393Expansion|eventFoundation393Expansion|relationshipFoundation393Expansion|organizationState393Corrections|characterState393Corrections|nenSystemFoundation393Corrections))\.js$/ },
            // Chapter 394 turns Room 3101 into a confirmed Heil-Ly access lane,
            // expands Voconte/processing logistics and Contagion progression,
            // and introduces the Borksen/Gipper lower-tier soldier intelligence
            // lane. Keep its dense evidence boundary out of the core chunk.
            { name: 'succession-chapter-394-room-network-soldiers', test: /src\/data\/(?:succession394Research|succession\/(?:abilityFoundation394Expansion|eventFoundation394Expansion|relationshipFoundation394Expansion|organizationState394Corrections|characterState394Corrections|nenSystemFoundation394Corrections))\.js$/ },
            // Chapter 395 combines another dense lower-tier spatial investigation
            // with the opening Meteor City origin flashback. Keep the dedicated
            // research, event/relationship/location leaves, and current-day
            // state corrections together so the historical material does not
            // inflate the central Succession graph or blur the lazy boundary.
            { name: 'succession-chapter-395-room-network-origin', test: /src\/data\/(?:succession395Research|succession\/(?:eventFoundation395Expansion|relationshipFoundation395Expansion|locationFoundation395Expansion|organizationState395Corrections|characterState395Corrections))\.js$/ },
            // Chapter 396 stays entirely inside the Meteor City childhood layer:
            // the live Power Cleaners performance, incomplete troupe naming,
            // Uvogin's stage ambition, and Sarasa's Uga Forest cliffhanger.
            // Keep its research/event/location/relationship leaves together so
            // the central Succession graph remains below the 750 kB hard cap.
            { name: 'succession-chapter-396-meteor-city-performance', test: /src\/data\/(?:succession396Research|succession\/(?:eventFoundation396Expansion|relationshipFoundation396Expansion|locationFoundation396Expansion))\.js$/ },
            // Chapter 397 resolves Sarasa's cliffhanger, introduces Renko's
            // bounded embalming ability and Machi's aura perception, then turns
            // Chrollo's grief into the three-year criminal-attraction strategy
            // and historical Spider founding. Keep the entire origin payload in
            // its own lazy data island rather than raising the 750 kB ceiling.
            { name: 'succession-chapter-397-sarasa-spider-origin', test: /src\/data\/(?:succession397Research|succession\/(?:abilityFoundation397Expansion|eventFoundation397Expansion|relationshipFoundation397Expansion|locationFoundation397Expansion))\.js$/ },
            // Chapter 398 returns to Tier 3 and adds a dense spatial-mechanics
            // packet: repeat front-door teleport testing, barrier/land-mine trap
            // exposition, Biohazard's transmitter-oyster rules, temporary
            // Hinrigh/Nobunaga cooperation, exact character states, and the
            // self-restoring hideout stage. Keep the chapter's direct leaves in
            // one lazy island while preserving the current soft-warning and
            // emergency chunk-budget policy unchanged.
            { name: 'succession-chapter-398-teleport-hideout-infiltration', test: /src\/data\/(?:succession398Research|succession\/(?:abilityFoundation398Expansion|eventFoundation398Expansion|relationshipFoundation398Expansion|locationFoundation398Expansion|characterState398Corrections|nenSystemFoundation398Corrections))\.js$/ },
            // Chapter 399 opens the hideout's defended gathering room, formally
            // reveals Terebellum's Sweet Home and Yokotani's LSDF, advances the
            // Room 3101 return route, and adds exact resource/organization state
            // boundaries. Keep this dense confrontation in its own lazy island.
            { name: 'succession-chapter-399-sweet-home-lsdf', test: /src\/data\/(?:succession399Research|succession\/(?:abilityFoundation399Expansion|eventFoundation399Expansion|relationshipFoundation399Expansion|locationFoundation399Expansion|organizationState399Corrections|characterState399Corrections|nenSystemFoundation399Corrections))\.js$/ },
            // Chapter 400 modernizes the older maintained packet into the same
            // strict boundary architecture: Tier 2 hideout localization, Phinks
            // En limits, Tyson/Izunavi planning, Without You/Fugetsu updates,
            // Melody/Kaiser Justice pressure, the hostile-spirit affliction and
            // Longhi contract stopping point. Keep direct leaves plus the legacy
            // state splits/corrections isolated so the core does not spend its
            // remaining headroom while we preserve 401+ imported continuity.
            { name: 'succession-chapter-400-tier2-justice-fugetsu', test: /src\/data\/(?:succession(?:400Research|ArchiveThrough400|DossierThrough400)|succession\/(?:abilityFoundation400Expansion|eventFoundation400(?:Expansion|Corrections)|relationshipFoundation400Expansion|locationFoundation400Expansion|organizationState400(?:Corrections|LegacySplits)|characterState400(?:Corrections|LegacySplits)|nenSystemFoundation400Corrections))\.js$/ },
            // Chapter 401 is the first fresh post-400 boundary and carries a
            // dense Room 1014 contract/lineage packet: Moonlight Act, Longhi's
            // Beyond parentage, the death-released curse-sacrifice network,
            // exact character states, the weekly Tubeppa–Woble treaty, and the
            // 2:00 p.m. Beyond detention coda. Keep only the direct 401 leaves
            // together so the already-large Chapter 400 island is not dragged
            // into this new chunk through the Through401 overlay chain.
            { name: 'succession-chapter-401-moonlight-beyond-contract', test: /src\/data\/(?:succession401Research|succession\/(?:abilityFoundation401Expansion|eventFoundation401Expansion|relationshipFoundation401Expansion|locationFoundation401Expansion|characterState401Corrections|nenSystemFoundation401Corrections))\.js$/ },
          ],
        },
      },
    },
  },
});
