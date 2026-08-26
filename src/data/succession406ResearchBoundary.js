const freeze = (value) => Object.freeze(value);
const source406 = 'https://hunterxhunter.fandom.com/wiki/Chapter_406';

export const succession406SourcePolicy = freeze({
  reviewedAt: '2026-08-11',
  soleStorySource: 'Current user-supplied Hunterpedia-style Chapter 406 synopsis and its supplied trivia block',
  titleBoundary: 'No Chapter 406 title or Japanese title was supplied in the current packet. Neither is invented or backfilled from the older Chapter 406 catalog.',
  chronologyPolicy: 'Chapter 406 continues the Chapter 405 Tajao-route cliffhanger and shows Halkenburg’s funeral procession beginning. Maintained prior scheduling places the sequence on Voyage Day 12 during the funeral-procession period; no exact minute is invented.',
  routeBoundary: 'The Chapter 405 unseen destination is resolved as the Black Whale’s outermost interior pipe/stair chamber leading toward the top of Tier 2. This is distinct from both the Tier 2 Heil-Ly processing area and the waste/sewage plant between Tiers 4 and 5.',
  wasteBoundary: 'Cha-R/Xi-Yu control of the waste-processing area is stated by Tajao. Heil-Ly posing as waste subcontractors and using interviews as an assembly-line murder pipeline remains the Troupe’s theory rather than a demonstrated operation.',
  defenseBoundary: 'Nobunaga recaps the hideout counteractive defense, invincibility-like activation, Nen doll expulsion, and Room A/Room B warp to Tier 3. Feitan’s self-defense idea is an untested tactical proposal.',
  biohazardBoundary: 'Hinrigh’s transmitter-oyster reverts to its original transmitter form beneath the cabinet. Exact elapsed duration, aura remainder, and discovery status are not supplied.',
  lynchBoundary: 'Chapter 405 already establishes Bonolenov as Lynch’s killer. Chapter 406 newly shows the body recovered with a professionally twisted and broken neck. Hinrigh and Zakuro do not know Bonolenov is the killer and their fake-Lynch/fake-Hisoka reconstruction remains an inference.',
  phoneBoundary: 'Chrollo uses a conjured-cell-phone search ability with current-area guidance, a daily call limit, and a final beyond-signal-range result. Exact call count, range, target identity, and complete condition-editing mechanics remain unknown.',
  phoneTriviaBoundary: 'The supplied trivia translates the visible Skill Hunter page as “Love Dial 6700 - Disgusting Telephone” and gives criteria → 6–20 digit number → dial for guidance mechanics. “McGait Narumi” also appears in the translation, but the packet does not define that text’s role, so it is not promoted to an original-user identity.',
  regaliaBoundary: 'Seed Urn, Lotus Anchorite, and Sword of Good Omens are directly identified. Their role as the core Nen system of Kakin prosperity, spiritual focal points, extreme security, and Tier 1 storage remain Chrollo’s theories.',
  skillHunterBoundary: 'Chrollo states that stealing an item comparable to a national treasure is a prerequisite before the usual conditions for stealing/storing the desired ability in the Skill Hunter evolution plan he wants for Hisoka. No treasure is stolen, no evolution occurs, and the desired ability remains unidentified.',
  spiderBoundary: 'Chrollo says an alternative is already in place so the Spider can continue if he dies. No successor, procedure, or exact alternative is identified.',
  funeralBoundary: 'Halkenburg’s funeral procession begins on Tier 3. Chrollo’s final call places the tracked person above his current position but outside the current Nen signal range; exact tier and identity remain unknown.',
  excluded: freeze([
    'Importing any Chapter 407+ identity for Chrollo’s tracked person or desired ability',
    'Confirming Heil-Ly as waste-disposal subcontractors or treating the proposed killing pipeline as demonstrated',
    'Conflating the Tier 2 Heil-Ly processing area with the separate waste/sewage plant between Tiers 4 and 5',
    'Treating Feitan’s self-defense proposal as a proven bypass of LSDF or another counteractive defense',
    'Giving Hinrigh or Zakuro reader-only knowledge that Bonolenov killed Lynch',
    'Inventing a transformation method for the Chapter 406 fake-Lynch deduction beyond the participants’ hypotheses',
    'Assigning “McGait Narumi” an original-user or owner role not defined by the supplied packet',
    'Inventing Love Dial’s exact call count, Nen category, signal radius, reset time, or target identity',
    'Confirming Chrollo’s theory that the three treasures generate Kakin prosperity or are stored together on Tier 1',
    'Showing a sacred-treasure theft, Skill Hunter evolution result, or acquisition of the desired anti-Hisoka ability',
    'Naming a Spider successor or defining Chrollo’s unspecified continuity alternative',
    'Starting an Xi-Yu/Cha-R or Xi-Yu/Phantom Troupe war',
  ]),
});

