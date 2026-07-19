const wikiBase = 'https://hunterxhunter.fandom.com/wiki';
const directoryUrl = `${wikiBase}/List_of_Hunter_%C3%97_Hunter_Characters/Chapters_340-current`;
const article = (name) => `${wikiBase}/${encodeURIComponent(name.replaceAll(' ', '_'))}`;
import { statusNoteOf, statusOf } from './successionStatus';
import { characters } from './characters';

const verifiedCharacterMedia = new Map(characters.map((character) => [character.name, character]));

const makeMembers = (group, role, rows) => rows.map(([name, , note]) => {
  const verified = verifiedCharacterMedia.get(name);
  return {
    name,
    group,
    role: note || role,
    image: verified?.image || '',
    imageSource: verified?.imageSource || '',
    media: verified?.media || null,
    source: name.includes('Unnamed ') || name.startsWith('Stone Wall ') || name.startsWith('V6 Leader ')
      || name.startsWith('Temp Hunter ') || name.startsWith('Cha-R Associate ')
      || name.startsWith('Tserriednich Friend ') || name === 'Heil-Ly Associate 9'
      ? directoryUrl
      : article(name),
    status: statusOf(name),
    statusNote: statusNoteOf(name),
  };
});

const royalRows = [
  ['Nasubi Hui Guo Rou'], ['Unma Hui Guo Rou'], ['Duazul Hui Guo Rou'], ['Tang Zhao Li Hui Guo Rou'],
  ['Katrono Hui Guo Rou'], ['Swinko-swinko Hui Guo Rou'], ['Seiko Hui Guo Rou'], ['Sevanti Hui Guo Rou'], ['Oito Hui Guo Rou'],
  ['Benjamin Hui Guo Rou'], ['Camilla Hui Guo Rou'], ['Zhang Lei Hui Guo Rou'], ['Tserriednich Hui Guo Rou'],
  ['Tubeppa Hui Guo Rou'], ['Tyson Hui Guo Rou'], ['Luzurus Hui Guo Rou'], ['Salé-salé Hui Guo Rou', 'Sale-sale Hui Guo Rou'],
  ['Halkenburg Hui Guo Rou'], ['Kacho Hui Guo Rou'], ['Fugetsu Hui Guo Rou'], ['Momoze Hui Guo Rou'],
  ['Marayam Hui Guo Rou'], ['Woble Hui Guo Rou'],
];

const bodyguardRows = [
  ['Anesuto'], ['Anzel'], ['Bachaem'], ['Barrigen'], ['Basho'], ['Beeta'], ['Belerainte'], ['Bharate'], ['Bill'],
  ['Biscuit Krueger'], ['Bladge'], ['Danjin'], ['Deruboro'], ['Erikkusu'], ['Famule'], ['Furichosefu'], ['Gadeau'],
  ['Gihoruto'], ['Giuliano'], ['Guerimori'], ['Hanzo'], ['Hashito'], ['Himoncé'], ['Hyuga'], ['Izunavi'], ['Javietti'],
  ['Keeney'], ['Kitokattamu'], ['Kōbihi'], ['Konattsu'], ['Kontasutin'], ['Koroabde'], ['Kurapika'], ['Kurton'],
  ['Longhi'], ['Laroc'], ['Macne'], ['Madwig'], ['Mandam'], ['Maor'], ['Melody'], ['Mizaurouno'], ['Momiita'],
  ['Muhahahasare'], ['Mushaho'], ['Myuhan'], ['Nagmum'], ['Naikēru'], ['Nikoraurusu'], ['Nipaper'], ['Odessa'],
  ['Orzny'], ['Rēuen'], ['Rice'], ['Ridge'], ['Ryoji'], ['Ryubihhi'], ['Sakata'], ['Salkov'], ['Satobi'], ['Sayird'],
  ['Scairt'], ['Shedule'], ['Slakka'], ['Sumidori'], ['Tagenpaku'], ['Tenftory'], ['Theta'], ['Tuffdy'], ['Vantine'],
  ['Vergei'], ['Wolfe'], ['Woody'], ['Yuhirai'], ['Zomeesa'],
];

const servantRows = [
  ['Fukataki'], ['Heisen'], ['Illardia'], ['Komiya'], ['Ladiolus'], ['Loberry'], ['Nadaasu'], ['Naipei'],
  ['Nugui'], ['Pitakusu'], ['Roccoli'], ['Sandra'], ['Shimano'], ['Yuri'],
];

const soldierRows = [
  ['Borksen'], ['Gipper'], ['Maizan'], ['Makaha'], ['Mizuri'], ['Momolly'], ['Otocin'],
  ['Tserriednich Friend 1'], ['Tserriednich Friend 2'], ['Tserriednich Friend 3'],
];

