const freeze = (value) => Object.freeze(value);

const sources = freeze({
  351: 'https://hunterxhunter.fandom.com/wiki/Chapter_351',
  352: 'https://hunterxhunter.fandom.com/wiki/Chapter_352',
  353: 'https://hunterxhunter.fandom.com/wiki/Chapter_353',
  354: 'https://hunterxhunter.fandom.com/wiki/Chapter_354',
  355: 'https://hunterxhunter.fandom.com/wiki/Chapter_355',
  356: 'https://hunterxhunter.fandom.com/wiki/Chapter_356',
  357: 'https://hunterxhunter.fandom.com/wiki/Chapter_357',
});

export const succession351357SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 351-357 synopsis and chapter-note text',
  chapterUrls: sources,
  titleLabels: 'Existing maintained project metadata is retained for English chapter-title labels because the supplied text identified chapters by number rather than repeating each English title.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const chapterTitles = freeze({
  351: 'Battle to the Death',
  352: 'Troublesome',
  353: 'Cold-Blooded',
  354: 'Head',
  355: 'Detonation',
  356: 'Unfortunate: Part 1',
  357: 'Unfortunate: Part 2',
});

const event = ({ chapter, id, title, detail, location = 'Heavens Arena', tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: `Pre-voyage · Heavens Arena interlude · Chapter ${chapter}`,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter,
  confidence,
  source: sources[chapter],
});

const chapter351Events = freeze([
  event({ chapter: 351, id: '351-death-match-agreement', title: 'Hisoka and Chrollo agree to a battle to the death', detail: 'At Heavens Arena, Hisoka and Chrollo are introduced as Floor Masters. Hisoka rejects a sparring match and Chrollo agrees to a lethal fight. Weapons are permitted and the match begins.', tracks: ['hisoka', 'chrollo', 'heavens-arena', 'death-match'] }),
  event({ chapter: 351, id: '351-black-voice-referee', title: 'Chrollo opens with Black Voice on the referee', detail: 'Chrollo produces Shalnark’s phone and antenna, implants the referee, and turns him into a controlled attacker. Hisoka immediately recognizes that Chrollo prepared borrowed abilities specifically for this fight.', tracks: ['chrollo', 'black-voice', 'shalnark', 'hisoka', 'nen'] }),
  event({ chapter: 351, id: '351-chrollo-feint', title: 'Chrollo uses the manipulated referee to layer an antenna threat over direct combat', detail: 'While Hisoka must respect the possibility of being pierced by the second antenna, Chrollo feints a strike and lands a rapid kicking combination. Hisoka counters by attaching Bungee Gum to the referee and redirecting the controlled body.', tracks: ['chrollo', 'hisoka', 'black-voice', 'bungee-gum', 'combat'] }),
  event({ chapter: 351, id: '351-sun-moon-reveal', title: 'The Sun and Moon is revealed through the referee explosion', detail: 'A blast from the referee leads Chrollo to reveal the sun-plus mark on his left hand and moon-minus mark on his right. Opposing marks explode when they touch. Instant marking gives a smaller blast, while a complete bomb requires roughly three to five seconds of contact.', tracks: ['chrollo', 'sun-and-moon', 'nen', 'meteor-city'] }),
  event({ chapter: 351, id: '351-double-face-reveal', title: 'Double Face removes Skill Hunter’s constant book-holding limitation', detail: 'Chrollo reveals a single bookmark called Double Face. It can maintain the ability on a bookmarked page when the book is closed, or keep one ability active while the book is open to another. Chrollo states that Double Face is his own extension rather than a stolen ability and that its efficiency came with additional conditions.', tracks: ['chrollo', 'double-face', 'skill-hunter', 'nen'] }),
  event({ chapter: 351, id: '351-more-abilities-promised', title: 'Chrollo tells Hisoka the prepared system is not fully disclosed yet', detail: 'Chrollo says he intends to show three additional abilities and boasts that Hisoka will set a personal record for the number of abilities Chrollo has needed to kill someone.', tracks: ['chrollo', 'hisoka', 'fight-system'] }),
]);

