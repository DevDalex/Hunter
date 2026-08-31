import fs from 'node:fs';

const sourcePath = new URL('../src/data/successionRoster.js', import.meta.url);
const source = fs.readFileSync(sourcePath, 'utf8');
const failures = [];
const requireText = (needle, message) => {
  if (!source.includes(needle)) failures.push(message);
};

requireText("const makeMembers = (group, role, rows) => rows.map(([name, portraitHint, note])", 'Roster member builder is not preserving portrait hints');
requireText('const imageFile = rosterPortraitFileFor(name, portraitHint);', 'Roster member builder is not resolving an explicit portrait filename');
requireText('imageFile,', 'Roster records do not expose their resolved portrait filename');
requireText("const portrait = (file) => `${wikiBase}/Special:Redirect/file/${encodeURIComponent(file)}`;", 'Roster portraits are not using the Hunterpedia redirect-file path');

const regressionNames = [
  'Anzel', 'Bachaem', 'Barrigen', 'Borksen', 'Bucket', 'Butch', 'Cleapatro', 'Don Freecss',
  'Bonolenov Ndongo', 'Cha-R Associate 1', 'Temp Hunter 7', 'Stone Wall 1', 'V6 Leader 1',
  'Heil-Ly Associate 9', 'Kakin Announcer',
];
for (const name of regressionNames) {
  requireText(name, `Regression portrait roster entry is missing: ${name}`);
}

requireText("['Bonolenov Ndongo', 'Bonolenov Ndongo CA Portrait.png']", 'Bonolenov Chimera Ant portrait fallback is missing');
requireText("['Cluck', 'Cluck HCE Portrait.png']", 'Cluck Hunter Chairman Election portrait fallback is missing');
requireText("['Mizaistom Nana', 'Mizaistom Nana HCE Portrait.png']", 'Mizaistom Hunter Chairman Election portrait fallback is missing');
requireText("['Saiyu', 'Saiyu HCE Portrait.png']", 'Explicit Saiyu portrait hint is missing');
requireText("['Sheila', 'Sheila V0 Portrait.png']", 'Explicit Sheila portrait hint is missing');
requireText("['Unnamed Benjamin Guard 14', \"Benjamin's Personal Guard 14\"]", 'Benjamin guard alternate portrait base is missing');

const groupBlock = source.match(/export const successionRosterGroups = \[([\s\S]*?)\]\.map\(\(group\)/)?.[1] || '';
const groupCount = (groupBlock.match(/\{ id:/g) || []).length;
if (groupCount !== 15) failures.push(`Expected 15 Succession roster groups, found ${groupCount}`);

if (/const rosterPortraitFor[\s\S]*?isGenericRosterName\(name\)[\s\S]*?\?\s*''/.test(source)) {
  failures.push('Generic visible Succession records are still being suppressed from portrait attempts');
}

if (failures.length) {
  console.error(`Portrait roster audit failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Portrait roster audit passed: portrait hints, screenshot regressions, generic roster attempts, and fallback families are structurally protected.');
