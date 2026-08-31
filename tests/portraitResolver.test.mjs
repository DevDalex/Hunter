import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hunterpediaStaticFileUrl,
  md5Hex,
  staticFileCandidates,
} from '../server/index.js';

test('portrait resolver hashes MediaWiki filenames exactly', () => {
  assert.equal(md5Hex('Anzel_SC_Portrait.png'), '56b34060ab710103499f44cf37b413e3');
  assert.equal(md5Hex('Kōbihi_SC_Portrait.png'), '49e8ff3f08bb0778b45d3e41c43373d0');
  assert.equal(
    md5Hex("Benjamin's_Personal_Guard_14_SC_Portrait.png"),
    '2984a7871b643adcce73e85ce6bc7fd0',
  );
});

test('portrait resolver constructs Fandom static CDN URLs without MediaWiki API discovery', () => {
  assert.equal(
    hunterpediaStaticFileUrl('Anzel SC Portrait.png'),
    'https://static.wikia.nocookie.net/hunterxhunter/images/5/56/Anzel_SC_Portrait.png/revision/latest?format=original',
  );
});

test('portrait resolver has design fallbacks for characters without an arc portrait', () => {
  assert.deepEqual(
    staticFileCandidates('Kalluto Zoldyck SC Portrait.png', 'Kalluto Zoldyck').slice(0, 4),
    [
      'Kalluto Zoldyck SC Portrait.png',
      'Kalluto Zoldyck 2011 Design.png',
      'Kalluto 2011 Design.png',
      'Kalluto Chimera Ant Arc 2011 Design.png',
    ],
  );
});