const chapter352Events = freeze([
  event({ chapter: 352, id: '352-order-stamp', title: 'Order Stamp establishes the mass-puppet control layer', detail: 'Chrollo explains that Order Stamp manipulates puppets rather than living humans. Unlike Black Voice’s total control of at most two targets, Order Stamp can control many puppets at once but only through simple verbal commands.', tracks: ['chrollo', 'order-stamp', 'black-voice', 'manipulation'] }),
  event({ chapter: 352, id: '352-gallery-fake-referee-copy', title: 'Gallery Fake creates a controllable copy of the dead referee', detail: 'Using Kortopi’s Gallery Fake, Chrollo copies the referee and applies Order Stamp to the copy. The former owner of Order Stamp did not classify an ordinary corpse as a puppet, but did accept a copied corpse as one.', tracks: ['chrollo', 'gallery-fake', 'kortopi', 'order-stamp'] }),
  event({ chapter: 352, id: '352-puppet-head-rule', title: 'The head rule defines how Order Stamp puppets stop functioning', detail: 'Chrollo demonstrates that a copied human remains a puppet only while its head is connected to its torso. Beheading stops the control and removes the stamp. Under the simple command “break,” human-shaped puppets consistently attempt to sever the target’s head.', tracks: ['order-stamp', 'puppets', 'hisoka', 'nen-rules'] }),
  event({ chapter: 352, id: '352-convert-hands', title: 'Convert Hands introduces appearance substitution', detail: 'Chrollo reveals arrows on both palms. A right-hand touch makes the target look like Chrollo; a left-hand touch makes Chrollo look like the target; touching with both hands swaps their appearances. Chrollo says the palm arrows remain a way to distinguish the real user.', tracks: ['chrollo', 'convert-hands', 'disguise', 'nen'] }),
  event({ chapter: 352, id: '352-sun-moon-postmortem', title: 'The Sun and Moon persists because its original owner’s Nen intensified after death', detail: 'Chrollo explains that stolen abilities normally vanish from Skill Hunter when their original owner dies, but The Sun and Moon remained after the death of Meteor City’s Elder. The post-mortem effect means impressed marks remain until detonation even if the book is closed or put away.', tracks: ['sun-and-moon', 'post-mortem-nen', 'meteor-city-elder', 'skill-hunter'] }),
  event({ chapter: 352, id: '352-fight-enters-crowd', title: 'Chrollo moves the battle into the audience', detail: 'After Hisoka accepts the fight despite the disclosed system, Chrollo bookmarks an ability, retreats into the spectators, and begins using Black Voice and Convert Hands to create an identity-and-distance problem inside the crowd.', location: 'Heavens Arena · audience stands', tracks: ['chrollo', 'hisoka', 'black-voice', 'convert-hands', 'crowd'] }),
]);

const chapter353Events = freeze([
  event({ chapter: 353, id: '353-hisoka-reads-tool-state', title: 'Hisoka reconstructs which abilities Chrollo currently has active', detail: 'Seeing copied audience members and the missing Black Voice antennae, Hisoka reasons that Gallery Fake is active, Convert Hands has been released, and Chrollo has changed clothes to blend into the audience.', location: 'Heavens Arena · audience stands', tracks: ['hisoka', 'chrollo', 'gallery-fake', 'convert-hands', 'deduction'] }),
  event({ chapter: 353, id: '353-puppet-horde', title: 'A stamped puppet horde is ordered to break Hisoka', detail: 'Roughly thirty visible puppets, with additional uncommanded copies possible, rush Hisoka after Chrollo combines Gallery Fake with Order Stamp and the command to “break Hisoka.”', location: 'Heavens Arena · audience stands', tracks: ['gallery-fake', 'order-stamp', 'puppets', 'hisoka'] }),
  event({ chapter: 353, id: '353-ceiling-escape', title: 'Hisoka uses Bungee Gum to escape vertically as the puppets stack toward him', detail: 'Hisoka attaches himself overhead, but the puppets climb over one another and nearly reach him, showing that the mass-control system can pressure even his aerial movement.', location: 'Heavens Arena · audience stands / ceiling', tracks: ['hisoka', 'bungee-gum', 'puppets'] }),
  event({ chapter: 353, id: '353-chrollo-hit-and-hide', title: 'Chrollo repeatedly attacks through openings created by the puppet mass', detail: 'Chrollo appears behind Hisoka, lands kicks, disappears into the pressure created by the puppets, and attacks again whenever Hisoka is occupied with preventing decapitation.', location: 'Heavens Arena · audience stands', tracks: ['chrollo', 'hisoka', 'puppets', 'combat'] }),
  event({ chapter: 353, id: '353-severed-head-counter', title: 'Hisoka turns severed puppet heads into Bungee Gum projectiles', detail: 'Hisoka attaches Bungee Gum to severed heads and attacks Chrollo from multiple directions. One head misses, but a second head attached from Hisoka’s leg strikes Chrollo in the face.', location: 'Heavens Arena · audience stands', tracks: ['hisoka', 'bungee-gum', 'chrollo', 'improvised-weapon'] }),
]);

