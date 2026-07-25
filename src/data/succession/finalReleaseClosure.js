export const createFinalReleaseClosure = ({
  data,
  validation,
  evidenceGraph,
  peopleClosure,
  nenSystems,
  storyIntelligence,
  productClosure,
}) => {
  const getFinalReleaseClosureReport = () => {
    const foundation = evidenceGraph.getFoundationClosureReport();
    const people = peopleClosure.getPeopleInstitutionClosureReport();
    const nen = nenSystems.getNenSystemClosureReport();
    const story = storyIntelligence.getStoryIntelligenceClosureReport();
    const product = productClosure.getProductClosureReport();
    const chapterCount = data.chapters.length;
    const latestChapter = data.chapters.at(-1)?.number || null;
    const closureReady = Boolean(
      validation.valid
      && foundation?.closureReady
      && people?.closureReady
      && nen?.closureReady
      && story?.closureReady
      && product?.closureReady
    );

    return Object.freeze({
      status: closureReady ? 'release-candidate' : 'open',
      closureReady,
      deploymentRequiredForClosedStatus: true,
      catalogue: Object.freeze({ chapterCount, latestChapter, entities: validation.stats.entities }),
      batches: Object.freeze({
        foundation: Object.freeze({ status: foundation?.closureReady ? 'closed' : 'open', report: foundation }),
        peopleAndInstitutions: Object.freeze({ status: people?.closureReady ? 'closed' : 'open', report: people }),
        nenAndRitualSystems: Object.freeze({ status: nen?.closureReady ? 'closed' : 'open', report: nen }),
        chapterAndStoryIntelligence: Object.freeze({ status: story?.closureReady ? 'closed' : 'open', report: story }),
        finalProductClosure: Object.freeze({ status: product?.closureReady ? 'release-candidate' : 'open', report: product }),
      }),
      releaseGates: Object.freeze({
        canonicalData: validation.valid,
        foundationEvidence: Boolean(foundation?.closureReady),
        peopleInstitutions: Boolean(people?.closureReady),
        nenSystems: Boolean(nen?.closureReady),
        storyIntelligence: Boolean(story?.closureReady),
        searchGlossaryMedia: Boolean(product?.closureReady),
        cloudflareDeployment: 'pending-external-build-result',
      }),
    });
  };

  return Object.freeze({ getFinalReleaseClosureReport });
};
