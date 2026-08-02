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

  const readJson = async (path) => {
    const response = await nativeFetch(path, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
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

    const readText = async (path) => {
      const response = await nativeFetch(path, { headers: { accept: 'text/plain' } });
      if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
      return response.text();
    };
    const readGzipBase64Json = async (path) => {
      const encoded = (await readText(path)).trim();
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
    const legacyFuture = analysis.blackWhale3dRoadmap.filter((phase) => Number(phase.id) >= 7.2);
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
        status: 'in-progress',
        summary: 'Every chapter slot from 342 through 415 is registered; 342–411 are reviewed, 412–415 are explicitly unavailable, and the atomic corpus awaits discussion and a second pass.',
      },
      ...legacyFuture.map((phase) => phase.id === '7.2'
        ? { ...phase, status: 'blocked', summary: 'Blocked until the exhaustive corpus is discussed, corrected, independently rechecked and frozen.' }
        : phase),
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
        completedStages: 1,
        totalStages: roadmap.length,
        programmePercent: null,
        programmeLabel: 'RESEARCH OPEN',
        productionGeometryPercent: 0,
        activeStage: '7.1B',
        nextStage: '7.1B discussion and second pass',
        blockedStage: '7.2',
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