const chapter354Events = freeze([
  event({ chapter: 354, id: '354-head-hammer', title: 'Hisoka weaponizes an adult head as a heavy swinging weapon', detail: 'After the narration compares an adult male head to a roughly 7–8 kg bowling-ball weight, Hisoka repeatedly uses a severed puppet head with Bungee Gum to crush or decapitate incoming puppets and pressure Chrollo.', location: 'Heavens Arena · audience stands', tracks: ['hisoka', 'bungee-gum', 'puppets', 'combat'] }),
  event({ chapter: 354, id: '354-hostage-puppet', title: 'Hisoka deliberately leaves one puppet active to constrain Chrollo’s sequence', detail: 'Rather than destroy every puppet, Hisoka disarms one and keeps it alive. His goal is to force Chrollo either to maintain Order Stamp or visibly deactivate it before returning to Gallery Fake or Convert Hands.', location: 'Heavens Arena · audience stands', tracks: ['hisoka', 'order-stamp', 'chrollo', 'deduction'] }),
  event({ chapter: 354, id: '354-stamp-disappears', title: 'The disappearing stamp tells Hisoka that Chrollo changed ability state', detail: 'When the stamp on the hostage puppet vanishes, Hisoka concludes that Chrollo has deactivated Order Stamp and shifted back toward copy production or disguise.', location: 'Heavens Arena · audience stands', tracks: ['hisoka', 'order-stamp', 'gallery-fake', 'convert-hands'] }),
  event({ chapter: 354, id: '354-fake-chrollo-caught', title: 'Hisoka catches and destroys a body disguised as Chrollo', detail: 'Hisoka uses Bungee Gum anchored to spectators and his severed-head weapon to seize a Chrollo-looking target, slam it down, and apparently break Chrollo’s body, only to discover it is an audience member transformed to resemble him.', location: 'Heavens Arena · audience stands', tracks: ['hisoka', 'chrollo', 'convert-hands', 'black-voice', 'bungee-gum'] }),
  event({ chapter: 354, id: '354-persistence-revelation', title: 'Hisoka realizes The Sun and Moon can preserve Gallery Fake copies', detail: 'The continuing existence of the severed copied head after Gallery Fake should have been released leads Hisoka to the key rule: a copy bearing a Sun and Moon mark does not vanish under normal Gallery Fake deactivation expectations.', location: 'Heavens Arena · audience stands', tracks: ['hisoka', 'sun-and-moon', 'gallery-fake', 'post-mortem-nen'] }),
]);

const chapter355Events = freeze([
  event({ chapter: 355, id: '355-hisoka-reconstructs-true-sequence', title: 'Hisoka reconstructs the hidden production sequence behind the persistent puppets', detail: 'Hisoka realizes Chrollo could bookmark Gallery Fake, create copies, apply a Sun mark with the free left hand, then release Gallery Fake while post-mortem Sun and Moon preserves the marked copies before Order Stamp is activated.', location: 'Heavens Arena · audience stands', tracks: ['hisoka', 'chrollo', 'gallery-fake', 'sun-and-moon', 'order-stamp', 'double-face'] }),
  event({ chapter: 355, id: '355-puppet-count-revised', title: 'Hisoka lowers his estimate of the remaining puppets because the hidden marking process takes extra time', detail: 'The additional Sun-and-Moon marking step means Chrollo’s production was slower than Hisoka first assumed. Hisoka revises the remaining puppet estimate to roughly twenty to thirty while recognizing Chrollo can continue making more every few seconds.', location: 'Heavens Arena · audience stands', tracks: ['hisoka', 'puppets', 'deduction'] }),
  event({ chapter: 355, id: '355-ten-minute-window', title: 'Hisoka identifies an approaching operational deadline', detail: 'Hisoka estimates paramedics and security will arrive in about ten minutes. He predicts Chrollo must launch the final assault before the puppet bodies are confused with casualties and removed from the arena.', location: 'Heavens Arena', tracks: ['hisoka', 'chrollo', 'security', 'paramedics', 'deduction'] }),
  event({ chapter: 355, id: '355-hundreds-rush', title: 'The crowd-control system escalates into a mass rush', detail: 'After the command “Break Hisoka” is broadcast through an audience member’s headset, a huge mass of marked puppets pours toward the arena. Hisoka attaches Bungee Gum to several bodies and swings them as a human hammer to repel the wave.', tracks: ['order-stamp', 'puppets', 'hisoka', 'bungee-gum'] }),
  event({ chapter: 355, id: '355-black-voice-positioning', title: 'Chrollo uses Black Voice to position a human trigger for the explosive sequence', detail: 'From within the audience, Chrollo gives a controlled person a precise positional command, preparing the contact needed to detonate Sun and Moon marks while Hisoka is occupied by the puppet mass.', location: 'Heavens Arena · audience stands', tracks: ['chrollo', 'black-voice', 'sun-and-moon', 'trap'] }),
  event({ chapter: 355, id: '355-hand-explosion', title: 'The severed head explodes in Hisoka’s hand and destroys four fingers', detail: 'At Chrollo’s timing command, the severed head Hisoka has been using detonates and obliterates four of the five fingers on the hand holding it.', tracks: ['hisoka', 'sun-and-moon', 'injury'], confidence: 'The supplied synopsis places the severed head in Hisoka’s left hand immediately before the explosion; the archive records the damaged hand as the left hand on that basis' }),
]);

