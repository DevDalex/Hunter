const loadExterior = async () => {
  const [blockoutResponse, refinementResponse, profileResponse] = await Promise.all([
    fetch('/phase7/black-whale-3d-exterior-blockout.json'),
    fetch('/phase7/black-whale-3d-exterior-refinement.json'),
    fetch('/phase7/black-whale-3d-exterior-refinement-profile.json'),
  ]);
  if (!blockoutResponse.ok) throw new Error(`Exterior contract HTTP ${blockoutResponse.status}`);
  if (!refinementResponse.ok) throw new Error(`Exterior refinement contract HTTP ${refinementResponse.status}`);
  if (!profileResponse.ok) throw new Error(`Exterior refinement profile HTTP ${profileResponse.status}`);
  return {
    blockout: await blockoutResponse.json(),
    refinement: await refinementResponse.json(),
    profile: await profileResponse.json(),
  };
};

const makeEvidenceObjects = ({ blockout, refinement }) => [
  ...blockout.plannedObjects,
  ...refinement.refinementTargets.map((target) => ({
    id: `bw3d.refinement.${target.id}`,
    class: 'reconstructed-closure',
    modelingPermission: target.permission,
    prohibitions: target.prohibitions,
  })),
];

const makeSection = (data, objects) => {
  const section = document.createElement('section');
  section.id = 'exterior-blockout';
  section.className = 'section exterior-blockout exterior-refinement';
  section.innerHTML = `
    <header class="section__head">
      <div><p class="kicker">Phase 7.3R · Exterior refinement</p><h2>Recognizable whale silhouette, still noncanonical</h2></div>
      <p>The original blockout is being refined into a more coherent whale-shaped vessel while dimensions, detailed anatomy, openings, machinery and Tier 1 plan orientation remain unresolved.</p>
    </header>
    <div class="exterior-refinement-note" role="note">
      <strong>Refined macro form</strong>
      <span>${data.profile.hullStations.length} longitudinal hull stations, a broad blunt head face, asymmetric back and belly contours, a smoother rear taper, diagrammatic whale-identity cues, improved Tier 1 integration and analytical water context.</span>
    </div>
    <div class="exterior-layout">
      <div class="exterior-stage">
        <canvas id="exterior-canvas" width="1200" height="720" tabindex="0" aria-label="Interactive refined Black Whale exterior envelope"></canvas>
        <span>Working scene units · head-side and bow mapping remain analytical, not canonical</span>
      </div>
      <aside class="exterior-controls">
        <div class="button-row"><button data-view="hero">Hero</button><button data-view="side">Side</button><button data-view="front">Front</button><button data-view="rear">Rear</button></div>
        <label><input id="cutaway-toggle" type="checkbox"> Cutaway hull</label>
        <label><input id="tiers-toggle" type="checkbox"> Five tier bands</label>
        <label><input id="unknown-toggle" type="checkbox"> Unknown volume</label>
        <select id="exterior-object-select">${objects.map((object) => `<option value="${object.id}">${object.id.replace(/^bw3d\.(exterior|refinement)\./, '').replaceAll('-', ' ')}</option>`).join('')}</select>
        <article id="exterior-evidence" class="exterior-evidence" aria-live="polite"></article>
        <p>Drag or use arrow keys to rotate. Use +/− to zoom. Press C for cutaway.</p>
      </aside>
    </div>`;
  return section;
};

