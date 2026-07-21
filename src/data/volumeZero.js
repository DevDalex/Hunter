const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const file = (name) => `https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(name)}`;

export const volumeZeroPublication = {
  title: 'Kurapika’s Memories',
  japaneseTitle: 'クラピカ追憶編',
  format: 'Two-part manga prequel',
  totalPages: 63,
  storyPosition: 'Before Chapter 1',
  animeStatus: 'Not adapted in the 2011 anime',
  releases: [
    { date: 'December 3, 2012', label: 'Part One · Weekly Shōnen Jump No. 1' },
    { date: 'December 10, 2012', label: 'Part Two · Weekly Shōnen Jump No. 2' },
    { date: 'January 12, 2013', label: 'Volume 0 · theater-exclusive booklet' },
    { date: 'July 4, 2023', label: 'Digital edition' },
  ],
  sources: [
    { label: 'Volume 0', href: wiki('Volume_0') },
    { label: 'Part One', href: wiki('Kurapika%27s_Memories%3A_Part_One') },
    { label: 'Part Two', href: wiki('Kurapika%27s_Memories%3A_Part_Two') },
  ],
};

export const volumeZeroArtwork = {
  cover: { src: file('Volume 0 cover.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Volume 0 cover artwork for Kurapika’s Memories', source: wiki('Volume_0') },
  partOne: { src: file('Kurapika memories part one.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Chapter 0A cover artwork for Kurapika’s Memories Part One', source: wiki('Kurapika%27s_Memories%3A_Part_One') },
  partTwo: { src: file("Kurapika's Memories Part Two cover.png"), fallback: '/media/portraits/kurapika.webp', alt: 'Chapter 0B cover artwork for Kurapika’s Memories Part Two', source: wiki('Kurapika%27s_Memories%3A_Part_Two') },
  forest: { src: file('Chap 0A - Lukso Province.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Lukso Province and the forest surrounding the Kurta settlement', source: wiki('Category%3AChapter_0A_Images') },
  sheila: { src: file('Kura & pairo discover shilah.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Kurapika and Pairo discover the injured traveler Sheila', source: wiki('Category%3AChapter_0A_Images') },
  dinoHunter: { src: file('Chapter 0A - Sheila Dino Hunter.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Sheila gives Kurapika and Pairo the Dino Hunter book', source: wiki('Category%3AChapter_0A_Images') },
  reading: { src: file('Special 1- Kurapika and Pairo read Hunter book.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Kurapika and Pairo reading Dino Hunter together', source: wiki('Category%3AChapter_0A_Images') },
  piko: { src: file("Kurapika's Memories P1 IMG14 Kurapika and Pairo on a Piko.png"), fallback: '/media/portraits/kurapika.webp', alt: 'Kurapika and Pairo travelling on a Piko toward the outside world', source: wiki('Category%3AChapter_0A_Images') },
  city: { src: file('Special 2- Kurapika and Pairo excited at being in town.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Kurapika and Pairo arriving excitedly in Nancha City', source: wiki('Category%3AChapter_0B_Images') },
  scarlet: { src: file('Chapter 0B - Kurapika attacking the thug.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Kurapika’s eyes turn scarlet during the Nancha City confrontation', source: wiki('Category%3AChapter_0B_Images') },
  passed: { src: file('Chapter 0B - Kurapika passing the exam.png'), fallback: '/media/portraits/kurapika.webp', alt: 'The Elder confirms that Kurapika passed the exit examination', source: wiki('Category%3AChapter_0B_Images') },
  goodbye: { src: file('Chapter 0B - Kurapika saying goodbye.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Kurapika says goodbye to Pairo before leaving the settlement', source: wiki('Category%3AChapter_0B_Images') },
  kurapika: { src: file('Young Kurapika.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Young Kurapika in Volume 0', source: wiki('Category%3AChapter_0A_Images') },
  pairo: { src: file('Pairo close up.PNG'), fallback: '/media/portraits/kurapika.webp', alt: 'Pairo in Volume 0', source: wiki('Pairo') },
  sheilaPortrait: { src: file('Sheila V0 Portrait.png'), fallback: '/media/portraits/kurapika.webp', alt: 'Sheila in Volume 0', source: wiki('Sheila') },
  elder: { src: file('Chapter 0B - Kurta Clan Elder.png'), fallback: '/media/portraits/kurapika.webp', alt: 'The Elder of the Kurta Clan', source: wiki('Kurta_Clan_Elder') },
};

export const volumeZeroChapters = [
  {
    id: 'part-one',
    code: '0A',
    label: 'Part One',
    pages: 29,
    title: 'The world enters the forest',
    deck: 'Kurapika and Pairo discover Sheila, learn to communicate with her, and turn the forbidden outside world into a future they can imagine.',
    cover: volumeZeroArtwork.partOne,
    accent: 'forest',
    source: wiki('Kurapika%27s_Memories%3A_Part_One'),
    scenes: [
      { number: '01', title: 'A hidden life', detail: 'Kurapika argues against the rules that keep young Kurta inside the settlement and prevent them from learning the outside language.', change: 'The story begins with freedom already defined as a forbidden subject.', artwork: volumeZeroArtwork.forest },
      { number: '02', title: 'Kurapika and Pairo', detail: 'Pairo’s physical limitations and calmer judgment establish the friendship that gives Kurapika’s desire to leave a purpose beyond curiosity.', change: 'Departure becomes a shared dream rather than an individual escape.', artwork: volumeZeroArtwork.pairo },
      { number: '03', title: 'Sheila is discovered', detail: 'The boys secretly help an injured traveler in the forest even though they cannot initially understand her language.', change: 'The outside world arrives as a vulnerable person rather than a distant threat.', artwork: volumeZeroArtwork.sheila },
      { number: '04', title: 'A language is learned', detail: 'Kurapika retrieves his father’s dictionary, allowing the children and Sheila to communicate while she recovers.', change: 'Knowledge becomes the first route through the settlement’s boundary.', artwork: volumeZeroArtwork.reading },
      { number: '05', title: 'Dino Hunter', detail: 'Sheila’s adventure book gives the Hunter profession and the wider world a concrete shape that Kurapika and Pairo can study together.', change: 'A forbidden world becomes an imaginable future.', artwork: volumeZeroArtwork.dinoHunter },
      { number: '06', title: 'Permission to try', detail: 'After reading the book himself, the Elder allows Kurapika to attempt the settlement’s exit examination.', change: 'Argument becomes a formal path toward departure.', artwork: volumeZeroArtwork.elder },
    ],
  },
  {
    id: 'part-two',
    code: '0B',
    label: 'Part Two',
    pages: 34,
    title: 'The journey outside',
    deck: 'The exit examination carries Kurapika and Pairo to Nancha City, where curiosity, prejudice, emotional control, and the promise of return collide.',
    cover: volumeZeroArtwork.partTwo,
    accent: 'scarlet',
    source: wiki('Kurapika%27s_Memories%3A_Part_Two'),
    scenes: [
      { number: '01', title: 'The final examination', detail: 'Kurapika must complete a shopping trip within twenty-four hours without allowing the special eyedrops to register a Scarlet Eyes activation.', change: 'Emotional control becomes the price of freedom.', artwork: volumeZeroArtwork.passed },
      { number: '02', title: 'Choosing Pairo', detail: 'Kurapika chooses Pairo as his companion and carries an additional goal: finding a doctor who may restore his friend’s health.', change: 'The journey is tied to responsibility and return.', artwork: volumeZeroArtwork.pairo },
      { number: '03', title: 'The route to Nancha', detail: 'The boys travel on three Piko and calculate the time needed to reach the city, shop, and return before the deadline.', change: 'The boundary becomes a practical route instead of an abstract prohibition.', artwork: volumeZeroArtwork.piko },
      { number: '04', title: 'The city', detail: 'Kurapika encounters crowds, a department store, generosity, intimidation, and the ordinary complexity of outside life.', change: 'The outside world proves neither wholly kind nor wholly hostile.', artwork: volumeZeroArtwork.city },
      { number: '05', title: 'Provocation', detail: 'After Pairo is insulted and attacked, Kurapika’s anger overwhelms his control and his eyes turn scarlet.', change: 'The danger the clan feared becomes visible in public.', artwork: volumeZeroArtwork.scarlet },
      { number: '06', title: 'The hidden test', detail: 'The hired provocateurs reveal the Elder’s plan, while Pairo reveals that he secretly replaced Kurapika’s eyedrops.', change: 'Pairo’s judgment protects Kurapika from a test designed around mistrust.', artwork: volumeZeroArtwork.passed },
      { number: '07', title: 'Permission and farewell', detail: 'The Elder permits Kurapika to leave indefinitely and gives him information about Pairo’s condition. Kurapika promises to find help and return.', change: 'Freedom is granted, but it is defined by obligation.', artwork: volumeZeroArtwork.goodbye },
    ],
  },
];

export const volumeZeroPeople = [
  { name: 'Kurapika', role: 'The one who leaves', note: 'Curious, intelligent, and quick-tempered before vengeance gives those traits a target.', artwork: volumeZeroArtwork.kurapika, source: wiki('Kurapika') },
  { name: 'Pairo', role: 'The reason to return', note: 'The friend who shares the dream, steadies Kurapika, and protects his chance to leave.', artwork: volumeZeroArtwork.pairo, source: wiki('Pairo') },
  { name: 'Sheila', role: 'The outside world arrives', note: 'The injured traveler whose language, stories, and book make exploration imaginable.', artwork: volumeZeroArtwork.sheilaPortrait, source: wiki('Sheila') },
];

export const volumeZeroSupportingPeople = [
  ['Kurta Clan Elder', 'Protective authority who restricts departure, designs the examination, and ultimately permits Kurapika to leave.'],
  ['Kurapika’s parents', 'Family members who watch the conflict between communal safety and Kurapika’s determination.'],
  ['Mizelle and Chikuta', 'Outsiders living among the Kurta whose eyes do not turn scarlet, helping Pairo explain the clan’s difference.'],
  ['Nancha residents', 'A mixed public whose help, fear, silence, and prejudice complicate Kurapika’s first experience outside.'],
];

export const volumeZeroExam = {
  facts: [
    ['Destination', 'Nancha City'],
    ['Time limit', '24 hours'],
    ['Companion', 'Pairo'],
    ['Transport', 'Three Piko'],
    ['Failure trigger', 'Scarlet Eyes activation'],
    ['Hidden variable', 'Provocateurs hired by the Elder'],
    ['Actual result', 'Passed'],
  ],
  layers: [
    ['Knowledge', 'Complete the preliminary study requirements and understand the settlement’s rules.'],
    ['Practical judgment', 'Reach Nancha City, buy the listed supplies, and return within the time limit.'],
    ['Emotional control', 'Face unfamiliar people and provocation without allowing the Scarlet Eyes to appear.'],
  ],
};

export const volumeZeroObjects = [
  ['Dino Hunter', 'Sheila → Kurapika and Pairo → the Elder', 'An adventure book that makes the Hunter profession and the outside world imaginable.'],
  ['Dictionary', 'Kurapika’s family', 'Allows the children to communicate with Sheila and begin learning the outside language.'],
  ['Eyedrops', 'The Elder and Pairo', 'Turn emotional activation into a measurable rule; Pairo secretly replaces Kurapika’s dose.'],
  ['Shopping list', 'Kurta Clan', 'Transforms the final examination into an ordinary task inside an unfamiliar city.'],
  ['Piko', 'Kurta settlement', 'Carry the boys and their supplies between the forest and Nancha City.'],
  ['Medical envelope', 'The Elder → Kurapika', 'Carries information about Pairo’s condition and turns departure into a search for help.'],
];

export const volumeZeroPromise = [
  ['01', 'Read Dino Hunter together', 'The dream begins as a shared story.'],
  ['02', 'See the outside world', 'Curiosity becomes a future the boys intend to experience.'],
  ['03', 'Find a doctor for Pairo', 'Kurapika’s departure becomes an act of responsibility.'],
  ['04', 'Have a journey worth describing', 'Pairo asks Kurapika not to reduce the outside world to duty alone.'],
  ['05', 'Return with an honest answer', 'The promise assumes that home and friendship will still be waiting.'],
];

export const volumeZeroConnections = [
  ['Hunter Exam', 'Kurapika seeks the access, mobility, and legitimacy needed to pursue the Scarlet Eyes and move through the outside world.'],
  ['Yorknew City', 'The stolen eyes belong to people who had names, relationships, rules, and a home rather than to an abstract lost clan.'],
  ['Succession Contest', 'Protecting Woble places duty, survival, and another child’s future ahead of immediate revenge.'],
];

export const volumeZeroGallery = [
  { group: 'The hidden world', title: 'Lukso Province', note: 'The forest surrounding the secluded Kurta settlement.', artwork: volumeZeroArtwork.forest },
  { group: 'The outside world arrives', title: 'Sheila is found', note: 'Kurapika and Pairo encounter a traveler they cannot initially understand.', artwork: volumeZeroArtwork.sheila },
  { group: 'The outside world arrives', title: 'Dino Hunter', note: 'A book turns distant adventure into a personal possibility.', artwork: volumeZeroArtwork.dinoHunter },
  { group: 'The journey', title: 'Leaving the forest', note: 'The boys ride toward the final examination and Nancha City.', artwork: volumeZeroArtwork.piko },
  { group: 'The examination', title: 'Nancha City', note: 'Kurapika’s first experience of crowds, commerce, help, and prejudice.', artwork: volumeZeroArtwork.city },
  { group: 'The examination', title: 'Scarlet activation', note: 'Provocation exposes the danger of Kurapika’s emotional loss of control.', artwork: volumeZeroArtwork.scarlet },
  { group: 'Departure', title: 'Permission granted', note: 'The Elder confirms that Kurapika may leave indefinitely.', artwork: volumeZeroArtwork.passed },
  { group: 'Departure', title: 'The farewell', note: 'Kurapika leaves intending to find help and return to Pairo.', artwork: volumeZeroArtwork.goodbye },
];

export const volumeZeroSources = [
  { label: 'Volume 0', href: wiki('Volume_0'), note: 'Publication, release, and collected-volume record' },
  { label: 'Kurapika’s Memories: Part One', href: wiki('Kurapika%27s_Memories%3A_Part_One'), note: 'Chapter 0A synopsis and publication data' },
  { label: 'Kurapika’s Memories: Part Two', href: wiki('Kurapika%27s_Memories%3A_Part_Two'), note: 'Chapter 0B synopsis and publication data' },
  { label: 'Chapter 0A Images', href: wiki('Category%3AChapter_0A_Images'), note: 'Scene artwork used across Part One' },
  { label: 'Chapter 0B Images', href: wiki('Category%3AChapter_0B_Images'), note: 'Scene artwork used across Part Two' },
  { label: 'Kurta Clan', href: wiki('Kurta_Clan'), note: 'Clan background and Scarlet Eyes context' },
  { label: 'Pairo', href: wiki('Pairo'), note: 'Pairo’s role, condition, and relationship with Kurapika' },
  { label: 'Sheila', href: wiki('Sheila'), note: 'Sheila and the children’s first link to the outside world' },
  { label: 'Nancha City', href: wiki('Nancha_City'), note: 'Location used for the final examination' },
];
