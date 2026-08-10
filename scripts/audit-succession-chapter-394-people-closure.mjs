import { createServer } from 'vite';

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const report = archive.getPeopleInstitutionClosureReport();
  if (!report?.closureReady || report.status !== 'closed') {
    const compact = {
      chapter: report?.chapter,
      status: report?.status,
      characters: report?.characters,
      organizations: report?.organizations,
      priorityCharacterGaps: (report?.gaps?.priorityCharacterGaps || []).map((record) => ({ id: record.entity?.id, roleLayer: record.roleLayer })),
      stateIntegrityIssues: report?.stateIntegrityIssues || [],
      invalidCharacters: (report?.invalidCharacters || []).map((record) => ({ id: record.entity?.id, issues: record.issues })),
      invalidOrganizations: (report?.invalidOrganizations || []).map((record) => ({ id: record.entity?.id, issues: record.issues })),
    };
    console.error('Chapter 394 people/institution closure diagnostic:');
    console.error(JSON.stringify(compact, null, 2));
    throw new Error('Chapter 394 integration must preserve people and institution closure');
  }
  console.log(`Chapter 394 people/institution closure audit passed: ${report.characters.total} characters and ${report.organizations.total} organizations remain closed at Chapter ${report.chapter}.`);
} finally {
  await vite.close();
}
