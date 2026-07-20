import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { dataOwnership, generatedDataFiles } from '../src/data/dataOwnership.js';
import { blackWhaleRoomMedia } from '../src/data/blackWhaleMedia.generated.js';
import { priorityPortraits } from '../src/data/priorityMedia.generated.js';
import { generatedProvenanceMatches, mediaRecordIsComplete } from '../src/data/mediaSchema.js';
import { isApprovedSourceUrl, SOURCE_POLICY_VERSION } from '../src/data/sourcePolicy.js';

const root = process.cwd();
const assert = (condition, message) => { if (!condition) throw new Error(`Data-schema audit failed: ${message}`); };
const unique = (values) => new Set(values).size === values.length;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const walk = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
};

assert(/^\d{4}-\d{2}-\d{2}$/.test(SOURCE_POLICY_VERSION), 'source policy version must be an ISO date');
assert(dataOwnership.characterPortraits.canonical === 'src/data/characters.js#characterPortraitSources', 'character portrait ownership changed without updating the contract');
assert(dataOwnership.blackWhaleRooms.canonical === 'src/data/blackWhale.js#blackWhaleRemoteImageSources', 'Black Whale media ownership changed without updating the contract');
assert(dataOwnership.archiveSearch.shards.length === 3, 'archive search must retain three canonical domain shards');

await Promise.all([
  ...generatedDataFiles.map((file) => access(path.join(root, file))),
  ...dataOwnership.archiveSearch.shards.map((file) => access(path.join(root, file))),
]);

const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });
let charactersModule;
let blackWhaleModule;
let encyclopediaModule;
let mediaRegistryModule;
try {
  [charactersModule, blackWhaleModule, encyclopediaModule, mediaRegistryModule] = await Promise.all([
    server.ssrLoadModule('/src/data/characters.js'),
    server.ssrLoadModule('/src/data/blackWhale.js'),
    server.ssrLoadModule('/src/data/encyclopedia.js'),
    server.ssrLoadModule('/src/data/mediaRegistry.js'),
  ]);
} finally {
  await server.close();
}

const portraitSources = charactersModule.characterPortraitSources;
const portraitSourceByName = new Map(portraitSources.map((record) => [record.name, record]));
assert(portraitSources.length === priorityPortraits.length, `character source count ${portraitSources.length} does not match portrait derivative count ${priorityPortraits.length}`);
assert(unique(portraitSources.map((record) => record.name)), 'canonical character portrait names must be unique');
assert(portraitSources.every((record) => isApprovedSourceUrl(record.articleSource) && isApprovedSourceUrl(record.imageSource)), 'canonical character portrait sources must use approved Hunterpedia hosts');
assert(priorityPortraits.every((record) => generatedProvenanceMatches(record, portraitSourceByName.get(record.name))), 'a generated portrait source mirror drifted from characters.js');
assert(priorityPortraits.every(mediaRecordIsComplete), 'a generated portrait derivative violates the shared media schema');

const characterByName = new Map(charactersModule.characters.map((record) => [record.name, record]));
assert(priorityPortraits.every((derivative) => {
  const runtime = characterByName.get(derivative.name);
  const canonical = portraitSourceByName.get(derivative.name);
  return runtime?.image === derivative.src
    && runtime?.media?.articleSource === canonical?.articleSource
    && runtime?.media?.imageSource === canonical?.imageSource;
}), 'runtime character media no longer resolves from the canonical source plus generated derivative');

const roomSources = blackWhaleModule.blackWhaleRemoteImageSources;
const roomSourceByKey = new Map(roomSources.map((record) => [record.key, record]));
assert(roomSources.length === blackWhaleRoomMedia.length, `Black Whale source count ${roomSources.length} does not match room derivative count ${blackWhaleRoomMedia.length}`);
assert(unique(roomSources.map((record) => record.key)), 'canonical Black Whale media keys must be unique');
assert(roomSources.every((record) => isApprovedSourceUrl(record.articleSource) && isApprovedSourceUrl(record.imageSource)), 'canonical Black Whale sources must use approved Hunterpedia hosts');
assert(blackWhaleRoomMedia.every((record) => generatedProvenanceMatches(record, roomSourceByKey.get(record.key))), 'a generated Black Whale source mirror drifted from blackWhale.js');
assert(blackWhaleRoomMedia.every(mediaRecordIsComplete), 'a generated Black Whale derivative violates the shared media schema');

