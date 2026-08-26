import { eventFoundation400Expansion } from './eventFoundation400Expansion.js';

const freeze = (value) => Object.freeze(value);
const contractEvent = eventFoundation400Expansion.find((event) => event.id === 'event:kurapika-accepts-longhi-contract-tubeppa-collaboration');

export const eventFoundation400Corrections = freeze([
  freeze({
    ...contractEvent,
    summary: 'In Room 1014, Longhi says Water Divination is unnecessary because she can already use Nen and asks whether Kurapika accepts the contract after hearing her explanation. With Bill present, Kurapika agrees and says he will collaborate with Tubeppa. The supplied Chapter 400 synopsis does not reproduce the contract terms, so later named contract mechanics and Chapter 401+ treaty details are not imported backward.',
    outcomes: freeze([
      'Kurapika accepts Longhi’s contract.',
      'Kurapika explicitly agrees to collaborate with Tubeppa.',
      'The contract terms and later named mechanics remain unsupplied at the Chapter 400 boundary.',
    ]),
    openQuestions: freeze(['What are the exact terms of Longhi’s contract?']),
    updatedAt: '2026-08-10',
  }),
]);
