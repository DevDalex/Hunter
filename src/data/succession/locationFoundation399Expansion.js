import { locationFoundation398Expansion } from './locationFoundation398Expansion.js';

const freeze = (value) => Object.freeze(value);
const source398 = 'source:chapter-398';
const source399 = 'source:chapter-399';
const shipId = 'location:black-whale';
const tier3 = `${shipId}:tier-3`;
const hideout = `${tier3}:heil-ly-hideout`;
const priorLaundry = locationFoundation398Expansion.find((location) => location.id === `${hideout}:laundry-room`);

export const locationFoundation399Expansion = freeze([
  freeze({
    ...priorLaundry,
    summary: 'The laundry-filled internal room first exposed at Chapter 398’s endpoint. Chapter 399 begins with Hinrigh and Nobunaga judging it recently occupied but finding no fresh bodies or bloodstains; their explanations for missing civilians remain competing theories. During LSDF’s pursuit, Hinrigh returns here, vomits the still-transformed Biohazard transmitter-oyster, and hides it beneath a cabinet. At the Chapter 399 endpoint the oyster remains under that cabinet and beeps twice. These observations still do not establish the room’s official name, exact coordinates, full connection to Chapter 394’s disposal/laundry route, or the complete hideout topology.',
    sourceIds: freeze([source398, source399]),
    updatedAt: '2026-08-10',
    zoneRole: 'laundry / transmitter-concealment / route-investigation room',
  }),
  freeze({
    id: `${hideout}:gathering-defense-room`,
    entityType: 'location',
    slug: 'tier-3-heil-ly-hideout-gathering-defense-room',
    name: 'Heil-Ly Hideout Gathering / Defensive Room',
    aliases: freeze(['Descriptive archive label · official room name unsupplied']),
    summary: 'The internal Heil-Ly room reached through the unlocked main door from the laundry-side area in Chapter 399. Hinrigh and Nobunaga encounter nine Heil-Ly members seated and talking here; Terebellum’s Damage: “Sweet Home” and Yokotani’s A Battle of Wits: “LSDF” are revealed during the confrontation. LSDF’s location condition establishes that this is within the hideout where Morena is located, but the chapter does not supply the room’s official name, dimensions, exact ship coordinates, Morena’s exact room, or a complete internal route map.',
    sourceIds: freeze([source399]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10',
    locationType: 'room',
    parentId: hideout,
    ancestorIds: freeze([shipId, tier3, hideout]),
    deck: 3,
    accessLevel: 'covert',
    zoneRole: 'Heil-Ly gathering and law-conditioned defensive enforcement room',
    certainty: 'confirmed location / descriptive archive naming',
  }),
]);
