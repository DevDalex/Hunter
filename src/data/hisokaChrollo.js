const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const file = (name) => `https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(name)}`;

export const fightSources = {
  hisoka: wiki('Hisoka_Morow'),
  chrollo: wiki('Chrollo_Lucilfer'),
  arena: wiki('Heavens_Arena'),
  troupe: wiki('Phantom_Troupe'),
  nen: wiki('Nen'),
};

export const fightChapters = [
  {
    number: 351, title: 'Battle to the Death', phase: 'Contract and disclosure', source: wiki('Chapter_351'),
    image: file('Hisoka and Chrollo prepared to fight.png'),
    imageAlt: 'Hisoka and Chrollo prepare to fight at Heavens Arena', zone: 'Arena floor',
    thesis: 'The formal duel begins, but Chrollo immediately reveals that the actual opponent is a prepared system of interacting abilities.',
    events: ['Both Floor Masters agree to a battle to the death.', 'Black Voice turns the referee into the first controlled threat.', 'Chrollo uses a physical feint while Hisoka tracks the antennae.', 'Sun and Moon produces the first explosion.', 'Double Face explains how Chrollo can maintain and combine abilities.'],
    mechanics: ['Black Voice', 'Sun and Moon', 'Double Face'],
    hisokaState: 'Excited; beginning to count restrictions and possible controlled targets.',
    chrolloState: 'Controls the information tempo and demonstrates only the first layer.',
    arena: { hisoka: [34, 61], chrollo: [66, 61], threat: [50, 62], label: 'Referee used as the first weapon' },
  },
  {
    number: 352, title: 'Troublesome', phase: 'The full toolset', source: wiki('Chapter_352'),
    image: file('Chrollo using Gallery Fake.png'),
    imageAlt: 'Chrollo demonstrates the abilities selected for Hisoka', zone: 'Floor to audience',
    thesis: 'Chrollo explains the production chain—copies, puppets, disguises and persistent explosive marks—then removes himself from Hisoka’s preferred duel.',
    events: ['Order Stamp establishes the puppet rule.', 'Gallery Fake produces a usable copy of the dead referee.', 'Convert Hands creates appearance swaps and disguises.', 'Sun and Moon is identified as post-mortem Nen whose marks persist.', 'Chrollo enters the audience and Hisoka follows.'],
    mechanics: ['Order Stamp', 'Gallery Fake', 'Convert Hands', 'Sun and Moon'],
    hisokaState: 'Understands individual rules but has not yet experienced their complete combination.',
    chrolloState: 'Finishes disclosure and moves into the resource-rich crowd.',
    arena: { hisoka: [39, 48], chrollo: [63, 31], threat: [72, 24], label: 'Chrollo disappears into the stands' },
  },
  {
    number: 353, title: 'Cold-Blooded', phase: 'Identity and distance', source: wiki('Chapter_353'),
    image: file('A horde of puppets pursuing Hisoka.png'),
    imageAlt: 'Hisoka searches the Heavens Arena crowd for Chrollo', zone: 'Audience stands',
    thesis: 'The fight stops behaving like a duel: every spectator can conceal Chrollo, obstruct Hisoka or become a controlled attack.',
    events: ['Hisoka searches through the stands.', 'Black Voice makes ordinary spectators immediate threats.', 'Convert Hands destabilizes visual identification.', 'Chrollo determines when direct contact occurs.', 'Hisoka must solve distance and identity at the same time.'],
    mechanics: ['Black Voice', 'Convert Hands', 'Bungee Gum'],
    hisokaState: 'Searching for the real body while respecting the instant-control threat.',
    chrolloState: 'Alternates concealment, human shields and brief attacks.',
    arena: { hisoka: [42, 34], chrollo: [70, 23], threat: [53, 27], label: 'The crowd becomes concealment' },
  },
  {
    number: 354, title: 'Head', phase: 'Puppet production', source: wiki('Chapter_354'),
    image: file('Hisoka striking Chrollo.png'),
    imageAlt: 'Hisoka turns a severed puppet head into a Bungee Gum weapon', zone: 'Upper stands',
    thesis: 'Hisoka finds a repeatable counter—remove the head—then weaponizes a head and body with Bungee Gum to clear the growing puppet mass.',
    events: ['Gallery Fake and Order Stamp scale the number of attackers.', 'Hisoka confirms that separating a puppet’s head disables it.', 'Bungee Gum turns severed material into a ranged hammer.', 'Chrollo shifts between production and direct intervention.', 'A correct solution reduces puppets but does not neutralize every marked body.'],
    mechanics: ['Gallery Fake', 'Order Stamp', 'Bungee Gum'],
    hisokaState: 'Has a working anti-puppet method and briefly regains initiative.',
    chrolloState: 'Lets the apparent counter create trackable bodies and future explosive material.',
    arena: { hisoka: [48, 26], chrollo: [27, 35], threat: [59, 31], label: 'Head-hammer counterattack' },
  },
  {
    number: 355, title: 'Detonation', phase: 'The hidden conversion', source: wiki('Chapter_355'),
    image: file("Hisoka preparing for Chrollo's final assault.png"),
    imageAlt: 'Sun and Moon detonations reverse Hisoka’s anti-puppet strategy', zone: 'Stands and arena edge',
    thesis: 'Disabled bodies are converted into bombs. Hisoka’s correct local deductions fail against the larger system because post-mortem marks outlive ordinary deactivation expectations.',
    events: ['Sun and Moon is integrated into the puppet mass.', 'Explosions interrupt Bungee Gum movement and body control.', 'Hisoka must track which head belongs to which body.', 'Chrollo turns discarded material into delayed danger.', 'The safe routes through the stands begin to collapse.'],
    mechanics: ['Sun and Moon', 'Gallery Fake', 'Order Stamp'],
    hisokaState: 'Correctly detects pieces of the bombing method while losing positional freedom.',
    chrolloState: 'Converts the crowd system from pursuit into an expanding kill zone.',
    arena: { hisoka: [52, 43], chrollo: [78, 27], threat: [60, 45], label: 'Marked bodies become bombs' },
  },
  {
    number: 356, title: 'Unfortunate: Part 1', phase: 'Kill zone', source: wiki('Chapter_356'),
    image: file("Hisoka hit by the puppets' explosion.png"),
    imageAlt: 'Explosive puppets surround and injure Hisoka', zone: 'Arena and lower stands',
    thesis: 'Chrollo destroys Hisoka’s anchors, damages his limbs and floods the remaining space with self-destructing puppets until movement and identification are no longer sustainable.',
    events: ['A maximum-power body-and-head bomb detonates.', 'Hisoka loses a Bungee Gum ceiling anchor.', 'Puppets pursue and self-destruct at close range.', 'Hisoka loses part of a leg.', 'Chrollo throws spectators to restrict movement.', 'A final mass explosion engulfs Hisoka.'],
    mechanics: ['Sun and Moon', 'Black Voice', 'Order Stamp', 'Bungee Gum'],
    hisokaState: 'Severely injured, surrounded and forced into a last-resort survival condition.',
    chrolloState: 'Maintains range while every available route converges on detonation.',
    arena: { hisoka: [50, 61], chrollo: [78, 38], threat: [50, 58], label: 'Mass detonation closes the arena' },
  },
  {
    number: 357, title: 'Unfortunate: Part 2', phase: 'Death, revival and reversal', source: wiki('Chapter_357'),
    image: file("Machi seeing Hisoka's post-mortem Nen.png"),
    imageAlt: 'Hisoka revives through post-mortem Bungee Gum', zone: 'Arena aftermath',
    thesis: 'The official fight is over, but Hisoka’s post-death command restarts his body and changes the rivalry from a desired duel into an unrestricted hunt against the Spider.',
    events: ['Hisoka is examined and declared dead.', 'Post-mortem Bungee Gum contracts his heart and lungs.', 'He reconstructs lost structure and appearance with Bungee Gum and Texture Surprise.', 'Hisoka restrains Machi and announces the new hunt.', 'Kortopi and Shalnark are killed.', 'The Phantom Troupe’s Black Whale pursuit begins from this reversal.'],
    mechanics: ['Post-mortem Nen', 'Bungee Gum', 'Texture Surprise'],
    hisokaState: 'Revived; rejects the old terms and begins killing Troupe members outside formal combat.',
    chrolloState: 'Winner of the match, but the victory initiates an organizational war and removes two ability owners.',
    arena: { hisoka: [50, 62], chrollo: [84, 18], threat: [50, 62], label: 'The corpse becomes the revival site' },
  },
];