const chapter356Events = freeze([
  event({ chapter: 356, id: '356-max-power-body-head-bomb', title: 'Hisoka deduces how Chrollo turned the separated body and head into one maximum-power bomb', detail: 'Hisoka concludes that Chrollo tracked the original body, completed a Sun mark on it, marked another person with the Moon, and used Black Voice to force contact. The detonation affected both the marked body and its severed copied head.', tracks: ['hisoka', 'chrollo', 'sun-and-moon', 'black-voice', 'deduction'] }),
  event({ chapter: 356, id: '356-hisoka-regroups', title: 'Hisoka improvises new weapons and movement anchors despite catastrophic hand damage', detail: 'Hisoka tears the head from another puppet, uses the body to clear attackers, and shoots Bungee Gum from his leg toward an upper tier as he tries to restore mobility.', tracks: ['hisoka', 'bungee-gum', 'puppets', 'survival'] }),
  event({ chapter: 356, id: '356-self-destruct-order', title: 'Chrollo orders puppets to find Hisoka and self-destruct at close range', detail: 'Multiple puppets leap from the balcony, bring opposing marks together near Hisoka, and detonate, turning the arena itself into a chained explosive pursuit zone.', tracks: ['chrollo', 'puppets', 'sun-and-moon', 'order-stamp', 'explosion'] }),
  event({ chapter: 356, id: '356-leg-loss', title: 'An explosion destroys part of Hisoka’s lower leg', detail: 'The blast removes Hisoka’s lower leg and sharply reduces his remaining movement options.', tracks: ['hisoka', 'injury', 'sun-and-moon'], confidence: 'Source conflict preserved: the supplied synopsis says Hisoka’s right lower leg is blown off, Chapter 356 notes say left leg, and Chapter 357 later describes reconstructing the right leg. The archive does not silently erase that discrepancy.' }),
  event({ chapter: 356, id: '356-spectator-projectiles', title: 'Chrollo throws spectators into Hisoka to break his remaining movement rhythm', detail: 'As Hisoka attempts to use Bungee Gum after the leg injury, Chrollo hurls audience members into him from the opposite side and continues using bodies to interrupt anchors and force him downward.', tracks: ['chrollo', 'hisoka', 'crowd', 'movement-denial'] }),
  event({ chapter: 356, id: '356-final-encirclement', title: 'The puppet mass encloses Hisoka for the final detonation', detail: 'With Hisoka on the floor and surrounded, the puppet horde closes in. Hisoka draws his arms toward his chest in a last-resort posture before a massive explosion engulfs the group.', tracks: ['hisoka', 'chrollo', 'puppets', 'explosion', 'fight-climax'] }),
]);

const chapter357Events = freeze([
  event({ chapter: 357, id: '357-arena-aftermath', title: 'The Heavens Arena match ends in a mass-casualty explosion', detail: 'News coverage reports a war-zone-like scene, casualties, and an investigation after the Floor Master battle produces a major explosion and crater inside Heavens Arena.', location: 'Heavens Arena · aftermath', tracks: ['heavens-arena', 'aftermath', 'casualties'] }),
  event({ chapter: 357, id: '357-hisoka-death-confirmed', title: 'Machi, Shalnark, and Kortopi confirm Hisoka’s death', detail: 'The three Spiders inspect Hisoka’s corpse. Shalnark explains that around two hundred puppets trying to decapitate Hisoka cushioned him from the bomb puppets, but the blast and mass of bodies deprived him of oxygen. Hisoka is judged to have died by suffocation.', location: 'Heavens Arena · aftermath', tracks: ['hisoka', 'machi', 'shalnark', 'kortopi', 'death'] }),
  event({ chapter: 357, id: '357-postmortem-command', title: 'Hisoka’s pre-death Bungee Gum command activates after death', detail: 'A flashback reveals that Hisoka ordered Bungee Gum to contract his heart and lungs after death. Post-mortem aura swells around the corpse, the heart begins beating, breathing resumes, and Hisoka revives.', location: 'Heavens Arena · aftermath', tracks: ['hisoka', 'bungee-gum', 'post-mortem-nen', 'revival'] }),
  event({ chapter: 357, id: '357-self-reconstruction', title: 'Hisoka uses Bungee Gum and Texture Surprise to rebuild a functional exterior', detail: 'After revival, Hisoka uses Bungee Gum to stop bleeding and form rubber replacements for his damaged left hand and right leg, then uses Texture Surprise to recreate the visible flesh and appearance over the damaged areas. The supplied text presents this as Nen reconstruction/prosthesis rather than biological regrowth.', location: 'Heavens Arena · aftermath', tracks: ['hisoka', 'bungee-gum', 'texture-surprise', 'body-state'] }),
  event({ chapter: 357, id: '357-hunt-declaration', title: 'Hisoka rejects future arranged duels and declares an unrestricted hunt on the Phantom Troupe', detail: 'Hisoka restrains Machi with Bungee Gum and tells her to inform the rest of the Troupe that he will fight and kill them wherever he encounters them rather than waiting for mutually arranged battles.', location: 'Heavens Arena · aftermath', tracks: ['hisoka', 'machi', 'phantom-troupe', 'hunt'] }),
  event({ chapter: 357, id: '357-black-whale-theft-plan', title: 'Chrollo plans to gather the Troupe aboard the Black Whale and steal Kakin royal treasure', detail: 'While speaking with Shalnark by phone, Chrollo says the Troupe will board Kakin’s voyage, steal the royal family’s considerable treasure, and reunite aboard the ship.', location: 'Post-fight city / phone call', tracks: ['chrollo', 'shalnark', 'phantom-troupe', 'black-whale', 'kakin'] }),
  event({ chapter: 357, id: '357-kortopi-killed', title: 'Hisoka kills Kortopi', detail: 'Hisoka emerges from the bathroom carrying Kortopi’s severed head, confirming Kortopi has been killed before Shalnark can react.', location: 'Post-fight public area', tracks: ['hisoka', 'kortopi', 'phantom-troupe', 'death'] }),
  event({ chapter: 357, id: '357-shalnark-killed', title: 'Hisoka kills Shalnark immediately afterward', detail: 'Hisoka throws Kortopi’s head toward Shalnark, closes the distance while Shalnark is occupied, and kills him. Shalnark’s corpse is later displayed on a swing with Kortopi’s head at its feet.', location: 'Post-fight public area', tracks: ['hisoka', 'shalnark', 'phantom-troupe', 'death'] }),
  event({ chapter: 357, id: '357-two-down', title: 'Hisoka counts the first two Troupe kills of his new hunt', detail: 'After killing Kortopi and Shalnark, Hisoka states that two are down and ten remain, framing the Heavens Arena aftermath as the beginning of an ongoing anti-Troupe hunt.', location: 'Post-fight public area', tracks: ['hisoka', 'phantom-troupe', 'hunt'] }),
]);

