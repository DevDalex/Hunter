const loadTierBlockout = async () => {
  const response = await fetch('/phase7/black-whale-3d-tier-blockout.json');
  if (!response.ok) throw new Error(`Tier blockout contract HTTP ${response.status}`);
  return response.json();
};

const makeTierSection = (data) => {
  const section = document.createElement('section');
  section.id = 'tier-blockout';
  section.className = 'section tier-blockout';
  section.innerHTML = `
    <header class="section__head">
      <div><p class="kicker">Phase 7.4 · Tier blockout</p><h2>Five macro-volumes, with unknown space preserved</h2></div>
      <p>Inspect broad tier envelopes and interstitial bands. These forms authorize neither rooms, routes, deck counts, nor exact metric boundaries.</p>
    </header>
    <div class="tier-layout">
      <div class="tier-stage">
        <canvas id="tier-canvas" width="1200" height="760" tabindex="0" aria-label="Interactive Black Whale five-tier macro-volume blockout"></canvas>
        <span>Diagrammatic volumes · not literal decks</span>
      </div>
      <aside class="tier-controls">
        <div class="button-row tier-view-buttons">
          <button type="button" data-tier-view="section">Section</button>
          <button type="button" data-tier-view="exploded">Exploded</button>
          <button type="button" data-tier-view="hull">Hull context</button>
          <button type="button" data-tier-view="unknown">Unknown space</button>
        </div>
        <label for="tier-select">Selected tier</label>
        <select id="tier-select">
          <option value="all">All tiers</option>
          ${data.tierVolumes.map((tier, index) => `<option value="${tier.id}">Tier ${index + 1}</option>`).join('')}
        </select>
        <label><input id="tier-interstitial-toggle" type="checkbox" checked> Interstitial bands</label>
        <label><input id="tier-hull-toggle" type="checkbox" checked> Hull context</label>
        <article id="tier-evidence" class="tier-evidence" aria-live="polite"></article>
        <p>Drag or use arrow keys to rotate. Use +/− to zoom. Press E for exploded view and I to toggle interstitial bands.</p>
      </aside>
    </div>`;
  return section;
};