const justiceRows = [['Cleapatro'], ['Kaiser'], ['Peuckert'], ['Steiner'], ['Worio Bay']];
const kakinOtherRows = [['Gantai'], ['Mark'], ['Tamazo'], ['Kakin Announcer']];

const benjaminRows = [
  ['Balsamilco Might'], ['Babimyna'], ['Butch'], ['Coventoba'], ['Furykov'], ['Kanjidol'], ['Musse'], ['Orau'],
  ['Rihan'], ['Shikaku'], ['Vict'], ['Vincent'], ['Yushohi'],
  ['Unnamed Benjamin Guard 14', "Benjamin's Personal Guard 14"],
  ['Unnamed Benjamin Guard 15', "Benjamin's Personal Guard 15"],
];

const camillaRows = [
  ['Sarahell'], ['Moswana'], ['Bucket'], ['Hignori'], ['Gidal'], ['Burvena'], ['Lisamsetta'], ['Nukuocon'],
  ['Kako'], ['Mozbe'], ['Meshush'], ['Cavic'], ['Taler'], ['Umanma'],
  ['Unnamed Camilla Hunter 5', "Camilla's Provisional Hunter 5"],
];

const xiYuRows = [
  ['Onior Longbao'], ['Hinrigh Biganduffno'], ['Zhang Lei Hui Guo Rou'], ['Connelly'],
  ['Lynch Fullbokko'], ['Zakuro Custard'], ['Tassi'], ['Misha Hao'],
];

const heilLyRows = [
  ['Morena Prudo'], ['Tserriednich Hui Guo Rou'], ['Bille'], ['Cashew'], ['Chiffon Toto'], ['Daemon'], ['Dogman'],
  ['Gateaume'], ['Gelato'], ['Luini'], ['Matvere'], ['Montblanc Toto'], ['Notre'], ['Orarge'], ['Padaille'],
  ['Perigord'], ['Quorolle'], ['Sodom'], ['Soufflé'], ['Terebellum'], ['Tevelares'], ['Voconte'], ['Yokotani'],
  ['Heil-Ly Associate 9'], ['Borksen'],
];

const chaRRows = [
  ['Brocco Li'], ['Tajao'], ["Ken'i Wang"], ['Ittoku'], ['Luzurus Hui Guo Rou'], ['Sun-bin'], ['Tsudonke'], ['Vic'],
  ...Array.from({ length: 8 }, (_, index) => [`Cha-R Associate ${index + 1}`]),
];

const expeditionRows = [
  ['Don Freecss'], ['Isaac Netero', 'Isaac Netero (Young)'], ['Zigg Zoldyck', 'Zigg Zoldyck (Young)'],
  ['Linne Horsdoeuvre', 'Linne Horsdoeuvre (Young)'], ['Beyond Netero'], ['Zobae Disease'], ['IPA Director'],
  ['Ging Freecss'], ['Pariston Hill'], ['Muherr'], ['Curly'], ['Golem'], ['Marione'], ['Mascher'], ['Pekotero'], ['Usamen'],
  ...Array.from({ length: 3 }, (_, index) => [`Temp Hunter ${index + 7}`]),
  ...Array.from({ length: 8 }, (_, index) => [`Stone Wall ${index + 1}`]),
  ['Saiyu', 'Saiyu HCE Portrait.png'], ['Bill'], ['Sayird'], ['Kurton'],
];

const v6Rows = Array.from({ length: 5 }, (_, index) => [`V6 Leader ${index + 1}`]);

const returningRows = [
  ['Hisoka Morow'], ['Chrollo Lucilfer'], ['Nobunaga Hazama'], ['Feitan Portor'], ['Machi Komacine'],
  ['Phinks Magcub'], ['Franklin Bordeau'], ['Shizuku Murasaki'], ['Bonolenov Ndongo'], ['Illumi Zoldyck'],
  ['Kalluto Zoldyck'], ['Leorio Paradinight'], ['Cheadle Yorkshire'], ['Mizaistom Nana'], ['Botobai Gigante'],
  ['Kanzai'], ['Ginta'], ['Pyon'], ['Saccho Kobayakawa'], ['Gel'], ['Cluck'],
];

const otherRows = [
  ['Shalnark'], ['Kortopi'], ['Uvogin'], ['Pakunoda'], ['Sarasa'], ['Sheila', 'Sheila V0 Portrait.png'], ['Lisores'], ['Renko'], ['Risnorth'],
  ["Meteor City's Elder"], ['Juhnde'], ['Hanal'], ['Narumi McGait'], ['Silent Majority user', 'Silent Majority User'],
];