export const succession406Mysteries = freeze([
  freeze({ id: '406-heilly-waste-subcontractor-theory', question: 'Is Heil-Ly actually using waste-disposal subcontractors as an interview-to-killing pipeline?', status: 'unresolved', answerAt406: 'Nobunaga, Phinks, Feitan, and Tajao see the contractor structure as a plausible route, but the supplied chapter gives no direct proof.', source: source406 }),
  freeze({ id: '406-lsdf-self-defense-loophole', question: 'Would a response made purely in self-defense avoid or bypass the Heil-Ly counteractive defense?', status: 'unresolved', answerAt406: 'Feitan proposes the idea; no Chapter 406 fight tests it.', source: source406 }),
  freeze({ id: '406-hinrigh-killer-identity-gap', question: 'When will Hinrigh and Zakuro identify the person who killed Lynch?', status: 'unresolved epistemic gap', answerAt406: 'The archive knows from Chapter 405 that Bonolenov killed Lynch, but Hinrigh and Zakuro only infer a fake-Hisoka-linked culprit who is searching for Hisoka.', source: source406 }),
  freeze({ id: '406-love-dial-target', question: 'Whom is Chrollo tracking with Love Dial 6700 - Disgusting Telephone?', status: 'unresolved', answerAt406: 'The target is above Chrollo’s Tier 3 position and beyond the current Nen signal range; identity and exact tier remain unknown.', source: source406 }),
  freeze({ id: '406-love-dial-full-rules', question: 'What are the complete rules of Chrollo’s phone-search ability?', status: 'unresolved', answerAt406: 'The translated page gives criteria → 6–20 digit number → dial for guidance; the story shows current-area/signal guidance and a limited number of calls. Exact count, radius, reset, condition-editing tradeoffs, category, and original user remain unknown.', source: source406 }),
  freeze({ id: '406-mcgait-narumi-role', question: 'What does the translated text “McGait Narumi” denote on the Skill Hunter page?', status: 'unresolved', answerAt406: 'The supplied trivia reproduces the text but does not define its role, so the archive does not assign an owner or biography.', source: source406 }),
  freeze({ id: '406-regalia-system-truth', question: 'Do the three sacred treasures actually power the succession contest and Kakin’s prosperity?', status: 'unresolved', answerAt406: 'Chrollo believes they do; the chapter does not independently verify the theory.', source: source406 }),
  freeze({ id: '406-regalia-location', question: 'Where are the Seed Urn, Lotus Anchorite, and Sword of Good Omens currently stored?', status: 'unresolved', answerAt406: 'Chrollo infers Tier 1; no direct storage location is shown.', source: source406 }),
  freeze({ id: '406-chrollo-desired-ability', question: 'What ability does Chrollo want to steal after satisfying the national-treasure prerequisite?', status: 'unresolved', answerAt406: 'The desired ability is still not identified.', source: source406 }),
  freeze({ id: '406-spider-continuity-alternative', question: 'What is the alternative Chrollo says will keep the Spider alive after his death?', status: 'unresolved', answerAt406: 'Only the existence of an alternative is stated; successor and procedure are not supplied.', source: source406 }),
]);

