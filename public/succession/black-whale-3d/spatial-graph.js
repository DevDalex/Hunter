const escapeGraphHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const graphTitle = (value = '') => String(value).replace(/^bw3d\.(container|node|route)\./, '').replaceAll('-', ' ').replace(/\b\w/g, (character) => character.toUpperCase());

const readGraphJson = async (path) => {
  const response = await fetch(path, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return response.json();
};

const renderSpatialGraph = async () => {
  const [graph, routeReview, migration] = await Promise.all([
    readGraphJson('/phase7/black-whale-3d-spatial-graph.json'),
    readGraphJson('/phase7/black-whale-3d-route-review.json'),
    readGraphJson('/phase7/black-whale-3d-quarantine-migration.json'),
  ]);

  const app = document.querySelector('#app');
  const status = document.querySelector('#status');
  if (!app || !status || document.querySelector('#spatial-graph')) return;

  const authorized = routeReview.routes.filter((route) => route.outcome === 'authorized-physical-connection');
  const blocked = routeReview.routes.filter((route) => route.outcome !== 'authorized-physical-connection');
  const section = document.createElement('section');
  section.className = 'section';
  section.id = 'spatial-graph';
  section.innerHTML = `
    <header class="section__head">
      <div><p class="kicker">Phase 7.2 · Spatial graph</p><h2>Evidence-backed topology, not a floor plan</h2></div>
      <p>Every registry identity is contained, every route is reviewed, and unknown intermediate space remains unavailable to navigation.</p>
    </header>
    <div class="stats-grid">
      <div class="stat"><strong>${graph.containers.length}</strong><span>Graph containers</span></div>
      <div class="stat"><strong>${routeReview.summary.registeredRoutes}</strong><span>Routes reviewed</span></div>
      <div class="stat"><strong>${routeReview.summary.authorizedPhysicalRoutes}</strong><span>Physical links authorized</span></div>
      <div class="stat"><strong>${migration.openSourceRecords}</strong><span>Open records carried forward</span></div>
    </div>
    <aside class="next-callout"><div><p class="kicker">Topology rule</p><h2>Containment is not adjacency</h2><p>Shared tier membership never proves neighboring rooms, coordinates, route shape, distance, width, height, or a navigable path.</p></div><strong>7.2</strong></aside>
    <details class="panel" open>
      <summary><strong>Authorized physical connections</strong></summary>
      <div class="issue-grid">${authorized.map((route) => `
        <article class="issue-card complete">
          <div class="card-top"><span class="status complete">physical link</span><code>${escapeGraphHtml(route.routeId)}</code></div>
          <h3>${escapeGraphHtml(graphTitle(route.from))} ↔ ${escapeGraphHtml(graphTitle(route.to))}</h3>
          <p>${escapeGraphHtml(route.limitations.join(' '))}</p>
          <strong>Traversal existence only · geometry prohibited</strong>
        </article>`).join('')}</div>
    </details>
    <details class="panel">
      <summary><strong>Nonphysical and quarantined route records</strong></summary>
      <div class="issue-grid">${blocked.map((route) => `
        <article class="issue-card open">
          <div class="card-top"><span class="status open">${escapeGraphHtml(route.outcome)}</span><code>${escapeGraphHtml(route.routeId)}</code></div>
          <h3>${escapeGraphHtml(graphTitle(route.routeId))}</h3>
          <p>${escapeGraphHtml(route.limitations.join(' '))}</p>
          <strong>Traversal and geometry prohibited</strong>
        </article>`).join('')}</div>
    </details>
    <details class="panel">
      <summary><strong>Containers and unknown-space policy</strong></summary>
      <div class="issue-grid">${graph.containers.map((container) => `
        <article class="issue-card ${container.kind === 'quarantine' ? 'open' : 'complete'}">
          <div class="card-top"><span class="status ${container.kind === 'quarantine' ? 'open' : 'complete'}">${escapeGraphHtml(container.kind)}</span><code>${escapeGraphHtml(container.id)}</code></div>
          <h3>${escapeGraphHtml(container.label)}</h3>
          <p>${escapeGraphHtml(container.certainty)}</p>
        </article>`).join('')}</div>
    </details>`;

  status.insertAdjacentElement('afterend', section);
  const nav = document.querySelector('.section-nav');
  if (nav && !nav.querySelector('a[href="#spatial-graph"]')) {
    const link = document.createElement('a');
    link.href = '#spatial-graph';
    link.textContent = '7.2 Graph';
    nav.insertBefore(link, nav.querySelector('a[href="#roadmap"]'));
  }
};

const scheduleSpatialGraph = () => window.setTimeout(() => renderSpatialGraph().catch((error) => {
  console.error('Phase 7.2 spatial graph dashboard failed:', error);
}), 0);

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleSpatialGraph, { once: true });
else scheduleSpatialGraph();
