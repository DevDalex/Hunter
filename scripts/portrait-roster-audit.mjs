import fs from 'node:fs';

const rosterPath = new URL('../src/data/successionRoster.js', import.meta.url);
const workerPath = new URL('../server/index.js', import.meta.url);
const source = fs.readFileSync(rosterPath, 'utf8');
const worker = fs.readFileSync(workerPath, 'utf8');
const failures = [];
const requireText = (haystack, needle, message) => {
  if (!haystack.includes(needle)) failures.push(message);
};

requireText(source, "const makeMembers = (group, role, rows) => rows.map(([name, portraitHint, note])", 'Roster member builder is not preserving portrait hints');
requireText(source, 'const imageFile = rosterPortraitFileFor(name, portraitHint);', 'Roster member builder is not resolving an explicit portrait filename');
requireText(source, 'const image = portrait(imageFile, name);', 'Roster portraits are not passing character titles to the stable proxy');
requireText(source, "const portrait = (file, title = '') => `/__hunterpedia/portrait?file=", 'Roster portraits are not routed through the same-origin Hunterpedia proxy');
requireText(worker, "const PORTRAIT_PATH = '/__hunterpedia/portrait';", 'Worker portrait proxy route is missing');
requireText(worker, "fileQuery.searchParams.set('prop', 'imageinfo');", 'Worker does not resolve exact Hunterpedia file records');
requireText(worker, "pageQuery.searchParams.set('prop', 'pageimages');", 'Worker does not fall back to the Hunterpedia character page image');
requireText(worker, "headers.set('cache-control'", 'Worker portrait responses are not cached');

const reportedNames = [
  'Anzel', 'Bachaem', 'Barrigen', 'Borksen', 'Bucket', 'Butch', 'Cleapatro', 'Don Freecss',
  'Duazul Hui Guo Rou', 'Feitan Portor', 'Franklin Bordeau', 'Fukataki', 'Gantai', 'Gel', 'Gipper',
  'Heisen', 'Hignori', 'Hisoka Morow', 'Illardia', 'Kalluto Zoldyck', 'Kortopi', 'Leorio Paradinight',
  'Machi Komacine', 'Maizan', 'Makaha', 'Mark', 'Mizuri', 'Nobunaga Hazama', 'Pakunoda',
  'Phinks Magcub', 'Shalnark', 'Shimano', 'Shizuku Murasaki', 'Uvogin',
];
for (const name of reportedNames) {
  requireText(source, name, `Reported portrait roster entry is missing: ${name}`);
}

const exactFallbacks = [
  ['Gel', 'Gel HCE Portrait.png'],
  ['Hisoka Morow', 'Hisoka Morow HCE Portrait.png'],
  ['Leorio Paradinight', 'Leorio Paradinight HCE Portrait.png'],
  ['Feitan Portor', 'Feitan Portor YC Portrait.png'],
  ['Franklin Bordeau', 'Franklin Bordeau YC Portrait.png'],
  ['Machi Komacine', 'Machi Komacine YC Portrait.png'],
  ['Nobunaga Hazama', 'Nobunaga Hazama YC Portrait.png'],
  ['Pakunoda', 'Pakunoda YC Portrait.png'],
  ['Phinks Magcub', 'Phinks Magcub YC Portrait.png'],
  ['Shalnark', 'Shalnark YC Portrait.png'],
  ['Shizuku Murasaki', 'Shizuku Murasaki YC Portrait.png'],
  ['Uvogin', 'Uvogin YC Portrait.png'],
  ['Kortopi', 'Kortopi YC Portrait.png'],
  ['Bonolenov Ndongo', 'Bonolenov Ndongo CA Portrait.png'],
];
for (const [name, file] of exactFallbacks) {
  requireText(source, `['${name}', '${file}']`, `${name} does not use the verified Hunterpedia portrait filename ${file}`);
}

requireText(source, 'Array.from({ length: 8 }, (_, index) => [`Cha-R Associate ${index + 1}`])', 'Cha-R associate portrait-generating roster entries are missing');
requireText(source, 'Array.from({ length: 3 }, (_, index) => [`Temp Hunter ${index + 7}`])', 'Temporary Hunter portrait-generating roster entries are missing');
requireText(source, 'Array.from({ length: 8 }, (_, index) => [`Stone Wall ${index + 1}`])', 'Stone Wall portrait-generating roster entries are missing');
requireText(source, 'const v6Rows = Array.from({ length: 5 }, (_, index) => [`V6 Leader ${index + 1}`]);', 'V6 leader portrait-generating roster entries are missing');
requireText(source, "['Saiyu', 'Saiyu HCE Portrait.png']", 'Explicit Saiyu portrait hint is missing');
requireText(source, "['Sheila', 'Sheila V0 Portrait.png']", 'Explicit Sheila portrait hint is missing');
requireText(source, "['Unnamed Benjamin Guard 14', \"Benjamin's Personal Guard 14\"]", 'Benjamin guard alternate portrait base is missing');

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

console.log(`Portrait roster audit passed: stable proxy plus ${reportedNames.length} reported portrait regressions are structurally protected.`);