export const succession351357TimelineEvents = freeze([
  ...chapter351Events,
  ...chapter352Events,
  ...chapter353Events,
  ...chapter354Events,
  ...chapter355Events,
  ...chapter356Events,
  ...chapter357Events,
]);

export const succession351357AbilityRecords = freeze([
  freeze({ user: 'Chrollo Lucilfer', ability: 'Black Voice', type: 'Borrowed Manipulation ability from Shalnark', mechanics: 'Uses a phone and physical antennae to achieve precise control over implanted human targets. Chapter 352 states that total control is limited to two targets at a time.', chapters: '351–356', conditions: 'Requires an antenna to be implanted in the target. Chrollo is using Shalnark’s real phone/antennae rather than a newly created copy.', source: sources[351] }),
  freeze({ user: 'Chrollo Lucilfer', ability: 'The Sun and Moon', type: 'Stolen ability preserved by post-mortem Nen', mechanics: 'Left hand applies a sun/plus mark and right hand applies a moon/minus mark. Opposing marks explode on contact. Instant marks produce smaller explosions while a complete bomb requires roughly three to five seconds of contact.', chapters: '351–356', conditions: 'The original Meteor City Elder died, yet the ability remains in Skill Hunter through post-mortem Nen. Impressed marks persist until detonation even if the book is closed, and marked Gallery Fake copies can remain after Gallery Fake is deactivated.', source: sources[351] }),
  freeze({ user: 'Chrollo Lucilfer', ability: 'Double Face', type: 'Chrollo-created Skill Hunter extension', mechanics: 'A single bookmark maintains the ability on its page when the book is closed or while Chrollo opens the book to another ability, enabling overlapping ability use and removing the constant need to hold the relevant page open.', chapters: '351–356', conditions: 'Only one bookmark exists. Chrollo states that adding the bookmark imposed additional conditions, but the supplied Chapters 351–357 text does not enumerate those extra conditions.', source: sources[351] }),
  freeze({ user: 'Chrollo Lucilfer', ability: 'Order Stamp', type: 'Stolen puppet-control ability', mechanics: 'A stamp placed on a qualifying puppet lets Chrollo issue simple verbal commands to many puppets. Human-shaped puppets ordered to “break” a target focus on severing the target’s head.', chapters: '352–356', conditions: 'Ordinary corpses are not accepted as puppets by the former owner’s rule, but Gallery Fake copies of corpses are. A puppet ceases to qualify when its head is separated from its torso, which also removes the stamp.', source: sources[352] }),
  freeze({ user: 'Chrollo Lucilfer', ability: 'Gallery Fake', type: 'Borrowed Conjuration ability from Kortopi', mechanics: 'Creates copies of objects/people, including copied human bodies that Order Stamp can treat as puppets. Chrollo uses the copies as the physical production base of his crowd strategy.', chapters: '352–356', conditions: 'Copies normally vanish after deactivation, but Chapter 354–355 establishes that Sun and Moon’s post-mortem persistence can preserve marked copies beyond normal Gallery Fake deactivation.', source: sources[352] }),
  freeze({ user: 'Chrollo Lucilfer', ability: 'Convert Hands', type: 'Stolen appearance-transformation ability', mechanics: 'Right-hand contact makes another person take Chrollo’s appearance; left-hand contact makes Chrollo take the other person’s appearance; simultaneous contact with both marks swaps appearances.', chapters: '352–354', conditions: 'The transformation affects appearance. Chrollo states that the arrow marks on the palms remain useful for identifying the real user. Complete duration and other limitations are not supplied.', source: sources[352] }),
  freeze({ user: 'Hisoka Morow', ability: 'Bungee Gum · post-mortem revival application', type: 'Transmutation / post-mortem application', mechanics: 'Before dying, Hisoka commands Bungee Gum to contract his heart and lungs after death. The command activates post-mortem, restarting circulation and breathing.', chapters: '357', conditions: 'Hisoka issues the command before the fatal explosion. Chapter 357 confirms the corpse was actually judged dead before the post-mortem contraction revived him.', source: sources[357] }),
  freeze({ user: 'Hisoka Morow', ability: 'Bungee Gum + Texture Surprise · prosthetic reconstruction', type: 'Transmutation / appearance reconstruction', mechanics: 'After revival, Bungee Gum stops bleeding and forms replacement structure for the damaged left hand and right leg while Texture Surprise recreates the visible flesh/skin appearance.', chapters: '357', conditions: 'The supplied text depicts a Nen-made functional exterior/prosthesis rather than biological regeneration of the lost tissue.', source: sources[357] }),
]);