export const fightAbilities = [
  { id: 'bungee-gum', owner: 'Hisoka', name: 'Bungee Gum', type: 'Transmutation', role: 'Movement, attachment, recoil, improvised weapons and post-death reconstruction.', condition: 'Aura carries adhesive and elastic properties; usefulness depends on placement and surviving anchors.', source: wiki('Bungee_Gum'), image: file('Hisoka using Bungee Gum.png'), color: 'hisoka' },
  { id: 'texture-surprise', owner: 'Hisoka', name: 'Texture Surprise', type: 'Transmutation', role: 'Changes the visible surface of a thin material; used after revival to conceal reconstructed damage.', condition: 'Alters appearance rather than biologically regenerating tissue.', source: fightSources.hisoka, image: file("Machi seeing Hisoka's post-mortem Nen.png"), color: 'hisoka' },
  { id: 'skill-hunter', owner: 'Chrollo', name: 'Skill Hunter', type: 'Specialization', role: 'Stores stolen abilities in Bandit’s Secret and supplies the library underlying the prepared combination.', condition: 'Theft and use obey multiple conditions; ordinary use requires the book and relevant page.', source: fightSources.chrollo, image: file("Chrollo's Double Face.png"), color: 'chrollo' },
  { id: 'double-face', owner: 'Chrollo', name: 'Double Face', type: 'Skill Hunter extension', role: 'Bookmarks and maintains one ability while another page is active, or permits use with the book closed.', condition: 'Only one bookmark; Chrollo says its efficiency came with additional conditions.', source: wiki('Chapter_351'), image: file("Chrollo's Double Face.png"), color: 'chrollo' },
  { id: 'black-voice', owner: 'Shalnark → Chrollo', name: 'Black Voice', type: 'Manipulation', role: 'Precise human control and a constant instant-loss threat if Hisoka is pierced by an antenna.', condition: 'Two antennae limit direct targets; requires phone and antenna placement.', source: fightSources.chrollo, image: file('Hisoka and Chrollo prepared to fight.png'), color: 'borrowed' },
  { id: 'gallery-fake', owner: 'Kortopi → Chrollo', name: 'Gallery Fake', type: 'Conjuration', role: 'Produces copied bodies that can qualify as puppets and carry persistent explosive marks.', condition: 'Copies eventually disappear, but Sun and Moon marks can persist through post-mortem Nen.', source: wiki('Chapter_352'), image: file('Chrollo using Gallery Fake.png'), color: 'borrowed' },
  { id: 'order-stamp', owner: 'Unknown former owner → Chrollo', name: 'Order Stamp', type: 'Manipulation', role: 'Turns copied bodies into a mass puppet army under simple verbal commands.', condition: 'Works on puppets, not living humans or ordinary corpses; removing the head disables the puppet.', source: wiki('Chapter_352'), image: file('A horde of puppets pursuing Hisoka.png'), color: 'chrollo' },
  { id: 'convert-hands', owner: 'Unknown former owner → Chrollo', name: 'Convert Hands', type: 'Conjuration', role: 'Changes appearances and conceals Chrollo among spectators and copies.', condition: 'Left and right palms have different effects; palm arrows remain as identifying marks.', source: wiki('Chapter_352'), image: file('Chrollo revealing Convert Hands.png'), color: 'chrollo' },
  { id: 'sun-moon', owner: 'Meteor City Elder → Chrollo', name: 'The Sun and Moon', type: 'Post-mortem ability', role: 'Marks bodies with opposing symbols that detonate on contact and convert the puppet system into a kill zone.', condition: 'Brief touches create smaller blasts; complete marks require longer contact. Marks persist until detonation.', source: wiki('Chapter_351'), image: file('Chrollo revealing The Sun and Moon.png'), color: 'explosive' },
];