const startTierRenderer = (canvas, data) => {
  const ctx = canvas.getContext('2d');
  const state = { yaw: -0.35, pitch: -0.12, zoom: 1, view: 'section', selected: 'all', interstitial: true, hull: true, drag: false, x: 0, y: 0 };
  const tiers = [
    { id: 'bw3d.tier.1', y: 2.75, w: 4.6, h: 0.8, d: 5.4 },
    { id: 'bw3d.tier.2', y: 1.55, w: 6.2, h: 0.78, d: 6.6 },
    { id: 'bw3d.tier.3', y: 0.35, w: 7.0, h: 0.8, d: 7.3 },
    { id: 'bw3d.tier.4', y: -0.9, w: 7.3, h: 0.86, d: 7.6 },
    { id: 'bw3d.tier.5', y: -2.2, w: 6.8, h: 0.95, d: 7.1 }
  ];
  const rotate = ([x, y, z]) => {
    const cy = Math.cos(state.yaw), sy = Math.sin(state.yaw), cp = Math.cos(state.pitch), sp = Math.sin(state.pitch);
    const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
    return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
  };
  const project = (point) => {
    const [x, y, z] = rotate(point), scale = 13 / (13 + z);
    return [canvas.width / 2 + x * 82 * scale * state.zoom, canvas.height / 2 - y * 82 * scale * state.zoom];
  };
  const polygon = (points, fill, alpha = 1, dash = []) => {
    const projected = points.map(project);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(...projected[0]);
    projected.slice(1).forEach((point) => ctx.lineTo(...point));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.setLineDash(dash);
    ctx.strokeStyle = '#1e211e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  };
  const box = ({ x = 0, y = 0, z = 0, w, h, d }, fill, alpha = 1, dash = []) => {
    const p = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]
      .map(([px,py,pz]) => [x + px*w/2, y + py*h/2, z + pz*d/2]);
    [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[3,0,4,7]].forEach((face) => polygon(face.map((i) => p[i]), fill, alpha, dash));
  };
  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const exploded = state.view === 'exploded';
    const selectedIndex = tiers.findIndex((tier) => tier.id === state.selected);
    if (state.hull || state.view === 'hull') box({ y: -0.1, w: 8.7, h: 6.8, d: 8.9 }, '#bcc5c5', state.view === 'hull' ? 0.18 : 0.1, [10,8]);
    tiers.forEach((tier, index) => {
      const visible = state.selected === 'all' || state.selected === tier.id;
      if (!visible) return;
      const offset = exploded ? (2 - index) * 0.42 : 0;
      const alpha = state.selected === 'all' ? 0.78 : 0.94;
      box({ ...tier, y: tier.y + offset }, `hsl(${205 + index * 15} 18% ${72 - index * 5}%)`, alpha);
      const label = project([0, tier.y + offset, tier.d / 2 + 0.25]);
      ctx.fillStyle = '#111';
      ctx.font = '800 22px system-ui';
      ctx.fillText(`TIER ${index + 1}`, label[0] - 38, label[1]);
    });
    if (state.interstitial && state.selected === 'all') {
      for (let i = 0; i < tiers.length - 1; i += 1) {
        const upper = tiers[i], lower = tiers[i + 1];
        const y = (upper.y - upper.h / 2 + lower.y + lower.h / 2) / 2;
        box({ y, w: Math.max(upper.w, lower.w) + 0.25, h: 0.22, d: Math.max(upper.d, lower.d) + 0.25 }, '#272b29', 0.24, [6,6]);
      }
    }
    if (state.view === 'unknown') {
      box({ y: -0.15, w: 8.0, h: 6.1, d: 8.2 }, '#111', 0.08, [4,10]);
      ctx.fillStyle = '#111';
      ctx.font = '800 24px system-ui';
      ctx.fillText('UNSURVEYED / UNRESOLVED VOLUME', 36, 48);
    }
    if (selectedIndex >= 0) {
      ctx.fillStyle = '#111';
      ctx.font = '700 18px system-ui';
      ctx.fillText(`Tier ${selectedIndex + 1} isolated · placement is macro-only`, 36, canvas.height - 34);
    }
  };
  const setView = (view) => { state.view = view; render(); };
  canvas.addEventListener('pointerdown', (event) => { state.drag = true; state.x = event.clientX; state.y = event.clientY; canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointermove', (event) => { if (!state.drag) return; state.yaw += (event.clientX - state.x) * 0.007; state.pitch += (event.clientY - state.y) * 0.005; state.x = event.clientX; state.y = event.clientY; render(); });
  canvas.addEventListener('pointerup', () => { state.drag = false; });
  canvas.addEventListener('wheel', (event) => { event.preventDefault(); state.zoom = Math.min(1.65, Math.max(0.65, state.zoom - event.deltaY * 0.001)); render(); }, { passive: false });
  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') state.yaw -= 0.08;
    if (event.key === 'ArrowRight') state.yaw += 0.08;
    if (event.key === 'ArrowUp') state.pitch -= 0.06;
    if (event.key === 'ArrowDown') state.pitch += 0.06;
    if (event.key === '+' || event.key === '=') state.zoom = Math.min(1.65, state.zoom + 0.08);
    if (event.key === '-') state.zoom = Math.max(0.65, state.zoom - 0.08);
    if (event.key.toLowerCase() === 'e') state.view = state.view === 'exploded' ? 'section' : 'exploded';
    if (event.key.toLowerCase() === 'i') state.interstitial = !state.interstitial;
    render();
  });
  return { state, render, setView };
};

const mountTierBlockout = async () => {
  const app = document.querySelector('#app');
  if (!app) return;
  const data = await loadTierBlockout();
  const section = makeTierSection(data);
  app.append(section);
  const renderer = startTierRenderer(section.querySelector('#tier-canvas'), data);
  const evidence = section.querySelector('#tier-evidence');
  const select = section.querySelector('#tier-select');
  const showEvidence = () => {
    if (renderer.state.selected === 'all') {
      evidence.innerHTML = '<h3>Five-tier macro system</h3><p>Confirmed: five vertically ordered tiers. Diagrammatic: all visible dimensions and spacing. Unknown: deck counts, boundaries, rooms, routes and exact hull fit.</p>';
      return;
    }
    const tier = data.tierVolumes.find((item) => item.id === renderer.state.selected);
    evidence.innerHTML = `<h3>${tier.id.replace('bw3d.tier.', 'Tier ')}</h3><p><strong>Authority:</strong> ${tier.evidenceAuthority}</p><p><strong>Prohibited:</strong> ${tier.prohibitions.join('; ')}</p>`;
  };
  select.addEventListener('change', () => { renderer.state.selected = select.value; renderer.render(); showEvidence(); });
  section.querySelector('#tier-interstitial-toggle').addEventListener('change', (event) => { renderer.state.interstitial = event.target.checked; renderer.render(); });
  section.querySelector('#tier-hull-toggle').addEventListener('change', (event) => { renderer.state.hull = event.target.checked; renderer.render(); });
  section.querySelectorAll('[data-tier-view]').forEach((button) => button.addEventListener('click', () => renderer.setView(button.dataset.tierView)));
  showEvidence();
  renderer.render();
};

mountTierBlockout().catch((error) => console.error('Phase 7.4 tier blockout failed', error));
