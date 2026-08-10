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
          ],
        },
      },
    },
  },
});
