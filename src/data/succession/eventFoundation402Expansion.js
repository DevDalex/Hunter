import { succession402TimelineEvents } from '../succession402Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-402';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const specialCharacterIds = freeze({ Seiko: 'character:seiko-hui-guo-rou' });
const characterId = (name) => specialCharacterIds[name] || `character:${slugify(name)}`;

const locationIdsByResearchId = freeze({
  '402-1330-zhang-lei-tenftory-three-prince-surrender-proposal': ['location:black-whale:tier-1:room-1003'],
  '402-1330-tubeppa-receives-alliance-report-welcomes-woble-visit': ['location:black-whale:tier-1:room-1005'],
  '402-zhang-lei-gives-tenftory-second-coin-fortune-holder-hypothesis': ['location:black-whale:tier-1:room-1003'],
  '402-tubeppa-redirect-benjamin-pressure-rihan-sees-spirit-beast': ['location:black-whale:tier-1:room-1005'],
  '402-day11-0800-tserriednich-zetsu-967-seconds': ['location:black-whale:tier-1:room-1004'],
  '402-salkov-theories-zetsu-ability-jester-beast-theta-manipulation': ['location:black-whale:tier-1:room-1004'],
  '402-vantine-melody-detention-update-tserriednich-recruit-order': ['location:black-whale:tier-1:room-1004'],
  '402-day11-0600-kacho-form-shows-fugetsu-shoulder-mark': ['location:black-whale:tier-2:justice-bureau:melody-cell'],
  '402-melody-fugetsu-mark-trap-addiction-indiscriminate-attack-theory': ['location:black-whale:tier-2:justice-bureau:melody-cell'],
  '402-kacho-form-suspects-luzurus-guardian-spirit-beast': ['location:black-whale:tier-2:justice-bureau:kaiser-office'],
  '402-magical-worm-lifeboat-route-third-party-access-plan': ['location:black-whale:tier-2:justice-bureau:kaiser-office', 'location:black-whale:lifeboat-area', 'location:black-whale:lifeboat-area:first-lifeboat'],
  '402-luzurus-abduction-accident-plan-kaiser-volunteers': ['location:black-whale:tier-2:justice-bureau:kaiser-office'],
  '402-magical-worm-prerequisite-luzurus-master-bedroom-previsit': ['location:black-whale:tier-2:justice-bureau:kaiser-office', 'location:black-whale:tier-1:room-1007'],
  '402-kacho-final-letter-prince-visits-cover-plan': ['location:black-whale:tier-2:justice-bureau:kaiser-office'],
  '402-kaiser-ideal-world-motive-melody-keeps-manipulation-suspicion-open': ['location:black-whale:tier-2:justice-bureau:kaiser-office'],
  '402-fugetsu-benjamin-audience-spirits-dispersed': ['location:black-whale:tier-1:room-1001'],
  '402-kaiser-leads-benjamin-into-martial-law-threshold-discussion': ['location:black-whale:tier-1:room-1001'],
  '402-fugetsu-delivers-letters-to-tubeppa-tyson-luzurus': ['location:black-whale:tier-1:room-1005', 'location:black-whale:tier-1:room-1006', 'location:black-whale:tier-1:room-1007'],
  '402-luzurus-reads-letter-infers-different-social-bombs': ['location:black-whale:tier-1:room-1007'],
  '402-basho-haiku-charm-temporarily-repels-low-level-spirits': ['location:black-whale:tier-1:room-1007'],
  '402-day11-0850-luzurus-operation-debrief-basho-buys-time': ['location:black-whale:tier-2:justice-bureau:kaiser-office'],
  '402-melody-halkenburg-rumble-illness-letter-contact-plan': ['location:black-whale:tier-2:justice-bureau:kaiser-office'],
  '402-melody-halkenburg-letter-kurapika-hope-end-succession': ['location:black-whale:tier-2:justice-bureau', 'location:black-whale:tier-1:room-1014'],
});