export const successionRosterGroups = [
  { id: 'royal-family', title: 'Royal family', description: 'King, eight queens, and fourteen princes.', rows: royalRows },
  { id: 'royal-bodyguards', title: 'Royal bodyguards', description: 'Hunters, private guards, spies, and reassigned security personnel.', rows: bodyguardRows },
  { id: 'royal-servants', title: 'Royal servants', description: 'Named attendants serving the princes and queens.', rows: servantRows },
  { id: 'kakin-soldiers', title: 'Kakin soldiers', description: 'Royal Army personnel and Tserriednich’s military friends.', rows: soldierRows },
  { id: 'justice-bureau', title: 'Justice Bureau', description: 'Officials involved in investigations, custody, and legal procedure.', rows: justiceRows },
  { id: 'kakin-others', title: 'Kakin officials and civilians', description: 'Other named Kakin figures aboard the ship.', rows: kakinOtherRows },
  { id: 'benjamin-guard', title: 'Benjamin’s elite soldiers', description: 'The First Prince’s private military unit.', rows: benjaminRows },
  { id: 'camilla-guard', title: 'Camilla’s personal soldiers', description: 'The Second Prince’s curse-bearing private unit.', rows: camillaRows },
  { id: 'xi-yu', title: 'Xi-Yu family', description: 'Onior’s mafia family and Zhang Lei’s underworld branch.', rows: xiYuRows },
  { id: 'heil-ly', title: 'Heil-Ly family', description: 'Morena’s Contagion network and its level-based members.', rows: heilLyRows },
  { id: 'cha-r', title: 'Cha-R family', description: 'Brocco Li’s mafia family and Luzurus’s underworld branch.', rows: chaRRows },
  { id: 'expedition', title: 'Dark Continent and expedition personnel', description: 'Explorers, Beyond’s team, temporary Hunters, and support personnel.', rows: expeditionRows },
  { id: 'v6', title: 'V6 leadership', description: 'The unnamed national leaders shown alongside Kakin.', rows: v6Rows },
  { id: 'returning', title: 'Returning cast and Association', description: 'Troupe members, Zodiacs, Hunters, and other established characters active in this material.', rows: returningRows },
  { id: 'other', title: 'Other and flashback characters', description: 'Named figures appearing in current-arc flashbacks or parallel material.', rows: otherRows },
].map((group) => ({
  ...group,
  members: makeMembers(group.title, group.description, group.rows),
}));

const byName = new Map();
successionRosterGroups.forEach((group) => group.members.forEach((member) => {
  if (!byName.has(member.name)) byName.set(member.name, member);
}));

export const successionRoster = [...byName.values()];
export const successionRosterSource = directoryUrl;

const commonRoyalBranches = [
  { queen: 'Tang Zhao Li Hui Guo Rou', order: '3rd Queen', children: ['Zhang Lei'] },
  { queen: 'Katrono Hui Guo Rou', order: '4th Queen', children: ['Tyson'] },
  { queen: 'Swinko-swinko Hui Guo Rou', order: '5th Queen', children: ['Salé-salé'] },
  { queen: 'Seiko Hui Guo Rou', order: '6th Queen', children: ['Kacho', 'Fugetsu'] },
  { queen: 'Sevanti Hui Guo Rou', order: '7th Queen', children: ['Momoze', 'Marayam'] },
  { queen: 'Oito Hui Guo Rou', order: '8th Queen', children: ['Woble'] },
];

export const legalRoyalFamilyTree = [
  { queen: 'Unma Hui Guo Rou', order: '1st Queen', children: ['Benjamin', 'Tserriednich'], note: 'Public / legal household branch' },
  { queen: 'Duazul Hui Guo Rou', order: '2nd Queen', children: ['Camilla', 'Tubeppa', 'Luzurus', 'Halkenburg†'], note: '†Halkenburg shown as Duazul’s adopted / raised son' },
  ...commonRoyalBranches,
];

export const biologicalRoyalFamilyTree = [
  { queen: 'Unma Hui Guo Rou', order: '1st Queen', children: ['Benjamin', 'Tserriednich', 'Halkenburg*'], note: '*Halkenburg’s confirmed birth mother' },
  { queen: 'Duazul Hui Guo Rou', order: '2nd Queen', children: ['Camilla', 'Tubeppa', 'Luzurus'], note: 'Halkenburg moves to Unma in biological view' },
  ...commonRoyalBranches,
];

export const royalFamilyTree = biologicalRoyalFamilyTree;

export const mafiaFamilyTree = [
  { name: 'Onior Longbao', relation: 'Nasubi’s half-brother', family: 'Xi-Yu boss', royal: 'Zhang Lei', link: 'Benefactor and half-nephew' },
  { name: 'Nasubi Hui Guo Rou', relation: 'Kakin king', family: 'Father of Morena Prudo', royal: 'Morena Prudo', link: 'Illegitimate daughter' },
  { name: 'Brocco Li', relation: 'Nasubi’s half-brother', family: 'Cha-R boss', royal: 'Luzurus', link: 'Benefactor and half-nephew' },
  { name: 'Morena Prudo', relation: 'Nasubi’s illegitimate daughter', family: 'Heil-Ly boss', royal: 'Tserriednich', link: 'Former benefactor and half-brother' },
];
