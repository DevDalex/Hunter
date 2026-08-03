const waitFor = (selector, timeout = 12000) => new Promise((resolve, reject) => {
  const existing = document.querySelector(selector);
  if (existing) return resolve(existing);
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (!element) return;
    observer.disconnect();
    resolve(element);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => {
    observer.disconnect();
    reject(new Error(`Timed out waiting for ${selector}`));
  }, timeout);
});

const ensureModule = async (selector, modulePath) => {
  if (!document.querySelector(selector)) {
    await import(`${modulePath}?dashboard-stable=1`);
  }
  return waitFor(selector);
};

const stabilizeViewers = async () => {
  await waitFor('#status');
  const visuals = document.querySelector('#visuals');
  if (!visuals) throw new Error('Stable #visuals mount is missing.');

  await ensureModule('#spatial-graph', '/succession/black-whale-3d/spatial-graph.js');
  const exterior = await ensureModule('#exterior-blockout', '/succession/black-whale-3d/exterior-blockout.js');
  const tier = await ensureModule('#tier-blockout', '/succession/black-whale-3d/tier-blockout.js');

  if (!exterior.querySelector('[data-view="scale"]')) {
    await import('/succession/black-whale-3d/exterior-scale-reference.js?dashboard-stable=1');
    await waitFor('#exterior-blockout [data-view="scale"]');
  }

  visuals.append(exterior, tier);
  document.documentElement.dataset.blackWhaleViewers = 'stable';
};

stabilizeViewers().catch((error) => {
  console.error('Black Whale analytical viewer stabilization failed:', error);
  document.documentElement.dataset.blackWhaleViewers = 'failed';
});
