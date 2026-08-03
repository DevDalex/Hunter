const waitForSelector = (selector, label, timeout = 30000) => new Promise((resolve, reject) => {
  const started = performance.now();
  const check = () => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);
    if (performance.now() - started > timeout) return reject(new Error(`${label} did not finish rendering.`));
    window.setTimeout(check, 50);
  };
  check();
});

const moveVisualSections = () => {
  const visualRoot = document.querySelector('#visual-app');
  if (!visualRoot) throw new Error('Persistent Phase 7 visual mount is missing.');
  for (const selector of ['#spatial-graph', '#exterior-blockout', '#tier-blockout']) {
    const section = document.querySelector(selector);
    if (!section) throw new Error(`Cannot move missing viewer ${selector}.`);
    if (section.parentElement !== visualRoot) visualRoot.append(section);
  }
};

const mountVisualProgramme = async () => {
  await waitForSelector('#status', 'Phase 7 evidence dashboard');

  await import('/succession/black-whale-3d/spatial-graph.js');
  await waitForSelector('#spatial-graph', 'Phase 7.2 spatial graph');

  await import('/succession/black-whale-3d/exterior-blockout.js');
  await waitForSelector('#exterior-blockout', 'Phase 7.3R exterior refinement');

  await import('/succession/black-whale-3d/exterior-scale-reference.js');
  await waitForSelector('#exterior-blockout [data-view="scale"]', 'Phase 7.3 human-scale control');

  await import('/succession/black-whale-3d/tier-blockout.js');
  await waitForSelector('#tier-blockout', 'Phase 7.4 tier blockout');

  moveVisualSections();
  const visualRoot = document.querySelector('#visual-app');
  for (const selector of ['#spatial-graph', '#exterior-blockout', '#tier-blockout']) {
    const section = document.querySelector(selector);
    if (section?.parentElement !== visualRoot) throw new Error(`${selector} is not retained by the persistent visual mount.`);
  }
};

mountVisualProgramme().catch((error) => console.error('Black Whale visual programme failed', error));