const startRenderer = (canvas, profile) => {
  const ctx = canvas.getContext('2d');
  const state = {
    yaw: -.48,
    pitch: -.14,
    zoom: .92,
    cutaway: false,
    tiers: false,
    unknown: false,
    drag: false,
    x: 0,
    y: 0,
    selected: '',
  };

  const hullStations = profile.hullStations.map((station) => ({
    z: station.z,
    rx: station.radiusX,
    ry: station.radiusY,
    cy: station.centerY,
    top: station.topScale,
    bottom: station.bottomScale,
  }));
  const segments = profile.ringSegments;

  const rotate = ([x, y, z]) => {
    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const x1 = x * cy - z * sy;
    const z1 = x * sy + z * cy;
    return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
  };

  const project = (point) => {
    const [x, y, z] = rotate(point);
    const perspective = 14 / (14 + z);
    return [
      canvas.width / 2 + x * 76 * perspective * state.zoom,
      canvas.height / 2 - y * 76 * perspective * state.zoom,
    ];
  };

  const polygon = (points, fill, alpha = 1, stroke = '#1e292c') => {
    const projected = points.map(project);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(...projected[0]);
    projected.slice(1).forEach((point) => ctx.lineTo(...point));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const line = (points, stroke, width = 1, alpha = 1, dash = []) => {
    const projected = points.map(project);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(...projected[0]);
    projected.slice(1).forEach((point) => ctx.lineTo(...point));
    ctx.stroke();
    ctx.restore();
  };

  const box = (cx, cy, cz, sx, sy, sz, fill, alpha = 1, stroke) => {
    const points = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ].map(([x, y, z]) => [cx + x * sx / 2, cy + y * sy / 2, cz + z * sz / 2]);
    [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [3, 0, 4, 7]]
      .forEach((face) => polygon(face.map((index) => points[index]), fill, alpha, stroke));
  };

  const ringPoints = hullStations.map((station) => Array.from({ length: segments }, (_, index) => {
    const angle = index / segments * Math.PI * 2;
    const sine = Math.sin(angle);
    const verticalScale = sine >= 0 ? station.top : station.bottom;
    return [
      Math.cos(angle) * station.rx,
      station.cy + sine * station.ry * verticalScale,
      station.z,
    ];
  }));

  const hullRefinementSelections = new Set([
    'bw3d.refinement.whale-head-mass',
    'bw3d.refinement.head-identity-cues',
    'bw3d.refinement.back-and-belly-contours',
    'bw3d.refinement.rear-taper',
    'bw3d.refinement.analytical-surface-language',
  ]);

  const hullShade = (face, ringIndex) => {
    if (state.selected === 'bw3d.exterior.main-hull' || hullRefinementSelections.has(state.selected)) return '#8fa5a5';
    const averageY = face.reduce((sum, point) => sum + point[1], 0) / face.length;
    if (averageY > 1.25) return ringIndex > 8 ? '#71888b' : '#687f82';
    if (averageY < -1.5) return '#40545b';
    return ringIndex > 8 ? '#5d7478' : '#536a70';
  };

  const drawWater = () => {
    const waterY = profile.analyticalWaterPlane.y;
    polygon([[-11, waterY, -10], [11, waterY, -10], [11, waterY, 12], [-11, waterY, 12]], '#789aa4', .25, '#789aa4');
    for (let z = -8; z <= 10; z += 2) line([[-10, waterY + .01, z], [10, waterY + .01, z]], '#d7e8e9', .7, .24);
  };

  const drawHull = () => {
    for (let ringIndex = 0; ringIndex < ringPoints.length - 1; ringIndex += 1) {
      for (let index = 0; index < segments; index += 1) {
        const next = (index + 1) % segments;
        const face = [
          ringPoints[ringIndex][index],
          ringPoints[ringIndex][next],
          ringPoints[ringIndex + 1][next],
          ringPoints[ringIndex + 1][index],
        ];
        if (state.cutaway && face.some(([x]) => x > .12)) continue;
        polygon(face, hullShade(face, ringIndex), .97, '#26363a');
      }
    }

    if (!state.cutaway) {
      polygon([...ringPoints[0]].reverse(), '#40545b', .98, '#26363a');
      const headColor = hullRefinementSelections.has(state.selected) ? '#8fa5a5' : '#71888b';
      polygon(ringPoints.at(-1), headColor, .98, '#26363a');
      line(profile.frontMouthGuide.points, state.selected === 'bw3d.refinement.head-identity-cues' ? '#d89a32' : '#17272b', 4, .96);
    }

    [-1, 1].forEach((side) => {
      line(profile.headSeamGuide.pointsPerSide.map((point) => [side * point.xScale, point.y, point.z]), '#26363a', 2.4, .82);
    });
  };

  const drawEyeMarkers = () => {
    const selected = state.selected === 'bw3d.refinement.head-identity-cues';
    for (const marker of profile.eyeMarkers.points) {
      const [x, y] = project(marker.center);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, profile.eyeMarkers.screenRadius, 0, Math.PI * 2);
      ctx.fillStyle = selected ? '#d89a32' : '#17272b';
      ctx.fill();
      ctx.strokeStyle = '#0d1719';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  };

  const drawTierEnvelope = () => {
    const levels = [2.0, 1.12, .22, -.68, -1.58];
    levels.forEach((y, index) => {
      const width = index === 0 ? 3.55 : 5.7 - index * .08;
      const depth = index === 0 ? 4.65 : 7.6 - index * .14;
      box(0, y, -.05, width, .52, depth, ['#d0b86f', '#a6b1a6', '#91a4aa', '#7d9298', '#687d84'][index], .7);
    });
  };

  const drawTierOne = () => {
    const selected = state.selected === 'bw3d.exterior.tier-1-vessel' || state.selected === 'bw3d.refinement.tier-1-integration';
    const colors = selected ? ['#efd08b', '#f3dca6', '#f0e1bd', '#f6f1e4'] : ['#c9bea0', '#ddd5bf', '#ebe6d7', '#f2efe5'];
    profile.tierOneWorkingMasses.forEach((mass, index) => {
      box(...mass.center, ...mass.size, colors[index], .98);
    });
  };

  const drawSupportRegion = () => {
    const selected = state.selected === 'bw3d.exterior.spring-support-region';
    [-1.38, 1.38].forEach((x) => {
      box(x, 2.48, -.2, .34, .58, 2.45, selected ? '#d79b49' : '#9b754a', .5);
    });
  };

  const render = () => {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#e9efed');
    sky.addColorStop(.58, '#c8d6d7');
    sky.addColorStop(1, '#91aeb5');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,.42)';
    ctx.fillRect(0, canvas.height * .54, canvas.width, 2);

    drawWater();
    if (state.unknown) box(0, -.2, -.1, 6.2, 4.55, 8.4, '#263033', .1, '#5f7377');
    if (state.tiers) drawTierEnvelope();
    drawHull();
    drawEyeMarkers();
    drawTierOne();
    if (state.cutaway || state.selected === 'bw3d.exterior.spring-support-region') drawSupportRegion();

    ctx.fillStyle = '#132024';
    ctx.font = '700 18px system-ui';
    ctx.fillText(state.cutaway ? 'REFINED CUTAWAY / DIAGRAMMATIC' : 'REFINED WHALE ENVELOPE / WORKING FORM', 26, 38);
    ctx.font = '500 13px system-ui';
    ctx.fillText('Macro silhouette refinement · detailed anatomy and dimensions remain quarantined', 26, 60);
  };

  const view = (name) => {
    const preset = {
      hero: [-.48, -.14, .92],
      side: [0, 0, .92],
      front: [-Math.PI / 2, 0, 1.02],
      rear: [Math.PI / 2, 0, 1.02],
    }[name];
    [state.yaw, state.pitch, state.zoom] = preset;
    render();
  };

  canvas.addEventListener('pointerdown', (event) => {
    state.drag = true;
    state.x = event.clientX;
    state.y = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!state.drag) return;
    state.yaw += (event.clientX - state.x) * .008;
    state.pitch = Math.max(-1.1, Math.min(1.1, state.pitch + (event.clientY - state.y) * .006));
    state.x = event.clientX;
    state.y = event.clientY;
    render();
  });
  canvas.addEventListener('pointerup', () => { state.drag = false; });
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    state.zoom = Math.max(.5, Math.min(1.65, state.zoom - event.deltaY * .001));
    render();
  }, { passive: false });
  canvas.addEventListener('keydown', (event) => {
    const rotation = {
      ArrowLeft: [-.08, 0], ArrowRight: [.08, 0], ArrowUp: [0, -.06], ArrowDown: [0, .06],
    }[event.key];
    if (rotation) {
      event.preventDefault();
      state.yaw += rotation[0];
      state.pitch += rotation[1];
      render();
    }
    if (event.key === '+' || event.key === '=') { state.zoom = Math.min(1.65, state.zoom + .08); render(); }
    if (event.key === '-') { state.zoom = Math.max(.5, state.zoom - .08); render(); }
    if (event.key.toLowerCase() === 'c') { state.cutaway = !state.cutaway; render(); }
  });

  render();
  return { state, render, view };
};

