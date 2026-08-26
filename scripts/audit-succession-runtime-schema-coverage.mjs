import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession runtime schema coverage audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archive, coverageModule, registries] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/runtimeSchemaCoverage.js'),
    vite.ssrLoadModule('/src/data/succession/registries.js'),
  ]);
  const coverage = coverageModule.getSuccessionRuntimeSchemaCoverage(archive.successionArchiveData);
  assert(coverage.valid, 'coverage registry does not match registered/runtime entity types');
  assert(coverage.version === 'runtime-schema-v1', `unexpected schema coverage version ${coverage.version}`);
  assert(coverage.registeredTypes.length === registries.ENTITY_TYPE_VALUES.length, 'registered type count drifted');
  assert(coverage.coveredTypes.length === registries.ENTITY_TYPE_VALUES.length, 'not every registered entity type is covered');
  assert(coverage.missingRegisteredTypes.length === 0, `registered types lack runtime schema families: ${coverage.missingRegisteredTypes.join(', ')}`);
  assert(coverage.uncoveredDataTypes.length === 0, `runtime data types lack schema coverage: ${coverage.uncoveredDataTypes.join(', ')}`);
  assert(coverage.unknownDataTypes.length === 0, `runtime data contains unregistered types: ${coverage.unknownDataTypes.join(', ')}`);
  assert(archive.successionArchiveValidation.runtimeSchemaCoverage?.valid, 'top-level archive validation is not enforcing schema coverage');
  assert(archive.successionArchiveValidation.stats.runtimeSchemaTypes === registries.ENTITY_TYPE_VALUES.length, 'archive validation stats do not publish the full schema type count');
  for (const type of registries.ENTITY_TYPE_VALUES) {
    assert(coverageModule.successionRuntimeSchemaTypeToFamily[type], `${type} has no schema family`);
    assert(Number.isInteger(coverage.counts[type]), `${type} has no runtime count`);
  }
  console.log(`Succession runtime schema coverage passed: ${coverage.coveredTypes.length} registered entity types are assigned to explicit runtime validator families (${Object.entries(coverageModule.successionRuntimeSchemaFamilies).map(([family, types]) => `${family}=${types.length}`).join(', ')}).`);
} finally {
  await vite.close();
}