export const succession351357BodyStates = freeze([
  freeze({ subject: 'Hisoka Morow', state: 'Severe left-hand injury', chapter: 355, detail: 'The exploding severed head obliterates four of the five fingers on the hand holding it; the supplied synopsis places the head in his left hand immediately beforehand.', status: 'injured', source: sources[355] }),
  freeze({ subject: 'Hisoka Morow', state: 'Lower-leg loss', chapter: 356, detail: 'An explosive puppet blast removes part of a lower leg. Source-side conflict is preserved: Chapter 356 synopsis says right, Chapter 356 notes say left, and Chapter 357 reconstruction identifies the right leg.', status: 'injured / source-side conflict', source: sources[356] }),
  freeze({ subject: 'Hisoka Morow', state: 'Confirmed dead by suffocation', chapter: 357, detail: 'Machi, Shalnark, and Kortopi confirm the corpse. Shalnark attributes death to oxygen deprivation caused by the blast and the mass of puppet bodies around Hisoka.', status: 'deceased at this point in chapter', source: sources[357] }),
  freeze({ subject: 'Hisoka Morow', state: 'Revived through post-mortem Bungee Gum', chapter: 357, detail: 'His pre-death command contracts his heart and lungs after death, restoring heartbeat and breathing.', status: 'alive / exceptional revival', source: sources[357] }),
  freeze({ subject: 'Hisoka Morow', state: 'Nen prosthetic reconstruction', chapter: 357, detail: 'Hisoka replaces the damaged left hand and right leg with Bungee Gum structures and overlays the visible surface with Texture Surprise.', status: 'alive / reconstructed', source: sources[357] }),
  freeze({ subject: 'Kortopi', state: 'Confirmed deceased', chapter: 357, detail: 'Hisoka kills Kortopi and carries his severed head from the bathroom.', status: 'deceased', source: sources[357] }),
  freeze({ subject: 'Shalnark', state: 'Confirmed deceased', chapter: 357, detail: 'Hisoka attacks and kills Shalnark immediately after revealing Kortopi’s death.', status: 'deceased', source: sources[357] }),
]);

export const succession351357RelationshipRecords = freeze([
  freeze({ from: 'Hisoka Morow', to: 'Chrollo Lucilfer', type: 'Battle-to-the-death rivalry', note: 'They mutually agree to a lethal Heavens Arena match. Chrollo wins the official fight, but Hisoka revives afterward and changes the rivalry from arranged duels to unrestricted hunting.', phase: 'Heavens Arena interlude', chapters: '351–357', state: 'escalated after official match', source: sources[357] }),
  freeze({ from: 'Chrollo Lucilfer', to: 'Shalnark', type: 'Borrowed Nen ability / equipment', note: 'Chrollo uses Shalnark’s Black Voice phone and antennae throughout the fight. Afterward he tells Shalnark the antennae are gone and plans to return the phone when they board the ship.', phase: 'Heavens Arena interlude', chapters: '351–357', state: 'ended by Shalnark’s death', source: sources[357] }),
  freeze({ from: 'Chrollo Lucilfer', to: 'Kortopi', type: 'Borrowed Nen ability', note: 'Chrollo uses Kortopi’s Gallery Fake as the copy-production base for the puppet strategy. Kortopi is killed by Hisoka immediately after the match aftermath.', phase: 'Heavens Arena interlude', chapters: '352–357', state: 'ended by Kortopi’s death', source: sources[357] }),
  freeze({ from: 'Hisoka Morow', to: 'Phantom Troupe', type: 'Unrestricted kill-on-sight hunt', note: 'After revival Hisoka tells Machi he will fight and kill the Spiders wherever he encounters them rather than waiting for favorable or mutually agreed duels.', phase: 'Post-Heavens Arena / Black Whale lead-in', chapters: '357–current', state: 'active', source: sources[357] }),
  freeze({ from: 'Chrollo Lucilfer', to: 'Phantom Troupe', type: 'Black Whale treasure operation', note: 'Chrollo plans to gather the Troupe on the Black Whale and steal the Kakin royal family’s treasure during the voyage.', phase: 'Black Whale lead-in', chapters: '357–current', state: 'planned', source: sources[357] }),
  freeze({ from: 'Machi Komacine', to: 'Hisoka Morow', type: 'Post-fight repair attempt / hostile separation', note: 'Machi stays behind to repair Hisoka’s corpse because he paid in advance and thanks him for helping exorcise Chrollo. After Hisoka revives and self-reconstructs, he restrains Machi and uses her as the messenger for his new anti-Troupe hunt.', phase: 'Heavens Arena aftermath', chapters: '357', state: 'hostile', source: sources[357] }),
]);

