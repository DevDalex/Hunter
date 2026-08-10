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
  ['Woody', 'Day 1', '359', 'Found blood-drained with multiple holes during the opening Room 1014 deaths. Chapter 370 disproves the theory that Woble’s Guardian Spirit Beast caused the blood-draining pattern, but does not yet prove the Chapter 359 killer was the Silent Majority user.', 'Room 1014'],
  ['Sandra', 'Day 1', '363', 'Killed by Vincent while he entered Room 1014 under Benjamin’s Royal Guard authority.', 'Room 1014'],
  ['Vincent', 'Day 1', '364', 'Commits suicide by swallowing hidden poison after Kurapika and Bill restrain him and Kurapika steals his Nen ability.', 'Room 1014'],
  ['Momoze Hui Guo Rou', 'Day 1', '368', 'Strangled to death in Room 1012. The killer is not identified at the Chapter 368 death boundary; Chapter 372 later resolves the murderer as Tuffdy.', 'Room 1012'],
  ['Barrigen', 'Day 2', '370', 'Killed by Silent Majority when four curse snakes drain his blood during Kurapika’s first Nen class.', 'Room 1014'],
  ['Tuffdy', 'Day 2', '372', 'After incriminating himself as Momoze’s murderer, Tuffdy is killed by Hanzo, who stages the death to resemble suicide.', 'Tier 1'],
  ['Musse', 'Day 2', '373', 'After Musse shoots and kills Camilla, Cat’s Name activates, kills Musse, and uses his life to revive Camilla.', 'Room 1002 area'],
  ['Wolfe', 'Day 2', '373', 'Queen Unma guard reassigned to Benjamin; shot and killed by Camilla outside Benjamin’s quarters while Benjamin’s guards are under orders not to attack her.', 'Outside Room 1001'],
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
  ['Sarasa', 'Meteor City flashback', '397', 'Found murdered in Uga Forest after being missing since the previous day. Chrollo’s group recovers her body, and her death becomes the catalyst for his three-year protection/revenge strategy and explicit villain turn. The killers, exact unseen abduction sequence, and note contents remain unresolved.', 'Uga Forest'],
  ['Halkenburg’s body', 'Day 12', '405', 'Original body declared dead; consciousness remains elsewhere.', 'Tier 3 hospital'],
].map(([name, day, chapter, cause, place]) => ({ name, day, chapter, cause, place, source: `https://hunterxhunter.fandom.com/wiki/Chapter_${chapter}` }));
