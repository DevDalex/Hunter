const freeze = (value) => Object.freeze(value);
const justice = 'location:black-whale:tier-2:justice-bureau';

export const organizationState404LegacySplits = freeze({
  'organization:hunter-association': freeze([
    freeze({
      id: 'organization-state:hunter-association:340', organizationId: 'organization:hunter-association', chapterRange: freeze({ start: 340, end: 403 }), status: 'active',
      operationalState: 'Supports the voyage through licensed Hunters, Zodiac governance, prince-protection contracts, expedition staffing, investigation, and Nen instruction before the exact Chapter 404 medical-jurisdiction event.',
      authority: 'Professional licensing, Association governance, expedition agreements, and individual contracts rather than Kakin sovereign authority.',
      territoryIds: freeze(['location:black-whale']), objectiveStates: freeze(['Support the Dark Continent expedition.', 'Fulfill shipboard and royal protection contracts.', 'Preserve Association governance while operating under Kakin law.']),
      pressure: freeze(['Members answer to different contracts and institutions.', 'The Succession Contest creates duties the Association cannot centrally control.']),
      relatedEventIds: freeze(['event:room-1014-opening-crisis', 'event:oito-little-eye-reconnaissance']), certainty: 'confirmed',
      sourceIds: freeze(['source:chapter-340', 'source:chapter-358', 'source:chapter-359', 'source:chapter-369']),
    }),
    freeze({
      id: 'organization-state:hunter-association:405', organizationId: 'organization:hunter-association', chapterRange: freeze({ start: 405, end: null }), status: 'active',
      operationalState: 'After the exact Chapter 404 Cheadle-team medical response and displacement, imported Association voyage continuity resumes while later chapter-specific duties await review.',
      authority: 'Professional licensing, Association governance, expedition agreements, and individual contracts rather than Kakin sovereign authority.',
      territoryIds: freeze(['location:black-whale']), objectiveStates: freeze(['Support the Dark Continent expedition.', 'Fulfill shipboard and protection assignments.', 'Continue Association governance under Kakin law.']),
      pressure: freeze(['Kakin jurisdiction can restrict access to royal cases.', 'Members remain distributed across competing voyage duties.']), relatedEventIds: freeze([]), certainty: 'confirmed',
      sourceIds: freeze(['source:chapter-404', 'source:chapter-411']),
    }),
  ]),
  'organization:camilla-private-guard': freeze([
    freeze({
      id: 'organization-state:camilla-private-guard:389', organizationId: 'organization:camilla-private-guard', chapterRange: freeze({ start: 389, end: 403 }), status: 'active',
      operationalState: 'Chapter 389 discloses an organized Have-Not curse-assassination network inside Camilla’s private army, with individual curse bearers assigned to rival princes, a Nen exorcist held in reserve, and target-specific preparation already under way.',
      authority: 'Camilla’s household command is reinforced by Have-Not loyalty created after she admitted the caste into her personal army, provided housing, and granted military-equivalent status and rights.',
      territoryIds: freeze(['location:black-whale:tier-1:room-1002']), objectiveStates: freeze(['Protect Camilla.', 'Prepare assigned post-mortem curses against rival princes.', 'Investigate enemy Nen exorcism capability.', 'Create opportunities for curse bearers to approach assigned targets.']),
      pressure: freeze(['Prince Guardian Spirit Beasts complicate close-proximity suicide attacks.', 'Enemy or Hunter Association exorcists may neutralize curses.', 'Sarahell has only planned, not yet executed, her Room 1014 approach at this boundary.']), relatedEventIds: freeze(['event:camilla-have-not-curse-network-disclosure', 'event:have-not-curse-ritual-and-woble-plan']), certainty: 'confirmed', sourceIds: freeze(['source:chapter-389']),
    }),
    freeze({
      id: 'organization-state:camilla-private-guard:405', organizationId: 'organization:camilla-private-guard', chapterRange: freeze({ start: 405, end: 410 }), status: 'active',
      operationalState: 'After the exact Chapter 404 scheduled-attendance boundary, imported Have-Not continuity resumes without backfilling Sarahell’s later entry or curse actions.',
      authority: 'Camilla’s household command persists through loyal guards and curse bearers despite her confinement.',
      territoryIds: freeze(['location:black-whale:tier-1:room-1002', 'location:black-whale:tier-1:room-1014']), objectiveStates: freeze(['Continue assigned curse operations.', 'Preserve concealment around later access opportunities.']),
      pressure: freeze(['Room 1014 prepares actively against Sarahell.', 'Later entry and activation states require their own chapter evidence.']), relatedEventIds: freeze(['event:sarahell-curse-infiltration']), certainty: 'probable', sourceIds: freeze(['source:chapter-404', 'source:chapter-411', 'source:chapter-412']),
    }),
  ]),
  'organization:kakin-military': freeze([freeze({
    id: 'organization-state:kakin-military:405',
    organizationId: 'organization:kakin-military',
    chapterRange: freeze({ start: 405, end: 409 }),
    status: 'active',
    operationalState: 'After the exact Chapter 404 medical takeover, death, and funeral authorization boundary, imported military continuity resumes through Chapter 409 while the intervening chapters await modernization.',
    authority: 'Royal Army hierarchy and Kakin security law remain distinct from Justice procedure; later emergency-authority changes require exact chapter evidence.',
    territoryIds: freeze(['location:black-whale', 'location:black-whale:tier-1', 'location:black-whale:tier-2', 'location:black-whale:tier-3']),
    objectiveStates: freeze(['Maintain voyage security.', 'Control sensitive royal movement.', 'Execute later military orders without backfilling them into Chapter 404.']),
    pressure: freeze(['Nen identity compromise persists inside the command network.', 'Funeral and mafia developments may alter emergency authority in later chapters.']),
    relatedEventIds: freeze(['event:balsamilco-poisoning-operation', 'event:halkenburg-funeral-procession']),
    certainty: 'confirmed', sourceIds: freeze(['source:chapter-404', 'source:chapter-409']),
  })]),
  'organization:kakin-justice-bureau': freeze([freeze({
    id: 'organization-state:kakin-justice-bureau:405',
    organizationId: 'organization:kakin-justice-bureau',
    chapterRange: freeze({ start: 405, end: null }),
    status: 'active',
    operationalState: 'After the exact Chapter 404 Fugetsu/Kacho-form and charge-dismissal boundary, imported Justice continuity resumes while later chapters await their own evidence review.',
    authority: 'Justice procedure, protected custody, medical access, and court coordination under increasing military pressure.',
    territoryIds: freeze([justice, `${justice}:detention-wing`, `${justice}:medical-wing`]),
    objectiveStates: freeze(['Protect vulnerable witnesses and survivors.', 'Investigate hostile Nen and exceptional body states.', 'Preserve legal procedure during later emergency-authority escalation.']),
    pressure: freeze(['Fugetsu’s hostile condition remains unresolved.', 'Kacho-form’s Chapter 404 fading has no supplied resolution.', 'Military authority increasingly pressures later Justice cases.']),
    relatedEventIds: freeze(['event:kacho-letter-operation']),
    certainty: 'probable', sourceIds: freeze(['source:chapter-404', 'source:chapter-411']),
  })]),
});
