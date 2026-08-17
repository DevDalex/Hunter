import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Succession Batch 4 Nen release audit failed: ${message}`); };

const [workspace, command, layout, dossier, workflow] = await Promise.all([
  read('src/components/succession/SuccessionArchiveNenWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveNenCommand.css'),
  read('src/components/succession/SuccessionArchiveNenCommandLayout.css'),
  read('src/components/succession/SuccessionArchiveNenCommandDossier.css'),
  read('.github/workflows/succession-visual-redesign-batch-4-nen.yml'),
]);
const styles = `${command}\n${layout}\n${dossier}`;

for (const token of ['knowledgeClass','AbilityMechanicPipeline','AbilityCard','SystemCard','succession-nen-command__hero','succession-nen-command__metrics','succession-nen-command__control-deck','succession-nen-command__ability-grid','succession-nen-command__system-grid','succession-nen-command-dossier','succession-nen-command-dossier__hero','succession-nen-command-boundary','succession-nen-command-pipeline','succession-nen-command-system-architecture','Nen mechanics laboratory','Trigger → range → target → duration → cost → limitation','The archive does not convert an observer’s model into a demonstrated rule']) assert(workspace.includes(token), `Nen workspace contract is missing ${token}`);
for (const selector of ['.succession-nen-command__hero','.succession-nen-command__metrics','.succession-nen-command__control-deck','.succession-nen-command-ability','.succession-nen-command-system','.succession-nen-command-dossier__hero','.succession-nen-command-boundary','.succession-nen-command-pipeline','.succession-nen-command-mechanic-grid','.succession-nen-command-system-architecture']) assert(styles.includes(selector), `Nen visual system is missing ${selector}`);

assert(!styles.includes('@media (max-width:'), 'desktop-only Nen CSS must not carry narrow-width breakpoint layouts');
assert(!styles.includes('@media (hover: none)'), 'desktop-only Nen CSS must not carry no-hover device behavior');
assert(!styles.includes('(pointer: coarse)'), 'desktop-only Nen CSS must not carry coarse-pointer behavior');
assert(!styles.includes('touch-action:'), 'desktop-only Nen CSS must not carry touch-action rules');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'Nen reduced-motion behavior is required');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'Nen CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'Nen route-owned CSS must not depend on !important');
assertReleasedSuccessionRoutes(['nen'], assert, 'release visual manifest');
assert(workflow.includes('node scripts/audit-succession-batch-4-nen-release.mjs'), 'Nen workflow must run this audit');
assert(workflow.includes('succession/nen'), 'Nen workflow must render the Nen workspace');
console.log('Succession Batch 4 Nen release audit passed: desktop systems and abilities, knowledge-state filtering, owners and system facets, six-stage mechanic model, dedicated dossiers, chapter boundaries, and reduced motion are registered.');
