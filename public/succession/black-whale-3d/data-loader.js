(() => {
  const combinedPath = '/phase7/black-whale-3d-data.json';
  const sourcePaths = [
    '/phase7/black-whale-3d-charter.json',
    '/phase7/black-whale-3d-analysis.json',
    '/phase7/black-whale-3d-references-a.json',
    '/phase7/black-whale-3d-references-b.json',
  ];
  const nativeFetch = window.fetch.bind(window);
  let combinedPromise;

  const readJson = async (path) => {
    const response = await nativeFetch(path, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
    return response.json();
  };

  const combine = async () => {
    const [charter, analysis, referencesA, referencesB] = await Promise.all(sourcePaths.map(readJson));
    const rawStats = analysis.blackWhale3dReferenceStats;
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