const localRoomMedia = blackWhaleModule.blackWhaleRooms.filter((record) => record.media?.storage === 'local');
assert(localRoomMedia.every((record) => mediaRecordIsComplete({ ...record.media, image: record.image })), 'a runtime Black Whale room has incomplete local media provenance');

const encyclopediaRecords = encyclopediaModule.encyclopediaRecords;
assert(unique(encyclopediaRecords.map((record) => record.id)), 'encyclopedia record IDs must be unique');
assert(encyclopediaRecords.every((record) => isApprovedSourceUrl(record.source)), 'every encyclopedia record must retain an approved canonical source');
assert(encyclopediaRecords.filter((record) => record.imageSource).every((record) => isApprovedSourceUrl(record.imageSource)), 'encyclopedia image sources must use approved Hunterpedia hosts');

const { mediaRegistry, mediaRegistryStats } = mediaRegistryModule;
assert(unique(mediaRegistry.map((record) => record.id)), 'media registry IDs must be unique');
assert(mediaRegistryStats.policyVersion === SOURCE_POLICY_VERSION, 'media registry is not reporting the canonical source policy version');
assert(mediaRegistryStats.sourcesApproved, 'media registry contains an unapproved source');
assert(mediaRegistryStats.localMetadataComplete, 'media registry contains incomplete local metadata');
assert(mediaRegistryStats.remoteImagesApproved, 'media registry contains an unapproved remote image');
assert(mediaRegistryStats.localPathsValid, 'media registry contains an invalid local media path');
assert(mediaRegistryStats.uniqueLocalPaths, 'media registry local paths must be unique');

const sourceFiles = (await walk(path.join(root, 'src'))).filter((file) => /\.(?:js|jsx)$/.test(file));
const generatedImports = new Map(generatedDataFiles.map((file) => [path.basename(file, '.js'), []]));
for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8');
  for (const generatedName of generatedImports.keys()) {
    const escapedName = escapeRegExp(generatedName);
    const importPattern = new RegExp(`(?:from\\s*['\"][^'\"]*${escapedName}|import\\(\\s*['\"][^'\"]*${escapedName})`);
    if (importPattern.test(source)) generatedImports.get(generatedName).push(path.relative(root, file).replaceAll('\\', '/'));
  }
}
const portraitConsumers = generatedImports.get('priorityMedia.generated').sort();
const roomConsumers = generatedImports.get('blackWhaleMedia.generated').sort();
const expectedPortraitConsumers = [...dataOwnership.characterPortraits.consumers].sort();
const expectedRoomConsumers = [...dataOwnership.blackWhaleRooms.consumers].sort();
assert(JSON.stringify(portraitConsumers) === JSON.stringify(expectedPortraitConsumers), `portrait derivative consumers differ from the ownership contract; found ${portraitConsumers.join(', ') || 'none'}`);
assert(JSON.stringify(roomConsumers) === JSON.stringify(expectedRoomConsumers), `Black Whale derivative consumers differ from the ownership contract; found ${roomConsumers.join(', ') || 'none'}`);

const mediaPipeline = await readFile(path.join(root, 'scripts/lib/mediaPipeline.mjs'), 'utf8');
const portraitStabilizer = await readFile(path.join(root, 'scripts/stabilize-media.mjs'), 'utf8');
const roomStabilizer = await readFile(path.join(root, 'scripts/stabilize-room-media.mjs'), 'utf8');
assert(portraitStabilizer.includes("from './lib/mediaPipeline.mjs'") && roomStabilizer.includes("from './lib/mediaPipeline.mjs'"), 'both media stabilizers must use the shared pipeline');
assert(mediaPipeline.includes('stableHunterpediaImageUrl') && mediaPipeline.includes('readWebpDimensions'), 'shared media pipeline is incomplete');

console.log(`Data-schema audit passed under source policy ${SOURCE_POLICY_VERSION}: ${portraitSources.length} character sources, ${roomSources.length} Black Whale sources, ${encyclopediaRecords.length} encyclopedia records, and three search shards have explicit canonical owners.`);
