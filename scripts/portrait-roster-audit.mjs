import { successionRoster, successionRosterGroups } from '../src/data/successionRoster.js';

const failures = [];
const seen = new Set();
for (const record of successionRoster) {
  if (!record?.name) failures.push('Roster record missing name');
  if (!record?.imageFile) failures.push(`${record?.name || 'Unknown'} missing imageFile`);
  if (!record?.image || !record.image.includes('/Special:Redirect/file/')) failures.push(`${record?.name || 'Unknown'} is not using the Hunterpedia redirect path`);
  if (seen.has(record.name)) failures.push(`Duplicate roster character: ${record.name}`);
  seen.add(record.name);
}

const regressionNames = [
  'Anzel', 'Bachaem', 'Barrigen', 'Borksen', 'Bucket', 'Butch', 'Cleapatro', 'Don Freecss', 'Bonolenov Ndongo',
  'Cha-R Associate 1', 'Temp Hunter 7', 'Stone Wall 1', 'V6 Leader 1', 'Heil-Ly Associate 9', 'Kakin Announcer',
];
for (const name of regressionNames) {
  const record = successionRoster.find((item) => item.name === name);
  if (!record) failures.push(`Regression portrait record missing: ${name}`);
  else if (!record.imageFile) failures.push(`Regression portrait file missing: ${name}`);
}

const bonolenov = successionRoster.find((item) => item.name === 'Bonolenov Ndongo');
if (bonolenov?.imageFile !== 'Bonolenov Ndongo CA Portrait.png') failures.push('Bonolenov fallback portrait is not the Chimera Ant portrait');

const sai = successionRoster.find((item) => item.name === 'Saiyu');
if (sai?.imageFile !== 'Saiyu HCE Portrait.png') failures.push('Explicit Saiyu portrait hint was not preserved');

const unnamedBenjamin = successionRoster.find((item) => item.name === 'Unnamed Benjamin Guard 14');
if (unnamedBenjamin?.imageFile !== "Benjamin's Personal Guard 14 SC Portrait.png") failures.push('Named-file hint for Benjamin guard 14 was not expanded correctly');

if (successionRosterGroups.length !== 15) failures.push(`Expected 15 roster groups, found ${successionRosterGroups.length}`);
if (successionRoster.length < 274) failures.push(`Expected at least 274 roster records, found ${successionRoster.length}`);

if (failures.length) {
  console.error(`Portrait roster audit failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Portrait roster audit passed: ${successionRoster.length} records have explicit Hunterpedia portrait filenames, including screenshot regressions and generic roster entries.`);
