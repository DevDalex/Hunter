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
    class: 'reference-matched-reconstruction',
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
      <div><p class="kicker">Phase 7.3R · Canonical face correction</p><h2>Reference-matched Black Whale exterior</h2></div>
      <p>The exterior now follows the defining canonical view: a broad black whale dome, large ringed eyes, a pale segmented mouth, side fins and a compact upper vessel.</p>
    </header>
    <div class="exterior-refinement-note" role="note">
      <strong>Front identity locked</strong>
      <span>The visible face and silhouette are matched to the supplied exterior reference. Exact scale and unseen side/rear engineering remain unresolved.</span>
    </div>
    <div class="exterior-layout">
      <div class="exterior-stage">
        <canvas id="exterior-canvas" width="1200" height="720" tabindex="0" aria-label="Interactive reference-matched Black Whale exterior"></canvas>
        <span>Reference-matched front identity · analytical side and rear continuation</span>
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
    yaw: 0,
    pitch: -0.02,
    zoom: 1.05,
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
    const perspective = 16 / Math.max(5, 16 - z);
    return [
      canvas.width / 2 + x * 58 * perspective * state.zoom,
      canvas.height / 2 - y * 58 * perspective * state.zoom,
    ];
  };

  const depth = (points) => points.reduce((sum, point) => sum + rotate(point)[2], 0) / points.length;

  const polygon = (points, fill, alpha = 1, stroke = '#1e292c', lineWidth = 1) => {
    const projected = points.map(project);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(...projected[0]);
    projected.slice(1).forEach((point) => ctx.lineTo(...point));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  };

  const line = (points, stroke, width = 1, alpha = 1, dash = []) => {
    const projected = points.map(project);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(...projected[0]);
    projected.slice(1).forEach((point) => ctx.lineTo(...point));
    ctx.stroke();
    ctx.restore();
  };

  const ellipseOnFace = (center, radiusX, radiusY, fill, stroke, lineWidth = 1) => {
    const points = Array.from({ length: 32 }, (_, index) => {
      const angle = index / 32 * Math.PI * 2;
      return [
        center[0] + Math.cos(angle) * radiusX,
        center[1] + Math.sin(angle) * radiusY,
        center[2],
      ];
    });
    polygon(points, fill, 1, stroke, lineWidth);
  };

  const box = (cx, cy, cz, sx, sy, sz, fill, alpha = 1, stroke = '#273034') => {
    const points = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ].map(([x, y, z]) => [cx + x * sx / 2, cy + y * sy / 2, cz + z * sz / 2]);
    [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [3, 0, 4, 7]]
      .map((face) => face.map((index) => points[index]))
      .sort((a, b) => depth(a) - depth(b))
      .forEach((face) => polygon(face, fill, alpha, stroke, 0.8));
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

  const faceVisible = () => Math.cos(state.yaw) * Math.cos(state.pitch) > 0.12;
  const rearVisible = () => Math.cos(state.yaw) * Math.cos(state.pitch) < -0.12;

  const hullShade = (face, ringIndex) => {
    const averageY = face.reduce((sum, point) => sum + point[1], 0) / face.length;
    if (ringIndex >= 8) return averageY > 0.35 ? '#101416' : '#192023';
    if (averageY > 1.0) return '#1e272a';
    if (averageY < -1.2) return '#303d42';
    return ringIndex < 3 ? '#293438' : '#242f33';
  };

  const drawWater = () => {
    const waterY = profile.analyticalWaterPlane.y;
    polygon([[-11, waterY, -9], [11, waterY, -9], [11, waterY, 11], [-11, waterY, 11]], '#789aa4', 0.34, '#789aa4', 0.5);
    for (let z = -8; z <= 10; z += 1.5) {
      line([[-10, waterY + 0.01, z], [-3, waterY + 0.06, z + 0.18], [3, waterY - 0.01, z], [10, waterY + 0.05, z - 0.12]], '#dce9e9', 0.8, 0.26);
    }
  };

  const drawFins = () => {
    profile.sideFins
      .map((fin) => fin.points)
      .sort((a, b) => depth(a) - depth(b))
      .forEach((points) => polygon(points, '#141a1d', 1, '#090d0f', 1.2));
  };

  const drawHull = () => {
    const faces = [];
    for (let ringIndex = 0; ringIndex < ringPoints.length - 1; ringIndex += 1) {
      for (let index = 0; index < segments; index += 1) {
        const next = (index + 1) % segments;
        const face = [
          ringPoints[ringIndex][index],
          ringPoints[ringIndex][next],
          ringPoints[ringIndex + 1][next],
          ringPoints[ringIndex + 1][index],
        ];
        if (state.cutaway && face.some(([x]) => x > 0.12)) continue;
        faces.push({ points: face, ringIndex, depth: depth(face) });
      }
    }
    faces.sort((a, b) => a.depth - b.depth).forEach(({ points, ringIndex }) => {
      const headSurface = ringIndex >= 8;
      polygon(points, hullShade(points, ringIndex), 1, headSurface ? '#1c2427' : '#354247', headSurface ? 0.3 : 0.5);
    });

    if (!state.cutaway && rearVisible()) {
      polygon([...ringPoints[0]].reverse(), '#232d31', 1, '#0d1315', 1);
    }
  };

  const drawFaceIdentity = () => {
    if (!faceVisible() || state.cutaway) return;
    const identity = profile.faceIdentity;
    polygon(ringPoints.at(-1), identity.upperFaceColor, 1, '#06090b', 1.2);
    if (identity.leftBrowPatch) {
      polygon(identity.leftBrowPatch.points, identity.leftBrowPatch.color, 1, null, 0);
    }
    polygon(identity.mouthPanel, identity.lowerMouthColor, 1, identity.mouthOutlineColor, 1.3);
    line(identity.mouthTopCurve, identity.mouthOutlineColor, 5.4, 1);
    identity.mouthRibs.forEach((rib) => line(rib, '#747876', 1.2, 0.7));
    identity.eyes.forEach((eye) => {
      ellipseOnFace(eye.center, eye.outerRadiusX, eye.outerRadiusY, eye.outerColor || '#e9ece8', '#080c0e', 1.4);
      ellipseOnFace(eye.center, eye.innerRadiusX, eye.innerRadiusY, '#0e1214', '#0e1214', 0.5);
    });
  };

  const drawTierEnvelope = () => {
    const levels = [2.0, 1.12, 0.22, -0.68, -1.58];
    levels.forEach((y, index) => {
      const width = index === 0 ? 3.55 : 5.7 - index * 0.08;
      const depthValue = index === 0 ? 4.65 : 7.6 - index * 0.14;
      box(0, y, -0.05, width, 0.52, depthValue, ['#d0b86f', '#a6b1a6', '#91a4aa', '#7d9298', '#687d84'][index], 0.58);
    });
  };

  const drawTierOne = () => {
    const selected = state.selected === 'bw3d.exterior.tier-1-vessel' || state.selected === 'bw3d.refinement.tier-1-integration';
    const colors = selected
      ? ['#f0eee7', '#ffffff', '#f4f3ee', '#ffffff', '#30393d']
      : ['#d9d8d1', '#ecebe5', '#f3f2ed', '#faf9f4', '#30393d'];
    profile.tierOneWorkingMasses.forEach((mass, index) => {
      box(...mass.center, ...mass.size, colors[index], 1, index === 4 ? '#151b1e' : '#5e6465');
    });
  };

  const drawSupportRegion = () => {
    [-1.38, 1.38].forEach((x) => {
      box(x, 2.48, -0.2, 0.34, 0.58, 2.45, '#8b704e', 0.45);
    });
  };

  const drawForegroundWater = () => {
    const [, projectedWaterY] = project([0, profile.analyticalWaterPlane.y, profile.faceIdentity.facePlaneZ]);
    const horizon = Math.max(canvas.height * 0.59, Math.min(canvas.height * 0.71, projectedWaterY + 28));
    const gradient = ctx.createLinearGradient(0, horizon, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(89,126,138,0.42)');
    gradient.addColorStop(0.36, 'rgba(69,108,121,0.66)');
    gradient.addColorStop(1, 'rgba(42,78,91,0.92)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, horizon, canvas.width, canvas.height - horizon);
    ctx.save();
    ctx.strokeStyle = 'rgba(234,244,243,0.48)';
    ctx.lineWidth = 1.4;
    for (let y = horizon + 10; y < canvas.height; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= canvas.width; x += 80) {
        ctx.quadraticCurveTo(x + 20, y - 8, x + 40, y);
        ctx.quadraticCurveTo(x + 60, y + 8, x + 80, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  const render = () => {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#d8e1e1');
    sky.addColorStop(0.54, '#b4c6c8');
    sky.addColorStop(1, '#71949d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.34)';
    ctx.fillRect(0, canvas.height * 0.55, canvas.width, 2);

    drawWater();
    if (state.unknown) box(0, -0.2, -0.1, 7.6, 5.4, 8.7, '#263033', 0.09, '#5f7377');
    if (state.tiers) drawTierEnvelope();
    drawFins();
    drawHull();
    drawFaceIdentity();
    drawTierOne();
    if (state.cutaway || state.selected === 'bw3d.exterior.spring-support-region') drawSupportRegion();
    drawForegroundWater();

    ctx.fillStyle = '#11191c';
    ctx.font = '700 18px system-ui';
    ctx.fillText(state.cutaway ? 'BLACK WHALE CUTAWAY / ANALYTICAL' : 'BLACK WHALE / REFERENCE-MATCHED EXTERIOR', 26, 38);
    ctx.font = '500 13px system-ui';
    ctx.fillText('Canonical front identity · reconstructed unseen side and rear continuation', 26, 60);
  };

  const view = (name) => {
    const preset = {
      hero: [0, -0.02, 1.05],
      front: [0, -0.02, 1.08],
      side: [-Math.PI / 2, 0, 0.92],
      rear: [Math.PI, 0, 0.92],
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
    state.yaw += (event.clientX - state.x) * 0.008;
    state.pitch = Math.max(-1.1, Math.min(1.1, state.pitch + (event.clientY - state.y) * 0.006));
    state.x = event.clientX;
    state.y = event.clientY;
    render();
  });
  canvas.addEventListener('pointerup', () => { state.drag = false; });
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    state.zoom = Math.max(0.5, Math.min(1.65, state.zoom - event.deltaY * 0.001));
    render();
  }, { passive: false });
  canvas.addEventListener('keydown', (event) => {
    const rotation = {
      ArrowLeft: [-0.08, 0], ArrowRight: [0.08, 0], ArrowUp: [0, -0.06], ArrowDown: [0, 0.06],
    }[event.key];
    if (rotation) {
      event.preventDefault();
      state.yaw += rotation[0];
      state.pitch += rotation[1];
      render();
    }
    if (event.key === '+' || event.key === '=') { state.zoom = Math.min(1.65, state.zoom + 0.08); render(); }
    if (event.key === '-') { state.zoom = Math.max(0.5, state.zoom - 0.08); render(); }
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
  const identityOption = 'bw3d.refinement.head-identity-cues';
  if (objects.some((item) => item.id === identityOption)) select.value = identityOption;
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
  if (nav && !nav.querySelector('a[href="#exterior-blockout"]')) {
    const link = document.createElement('a');
    link.href = '#exterior-blockout';
    link.textContent = '7.3R Exterior';
    nav.insertBefore(link, nav.querySelector('a[href="#roadmap"]'));
  }
};

window.setTimeout(() => mountExterior().catch((error) => console.error('Phase 7.3R exterior refinement failed', error)), 0);
