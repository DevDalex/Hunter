import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession content depth P0 audit failed: ${message}`);
};
const byId = (records = []) => new Map(records.map((record) => [record.id, record]));

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archive, mysteryModule, storyDepthModule, storyCorrections] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/successionMysteryCases.js'),
    vite.ssrLoadModule('/src/data/succession/contentDepthStory418.js'),
    vite.ssrLoadModule('/src/data/succession/storyIntelligenceCorrections.js'),
  ]);
  const { successionArchiveData, successionArchiveValidation } = archive;
  const { successionMysteryCases } = mysteryModule;
  const { contentDepthCurrentPhaseThreadIds418, contentDepthStoryThreads418 } = storyDepthModule;
  const { correctedStoryPhaseProfiles, correctedStoryThreadProfiles } = storyCorrections;

  assert(successionArchiveValidation.valid, `canonical validation failed: ${successionArchiveValidation.errors.join(' | ')}`);
  assert(successionArchiveData.contentDepthVersion === 'content-depth-418-v1', 'content depth version is not active at Chapter 418');

  const knowledge = byId(successionArchiveData.knowledgeRecords);
  for (const id of [
    'knowledge-record:room-1004-reality-test',
    'knowledge-record:benjamin-layered-affliction',
    'knowledge-record:room-1001-tsk17-exposure',
    'knowledge-record:camilla-secret-window-surveillance',
    'knowledge-record:zhang-lei-coin-value10',
    'knowledge-record:halkenburg-feather-marker',
    'knowledge-record:gypsy-life-host-transfer',
    'knowledge-record:first-unit-reactivation',
    'knowledge-record:benjamin-unma-plan',
  ]) assert(knowledge.has(id), `missing ${id}`);
  const martialKnowledge = knowledge.get('knowledge-record:special-martial-law');
  assert(martialKnowledge?.chapterRange?.start === 415, 'formal Special Martial Law knowledge must begin at Chapter 415');
  assert(martialKnowledge?.publicAtChapter === 415, 'formal Special Martial Law public boundary must be Chapter 415');

  const protocols = byId(successionArchiveData.protocolRecords);
  for (const id of [
    'protocol:combo-master-curse-analysis-windows',
    'protocol:hell-fruit-post-mortem-trigger',
    'protocol:tsk17-airborne-exposure',
    'protocol:first-unit-reactivation',
    'protocol:halkenburg-feather-screening',
    'protocol:gypsy-life-host-transfer',
  ]) assert(protocols.has(id), `missing ${id}`);
  assert(protocols.get('protocol:special-martial-law-order')?.chapterRange?.start === 415, 'formal Special Martial Law protocol must begin at Chapter 415');
  assert((protocols.get('protocol:justice-custody-investigation')?.sourceIds || []).includes('source:chapter-417'), 'Justice protocol must include Chapter 417');

  const objects = byId(successionArchiveData.objects);
  const tsk17 = objects.get('object:tsk-17');
  assert(tsk17?.sourceIds?.includes('source:chapter-417'), 'TSK-17 object history must reach Chapter 417');
  assert(tsk17?.chainOfCustody?.some((entry) => entry.chapter === 417), 'TSK-17 custody must include the Room 1001 second-dose operation');
  const coins = objects.get('object:zhang-lei-coins');
  assert(coins?.sourceIds?.includes('source:chapter-417'), 'Zhang Lei coin history must reach value-10 Chapter 417 evidence');

  const documents = byId(successionArchiveData.documents);
  for (const id of [
    'document:ch415-coded-postcard',
    'document:special-martial-law-declaration',
    'document:justice-detention-order-417',
    'document:first-unit-reactivation-order-417',
    'document:zhang-lei-coin-report-417',
  ]) assert(documents.has(id), `missing ${id}`);

  const evidence = byId(successionArchiveData.evidenceItems);
  for (const id of [
    'evidence-item:room-1004-reality-test',
    'evidence-item:benjamin-affliction-disclosure',
    'evidence-item:tsk-17-operation-chain',
    'evidence-item:camilla-secret-window-surveillance',
    'evidence-item:halkenburg-feather-investigation',
    'evidence-item:gypsy-life-mechanics',
    'evidence-item:justice-takeover-first-unit',
    'evidence-item:zhang-lei-coin-value10',
    'evidence-item:unma-halkenburg-publication-endpoint',
  ]) assert(evidence.has(id), `missing ${id}`);
  assert(evidence.get('evidence-item:unma-halkenburg-publication-endpoint')?.chapterRange?.start === 417, 'Chapter 417 Unma/Halkenburg evidence must remain historically Chapter 417-bounded');

  assert(successionArchiveData.editorialChangeLog?.version === 'content-depth-418-v1', 'editorial log version must advance with the Chapter 418 integration');
  assert((successionArchiveData.editorialChangeLog?.entries || []).some((entry) => entry.id === 'change:content-depth-417-p0'), 'editorial log must retain the Chapter 417 content-depth P0 expansion');

  assert(successionMysteryCases.length >= 19, `expected at least 19 mystery cases, found ${successionMysteryCases.length}`);
  for (const record of successionMysteryCases) {
    assert(record.id.startsWith('mystery-case:'), `${record.id} must use the mystery-case namespace`);
    assert(record.firstChapter <= 418 && record.latestChapter <= 418, `${record.id} leaks beyond Chapter 418`);
    assert(record.knownFacts.length > 0, `${record.id} needs known facts`);
    assert(record.unknowns.length > 0, `${record.id} needs explicit unknowns`);
    assert(record.candidates.length > 0, `${record.id} needs competing or bounded candidate explanations`);
    assert(record.sourceIds.length > 0, `${record.id} needs chapter sources`);
  }

  const depthThreads = Object.values(contentDepthStoryThreads418);
  assert(depthThreads.length === 14, `expected 14 current-release depth threads through 418, found ${depthThreads.length}`);
  for (const thread of depthThreads) {
    assert(correctedStoryThreadProfiles[thread.id], `${thread.id} is not exposed through Story Intelligence`);
    assert(thread.chapterRange.start <= 418, `${thread.id} starts beyond the publication boundary`);
  }
  const currentPhase = correctedStoryPhaseProfiles['story-phase:current-releases-414-418'];
  assert(currentPhase, 'current Chapter 414–418 Story phase is missing');
  for (const id of contentDepthCurrentPhaseThreadIds418) assert(currentPhase.threadIds.includes(id), `${id} is not linked to the current-release phase`);
  assert(correctedStoryThreadProfiles['story-thread:tserriednich-room1004-reality']?.resolutionChapter === 418, 'Room 1004 reality thread must resolve in Chapter 418');
  assert(correctedStoryThreadProfiles['story-thread:tserriednich-route-a-escape']?.status === 'open', 'Route A escape thread must remain open at the Chapter 418 ceiling');

  const [appSource, caseWorkbenchSource] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveApp.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryCaseWorkbench.jsx'), 'utf8'),
  ]);
  assert(appSource.includes("import SuccessionMysteryCaseWorkbench from './SuccessionMysteryCaseWorkbench';"), 'Research app does not import the mystery case workbench');
  assert(appSource.includes('<SuccessionMysteryCaseWorkbench'), 'Research route does not render mystery cases');
  assert(appSource.includes("routeParams.mode !== 'cases'"), 'Research route does not isolate full case mode from the legacy intelligence overview');
  assert(caseWorkbenchSource.includes("mode: 'cases'"), 'case workbench does not expose a stable Research deep link');
  assert(caseWorkbenchSource.includes('Evidence for') && caseWorkbenchSource.includes('Evidence against / limits'), 'case detail does not render evidence for/against');

  console.log(`Succession content depth P0 audit passed: ${successionArchiveValidation.stats.knowledgeRecords} knowledge records, ${successionArchiveValidation.stats.protocols} protocols, ${successionArchiveValidation.stats.objects} objects, ${successionArchiveValidation.stats.documents} documents, ${successionArchiveValidation.stats.evidenceItems} evidence items, ${successionMysteryCases.length} mystery case files, and ${depthThreads.length} current-release Story threads through Chapter 418.`);
} finally {
  await vite.close();
}