export const aftermathImages = [
  { image: file("The three Spiders confirming Hisoka's death.png"), alt: 'Machi, Shalnark and Kortopi confirm Hisoka is dead', caption: 'The official result: Hisoka is pronounced dead.' },
  { image: file("Machi seeing Hisoka's post-mortem Nen.png"), alt: 'Machi sees Hisoka revive through post-mortem Nen', caption: 'Bungee Gum restarts his heart and lungs after the match.' },
  { image: file('Shalnark and Kortopi killed by Hisoka.png'), alt: 'Shalnark and Kortopi after Hisoka begins the unrestricted hunt', caption: 'The duel becomes an unrestricted war against the Spider.' },
];

export const comboSteps = [
  ['Gallery Fake', 'Create copied bodies', 'gallery-fake'],
  ['Order Stamp', 'Animate the copies', 'order-stamp'],
  ['Sun and Moon', 'Preserve explosive marks', 'sun-moon'],
  ['Convert Hands', 'Hide the real Chrollo', 'convert-hands'],
  ['Black Voice', 'Control precise human actions', 'black-voice'],
  ['Double Face', 'Keep abilities overlapping', 'double-face'],
  ['Kill zone', 'Overload Hisoka’s movement and attention', 'skill-hunter'],
];

export const knowledgeRows = [
  ['Black Voice target limit', 'Explained', 'Known', 'The antenna remains a decisive threat even after the rule is understood.'],
  ['Puppet disabling rule', 'Discovered in combat', 'Known', 'Removing the head stops Order Stamp control.'],
  ['Gallery Fake deactivation', 'Observed indirectly', 'Partial', 'Hisoka uses disappearance as a clue, but marked bodies complicate the inference.'],
  ['Convert Hands identity markers', 'Explained', 'Known', 'Knowing the palm rule does not reveal Chrollo’s position in a moving crowd.'],
  ['Sun and Moon persistence', 'Explained as post-mortem Nen', 'Known but underestimated', 'Persistence breaks ordinary expectations about closing the book or deactivating Gallery Fake.'],
  ['Which body matches each head', 'Reconstructed after detonation', 'Too late', 'The tracking burden is part of Chrollo’s trap.'],
  ['Complete puppet-bomb production rate', 'Not fully visible', 'Hidden', 'Hisoka cannot observe every preparation inside the stands.'],
  ['Hisoka’s post-death command', 'Hidden from Chrollo', 'Hisoka-only', 'The final concealed instruction creates the reversal after the official result.'],
];

