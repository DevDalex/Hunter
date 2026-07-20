import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { encyclopediaRecords, encyclopediaStats } from '../src/data/encyclopedia.js';
import { characterDirectoryPolicy, characterProfileStats, featuredCharacterProfiles } from '../src/data/characterProfilePrototype.js';
import { isApprovedSourceUrl } from '../src/data/sourcePolicy.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Character profile audit failed: ${message}`);
};
const unique = (values) => new Set(values).size === values.length;

const characterRecords = encyclopediaRecords.filter((record) => record.category === 'characters');
const characterNames = new Set(characterRecords.map((record) => record.name));

assert(characterRecords.length === encyclopediaStats.characters, 'character statistic must match the actual character directory count');
assert(characterRecords.length >= 100, 'the character directory must remain a broad cast archive, not a reduced profile-only set');
assert(characterDirectoryPolicy.rules.some(([name]) => /No cast deletion/i.test(name)), 'directory policy must explicitly preserve all cast records');
assert(characterDirectoryPolicy.directoryLanes.length >= 3, 'character directory/dossier split needs visible lanes');
assert(characterProfileStats.profiles >= 6, 'Batch 9 must ship at least six flagship profile prototypes');
assert(unique(featuredCharacterProfiles.map((profile) => profile.id)), 'profile IDs must be unique');
assert(unique(featuredCharacterProfiles.map((profile) => profile.name)), 'profile names must be unique');

for (const profile of featuredCharacterProfiles) {
  assert(characterNames.has(profile.name), `${profile.name} profile does not match a character directory record`);
  assert(isApprovedSourceUrl(profile.source), `${profile.name} primary source is not Hunterpedia/Fandom-approved`);
  assert(profile.sources.length >= 3 && profile.sources.every((source) => isApprovedSourceUrl(source.href)), `${profile.name} needs at least three approved source links`);
  for (const key of ['facts', 'story', 'relationships', 'nen', 'conflicts', 'organizations', 'locations', 'objects']) {
    assert(profile[key].length >= 3, `${profile.name} ${key} coverage is too thin`);
  }
  assert(profile.status && profile.lead && profile.role, `${profile.name} needs status, lead, and role copy`);
}

const component = await readFile(path.resolve('src/components/CharacterProfileDossier.jsx'), 'utf8');
assert(component.includes('DirectoryBoundary') && component.includes('characterDirectoryPolicy.rules'), 'component must show retained-directory state for non-profile characters');
assert(component.includes('characterProfileByName.get(selected.name)'), 'component must resolve profiles without replacing the base character record');
assert(component.includes('SourcePortrait'), 'profile dossiers must remain portrait-aware');

const encyclopedia = await readFile(path.resolve('src/components/EntityEncyclopedia.jsx'), 'utf8');
assert(encyclopedia.includes('CharacterProfileDossier') && encyclopedia.includes('<CharacterProfileDossier selected={selected} onOpenRelated={openRelated} />'), 'character encyclopedia must surface profile dossiers inside the selected record');
assert(encyclopedia.includes('Portrait gallery') && encyclopedia.includes('Research index') && encyclopedia.includes('Story groups'), 'existing character directory views must remain available');
assert(encyclopedia.includes('sourcePortraitStats.totalCharacters'), 'complete character directory coverage indicator must remain visible');

await access(path.resolve('src/components/CharacterProfileDossier.css'));
await access(path.resolve('docs/CHARACTER-PROFILES.md'));

console.log(`Character profile audit passed: ${characterRecords.length} retained character records, ${featuredCharacterProfiles.length} dossier prototypes, no deletion policy visible, and character directory views preserved.`);