const abilityIdsByResearchId = freeze({
  '402-zhang-lei-gives-tenftory-second-coin-fortune-holder-hypothesis': ['ability:zhang-lei-coins'],
  '402-day11-0800-tserriednich-zetsu-967-seconds': ['ability:parallel-future'],
  '402-salkov-theories-zetsu-ability-jester-beast-theta-manipulation': ['ability:parallel-future'],
  '402-day11-0600-kacho-form-shows-fugetsu-shoulder-mark': ['ability:without-you', 'ability:fugetsu-unidentified-hostile-spirit-affliction'],
  '402-melody-fugetsu-mark-trap-addiction-indiscriminate-attack-theory': ['ability:magical-worm', 'ability:fugetsu-unidentified-hostile-spirit-affliction'],
  '402-kacho-form-suspects-luzurus-guardian-spirit-beast': ['ability:without-you', 'ability:fugetsu-unidentified-hostile-spirit-affliction'],
  '402-magical-worm-lifeboat-route-third-party-access-plan': ['ability:magical-worm'],
  '402-luzurus-abduction-accident-plan-kaiser-volunteers': ['ability:melody-aura-performance', 'ability:magical-worm'],
  '402-magical-worm-prerequisite-luzurus-master-bedroom-previsit': ['ability:magical-worm'],
  '402-fugetsu-benjamin-audience-spirits-dispersed': ['ability:fugetsu-unidentified-hostile-spirit-affliction'],
  '402-basho-haiku-charm-temporarily-repels-low-level-spirits': ['ability:fugetsu-unidentified-hostile-spirit-affliction'],
  '402-day11-0850-luzurus-operation-debrief-basho-buys-time': ['ability:melody-aura-performance', 'ability:magical-worm', 'ability:fugetsu-unidentified-hostile-spirit-affliction'],
});

const openQuestionsByResearchId = freeze({
  '402-1330-zhang-lei-tenftory-three-prince-surrender-proposal': ['Can princes legally renounce the throne under the Succession Contest rules?'],
  '402-tubeppa-redirect-benjamin-pressure-rihan-sees-spirit-beast': ['Did the treaty/alliance development trigger Tubeppa’s Guardian Spirit Beast?'],
  '402-balsamilco-shoe-aerosol-pathogen-halkenburg-plan': ['Will Halkenburg actually be exposed to the prepared pathological weapon?'],
  '402-salkov-theories-zetsu-ability-jester-beast-theta-manipulation': ['Which, if any, of Salkov’s proposed explanations is correct?'],
  '402-day11-0600-kacho-form-shows-fugetsu-shoulder-mark': ['Who or what created the mark on Fugetsu?'],
  '402-kacho-form-suspects-luzurus-guardian-spirit-beast': ['Is Luzurus or his Guardian Spirit Beast actually responsible?'],
  '402-kaiser-ideal-world-motive-melody-keeps-manipulation-suspicion-open': ['Is Kaiser sincere, manipulated, or pursuing another hidden objective?'],
  '402-melody-halkenburg-rumble-illness-letter-contact-plan': ['What caused the rumble and Halkenburg’s illness?'],
});

export const eventFoundation402Expansion = freeze(succession402TimelineEvents.map((record, index) => {
  const slug = `chapter402-${record.id.replace(/^402-/, '')}`;
  return freeze({
    id: `event:${slug}`,
    entityType: 'event',
    slug,
    name: record.title,
    aliases: freeze([]),
    summary: record.detail,
    sourceIds: freeze([sourceId]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10',
    category: record.tracks?.[0] || 'chapter-402',
    importance: index === 4 || index === 16 || index === 17 ? 'critical' : 'major',
    chapterRange: freeze({ start: 402, end: 402 }),
    chronology: freeze({
      sequence: index + 1,
      day: record.day,
      timeOfDay: record.time || null,
      storyPeriod: `Voyage Day ${record.day} · present-day Black Whale succession contest`,
      certainty: 'chapter-presentation-order-confirmed',
    }),
    participantIds: freeze((record.people || []).map(characterId)),
    organizationIds: freeze([]),
    locationIds: freeze(locationIdsByResearchId[record.id] || []),
    abilityIds: freeze(abilityIdsByResearchId[record.id] || []),
    causes: freeze([]),
    outcomes: freeze([record.confidence || 'Chapter-bounded event recorded from the supplied synopsis.']),
    consequenceEventIds: freeze([]),
    status: 'completed',
    stateChanges: freeze([]),
    openQuestions: freeze(openQuestionsByResearchId[record.id] || []),
  });
}));
