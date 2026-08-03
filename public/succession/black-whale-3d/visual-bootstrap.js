const waitForDashboard = () => new Promise((resolve, reject) => {
  const started = performance.now();
  const check = () => {
    if (document.querySelector('#status')) return resolve();
    if (performance.now() - started > 15000) return reject(new Error('Phase 7 dashboard did not finish rendering.'));
    window.setTimeout(check, 50);
  };
  check();
});

const refreshDashboardCopy = () => {
  const statusHead = document.querySelector('#status .section__head');
  if (statusHead) {
    statusHead.querySelector('.kicker')?.replaceChildren('Current programme state');
    statusHead.querySelector('h2')?.replaceChildren('Research foundation complete. Tier blockout merged.');
    statusHead.querySelector(':scope > p')?.replaceChildren('Phases 7.0 through 7.3 are complete. Phase 7.4 is merged and undergoing final live-dashboard verification; Phase 7.5 remains blocked.');
  }
  const statusTitle = document.querySelector('#status .status-board h3');
  if (statusTitle) statusTitle.textContent = 'Phase 7.4 is active';
  const statusText = document.querySelector('#status .status-board p');
  if (statusText) statusText.textContent = 'The site now exposes the evidence corpus, spatial graph, exterior blockout and five-tier analytical blockout without treating working geometry as canon.';

  const corpusHead = document.querySelector('#corpus .section__head');
  if (corpusHead) {
    corpusHead.querySelector('.kicker')?.replaceChildren('Phases 7.1B and 7.1C · Complete');
    corpusHead.querySelector('h2')?.replaceChildren('Exhaustive corpus and repository-local full-page review');
    corpusHead.querySelector(':scope > p')?.replaceChildren('The Chapter 342–415 corpus is stored, and all scheduled Black Whale chapters were reviewed twice with source hashes, panel locators, exclusions, evidence atoms and modeling safeguards.');
  }
  const callout = document.querySelector('#corpus .next-callout');
  if (callout) {
    callout.querySelector('.kicker')?.replaceChildren('Research gate complete');
    callout.querySelector('h2')?.replaceChildren('Phase 7.2 spatial graph released');
    callout.querySelector('p')?.replaceChildren('The frozen corpus now feeds the evidence-bounded spatial graph while contradictions and unknown space remain quarantined.');
    callout.querySelector(':scope > strong')?.replaceChildren('7.1C');
  }
};

const moveVisualSections = () => {
  const visualRoot = document.querySelector('#visual-app');
  if (!visualRoot) return;
  for (const selector of ['#spatial-graph', '#exterior-blockout', '#tier-blockout']) {
    const section = document.querySelector(selector);
    if (section && section.parentElement !== visualRoot) visualRoot.append(section);
  }
};

const mountVisualProgramme = async () => {
  await waitForDashboard();
  refreshDashboardCopy();
  await import('/succession/black-whale-3d/spatial-graph.js');
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  await import('/succession/black-whale-3d/exterior-blockout.js');
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  await import('/succession/black-whale-3d/exterior-scale-reference.js');
  await import('/succession/black-whale-3d/tier-blockout.js');
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  moveVisualSections();

  const required = ['#spatial-graph', '#exterior-blockout', '#tier-blockout'];
  const missing = required.filter((selector) => !document.querySelector(selector));
  if (missing.length) throw new Error(`Missing Phase 7 viewers: ${missing.join(', ')}`);
};

mountVisualProgramme().catch((error) => console.error('Black Whale visual programme failed', error));
