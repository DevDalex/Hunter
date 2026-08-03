const waitForDashboard = () => new Promise((resolve, reject) => {
  const started = performance.now();
  const check = () => {
    if (document.querySelector('#status')) return resolve();
    if (performance.now() - started > 15000) return reject(new Error('Phase 7 dashboard did not finish rendering.'));
    window.setTimeout(check, 50);
  };
  check();
});

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
