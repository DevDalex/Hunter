const OPERATIONS_DATA = '/phase7/black-whale-3d-operational-deck.json';

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const loadOperationsData = async () => {
  const response = await fetch(OPERATIONS_DATA, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Operational deck HTTP ${response.status}`);
  return response.json();
};

const makeLinkList = (links = []) => `<div class="ops-links">${links.map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join('')}</div>`;

const makeOperationsSection = (data) => {
  const routes = data.routeProgramme.routes;
  const section = document.createElement('section');
  section.id = 'operations-deck';
  section.className = 'section operations-deck';
  section.innerHTML = `
    <header class="section__head">
      <div><p class="kicker">Combined Phase 7.5–7.7 · Implemented</p><h2>Routes, hero rooms and archive bridge</h2></div>
      <p>Supported connections are separated from unresolved route scope. Six evidence-bounded room dioramas link directly to the atlas, reader, chapter dossiers and research desk.</p>
    </header>
    <div class="ops-summary" aria-label="Combined phase summary">
      <article><strong>${data.routeProgramme.authorizedPhysicalCount}</strong><span>Supported physical connections</span></article>
      <article><strong>${data.routeProgramme.quarantinedScopeCount}</strong><span>Quarantined route scopes</span></article>
      <article><strong>${data.heroRooms.length}</strong><span>Hero-room dioramas</span></article>
      <article><strong>5</strong><span>Archive destinations bridged</span></article>
    </div>
    <div class="ops-workbench">
      <article class="ops-map-panel">
        <header class="ops-map-head"><div><h3>Evidence-bounded route board</h3><p>Solid routes confirm connection existence. The deliberate break in each solid line represents unknown intermediate geometry.</p></div></header>
        <div class="ops-route-stage">
          <canvas id="ops-route-canvas" width="1100" height="620" tabindex="0" aria-label="Black Whale supported and quarantined route diagram"></canvas>
          <div class="ops-stage-key" aria-hidden="true"><span><i></i>Supported existence</span><span class="quarantine"><i></i>Quarantined scope</span></div>
        </div>
      </article>
      <aside class="ops-sidebar">
        <label for="ops-route-select">Selected route
          <select id="ops-route-select">${routes.map((route) => `<option value="${escapeHtml(route.id)}">${escapeHtml(route.label)}</option>`).join('')}</select>
        </label>
        <article id="ops-route-card" class="ops-route-card" aria-live="polite"></article>
        <div class="ops-deferred"><strong>7.8 and 7.9 intentionally deferred</strong>Chapter playback, occupancy trails and Nen overlays are not part of this release. The two nonphysical route records remain data-only.</div>
      </aside>
    </div>
    <article class="ops-room-panel">
      <header class="ops-room-head"><div><h3>Open-wall hero-room production</h3><p>Each diorama models only the visible room class and confirmed fixtures. The open front and hatched edges mark incomplete enclosure.</p></div></header>
      <div id="ops-room-tabs" class="ops-room-tabs" role="tablist" aria-label="Hero rooms"></div>
      <div class="ops-room-stage">
        <div class="ops-room-canvas-wrap">
          <canvas id="ops-room-canvas" class="ops-room-canvas" width="1100" height="680" tabindex="0" aria-label="Selected Black Whale open-wall hero-room diorama"></canvas>
          <span class="ops-room-label">Open-wall reconstruction · incomplete enclosure visible</span>
        </div>
        <aside id="ops-room-evidence" class="ops-evidence" aria-live="polite"></aside>
      </div>
    </article>
    <aside class="ops-boundary-note"><strong>Production boundary</strong>These rooms and routes are research instruments, not a claim that the complete Black Whale floor plan is known. Exact dimensions, unseen adjacency and unshown circulation remain unresolved.</aside>
    <p id="ops-sr-status" class="ops-sr-status" role="status" aria-live="polite"></p>`;
  return section;
};

const startRouteBoard = (canvas, data, onSelection) => {
  const ctx = canvas.getContext('2d');
  const routes = data.routeProgramme.routes;
  const state = { selected: routes[0].id };
  const tierBands = [
    { label: 'TIER 1', y: 65, h: 80 },
    { label: 'TIER 2', y: 155, h: 80 },
    { label: 'TIER 3', y: 245, h: 80 },
    { label: 'TIER 4', y: 335, h: 80 },
    { label: 'TIER 5', y: 425, h: 105 },
  ];
  const point = ([x, y]) => [110 + (x / 100) * 860, 50 + (y / 100) * 500];
  const routeStatus = (route) => route.status.startsWith('authorized') ? 'authorized' : 'quarantined';
  const drawEndpoint = (x, y, label, active) => {
    ctx.beginPath();
    ctx.arc(x, y, active ? 9 : 6, 0, Math.PI * 2);
    ctx.fillStyle = active ? '#11130f' : '#f5f2e8';
    ctx.fill();
    ctx.strokeStyle = '#11130f';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (label) {
      ctx.font = '700 14px system-ui';
      ctx.fillStyle = '#11130f';
      ctx.fillText(label, x + 12, y - 9);
    }
  };
  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#eef2ef';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    tierBands.forEach((band, index) => {
      ctx.fillStyle = index % 2 ? '#d6dfdc' : '#e2e9e6';
      ctx.fillRect(85, band.y, 930, band.h);
      ctx.strokeStyle = '#49504a';
      ctx.lineWidth = 1;
      ctx.strokeRect(85, band.y, 930, band.h);
      ctx.fillStyle = '#11130f';
      ctx.font = '900 15px system-ui';
      ctx.fillText(band.label, 24, band.y + band.h / 2 + 5);
    });
    ctx.save();
    ctx.setLineDash([4, 10]);
    ctx.strokeStyle = 'rgba(17,19,15,.28)';
    ctx.strokeRect(70, 45, 960, 510);
    ctx.restore();
    routes.forEach((route) => {
      const [x1, y1] = point(route.diagram.from);
      const [x2, y2] = point(route.diagram.to);
      const selected = route.id === state.selected;
      const authorized = routeStatus(route) === 'authorized';
      ctx.strokeStyle = selected ? '#8a5d13' : authorized ? '#245f48' : '#6e5834';
      ctx.lineWidth = selected ? 6 : 3;
      ctx.lineCap = 'round';
      if (authorized) {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.max(1, Math.hypot(dx, dy));
        const gap = selected ? 18 : 13;
        const gx = (dx / length) * gap;
        const gy = (dy / length) * gap;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(mx - gx, my - gy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx + gx, my + gy); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.save();
        ctx.strokeStyle = '#11130f';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(mx - gx, my - gy); ctx.lineTo(mx + gx, my + gy); ctx.stroke();
        ctx.restore();
      } else {
        ctx.setLineDash([10, 8]);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.setLineDash([]);
      }
      if (selected) {
        drawEndpoint(x1, y1, route.from || route.tierScope, true);
        drawEndpoint(x2, y2, route.to || 'unresolved endpoint', true);
      } else {
        drawEndpoint(x1, y1, '', false);
        drawEndpoint(x2, y2, '', false);
      }
    });
    const selectedRoute = routes.find((route) => route.id === state.selected);
    ctx.fillStyle = '#11130f';
    ctx.font = '900 19px system-ui';
    ctx.fillText(selectedRoute.label, 88, 590);
  };
  const select = (id) => {
    state.selected = id;
    render();
    onSelection(routes.find((route) => route.id === id));
  };
  canvas.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const index = routes.findIndex((route) => route.id === state.selected);
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    select(routes[(index + delta + routes.length) % routes.length].id);
  });
  render();
  return { select, state };
};

const palettes = {
  royal: { floor: '#d7cdb9', back: '#e8dfcf', side: '#c7bca7', line: '#3b342a', accent: '#7b5d2e', fixture: '#eee8da' },
  ceremonial: { floor: '#d8c7ad', back: '#eadcc7', side: '#c5ad8c', line: '#3d3022', accent: '#8b6030', fixture: '#f3e8d5' },
  institutional: { floor: '#c9d0ce', back: '#e1e6e4', side: '#b6c0bd', line: '#26302e', accent: '#586d68', fixture: '#f5f6f2' },
  medical: { floor: '#c8d8d4', back: '#e8f1ee', side: '#b3c7c1', line: '#23332f', accent: '#4f7770', fixture: '#f7faf8' },
  justice: { floor: '#c7c3ba', back: '#e4e0d8', side: '#b2ada4', line: '#302e29', accent: '#66543d', fixture: '#f2eee7' },
  industrial: { floor: '#aeb8b5', back: '#cbd2cf', side: '#929e9a', line: '#202724', accent: '#6b765e', fixture: '#dfe4e1' },
};

const startRoomDiorama = (canvas) => {
  const ctx = canvas.getContext('2d');
  let room;
  const iso = (x, z, y = 0) => [535 + (x - z) * 58, 470 + (x + z) * 28 - y * 64];
  const polygon = (points, fill, stroke, width = 2) => {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    points.slice(1).forEach((p) => ctx.lineTo(...p));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  };
  const box = (x, z, w, d, h, palette, fill = palette.fixture) => {
    const p000 = iso(x, z, 0), p100 = iso(x + w, z, 0), p110 = iso(x + w, z + d, 0), p010 = iso(x, z + d, 0);
    const p001 = iso(x, z, h), p101 = iso(x + w, z, h), p111 = iso(x + w, z + d, h), p011 = iso(x, z + d, h);
    polygon([p000, p100, p101, p001], fill, palette.line, 1.4);
    polygon([p100, p110, p111, p101], palette.side, palette.line, 1.4);
    polygon([p001, p101, p111, p011], fill, palette.line, 1.4);
  };
  const table = (x, z, palette) => {
    const [cx, cy] = iso(x, z, .55);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 37, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = palette.fixture;
    ctx.fill();
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 2;
    ctx.stroke();
    const [a1, b1] = iso(x, z, .05), [a2, b2] = iso(x, z, .55);
    ctx.beginPath(); ctx.moveTo(a1, b1); ctx.lineTo(a2, b2); ctx.stroke();
  };
  const column = (x, z, palette) => {
    const [baseX, baseY] = iso(x, z, 0), [topX, topY] = iso(x, z, 2.7);
    ctx.fillStyle = palette.fixture;
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 2;
    ctx.fillRect(baseX - 8, topY, 16, baseY - topY);
    ctx.strokeRect(baseX - 8, topY, 16, baseY - topY);
    ctx.beginPath(); ctx.ellipse(topX, topY, 12, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  };
  const drawWalls = (palette) => {
    const floor = [iso(0, 0), iso(7, 0), iso(7, 5), iso(0, 5)];
    polygon(floor, palette.floor, palette.line, 2.5);
    polygon([iso(0, 5), iso(7, 5), iso(7, 5, 3), iso(0, 5, 3)], palette.back, palette.line, 2.5);
    polygon([iso(0, 0), iso(0, 5), iso(0, 5, 3), iso(0, 0, 3)], palette.side, palette.line, 2.5);
    ctx.save();
    ctx.setLineDash([9, 7]);
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(...iso(0, 0)); ctx.lineTo(...iso(7, 0)); ctx.stroke();
    ctx.restore();
  };
  const drawBackDetails = (room, palette) => {
    if (room.geometry.screen) {
      polygon([iso(2.1, 5, 1.05), iso(5.4, 5, 1.05), iso(5.4, 5, 2.55), iso(2.1, 5, 2.55)], '#e9eeee', palette.line, 2);
    }
    if (room.geometry.deepDoor) {
      polygon([iso(5.6, 5, 0), iso(6.5, 5, 0), iso(6.5, 5, 2.2), iso(5.6, 5, 2.2)], '#343b38', palette.line, 2);
    }
    if (room.palette === 'royal' || room.palette === 'ceremonial') {
      for (let i = 1; i <= 5; i += 1) {
        const x = .6 + i * 1.05;
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(...iso(x, 5, .35)); ctx.lineTo(...iso(x, 5, 2.65)); ctx.stroke();
      }
    }
  };
  const render = () => {
    if (!room) return;
    const palette = palettes[room.palette] || palettes.institutional;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#edf3f1');
    gradient.addColorStop(1, '#b9c6c3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#11130f';
    ctx.font = '900 24px system-ui';
    ctx.fillText(room.label.toUpperCase(), 28, 42);
    ctx.font = '700 14px system-ui';
    ctx.fillText(`${room.tier} · ${room.certainty.replaceAll('-', ' ')}`, 29, 66);
    drawWalls(palette);
    drawBackDetails(room, palette);
    const items = [];
    for (let i = 0; i < room.geometry.columns; i += 1) items.push({ type: 'column', x: i % 2 ? 6.2 : .8, z: 1 + Math.floor(i / 2) * 1.2 });
    for (let i = 0; i < room.geometry.roundTables; i += 1) items.push({ type: 'table', x: 1.6 + (i % 3) * 1.9, z: 1.1 + Math.floor(i / 3) * 1.8 });
    for (let i = 0; i < room.geometry.seatGroups; i += 1) items.push({ type: 'seat', x: 1.2 + i * 2.0, z: 1.6 + (i % 2) * 1.4 });
    for (let i = 0; i < room.geometry.rows; i += 1) items.push({ type: 'row', x: 1.05, z: .75 + i * .53 });
    for (let i = 0; i < room.geometry.counters; i += 1) items.push({ type: 'counter', x: .7 + (i % 2) * 3.7, z: 1.1 + Math.floor(i / 2) * 2.0 });
    for (let i = 0; i < room.geometry.stalls; i += 1) items.push({ type: 'stall', x: .55 + (i % 4) * 1.65, z: .75 + Math.floor(i / 4) * 2.8 });
    if (room.geometry.raisedBench) items.push({ type: 'bench', x: 2.1, z: 4.05 });
    items.sort((a, b) => (b.x + b.z) - (a.x + a.z));
    items.forEach((item) => {
      if (item.type === 'column') column(item.x, item.z, palette);
      if (item.type === 'table') table(item.x, item.z, palette);
      if (item.type === 'seat') { box(item.x, item.z, 1.25, .55, .45, palette); box(item.x + .1, item.z + .32, 1.05, .18, .75, palette, palette.accent); }
      if (item.type === 'row') for (let seat = 0; seat < 7; seat += 1) box(item.x + seat * .72, item.z, .5, .35, .38, palette);
      if (item.type === 'counter') { box(item.x, item.z, 2.25, .65, .9, palette); box(item.x + .18, item.z + .08, .5, .45, 1.28, palette, palette.accent); }
      if (item.type === 'stall') { box(item.x, item.z, 1.3, .75, .85, palette, palette.fixture); box(item.x, item.z + .57, 1.3, .18, 1.55, palette, palette.accent); }
      if (item.type === 'bench') box(item.x, item.z, 3.15, .75, 1.05, palette, palette.accent);
    });
    ctx.save();
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = '#11130f';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(...iso(0, 0)); ctx.lineTo(...iso(7, 0)); ctx.stroke();
    ctx.restore();
    ctx.font = '800 13px system-ui';
    ctx.fillStyle = '#11130f';
    ctx.fillText('OPEN / UNSHOWN ENCLOSURE', 710, 625);
  };
  const select = (nextRoom) => { room = nextRoom; render(); };
  return { select, render };
};

const routeCardMarkup = (route) => {
  const authorized = route.status.startsWith('authorized');
  return `<span class="ops-badge ${authorized ? 'authorized' : 'quarantined'}">${authorized ? 'Supported connection' : 'Quarantined scope'}</span>
    <h3>${escapeHtml(route.label)}</h3>
    <p><strong>Scope:</strong> ${escapeHtml(route.tierScope)}</p>
    <p><strong>Evidence:</strong> ${escapeHtml(route.evidenceAtomIds.join(', '))}</p>
    <ul>${route.limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    ${makeLinkList(route.archiveLinks)}`;
};

const roomEvidenceMarkup = (room) => `<h3>${escapeHtml(room.label)}</h3>
  <p class="ops-tier">${escapeHtml(room.tier)} · Primary Chapter ${room.primaryChapter}</p>
  <span class="ops-badge authorized">${escapeHtml(room.certainty.replaceAll('-', ' '))}</span>
  <p>${escapeHtml(room.summary)}</p>
  <h4>Confirmed features</h4><ul>${room.confirmedFeatures.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
  <h4>Still unknown</h4><ul>${room.unknowns.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
  <code>${escapeHtml(room.id)}</code>${makeLinkList(room.archiveLinks)}`;

const mountOperationsDeck = async () => {
  const app = document.querySelector('#app');
  if (!app) return;
  const data = await loadOperationsData();
  const section = makeOperationsSection(data);
  app.append(section);
  const routeCard = section.querySelector('#ops-route-card');
  const routeSelect = section.querySelector('#ops-route-select');
  const status = section.querySelector('#ops-sr-status');
  const board = startRouteBoard(section.querySelector('#ops-route-canvas'), data, (route) => {
    routeCard.innerHTML = routeCardMarkup(route);
    routeSelect.value = route.id;
    status.textContent = `Selected route ${route.label}`;
  });
  routeSelect.addEventListener('change', () => board.select(routeSelect.value));
  board.select(routeSelect.value);

  const tabs = section.querySelector('#ops-room-tabs');
  const evidence = section.querySelector('#ops-room-evidence');
  const roomCanvas = section.querySelector('#ops-room-canvas');
  const diorama = startRoomDiorama(roomCanvas);
  let roomIndex = 0;
  data.heroRooms.forEach((room, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.role = 'tab';
    button.dataset.roomId = room.id;
    button.innerHTML = `${escapeHtml(room.label)}<small>${escapeHtml(room.tier)} · Ch. ${room.primaryChapter}</small>`;
    button.addEventListener('click', () => selectRoom(index));
    tabs.append(button);
  });
  const selectRoom = (index) => {
    roomIndex = (index + data.heroRooms.length) % data.heroRooms.length;
    const room = data.heroRooms[roomIndex];
    tabs.querySelectorAll('[role="tab"]').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.roomId === room.id)));
    diorama.select(room);
    evidence.innerHTML = roomEvidenceMarkup(room);
    status.textContent = `Selected hero room ${room.label}`;
  };
  roomCanvas.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', '[', ']'].includes(event.key)) return;
    event.preventDefault();
    selectRoom(roomIndex + (event.key === 'ArrowRight' || event.key === ']' ? 1 : -1));
  });
  selectRoom(0);
};

mountOperationsDeck().catch((error) => console.error('Combined Phase 7.5–7.7 operational deck failed', error));
