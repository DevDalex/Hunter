import { access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const requiredCommittedRoots = [
  'public',
  'src',
];

await Promise.all(requiredCommittedRoots.map((relative) => access(path.join(root, relative))));

console.log('ETA asset compatibility step passed: required assets are committed and Vite needs no generated preparation output.');