export const succession351357SourceConflicts = freeze([
  freeze({ issue: 'Which lower leg Hisoka loses in Chapter 356', synopsis: 'Right lower leg', chapterNotes: 'Left leg', laterChapter357Detail: 'Hisoka creates a rubber prosthesis for the right leg', handling: 'Preserve the conflict explicitly; do not silently overwrite the Chapter 356 notes.', source: sources[356] }),
]);

export const succession351357FightResearch = freeze({
  fight: 'Hisoka Morow vs Chrollo Lucilfer',
  venue: 'Heavens Arena',
  chapters: '351–357',
  stakes: 'Mutually agreed battle to the death',
  officialWinner: 'Chrollo Lucilfer',
  officialLoserState: 'Hisoka is confirmed dead after the arena explosion, then revives through a pre-set post-mortem Bungee Gum command',
  preparedAbilityStack: freeze([
    'Black Voice — precise living-human control',
    'Gallery Fake — copy production',
    'Order Stamp — mass puppet control',
    'Convert Hands — appearance substitution and concealment',
    'The Sun and Moon — persistent explosive marking',
    'Double Face — overlap/maintenance system that lets the other abilities interact efficiently',
  ]),
  productionChain: freeze([
    'Create human copies with Gallery Fake',
    'Use Sun and Moon to place persistent marks on selected copies',
    'Allow post-mortem Sun and Moon to preserve marked copies beyond ordinary Gallery Fake deactivation',
    'Animate/command copies with Order Stamp',
    'Use Convert Hands and the crowd to hide Chrollo’s real body and produce false Chrollo targets',
    'Use Black Voice for precise living-human positioning and trigger actions',
    'Collapse Hisoka’s movement space with mass pursuit and self-destructing puppets',
  ]),
  hisokaCounterplay: freeze([
    'Tracks Chrollo’s active-bookmark sequence in real time',
    'Uses Bungee Gum for ceiling movement and crowd manipulation',
    'Discovers that beheading disables Order Stamp puppets',
    'Leaves a puppet alive to test whether Order Stamp remains active',
    'Weaponizes severed heads as high-mass Bungee Gum projectiles',
    'Recognizes that Sun and Moon persistence is preserving copies after Gallery Fake deactivation',
    'Correctly predicts the need for a final assault before security/paramedics disrupt the prepared field',
  ]),
  decisiveAsymmetry: 'Hisoka repeatedly solves local mechanics after observing them, while Chrollo controls the venue, preparation time, crowd resources, identity noise, ability sequence, and timing of the final explosive convergence.',
  aftermath: freeze([
    'Hisoka’s confirmed death is reversed by post-mortem Bungee Gum',
    'Hisoka self-reconstructs damaged body parts with Bungee Gum and Texture Surprise',
    'Hisoka abandons the old arranged-duel logic and declares an unrestricted hunt on the Phantom Troupe',
    'Kortopi and Shalnark are killed immediately',
    'Chrollo’s Black Whale treasure plan becomes directly entangled with Hisoka’s anti-Troupe hunt',
  ]),
  sourceConflicts: succession351357SourceConflicts,
  source: sources[357],
});

export const succession351357Mysteries = freeze([
  freeze({ question: 'What additional conditions did Double Face add to Skill Hunter?', evidence: 'Chrollo says the bookmark greatly improves efficiency but came with additional conditions; the supplied Chapters 351–357 text does not enumerate them.', status: 'open', lastChapter: '357', source: sources[351] }),
  freeze({ question: 'What are the complete original conditions and limits of Order Stamp?', evidence: 'Chrollo explains the puppet/corpse/head rules and simple-command limitation, but the complete former-owner conditions, range, duration, and other restrictions are not supplied.', status: 'open', lastChapter: '357', source: sources[352] }),
  freeze({ question: 'What are the complete limits of Convert Hands?', evidence: 'Chapter 352 explains the left-hand, right-hand, and dual-touch appearance effects and the palm arrows, but not the full duration, range, or cancellation rules.', status: 'open', lastChapter: '357', source: sources[352] }),
  freeze({ question: 'How will the Phantom Troupe respond to Hisoka’s unrestricted hunt?', evidence: 'Chapter 357 ends with Hisoka killing Kortopi and Shalnark after declaring that he will hunt all remaining Spiders, while Chrollo is gathering the Troupe for the Black Whale.', status: 'developing', lastChapter: '357', source: sources[357] }),
]);

