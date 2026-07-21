const fandomImage = (path) => `https://static.wikia.nocookie.net/hunterxhunter/images/${path}`;

export const storyArcArtwork = [
  {
    id: 'volume-0',
    image: fandomImage('1/1a/Volume_0_cover.png/revision/latest?cb=20230703014833'),
    fallback: '/media/portraits/kurapika.webp',
    alt: 'Cover artwork for Hunter × Hunter Volume 0: Kurapika’s Memories',
    source: 'https://hunterxhunter.fandom.com/wiki/Volume_0',
    position: 'center 20%',
  },
  {
    id: 'hunter-exam',
    image: fandomImage('0/05/Hunter_Exam_Poster.png/revision/latest?cb=20230608011215'),
    fallback: '/media/portraits/gon-freecss.webp',
    alt: 'Hunter Exam arc poster showing the examination cast and trials',
    source: 'https://hunterxhunter.fandom.com/wiki/Hunter_Exam_arc',
    position: 'center 25%',
  },
  {
    id: 'zoldyck-family',
    image: fandomImage('2/26/Zoldyck_Family_members.png/revision/latest?cb=20150618052945'),
    fallback: '/media/portraits/killua-zoldyck.webp',
    alt: 'The Zoldyck Family assembled at their Kukuroo Mountain estate',
    source: 'https://hunterxhunter.fandom.com/wiki/Zoldyck_Family',
    position: 'center 24%',
  },
  {
    id: 'heavens-arena',
    image: fandomImage('c/c9/Heavens_Arena_Full.png/revision/latest?cb=20120423234044'),
    fallback: '/media/portraits/wing.webp',
    alt: 'The full Heavens Arena tower rising above the surrounding city',
    source: 'https://hunterxhunter.fandom.com/wiki/Heavens_Arena',
    position: 'center 45%',
  },
  {
    id: 'yorknew-city',
    image: fandomImage('5/53/Epis_45_%282011%29_-_Yorknew_City_-16.10-.png/revision/latest?cb=20181126015616'),
    fallback: '/media/portraits/chrollo-lucilfer.webp',
    alt: 'Yorknew City at night during the auction period',
    source: 'https://hunterxhunter.fandom.com/wiki/Yorknew_City',
    position: 'center center',
  },
  {
    id: 'greed-island',
    image: fandomImage('0/05/GI_Map.png/revision/latest?cb=20120106130831'),
    fallback: '/media/portraits/biscuit-krueger.webp',
    alt: 'Map of Greed Island and its game world',
    source: 'https://hunterxhunter.fandom.com/wiki/Greed_Island',
    position: 'center center',
  },
  {
    id: 'chimera-ant',
    image: fandomImage('e/e2/Chimera_ant_arc_poster.png/revision/latest?cb=20230219045031'),
    fallback: '/media/portraits/meruem.webp',
    alt: 'Chimera Ant arc poster representing the colony, Hunters, and palace conflict',
    source: 'https://hunterxhunter.fandom.com/wiki/Chimera_Ant_arc',
    position: 'center 24%',
  },
  {
    id: 'chairman-election',
    image: fandomImage('f/f1/13th_Hunter_Chairman_Election_arc_2011.png/revision/latest?cb=20140815143728'),
    fallback: '/media/portraits/cheadle-yorkshire.webp',
    alt: '13th Hunter Chairman Election arc artwork representing the election and rescue crisis',
    source: 'https://hunterxhunter.fandom.com/wiki/13th_Hunter_Chairman_Election_arc',
    position: 'center 24%',
  },
  {
    id: 'succession-contest',
    image: fandomImage('2/2b/Hunter_x_Hunter_Succession_Contest_arc.png/revision/latest?cb=20221115004342'),
    fallback: '/black-whale-cutaway.png',
    alt: 'Succession Contest arc artwork representing the Kakin princes, royal conflict, and voyage',
    source: 'https://hunterxhunter.fandom.com/wiki/Succession_Contest_arc',
    position: 'center 24%',
  },
];

export const storyArcArtworkById = new Map(storyArcArtwork.map((item) => [item.id, item]));