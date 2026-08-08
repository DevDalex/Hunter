import * as base from './successionArchiveBase.js';

export * from './successionArchiveBase.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions.filter((record) => ![
    'Vincent / Babimyna',
    'Loberry and Tuffdy',
  ].includes(record.subject)),
  {
    day: 'Day 1',
    chapters: '363–364',
    subject: 'Vincent / Babimyna',
    route: 'Benjamin command → Room 1014',
    change: 'Vincent enters Room 1014 in Chapter 363, kills Sandra under a self-defense claim, is restrained by Kurapika and Bill, and dies by suicide in Chapter 364. Benjamin then sends Babimyna as his replacement observer.',
    state: 'Vincent deceased / Babimyna replacement deployment active',
    source: wiki('Chapter_364'),
  },
  {
    day: 'Day 2',
    chapters: '369–370',
    subject: 'Loberry / Barrigen',
    route: 'Room 1014 Nen class → possession-assisted attack / death',
    change: 'Silent Majority operates through possessed Loberry during the first Nen class. In Chapter 370 the marionette draws the room’s attention and four curse snakes drain Barrigen’s blood, killing him. The user remains unidentified.',
    state: 'Loberry possessed/witness state / Barrigen deceased',
    source: wiki('Chapter_370'),
  },
  {
    day: 'Day 2',
    chapters: '371',
    subject: 'Loberry / Seiko / Kaiser',
    route: 'Room 1014 murder scene → Royal Army custody / Room 1010 judicial observation',
    change: 'Sakata and Hashito accuse Loberry after Barrigen’s murder and she is detained. Sakata asks Cleapatro to pursue Seiko as an accomplice, but Cleapatro declines the immediate case and dispatches Kaiser for a seventy-two-hour observation instead.',
    state: 'Loberry detained / Seiko under suspicion / Kaiser observation active; guilt unresolved',
    source: wiki('Chapter_371'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = [
  ...base.wobleCoreTimeline.filter((record) => ![
    'Vincent operation',
    'Reconnaissance',
  ].includes(record.title)),
  {
    chapters: '360–361',
    time: 'Day 1',
    title: 'Parasitic Nen crisis',
    detail: 'Kurapika exposes the higher-queen spy network, Guardian Spirit Beasts flood Room 1014, Sayird is manipulated into killing three guards, and Kurapika uses Steal Chain to remove Little Eye while testing the parasite’s dependence on host aura.',
    people: 'Kurapika, Oito, Woble, Bill, Sayird, Kurton',
    source: wiki('Chapter_361'),
  },
  {
    chapters: '363–364',
    time: 'Day 1',
    title: 'Vincent operation',
    detail: 'Vincent enters under Benjamin’s Royal Guard authority and kills Sandra in Chapter 363. Kurapika and Bill restrain him in Chapter 364, Kurapika steals his Nen ability, Vincent dies by poison suicide, and Babimyna becomes Benjamin’s replacement observer.',
    people: 'Kurapika, Bill, Oito, Woble, Sandra, Vincent, Babimyna',
    source: wiki('Chapter_364'),
  },
  {
    chapters: '364–369',
    time: 'Days 1–2',
    title: 'Little Eye and Emperor Time reconnaissance',
    detail: 'Kurapika transfers Little Eye to Oito, disguises the operation behind Bill, and Oito scouts Marayam before witnessing Momoze’s murder in progress. The prolonged shared Stealth Dolphin state keeps Emperor Time active for roughly twelve hours, causes linked blackouts, awakens Oito’s aura nodes, and ends when Tserriednich’s Guardian Spirit Beast consumes the controlled cockroach.',
    people: 'Oito, Kurapika, Bill, Babimyna, Marayam, Momoze, Tserriednich',
    source: wiki('Chapter_369'),
  },
  {
    chapters: '369–371',
    time: 'Day 2',
    title: 'First Nen class murder investigation',
    detail: 'Kurapika’s first public Nen class becomes an active murder scene when Silent Majority kills Barrigen. Loberry is detained under suspicion, Cleapatro orders Kaiser to watch the Seiko household for seventy-two hours, and Kurapika continues the class by dividing the remaining students into three groups with Furykov and Belerainte assisting.',
    people: 'Kurapika, Barrigen, Loberry, Sakata, Hashito, Cleapatro, Kaiser, Seiko, Furykov, Belerainte',
    source: wiki('Chapter_371'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));
