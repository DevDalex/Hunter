import * as base from './successionArchiveThrough386.js';

export * from './successionArchiveThrough386.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 8 · flashback', chapters: '387', subject: 'Tserriednich / Theta',
    route: '25 minutes before Sunday banquet → one-hour Zetsu exercise → first future vision → ten-second lead recognized',
    change: 'Chapter 387 rewinds to Tserriednich’s perspective. Once he fully closes his aura with his eyes shut, he sees a future scene; when Theta repeats the forecast dialogue after he loses Zetsu, he identifies the view as ten seconds ahead.',
    state: 'Parallel Future ten-second forecast lead explicitly revealed / earlier Chapter 385–386 knowledge remains frozen', source: wiki('Chapter_387'),
  },
  {
    day: 'Day 8 · flashback', chapters: '387', subject: 'Tserriednich / Theta',
    route: 'Second Zetsu activation → future vision continues past first ten seconds → coffee-cup divergence experiment',
    change: 'Tserriednich maintains the eyes-closed Zetsu state beyond the first preview. Real time advances while he watches the future ten seconds ahead and retains present sensory awareness. He changes his actual behavior while Theta continues reacting to the forecast version of him.',
    state: 'Continuous future viewing and demonstrated forecast-versus-actual divergence established / maximum duration unresolved', source: wiki('Chapter_387'),
  },
  {
    day: 'Day 8 · flashback', chapters: '387', subject: 'Tserriednich / Theta / Melody',
    route: 'Forecast gun draw → Tserriednich leaves predicted position → Theta fires → Melody landscape → guards enter → Melody invitation',
    change: 'Tserriednich sees Theta draw her gun in the future sequence, moves his actual body away from the forecast position, and survives while Theta fires at the version she perceives. The beautiful landscape that follows is recognized as someone else’s Nen and remains linked to Melody’s established concert effect rather than Parallel Future.',
    state: 'Chapter 385 apparent assassination mechanism retrospectively explained / Melody effect kept mechanically separate', source: wiki('Chapter_387'),
  },
  {
    day: 'Day 8 · flashback', chapters: '387', subject: 'Tserriednich',
    route: 'Assassination aftermath → ability self-analysis → Zetsu speed and maintenance prioritized',
    change: 'Tserriednich postpones confronting Theta about her motive and formalizes his working model: eyes-closed Zetsu provides a ten-second-ahead vision, and maintaining the state lets him keep watching the future while living through the sequence shown ten seconds earlier.',
    state: 'Core Parallel Future mechanics understood by Tserriednich / broader observer and maximum-duration rules unresolved', source: wiki('Chapter_387'),
  },
  {
    day: 'Day 9', chapters: '387', subject: 'Tserriednich / Salkov',
    route: 'Next-day training → refined sub-second close-and-open eye-cycle threshold → planned sparring',
    change: 'Tserriednich tells Salkov they will spar once he can close and then reopen his eyes in less than one second.',
    state: 'Sub-second eye-cycle remains a training target / achievement not established at Chapter 387 boundary', source: wiki('Chapter_387'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