export const succession406ResolvedQuestions = freeze([
  freeze({ id: '406-final-route-destination-resolved', question: 'What lies beyond the final door Tajao opened at the end of Chapter 405?', resolution: 'An enormous outermost interior chamber filled with pipes and a rickety staircase leading toward the top of Tier 2.', chapter: 406, source: source406 }),
  freeze({ id: '406-waste-plant-location', question: 'Where is the recyclable-waste and sewage processing plant?', resolution: 'Between Tiers 4 and 5, according to Tajao.', chapter: 406, source: source406 }),
  freeze({ id: '406-waste-control', question: 'Which established mafia families control the waste-processing area?', resolution: 'Cha-R and Xi-Yu, according to Tajao.', chapter: 406, source: source406 }),
  freeze({ id: '406-nobunaga-route-split', question: 'Does Nobunaga continue upward with Phinks and Feitan?', resolution: 'No. He turns back to investigate the waste/subcontractor theory while Phinks and Feitan continue the route with Tajao.', chapter: 406, source: source406 }),
  freeze({ id: '406-biohazard-transmitter-state', question: 'What happens to Hinrigh’s transmitter-oyster inside the hideout?', resolution: 'It reverts to the original transmitter beneath the cabinet.', chapter: 406, source: source406 }),
  freeze({ id: '406-lynch-body-recovery', question: 'Is Lynch’s body found, and what condition is it in?', resolution: 'Yes. A funeral patrol finds her body on Tier 3 with the neck completely destroyed after being twisted and broken professionally.', chapter: 406, source: source406 }),
  freeze({ id: '406-hinrigh-fake-hisoka-inference', question: 'Does Hinrigh realize the post-encounter Lynch was likely an impostor and the supposed Hisoka was fake?', resolution: 'Yes, as an inference. He reconstructs that Lynch learned the man was fake, was killed, and an impostor steered Zakuro toward reporting “Hisoka was there.”', chapter: 406, source: source406 }),
  freeze({ id: '406-regalia-identities', question: 'Which three Kakin sacred treasures does Chrollo target?', resolution: 'The Seed Urn, Lotus Anchorite, and Sword of Good Omens.', chapter: 406, source: source406 }),
  freeze({ id: '406-skill-hunter-prerequisite', question: 'What new prerequisite does Chrollo state for the Skill Hunter evolution step he wants?', resolution: 'He must steal an item comparable to a national treasure before the ordinary conditions for stealing and storing the desired ability.', chapter: 406, source: source406 }),
  freeze({ id: '406-funeral-start-status', question: 'Has Halkenburg’s funeral procession begun by the end of Chapter 406?', resolution: 'Yes. His guards carry the ornate casket through the Tier 3 procession.', chapter: 406, source: source406 }),
  freeze({ id: '406-phone-target-relative-position', question: 'What does Chrollo learn about the tracked person’s location?', resolution: 'The person is above Chrollo’s Tier 3 position but outside the current Nen signal range; exact tier and identity remain unknown.', chapter: 406, source: source406 }),
]);

export const succession406RelationshipRecords = freeze([
  freeze({ subject: 'Tajao ↔ Nobunaga / Phinks / Feitan', relation: 'restricted-route guidance and tactical separation', status: 'route continues / Nobunaga turns back', boundary: 'Tajao reveals the outer pipe route; Nobunaga splits off to investigate while Phinks and Feitan continue upward.', source: source406 }),
  freeze({ subject: 'Cha-R / Xi-Yu → waste-processing plant', relation: 'stated operational control of disposal infrastructure', status: 'active control according to Tajao', boundary: 'Control of the plant is stated; Heil-Ly subcontractor use remains unconfirmed.', source: source406 }),
  freeze({ subject: 'Hinrigh ↔ Zakuro', relation: 'joint Lynch investigation and revenge commitment', status: 'active', boundary: 'They reconstruct an impostor-Lynch/fake-Hisoka scenario and promise to avenge Lynch without yet identifying Bonolenov.', source: source406 }),
  freeze({ subject: 'Xi-Yu ↔ Cha-R / Phantom Troupe', relation: 'conditional future-conflict risk over Lynch’s killer', status: 'no active war', boundary: 'Zakuro says a Troupe culprit could force conflict involving Cha-R, but he explicitly rejects acting on guesswork.', source: source406 }),
  freeze({ subject: 'Chrollo → Hisoka', relation: 'lethal rematch preparation through regalia theft and Skill Hunter evolution plan', status: 'active preparation / no encounter', boundary: 'Chrollo targets the sacred treasures to satisfy a prerequisite before stealing the unidentified ability he wants for Hisoka.', source: source406 }),
  freeze({ subject: 'Chrollo ↔ Phantom Troupe', relation: 'leader-continuity contingency', status: 'alternative exists / details unresolved', boundary: 'Chrollo says the Spider will continue even if he dies, but no successor or procedure is identified.', source: source406 }),
]);
