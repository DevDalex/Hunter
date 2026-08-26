import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Succession Batch 4 Guardian Beast audit failed: ${message}`); };

const [workspace, command, layout, dossier, workflow, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveGuardianBeastWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveGuardianBeastCommand.css'),
  read('src/components/succession/SuccessionArchiveGuardianBeastCommandLayout.css'),
  read('src/components/succession/SuccessionArchiveGuardianBeastCommandDossier.css'),
  read('.github/workflows/succession-visual-redesign-batch-4-guardian-beasts.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-4-GUARDIAN-BEASTS.md'),
]);
const styles = `${command}\n${layout}\n${dossier}`;

for (const token of ['knowledgeClass','hostStateClass','BeastOrbit','BeastCard','succession-gsb-command__hero','succession-gsb-command__metrics','succession-gsb-command-orbit','succession-gsb-command__controls','succession-gsb-command-card','succession-gsb-command-dossier','succession-gsb-command-separation','succession-gsb-command-timeline','succession-gsb-command-systems','Host body, host consciousness, beast activity, and Nen continuation','Host first','Beast first']) assert(workspace.includes(token), `workspace contract is missing ${token}`);
for (const selector of ['.succession-gsb-command__hero','.succession-gsb-command__metrics','.succession-gsb-command-orbit','.succession-gsb-command__controls','.succession-gsb-command-card','.succession-gsb-command-dossier__hero','.succession-gsb-command-separation','.succession-gsb-command-dossier__columns','.succession-gsb-command-timeline','.succession-gsb-command-systems','.succession-gsb-command-sources']) assert(styles.includes(selector), `visual system is missing ${selector}`);

assert(!styles.includes('@media (max-width:'), 'desktop-only Guardian Beast CSS must not carry narrow-width breakpoint layouts');
assert(!styles.includes('@media (hover: none)'), 'desktop-only Guardian Beast CSS must not carry no-hover device behavior');
assert(!styles.includes('(pointer: coarse)'), 'desktop-only Guardian Beast CSS must not carry coarse-pointer behavior');
assert(!styles.includes('touch-action:'), 'desktop-only Guardian Beast CSS must not carry touch-action rules');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion behavior is required');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'route-owned CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'route-owned CSS must not depend on !important');
assertReleasedSuccessionRoutes(['guardian-spirit-beasts'], assert, 'release visual manifest');
assert(workflow.includes('node scripts/audit-succession-batch-4-guardian-beasts.mjs'), 'workflow must run the Guardian Beast audit');
assert(workflow.includes('succession/guardian-spirit-beasts'), 'workflow must render the Guardian Beast workspace');
assert(docs.includes('Hour 49'), 'design record must document Hour 49');
console.log('Succession Batch 4 Guardian Beast audit passed: desktop host index, knowledge and host-state filters, host/beast browsing, body-consciousness-Nen separation, mechanics, unresolved questions, knowledge history, ritual-system links, evidence, and reduced motion are registered.');
