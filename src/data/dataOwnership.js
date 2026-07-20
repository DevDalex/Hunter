export const dataOwnership = Object.freeze({
  characterPortraits: Object.freeze({
    key: 'name',
    canonical: 'src/data/characters.js#characterPortraitSources',
    derivative: 'src/data/priorityMedia.generated.js#priorityPortraits',
    generator: 'scripts/stabilize-media.mjs',
    publicDirectory: 'public/media/portraits',
    consumers: Object.freeze([
      'src/components/NenEncyclopedia.jsx',
      'src/components/PreSuccessionExperience.jsx',
      'src/components/PreSuccessionOverview.jsx',
      'src/data/characters.js',
    ]),
  }),
  blackWhaleRooms: Object.freeze({
    key: 'key',
    canonical: 'src/data/blackWhale.js#blackWhaleRemoteImageSources',
    derivative: 'src/data/blackWhaleMedia.generated.js#blackWhaleRoomMedia',
    generator: 'scripts/stabilize-room-media.mjs',
    publicDirectory: 'public/media/rooms',
    consumers: Object.freeze([
      'src/data/blackWhale.js',
    ]),
  }),
  archiveSearch: Object.freeze({
    canonical: 'src/data/* domain records',
    derivative: 'runtime-only normalized search records',
    generator: 'src/data/archiveSearch.js',
    shards: Object.freeze([
      'src/data/archiveSearch.series.js',
      'src/data/archiveSearch.succession.js',
      'src/data/archiveSearch.reference.js',
    ]),
  }),
});

export const generatedDataFiles = Object.freeze([
  'src/data/priorityMedia.generated.js',
  'src/data/blackWhaleMedia.generated.js',
]);
