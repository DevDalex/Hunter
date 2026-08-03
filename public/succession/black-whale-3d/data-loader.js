(() => {
  const combinedPath = '/phase7/black-whale-3d-data.json';
  const paths = {
    charter: '/phase7/black-whale-3d-charter.json',
    analysis: '/phase7/black-whale-3d-analysis.json',
    referencesA: '/phase7/black-whale-3d-references-a.json',
    referencesB: '/phase7/black-whale-3d-references-b.json',
    corpusSummary: '/phase7/black-whale-3d-corpus-summary-342-415.json',
    corpusManifest: '/phase7/black-whale-3d-corpus-manifest-342-415.json',
    corpusLocations: '/phase7/black-whale-3d-location-registry-342-415.json',
    corpusContradictions: '/phase7/black-whale-3d-contradictions-342-415.json',
  };
  const nativeFetch = window.fetch.bind(window);
  let combinedPromise;

  const readJson = async (sourcePath) => {
    const response = await nativeFetch(sourcePath, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`${sourcePath} returned HTTP ${response.status}`);
    return response.json();
  };

  const combine = async () => {
    const [
      charter,
      analysis,
      referencesA,
      referencesB,
      corpusSummary,
      corpusManifest,
      corpusLocations,
      corpusContradictions,
    ] = await Promise.all(Object.values(paths).map(readJson));

    const readText = async (sourcePath) => {
      const response = await nativeFetch(sourcePath, { headers: { accept: 'text/plain' } });
      if (!response.ok) throw new Error(`${sourcePath} returned HTTP ${response.status}`);
      return response.text();
    };
    const readGzipBase64Json = async (sourcePath) => {
      const encoded = (await readText(sourcePath)).trim();
      const compressed = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
      const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
      return JSON.parse(await new Response(stream).text());
    };
    const [sourceCensusParts, evidenceAtomParts, evidenceAtomsRest, corpusVisuals] = await Promise.all([
      Promise.all(corpusManifest.sourceCensus.map(readJson)),
      Promise.all(corpusManifest.evidenceAtomJson.map(readJson)),
      readGzipBase64Json(corpusManifest.evidenceAtomGzipBase64),
      readGzipBase64Json(corpusManifest.visualIndexGzipBase64),
    ]);
    const sourceCensus = sourceCensusParts.flat();
    const evidenceAtomsA = evidenceAtomParts.flat();
    const evidenceAtomsB = evidenceAtomsRest;

    const rawStats = analysis.blackWhale3dReferenceStats;
    const laterRoadmap = analysis.blackWhale3dRoadmap.filter((phase) => Number(phase.id) >= 7.5);
    const roadmap = [
      {
        id: '7.0',
        title: 'Reconstruction charter',
        status: 'complete',
        summary: 'Governance, evidence classes, coordinates, source boundary, performance and accessibility contracts.',
      },
      {
        id: '7.1A',
        title: 'Initial reference ledger',
        status: 'complete',
        summary: 'The original 38-shot starter corpus is preserved as a frozen first extraction.',
      },
      {
        id: '7.1B',
        title: 'Exhaustive Hunterpedia corpus',
        status: 'complete',
        summary: 'The Chapter 342–415 source census, evidence atoms, location registry, visual index and contradiction ledger are stored and audited.',
      },
      {
        id: '7.1C',
        title: 'Repository-local full-page review',
        status: 'complete',
        summary: 'Sixty-seven Black Whale chapters received two-pass page review with hashes, panel locators, exclusions, evidence atoms and modeling permissions.',
      },
      {
        id: '7.2',
        title: 'Spatial graph',
        status: 'complete',
        summary: 'All registered identities are normalized into evidence-bounded containers and reviewed route relations without invented geometry.',
      },
      {
        id: '7.3',
        title: 'Exterior blockout',
        status: 'complete',
        summary: 'The evidence-labeled hull envelope, Tier 1 mass, cutaway views, camera presets and human-scale analytical view are released.',
      },
      {
        id: '7.3R',
        title: 'Exterior refinement',
        status: 'in-progress',
        summary: 'The placeholder hull is being replaced by a thirteen-station whale silhouette with a broad blunt head, paired diagrammatic identity markers, refined back, belly and rear contours, improved Tier 1 integration and analytical water context.',
      },
      {
        id: '7.4',
        title: 'Tier blockout',
        status: 'complete',
        summary: 'The five tier macro-volumes, interstitial bands, unknown-space views and analytical controls are merged, deployed and confirmed live.',
      },
      ...laterRoadmap,
    ];

    return {
      ...charter,
      ...analysis,
      blackWhale3dCoordinateSystem: {
        ...charter.blackWhale3dCoordinateSystem,
        unit: charter.blackWhale3dCoordinateSystem.units,
      },
      blackWhale3dReferenceStats: {
        ...rawStats,
        totalShots: rawStats.shots,
        exactImageSources: rawStats.exactFileSources,
      },
      blackWhale3dReferenceIssues: analysis.blackWhale3dReferenceIssues.map((issue) => ({
        ...issue,
        title: issue.subject,
        summary: issue.observation,
      })),
      blackWhale3dReferenceGaps: analysis.blackWhale3dReferenceGaps.map((gap) => ({
        ...gap,
        title: gap.subject,
        need: gap.reason,
        blocks: [
          gap.priority === 'critical' ? 'Canonical spatial graph or traversal' : 'Detailed reconstruction confidence',
          'Evidence-backed Phase 7 production',
        ],
      })),
      blackWhale3dArchitecturalMotifs: analysis.blackWhale3dArchitecturalMotifs.map((motif) => ({
        ...motif,
        referenceIds: motif.supportingShotKeys,
      })),
      blackWhale3dReferenceShots: [...referencesA, ...referencesB],
      blackWhale3dCorpusSummary: corpusSummary,
      blackWhale3dSourceCensus: sourceCensus,
      blackWhale3dEvidenceAtoms: [...evidenceAtomsA, ...evidenceAtomsB],
      blackWhale3dCorpusLocations: corpusLocations,
      blackWhale3dCorpusVisuals: corpusVisuals,
      blackWhale3dCorpusContradictions: corpusContradictions,
      blackWhale3dRoadmap: roadmap,
      blackWhale3dProgressStats: {
        completedStages: 7,
        totalStages: roadmap.length,
        programmePercent: null,
        programmeLabel: 'EXTERIOR REFINEMENT ACTIVE',
        productionGeometryPercent: null,
        activeStage: '7.3R',
        nextStage: '7.3R silhouette validation and release',
        blockedStage: '7.5',
      },
    };
  };

  window.fetch = async (input, init) => {
    let url;
    try {
      url = new URL(typeof input === 'string' ? input : input.url, window.location.href);
    } catch {
      return nativeFetch(input, init);
    }
    if (url.pathname !== combinedPath) return nativeFetch(input, init);
    combinedPromise ||= combine();
    try {
      const payload = await combinedPromise;
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        },
      });
    } catch (error) {
      combinedPromise = null;
      return new Response(JSON.stringify({ error: error.message }), {
        status: 502,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }
  };
})();