const chapterDefinitions = freeze({
  351: freeze({ focus: 'Hisoka and Chrollo begin their mutually agreed death match; Chrollo opens with Black Voice, reveals The Sun and Moon, and introduces Double Face as the bookmark extension that lets his prepared abilities overlap.', events: chapter351Events, lanes: freeze(['Hisoka vs Chrollo', 'Black Voice', 'The Sun and Moon', 'Double Face', 'Nen combat']) }),
  352: freeze({ focus: 'Chrollo discloses Order Stamp, Gallery Fake, Convert Hands, and the post-mortem persistence of The Sun and Moon, then moves the fight into the audience where copied bodies and disguises become battlefield resources.', events: chapter352Events, lanes: freeze(['Hisoka vs Chrollo', 'Order Stamp', 'Gallery Fake', 'Convert Hands', 'Post-mortem Nen']) }),
  353: freeze({ focus: 'Chrollo turns the audience into a concealment field and launches a mass of stamped copied spectators while Hisoka uses Bungee Gum and severed heads to survive and strike back.', events: chapter353Events, lanes: freeze(['Hisoka vs Chrollo', 'Puppet horde', 'Crowd concealment', 'Bungee Gum']) }),
  354: freeze({ focus: 'Hisoka weaponizes severed puppet heads, deliberately preserves one puppet to constrain Chrollo’s sequence, catches a false Chrollo, and realizes Sun and Moon can preserve marked copies after Gallery Fake is deactivated.', events: chapter354Events, lanes: freeze(['Hisoka vs Chrollo', 'Puppet counterplay', 'Convert Hands', 'Sun and Moon persistence']) }),
  355: freeze({ focus: 'Hisoka reconstructs Chrollo’s true marked-copy production chain and anticipates a final explosive assault, but the puppet rush and a precisely timed Sun and Moon detonation destroy four fingers on his left hand.', events: chapter355Events, lanes: freeze(['Hisoka vs Chrollo', 'Production chain', 'Explosive puppets', 'Hisoka injury']) }),
  356: freeze({ focus: 'Chrollo’s maximum-power bombs, self-destructing puppets, and spectator interference destroy Hisoka’s lower leg, collapse his remaining movement routes, and engulf him in the final mass detonation.', events: chapter356Events, lanes: freeze(['Hisoka vs Chrollo', 'Kill zone', 'Explosive puppets', 'Hisoka injury']) }),
  357: freeze({ focus: 'Hisoka is confirmed dead by suffocation, revives through post-mortem Bungee Gum, reconstructs his damaged body, declares an unrestricted hunt on the Phantom Troupe, and kills Kortopi and Shalnark as Chrollo prepares the Troupe’s Black Whale treasure operation.', events: chapter357Events, lanes: freeze(['Hisoka revival', 'Post-mortem Nen', 'Phantom Troupe hunt', 'Black Whale lead-in', 'Kortopi & Shalnark deaths']) }),
});

export const succession351357ChapterResearch = freeze(
  Object.entries(chapterDefinitions).map(([numberText, definition]) => {
    const number = Number(numberText);
    return freeze({
      number,
      title: chapterTitles[number],
      phase: 'Heavens Arena interlude',
      voyageDay: 'Pre-voyage',
      lanes: definition.lanes,
      focus: definition.focus,
      events: definition.events,
      prelude: freeze([]),
      characters: number === 357
        ? freeze(['Hisoka Morow', 'Chrollo Lucilfer', 'Machi Komacine', 'Shalnark', 'Kortopi', 'Phantom Troupe', 'Heavens Arena spectators and emergency responders'])
        : freeze(['Hisoka Morow', 'Chrollo Lucilfer', 'Heavens Arena spectators', ...(number <= 352 ? ['Shalnark', 'Kortopi', 'Meteor City Elder'] : [])]),
      locations: number === 357
        ? freeze(['Heavens Arena · aftermath', 'Post-fight city / phone call', 'Post-fight public area'])
        : freeze(['Heavens Arena', 'Heavens Arena · audience stands']),
      threadLabels: freeze(['Hisoka vs Chrollo', 'Heavens Arena', 'Nen combat', 'Phantom Troupe', ...(number === 357 ? ['Black Whale', 'Hisoka hunt'] : [])]),
      fightResearch: succession351357FightResearch,
      confidence: freeze([
        'All story-event and mechanic claims are derived only from the user-supplied Hunterpedia Chapters 351–357 text',
        'English title labels are retained from existing maintained project metadata because the supplied block identified the chapters by number rather than repeating those titles',
        'Hisoka’s deductions are preserved as deductions until the supplied text confirms them',
        'The Chapter 356 left-leg/right-leg inconsistency is preserved explicitly rather than silently corrected',
        'Hisoka’s Chapter 357 reconstruction is treated as Nen prosthetic/appearance reconstruction, not biological regeneration',
      ]),
      status: 'Maintained chapter summary, combat chronology, ability interactions, tactical deductions, body-state changes, aftermath consequences, source conflicts, mysteries, and cross-chapter fight research linked',
      coverage: freeze({ identity: true, publication: false, summary: true, sceneSummary: true, chronology: true, appearances: true, locations: true, relationships: true, assignments: false, nen: true, source: true }),
      lastReviewed: 'August 7, 2026',
      releaseDate: null,
      titleStatus: 'maintained-project-metadata / story content verified from user-supplied Hunterpedia',
      officialReaderUrl: null,
      source: sources[number],
    });
  }),
);

export const succession351357ChapterFocus = freeze(Object.fromEntries(
  Object.entries(chapterDefinitions).map(([number, definition]) => [Number(number), definition.focus]),
));
