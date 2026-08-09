import * as base from './successionArchiveThrough388.js';

export * from './successionArchiveThrough388.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 9 · 10:00 a.m. flashback', chapters: '389', subject: 'Kanjidol / Benjamin / Balsamilco',
    route: 'Room 1001 briefing → Shikaku incident reconstruction → Balsamilco critiques Kanjidol’s theory → Room 1007 monitoring order',
    change: 'Kanjidol proposes that Halkenburg directly caused Shikaku’s suicide, while Balsamilco challenges the route, motive, manipulation logic, and prince-killing assumptions. Kanjidol is ordered to keep reconstructing and monitoring the Room 1007 incident.',
    state: 'Halkenburg threat confirmed operationally / Shikaku suicide mechanism and proposed Guardian Spirit Beast restrictions remain unresolved theories', source: wiki('Chapter_389'),
  },
  {
    day: 'Day 10 · 11:30 a.m.', chapters: '389', subject: 'Benjamin / Balsamilco / Vict',
    route: 'Fourth aura rumbling → fragmented Vict radio transmission → Tackle Shield failure assessment → Benjamin checks star marks',
    change: 'Benjamin and Balsamilco hear Vict report failure around Halkenburg and a bow before the transmission ends in a scream. Tackle Shield is named. Benjamin concludes Shikaku is dead but Vict remains alive.',
    state: 'Vict alive by Benjamin’s assessment / whereabouts and exact fourth-attack outcome unresolved', source: wiki('Chapter_389'),
  },
  {
    day: 'Day 10 · after 11:30 a.m. · exact time unsupplied', chapters: '389', subject: 'Halkenburg / Restricted Voyage Permit Agency',
    route: 'Balsamilco custody plan → five-person special task force arrives → Halkenburg taken into custody → trial isolation strategy',
    change: 'Steiner, Peuckert, and three other task-force members take Halkenburg into custody. Balsamilco says contact with Halkenburg’s men is blocked until after trial and expects possible release under surveillance if evidence is insufficient.',
    state: 'Halkenburg alive and in custody pending trial / planned Benjamin move not yet resolved', source: wiki('Chapter_389'),
  },
  {
    day: 'Day 10 · present · exact time unsupplied', chapters: '389', subject: 'Giuliano / Tyson / Izunavi',
    route: 'Book of Tyson reading → Izunavi warns against attachment → early birthday celebration',
    change: 'Giuliano openly expresses that he misjudged Tyson and becomes emotional when the household celebrates his birthday early because they expect to part in two months.',
    state: 'Giuliano emotionally attached / Chapter 389 does not establish Nen manipulation as the cause', source: wiki('Chapter_389'),
  },
  {
    day: 'Day 10 · present · exact time unsupplied', chapters: '389', subject: 'Kanjidol / Basho / Room 1007',
    route: 'Kanjidol develops Duazul-guard theory → Basho feigns agreement → Basho privately suspects Benjamin and post-mortem Nen',
    change: 'Kanjidol and Basho produce competing explanations for Shikaku’s suicide and the Room 1007 staging. Basho explicitly adds post-mortem Nen to his threat watch, but neither theory is confirmed.',
    state: 'Room 1007 causal explanation unresolved / observation continues', source: wiki('Chapter_389'),
  },
  {
    day: 'Day 10 · present · exact time unsupplied', chapters: '389', subject: 'Camilla Have-Not curse network',
    route: 'Have-Not historical disclosure → assigned curse system → target-object ritual and suicide mechanics → exorcism planning → Sarahell plans Woble approach',
    change: 'Camilla’s Have-Nots are revealed as organized post-mortem curse assassins. Moswana targets Benjamin, Sarahell targets Woble, Taler is redirected to Marayam, and the terminal ritual is explained through repeated cursing, a target-linked object, ash infusion, and suicide.',
    state: 'Curse network and core ritual confirmed / Sarahell has not yet entered Room 1014 / individual curse outcomes unresolved', source: wiki('Chapter_389'),
  },
  {
    day: 'Day 10 · present · exact time unsupplied', chapters: '389', subject: 'Zhang Lei / Tenftory / Coventoba',
    route: 'Tenftory reports successful Nen training → receives an open coin reward → Coventoba checks secretly acquired coin',
    change: 'Tenftory can now see Zhang Lei’s Guardian Spirit Beast and receives a coin directly. Coventoba privately observes that his earlier secretly acquired coin has changed from 1 to 10.',
    state: 'Coin 1→10 progression confirmed / meaning, trigger, threshold, and eventual holder effect unresolved', source: wiki('Chapter_389'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
