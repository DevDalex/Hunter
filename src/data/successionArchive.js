import * as base from './successionArchiveThrough389.js';

export * from './successionArchiveThrough389.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 10 · direct continuation from Chapter 389 · exact time unsupplied', chapters: '390', subject: 'Coventoba / Tenftory / Zhang Lei',
    route: 'Room 1003 coin observation → same-aura comparison → rejected Guardian Spirit Beast mouth experiment → Zhang Lei leaves to consult Onior',
    change: 'Coventoba confirms that the coin now displaying 10 carries the same aura he associated with the original coin, while Tenftory’s separate coin still displays 1. Coventoba considers but rejects placing the coin into the beast’s mouth as too risky.',
    state: 'same-aura continuity and 10-versus-1 comparison confirmed / number trigger, meaning, threshold, and eventual holder effect unresolved', source: wiki('Chapter_390'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '390', subject: 'Zhang Lei / Onior',
    route: 'Room 1003 → Xi-Yu boss room → Nen and Guardian Spirit Beast consultation',
    change: 'Zhang Lei asks Onior for information about Guardian Spirit Beasts and Nen. Onior says he lacks Guardian Spirit Beast knowledge and personal Nen expertise but knows younger Xi-Yu members who know Nen and agrees to ask them. The supplied synopsis explicitly identifies Onior as Zhang Lei’s father.',
    state: 'Zhang Lei–Onior information channel active / no new Guardian Spirit Beast mechanic established', source: wiki('Chapter_390'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '390', subject: 'Onior / Hinrigh / Xi-Yu',
    route: 'Onior phone order → Hisoka search assigned to Tier 3 → Phantom Troupe granted controlled Tier 4 search access → Morena elimination objective',
    change: 'Onior expands Xi-Yu’s field operation. Hinrigh is ordered to find Hisoka, permit the Troupe to search Tier 4 while Xi-Yu tries to manage its movement, and kill Morena.',
    state: 'expanded Xi-Yu operation active / Hisoka and Morena outcomes unresolved', source: wiki('Chapter_390'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '390', subject: 'Hinrigh / Lynch / Zakuro',
    route: 'Tier 3 manhunt → Heil-Ly burger-joint contact → fight → Bloody Mary and Body and Soul demonstrations → civilian-registration warning',
    change: 'Zakuro subdues an attacker with Bloody Mary after receiving a deep neck cut, while Lynch uses Body and Soul to obtain basic Heil-Ly and Morena information. Hinrigh learns that the encountered Heil-Ly members are officially registered as civilians and stops the public Mafia confrontation.',
    state: 'two Xi-Yu abilities demonstrated / encountered Heil-Ly civilian cover confirmed / complete ability rules unresolved', source: wiki('Chapter_390'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '390', subject: 'Hinrigh / Tier 3 soldiers',
    route: 'soldiers impose no-return condition → Hinrigh offers bribe and touches guns → group leaves → gun barrels transform into live snakes → soldiers killed',
    change: 'After outwardly agreeing not to return to Tier 3, Hinrigh covertly transforms the soldiers’ gun barrels into live snakes. The snake mouths retain the guns’ firing function and kill both soldiers.',
    state: 'Hinrigh transformation effect confirmed / formal ability name, Nen type, duration, and general transformation rules unresolved', source: wiki('Chapter_390'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
