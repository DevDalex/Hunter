export const confirmedDeceased = new Set([
  'Salé-salé Hui Guo Rou', 'Kacho Hui Guo Rou', 'Momoze Hui Guo Rou',
  'Barrigen', 'Keeney', 'Musse', 'Myuhan', 'Shikaku', 'Tuffdy', 'Vincent', 'Wolfe', 'Woody', 'Sandra',
  'Lynch Fullbokko', 'Luini', 'Padaille', 'Misha Hao', 'Sarasa', 'Risnorth',
  'Shalnark', 'Kortopi', 'Uvogin', 'Pakunoda',
]);

export const exceptionalStatus = {
  'Balsamilco Might': 'Body occupied; original consciousness status unresolved',
  'Halkenburg Hui Guo Rou': 'Original body deceased; consciousness remains active in Balsamilco’s body',
  'Kacho Hui Guo Rou': 'Confirmed deceased; Guardian Spirit Beast continues in her form',
};

export const statusOf = (name) => confirmedDeceased.has(name) ? 'deceased' : exceptionalStatus[name] ? 'exceptional' : 'active';
export const statusNoteOf = (name) => exceptionalStatus[name] || null;

export const isRoyalDeceased = (shortName) => confirmedDeceased.has(`${shortName.replace('*', '')} Hui Guo Rou`);

export const deathLedger = [
  ['Woody', 'Day 1', '359', 'Killed by Silent Majority in Room 1014.', 'Room 1014'],
  ['Wolfe', 'Day 1', '359', 'One of Woble’s guards found dead during the opening Room 1014 attack.', 'Room 1014'],
  ['Sandra', 'Day 1', '361', 'Killed by Vincent during Benjamin’s first operation against Woble.', 'Room 1014'],
  ['Vincent', 'Day 1', '361', 'Died after Kurapika and Bill defeated his operation.', 'Room 1014'],
  ['Momoze Hui Guo Rou', 'Day 1', '368', 'Strangled by Tuffdy after her protection was reduced.', 'Room 1012'],
  ['Barrigen', 'Day 2', '369', 'Killed by Silent Majority during Kurapika’s first Nen class.', 'Room 1014'],
  ['Tuffdy', 'Day 2', '370', 'Killed by Hanzo after confessing to Momoze’s murder.', 'Tier 1'],
  ['Musse', 'Day 2', '373', 'Killed by Camilla before her confrontation with Benjamin.', 'VVIP area'],
  ['Myuhan', 'Day 3', '376', 'Killed by Silent Majority during the second lesson day.', 'Room 1014'],
  ['Salé-salé Hui Guo Rou', 'Day 6', '382', 'Assassinated after Predator removed his Guardian Spirit Beast.', 'Room 1008'],
  ['Keeney', 'Day 8', '383', 'Died during the twin-prince lifeboat operation.', 'Lifeboat launch'],
  ['Kacho Hui Guo Rou', 'Day 8', '383', 'Killed when the ritual prevented escape from the ship.', 'Outside hull'],
  ['Shikaku', 'Day 9', '389', 'His possessed body died near Luzurus’s quarters.', 'Room 1007 area'],
  ['Padaille', 'Day 10', '391', 'Killed during Xi-Yu’s confrontation with Heil-Ly members.', 'Lower tiers'],
  ['Misha Hao', 'Before the voyage', '392', 'Death circumstances are unknown; her post-mortem Nen continues disposing of people killed by Xi-Yu members.', 'Unknown'],
  ['Lynch Fullbokko', 'Day 10 / revealed Day 12', '405', 'Killed by Bonolenov after her ability exposed his false-Hisoka disguise; her body is recovered later.', 'Tier 3'],
  ['Luini', 'Day 10', '393', 'Killed by Nobunaga after attempting to recruit the Troupe.', 'Lower tiers'],
  ['Kortopi', 'Pre-voyage', '357', 'Killed by Hisoka after the Heavens Arena death match.', 'Heavens Arena area'],
  ['Shalnark', 'Pre-voyage', '357', 'Killed by Hisoka after the Heavens Arena death match.', 'Heavens Arena area'],
  ['Sarasa', 'Meteor City flashback', '397', 'Abducted and murdered; her death becomes the decisive trauma behind the Troupe’s founding.', 'Meteor City'],
  ['Halkenburg’s body', 'Day 12', '405', 'Original body declared dead; consciousness remains elsewhere.', 'Tier 3 hospital'],
].map(([name, day, chapter, cause, place]) => ({ name, day, chapter, cause, place, source: `https://hunterxhunter.fandom.com/wiki/Chapter_${chapter}` }));