const mountExterior = async () => {
  const data = await loadExterior();
  const status = document.querySelector('#status');
  if (!status || document.querySelector('#exterior-blockout')) return;
  const objects = makeEvidenceObjects(data);
  const section = makeSection(data, objects);
  status.insertAdjacentElement('afterend', section);
  const renderer = startRenderer(section.querySelector('canvas'), data.profile);
  const select = section.querySelector('select');
  const evidence = section.querySelector('#exterior-evidence');
  const updateEvidence = () => {
    const object = objects.find((item) => item.id === select.value) || objects[0];
    renderer.state.selected = object.id;
    renderer.render();
    const statusClass = object.class === 'quarantined-marker' ? 'open' : 'complete';
    evidence.innerHTML = `<span class="status ${statusClass}">${object.class}</span><h3>${object.id}</h3><p>${object.modelingPermission}</p><strong>Prohibited</strong><ul>${object.prohibitions.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  };
  select.addEventListener('change', updateEvidence);
  updateEvidence();
  section.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => renderer.view(button.dataset.view)));
  section.querySelector('#cutaway-toggle').addEventListener('change', (event) => { renderer.state.cutaway = event.target.checked; renderer.render(); });
  section.querySelector('#tiers-toggle').addEventListener('change', (event) => { renderer.state.tiers = event.target.checked; renderer.render(); });
  section.querySelector('#unknown-toggle').addEventListener('change', (event) => { renderer.state.unknown = event.target.checked; renderer.render(); });
  const nav = document.querySelector('.section-nav');
  if (nav) {
    const link = document.createElement('a');
    link.href = '#exterior-blockout';
    link.textContent = '7.3R Exterior';
    nav.insertBefore(link, nav.querySelector('a[href="#roadmap"]'));
  }
};

window.setTimeout(() => mountExterior().catch((error) => console.error('Phase 7.3R exterior refinement failed', error)), 0);