export const strategyColumns = [
  { side: 'Hisoka', title: 'Reactive improvisation', points: ['Accepts Chrollo’s prepared venue', 'Analyzes rules during combat', 'Uses Bungee Gum for movement and improvised weapons', 'Finds the puppet head-removal counter', 'Pursues the real Chrollo through visual uncertainty', 'Loses mobility as anchors and limbs are destroyed'], conclusion: 'Hisoka repeatedly solves immediate problems, but each correct solution arrives inside a larger system that Chrollo already designed.' },
  { side: 'Chrollo', title: 'Prepared systems combat', points: ['Selects an audience-rich battlefield', 'Combines precision control, mass control, disguise and explosions', 'Controls when direct contact occurs', 'Forces incompatible tracking tasks onto Hisoka', 'Turns disabled bodies into delayed threats', 'Finishes without remaining in Hisoka’s preferred range'], conclusion: 'Chrollo wins by controlling environment, information and sequence—not by attempting a continuous direct exchange.' },
];

export const bodyStates = [
  ['Opening', 'Uninjured', 'Full movement and both Bungee Gum anchors available.'],
  ['Escalation', 'Hand damage', 'Weapon use and fine control become more difficult.'],
  ['Kill zone', 'Lower-leg loss', 'Explosive damage sharply reduces movement options.'],
  ['Detonation', 'Apparent death', 'Mass trauma and suffocation leave Hisoka without signs of life.'],
  ['Post-mortem command', 'Heart and lungs restarted', 'Bungee Gum contracts rhythmically after death.'],
  ['Reconstruction', 'Aura prosthetics', 'Bungee Gum supplies missing structure; Texture Surprise restores appearance.'],
];

export const aftermathNodes = [
  ['Heavens Arena defeat', 'Hisoka is officially killed by Chrollo’s prepared combination.'],
  ['Post-mortem revival', 'Bungee Gum restarts circulation and breathing.'],
  ['Rule change', 'Hisoka abandons the formal, opponent-prepared duel.'],
  ['Kortopi killed', 'Gallery Fake’s original owner is removed.'],
  ['Shalnark killed', 'Black Voice’s original owner is removed.'],
  ['Spider mobilizes', 'The Troupe begins an unrestricted hunt.'],
  ['Black Whale', 'Hisoka and the Spider enter the current lower-tier conflict.'],
];

export const debateRows = [
  { label: 'Confirmed', title: 'The match terms', text: 'Hisoka knowingly accepted Chrollo’s prepared conditions, both agreed to fight to the death, and weapons were permitted.' },
  { label: 'Confirmed', title: 'The battlefield resource', text: 'Chrollo used spectators, copied bodies, controlled humans and borrowed or stolen abilities as parts of the combat system.' },
  { label: 'Interpretation', title: '“Chrollo cheated”', text: 'The manga presents an agreed lethal match, but readers differ on whether preparation and the audience make the victory unfair in a broader sense.' },
  { label: 'Interpretation', title: 'Preparation versus superiority', text: 'The outcome proves that Chrollo’s prepared plan worked. It does not by itself settle every hypothetical fight under different conditions.' },
  { label: 'Unresolved', title: 'Outside assistance during the match', text: 'Claims that other Troupe members directly helped inside the arena should remain theory unless a source explicitly confirms them.' },
  { label: 'Analysis', title: 'Hisoka’s decisive error', text: 'Hisoka’s willingness to accept the opponent’s ideal conditions functions as both character strength and exploitable weakness.' },
];
