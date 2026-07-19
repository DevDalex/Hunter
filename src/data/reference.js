const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const referenceGroups = [
  {
    title: 'Characters',
    description: 'A starting cast index spanning the seven official arcs.',
    items: [
      ['Gon Freecss', 'Gon_Freecss'], ['Killua Zoldyck', 'Killua_Zoldyck'], ['Kurapika', 'Kurapika'],
      ['Leorio Paradinight', 'Leorio_Paradinight'], ['Hisoka Morow', 'Hisoka_Morow'], ['Illumi Zoldyck', 'Illumi_Zoldyck'],
      ['Wing', 'Wing'], ['Biscuit Krueger', 'Biscuit_Krueger'], ['Chrollo Lucilfer', 'Chrollo_Lucilfer'],
      ['Pakunoda', 'Pakunoda'], ['Uvogin', 'Uvogin'], ['Neon Nostrade', 'Neon_Nostrade'],
      ['Genthru', 'Genthru'], ['Razor', 'Razor'], ['Kite', 'Kite'], ['Isaac Netero', 'Isaac_Netero'],
      ['Meruem', 'Meruem'], ['Neferpitou', 'Neferpitou'], ['Shaiapouf', 'Shaiapouf'],
      ['Menthuthuyoupi', 'Menthuthuyoupi'], ['Komugi', 'Komugi'], ['Morel Mackernasey', 'Morel_Mackernasey'],
      ['Knov', 'Knov'], ['Knuckle Bine', 'Knuckle_Bine'], ['Shoot McMahon', 'Shoot_McMahon'],
      ['Alluka Zoldyck', 'Alluka_Zoldyck'], ['Ging Freecss', 'Ging_Freecss'], ['Pariston Hill', 'Pariston_Hill'],
      ['Cheadle Yorkshire', 'Cheadle_Yorkshire'], ['Beyond Netero', 'Beyond_Netero'], ['Oito Hui Guo Rou', 'Oito_Hui_Guo_Rou'],
      ['Woble Hui Guo Rou', 'Woble_Hui_Guo_Rou'], ['Benjamin Hui Guo Rou', 'Benjamin_Hui_Guo_Rou'],
      ['Camilla Hui Guo Rou', 'Camilla_Hui_Guo_Rou'], ['Tserriednich Hui Guo Rou', 'Tserriednich_Hui_Guo_Rou'],
      ['Halkenburg Hui Guo Rou', 'Halkenburg_Hui_Guo_Rou'], ['Bill', 'Bill'], ['Theta', 'Theta'],
    ],
  },
  {
    title: 'World, groups & objects',
    description: 'Places, institutions, factions, creatures, and recurring objects.',
    items: [
      ['Hunter Association', 'Hunter_Association'], ['Hunter Exam', 'Hunter_Exam'], ['Zoldyck Family', 'Zoldyck_Family'],
      ['Heavens Arena', 'Heavens_Arena'], ['Yorknew City', 'Yorknew_City'], ['Phantom Troupe', 'Phantom_Troupe'],
      ['Meteor City', 'Meteor_City'], ['Mafia Community', 'Mafia_Community'], ['Kurta Clan', 'Kurta_Clan'],
      ['Greed Island', 'Greed_Island'], ['Chimera Ants', 'Chimera_Ants'], ['NGL', 'Neo-Green_Life'],
      ['Republic of East Gorteau', 'Republic_of_East_Gorteau'], ['The Zodiacs', 'Zodiacs'], ['Kakin Empire', 'Kakin_Empire'],
      ['Kakin Royal Family', 'Kakin_Royal_Family'], ['Black Whale', 'Black_Whale'], ['Dark Continent', 'Dark_Continent'],
      ['Five Threats', 'Five_Threats'], ['Scarlet Eyes', 'Scarlet_Eyes'], ['Poor Man’s Rose', 'Poor_Man%27s_Rose'],
    ],
  },
  {
    title: 'Nen & combat systems',
    description: 'Core techniques, categories, conditions, and named abilities.',
    items: [
      ['Nen', 'Nen'], ['Ten', 'Ten'], ['Zetsu', 'Zetsu'], ['Ren', 'Ren'], ['Hatsu', 'Hatsu'],
      ['Gyo', 'Gyo'], ['In', 'In'], ['En', 'En'], ['Shu', 'Shu'], ['Ko', 'Ko'], ['Ken', 'Ken'], ['Ryu', 'Ryu'],
      ['Enhancement', 'Enhancement'], ['Transmutation', 'Transmutation'], ['Emission', 'Emission'],
      ['Conjuration', 'Conjuration'], ['Manipulation', 'Manipulation'], ['Specialization', 'Specialization'],
      ['Vows and Limitations', 'Vows_and_Limitations'], ['Conditions', 'Conditions'], ['Water Divination', 'Water_Divination'],
      ['Jajanken', 'Jajanken'], ['Godspeed', 'Godspeed'], ['Emperor Time', 'Emperor_Time'],
      ['Bungee Gum', 'Bungee_Gum'], ['Skill Hunter', 'Skill_Hunter'], ['Guardian Spirit Beast', 'Guardian_Spirit_Beast'],
    ],
  },
].map((group) => ({ ...group, items: group.items.map(([name, slug]) => ({ name, url: wiki(slug) })) }));

export const primarySources = [
  ['Story arcs', 'Story_Arcs'],
  ['Volumes and chapters', 'List_of_Volumes_and_Chapters'],
  ['In-universe timeline', 'Timeline'],
  ['Chapter directory', 'Category:Chapters'],
  ['Grouped character directory', 'List_of_Hunter_%C3%97_Hunter_Characters'],
  ['Complete character list A–Z', 'List_of_Hunter_%C3%97_Hunter_Characters/A-Z'],
  ['Chapters 340-current characters', 'List_of_Hunter_%C3%97_Hunter_Characters/Chapters_340-current'],
  ['World of Hunter × Hunter', 'World_of_Hunter_%C3%97_Hunter'],
  ['Nen', 'Nen'],
  ['Succession Contest arc', 'Succession_Contest_arc'],
].map(([name, slug]) => ({ name, url: wiki(slug) }));
