const escapeStatus = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const refreshProgrammeStatus = async () => {
  const section = document.querySelector('#status');
  if (!section) return;
  const response = await fetch('/phase7/black-whale-3d-data.json', { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Programme status HTTP ${response.status}`);
  const data = await response.json();
  const phases = data.blackWhale3dRoadmap.filter((phase) => ['7.2', '7.3', '7.3R', '7.4', '7.5', '7.6', '7.7'].includes(phase.id));
  const heading = section.querySelector('.section__head');
  if (heading) heading.innerHTML = '<div><p class="kicker">Current programme state</p><h2>Research, structure and operational production complete</h2></div><p>The evidence corpus now drives supported routes, six open-wall hero rooms and maintained archive links. Phases 7.8 and 7.9 are deliberately deferred; the next pass combines 7.10 through 7.12.</p>';
  const statusTitle = section.querySelector('.status-board h3');
  const statusCopy = section.querySelector('.status-board h3 + p');
  if (statusTitle) statusTitle.textContent = 'Combined Phase 7.5–7.7 is the current release';
  if (statusCopy) statusCopy.textContent = 'No false percentage is shown. Completion is recorded by evidence, interaction, archive-link and release gates.';
  const ring = section.querySelector('.progress-ring strong');
  if (ring) ring.textContent = data.blackWhale3dProgressStats.programmeLabel;
  const grid = section.querySelector('.phase-grid');
  if (grid) grid.innerHTML = phases.map((phase) => `<article class="phase-card ${escapeStatus(phase.status)}"><span>Phase ${escapeStatus(phase.id)} · ${escapeStatus(phase.status)}</span><strong>${escapeStatus(phase.title)}</strong><p>${escapeStatus(phase.summary)}</p></article>`).join('');
};

refreshProgrammeStatus().catch((error) => console.error('Phase 7 programme status refresh failed', error));
