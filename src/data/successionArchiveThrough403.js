import * as base from './successionArchiveThrough402.js';

export * from './successionArchiveThrough402.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const publicationBoundary403 = Object.freeze({
  chapter: 403,
  day: 'Voyage Day 11',
  presentDay: true,
  exactTimes: Object.freeze(['6:45 a.m.', '7:50 a.m.']),
  presentationOrderNonLinear: false,
  boundary: 'Chapter 403 confirms that Halkenburg’s collective arrow successfully compromises Balsamilco’s body, escalates Benjamin to red alert while keeping Special Martial Law inactive, confirms Unma as Halkenburg’s biological mother, advances the Fugetsu/Kacho-form/Kaiser letter operation, records a Zhang Lei Guardian Coin changing from 1 to 10 without resolving its rule, and ends with Kurapika/Oito arriving in Room 1003.',
  quarantined: Object.freeze([
    'Chapter 404+ fate of Halkenburg’s original body and any funeral/death sequence',
    'Chapter 404+ result of Kurapika’s examination of Zhang Lei’s coins',
    'Chapter 404+ consequences of Halkenburg occupying Balsamilco’s body',
    'Chapter 404+ result of the planned Luzurus removal operation',
    'Chapter 404+ Special Martial Law declaration or activation',
    'Chapter 404+ resolution of Balsamilco’s displaced consciousness',
    'Chapter 404+ explanation of Kurapika’s hoped-for succession ritual opening',
  ]),
});

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 11 · 6:45 a.m. onward', chapters: '403', subject: 'Balsamilco / Halkenburg / Vict / Benjamin',
    route: 'Tier 2 courthouse screening → Vict sign-language warning → twelve-civilian collective arrow → Balsamilco body compromise → Benjamin phone analysis',
    change: 'Balsamilco enters Justice intending to execute the TSK-17 plan but is successfully struck by Halkenburg’s collective arrow operation first. The chapter later directly reveals Halkenburg’s consciousness inside Balsamilco’s body while the original Halkenburg body lies unconscious. Balsamilco’s own consciousness remains unresolved.',
    state: 'Halkenburg-in-Balsamilco confirmed / Balsamilco consciousness unresolved / Vict control state unresolved / no Chapter 404+ body-death consequence imported', source: wiki('Chapter_403'),
  },
  {
    day: 'Voyage Day 11 · 7:50 a.m.', chapters: '403', subject: 'Benjamin / Butch / Kakin military',
    route: 'Room 1001 suspicion → red alert → Tiers 2 and 3 notification → conditional martial-law trigger',
    change: 'Benjamin tells Butch the rumbling was an attack on Balsamilco, orders red alert, and says unauthorized Balsamilco movement from Justice would trigger a martial-law declaration. The emergency condition is explicit, but Special Martial Law is not declared in Chapter 403.',
    state: 'red alert active / martial law conditional and inactive', source: wiki('Chapter_403'),
  },
  {
    day: 'Voyage Day 11 · exact time unsupplied', chapters: '403', subject: 'Unma / Halkenburg / Duazul / Kacho letter',
    route: 'Room 01 phone call → Unma calls Halkenburg her son → Benjamin reads Kacho maternity letter',
    change: 'Unma directly confirms that Halkenburg is her biological son. Kacho’s letter repeats the maternity fact but describes the theory that Unma entrusted Halkenburg to Duazul for protection as internet rumor; the archive does not promote that motive into confirmed history.',
    state: 'Unma maternity confirmed / household-transfer motive unresolved', source: wiki('Chapter_403'),
  },
  {
    day: 'Voyage Day 11 · exact time unsupplied', chapters: '403', subject: 'Zhang Lei / Guardian Coins / Kurapika',
    route: 'seven retained coins + three distributed → one retained coin changes 1→10 → date-tracking experiment → Kurapika summoned → Room 1003 arrival',
    change: 'Zhang Lei directly observes one Guardian Coin change from 1 to 10 and begins tracking coin production dates and distributed holders. The ten-day cycle, growth-parameter, monetary-value, and exponential-progression explanations remain hypotheses. Chapter 403 ends before Kurapika provides an answer.',
    state: '1→10 change confirmed / progression rule unresolved / Kurapika analysis deferred beyond boundary', source: wiki('Chapter_403'),
  },
  {
    day: 'Voyage Day 11 · exact time unsupplied', chapters: '403', subject: 'Kaiser / Worio / Halkenburg / Fugetsu / Kacho-form',
    route: 'mass-syncope review → Room E-6 interview → Worio feather mark → Halkenburg death warning → Fugetsu rests → Luzurus operation scheduled',
    change: 'Kaiser investigates an anomalous Justice staff fainting episode and learns Worio was instructed by Halkenburg to disclose information if Kaiser independently raised Nen. Worio says Halkenburg will die soon. Separately, Fugetsu rests while Basho’s aid is reported to keep hostile spirits away and the Luzurus operation is scheduled for the following night.',
    state: 'Worio contingency channel confirmed / future Halkenburg death warning not yet fulfilled / Fugetsu attacker still unknown / Luzurus still unconfirmed', source: wiki('Chapter_403'),
  },
  {
    day: 'Voyage Day 11 · chapter endpoint', chapters: '403', subject: 'Kurapika / Oito / Woble',
    route: 'Room 1014 ritual discussion → Oito publication permission → second Nen-class strategy → Room 1003 arrival',
    change: 'Kurapika says the Black Whale itself functions as the urn for the worm toxin and that attempted departure is punished by death, yet says he sees hope. Oito authorizes publication of the letter addressed to her during the next Nen class as part of Kurapika’s diplomatic bargaining strategy.',
    state: 'public-letter strategy authorized / ritual escape solution not yet demonstrated', source: wiki('Chapter_403'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
