import { createServer } from 'vite';

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const report = archive.getPeopleInstitutionClosureReport();
  console.log('PEOPLE_INSTITUTION_CLOSURE_DIAGNOSTIC');
  console.log(JSON.stringify({
    status: report?.status,
    closureReady: report?.closureReady,
    stateIntegrityIssues: report?.stateIntegrityIssues,
    priorityCharacterGaps: report?.gaps?.priorityCharacterGaps?.map((record) => ({ id: record.entity?.id, name: record.entity?.name, roleLayer: record.roleLayer })),
    invalidCharacters: report?.invalidCharacters?.map((record) => ({ id: record.entity?.id, name: record.entity?.name, issues: record.issues })),
    invalidOrganizations: report?.invalidOrganizations?.map((record) => ({ id: record.entity?.id, name: record.entity?.name, issues: record.issues })),
  }, null, 2));
} finally {
  await vite.close();
}
