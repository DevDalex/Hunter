const DATA_URL = '/phase7/black-whale-3d-data.json';
const app = document.querySelector('#app');
const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const humanize = (value='') => String(value).replace(/^c\d-/, '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const list = (items=[]) => `<ul>${items.map((item)=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
const pairs = (pairs=[]) => `<dl>${pairs.map(([term,value])=>`<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`;
const sectionHead = (kicker,title,copy) => `<header class="section__head"><div><p class="kicker">${escapeHtml(kicker)}</p><h2>${escapeHtml(title)}</h2></div><p>${escapeHtml(copy)}</p></header>`;

function render(data){
  const p=data.blackWhale3dProgressStats;
  const stats=data.blackWhale3dReferenceStats;
  app.innerHTML=`
  <section class="section" id="status">${sectionHead('Current programme state','Two foundations are locked.','The research contracts exist; production geometry remains deliberately at zero until the spatial graph is approved.')}
    <div class="status-board"><div class="progress-ring" style="--percent:${p.programmePercent}%"><span><strong>${p.programmePercent}%</strong><small>programme</small></span></div><div><h3>${p.completedStages} of ${p.totalStages} stages complete</h3><p>Phase 7.0 and 7.1 are complete. Phase ${escapeHtml(p.nextStage)} is next. No exterior or interior mesh is being presented as finished.</p></div></div>
    <div class="phase-grid">${data.blackWhale3dRoadmap.slice(0,4).map((r)=>`<article class="phase-card ${r.status}"><span>Phase ${escapeHtml(r.id)} · ${escapeHtml(r.status)}</span><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.summary)}</p></article>`).join('')}</div>
  </section>
  <section class="section" id="charter">${sectionHead('Phase 7.0 · Complete','The reconstruction charter','The charter makes truthfulness, provenance, accessibility, and chapter safety enforceable before any 3D production begins.')}
    <div class="principle-grid">${data.blackWhale3dPrinciples.map((x)=>`<article>${escapeHtml(x)}</article>`).join('')}</div>
    <div class="spec-grid">
      <article class="spec-card"><p class="kicker">Source boundary</p><h3>Canon before spectacle</h3><p>${escapeHtml(data.blackWhale3dSourceContract.acceptedLoreEvidence.join(' · '))}</p>${pairs([['Approved hosts',data.blackWhale3dSourceContract.approvedLoreHosts.join(', ')],['Core rule','Geometry cannot become evidence.']])}</article>
      <article class="spec-card"><p class="kicker">Coordinates</p><h3>One ship-local language</h3>${pairs([['Unit',data.blackWhale3dCoordinateSystem.unit],['Handedness',data.blackWhale3dCoordinateSystem.handedness],['Axes','+X starboard · +Y up · +Z bow'],['Origin',data.blackWhale3dCoordinateSystem.originId]])}</article>
      <article class="spec-card"><p class="kicker">Technical baseline</p><h3>Data and geometry stay separate</h3>${pairs([['Renderer',data.blackWhale3dTechnicalStack.renderer],['Assets',data.blackWhale3dTechnicalStack.assetDelivery],['Browser',data.blackWhale3dTechnicalStack.browserBaseline]])}</article>
    </div>
    <details class="panel"><summary><strong>Complete scope and acceptance gates</strong></summary><div class="spec-grid"><article><h3>Included</h3>${list(data.blackWhale3dScope.included)}</article><article><h3>Excluded</h3>${list(data.blackWhale3dScope.excluded)}</article><article><h3>Accessibility parity</h3><p>${escapeHtml(data.blackWhale3dAccessibilityContract.parityRule)}</p>${list(data.blackWhale3dAccessibilityContract.required)}</article></div><ol class="gate-list">${data.blackWhale3dAcceptanceGates.map((g)=>`<li><b>✓</b><strong>${escapeHtml(g.label)}</strong><small>${escapeHtml(g.pass)}</small></li>`).join('')}</ol></details>
  </section>
  <section class="section" id="certainty">${sectionHead('Truth hierarchy','Five levels. No hidden “looks plausible” tier.','Every future room, route, volume, and overlay must declare exactly one evidence classification.')}
    <div class="certainty-grid">${data.blackWhale3dCertaintyLevels.map((c)=>`<article class="certainty-card"><header><i>C${c.rank}</i><strong>${escapeHtml(c.label)}</strong></header><p>${escapeHtml(c.minimumEvidence)}</p>${pairs([['Default',c.defaultVisible?'Visible':'Hidden'],['Traversal',c.traversable?'Allowed':'Blocked'],['Treatment',c.renderTreatment]])}</article>`).join('')}</div>
  </section>
  <section class="section" id="references">${sectionHead('Phase 7.1 · Complete','Reference extraction','The complete source-shot ledger is available here with filters, permitted uses, limitations, and direct evidence links.')}
    <div class="stats-grid">${[['Reference shots',stats.totalShots],['Exact image URLs',stats.exactImageSources],['Issues',data.blackWhale3dReferenceIssues.length],['Evidence gaps',data.blackWhale3dReferenceGaps.length],['Motifs',data.blackWhale3dArchitecturalMotifs.length]].map(([label,value])=>`<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>
    <div class="filters"><label><span class="hidden">Search references</span><input id="reference-search" type="search" placeholder="Search room, tier, signal, use, limitation…"></label><label><span class="hidden">Filter tier</span><select id="tier-filter"><option value="all">All tiers</option></select></label><label><span class="hidden">Filter shot type</span><select id="type-filter"><option value="all">All shot types</option></select></label></div>
    <p id="result-count" class="result-count"></p><div id="reference-grid" class="cards"></div><button id="load-more" class="load-more" type="button">Show more references</button>
  </section>
  <section class="section" id="issues">${sectionHead('Corrections and contradictions','Quarantine first. Resolve second.','Conflicting labels and corrected room identities remain visible so later geometry cannot silently choose the convenient answer.')}
    <div class="issue-grid">${data.blackWhale3dReferenceIssues.map((x)=>`<article class="issue-card ${x.status}"><div class="card-top"><span class="status ${x.status}">${escapeHtml(x.status)}</span><code>${escapeHtml(x.id)}</code></div><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.summary)}</p><strong>Decision</strong><p>${escapeHtml(x.decision)}</p></article>`).join('')}</div>
  </section>
  <section class="section" id="gaps">${sectionHead('Evidence debt','Unknown means unknown.','These missing views block or limit future modeling. They are not invitations to improvise corridors.')}
    <div class="gap-grid">${data.blackWhale3dReferenceGaps.map((x)=>`<article class="gap-card ${x.priority}"><div class="card-top"><span class="status ${x.priority}">${escapeHtml(x.priority)}</span><code>${escapeHtml(x.id)}</code></div><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.need)}</p><strong>Blocks</strong>${list(x.blocks)}</article>`).join('')}</div>
  </section>
  <section class="section" id="motifs">${sectionHead('Architectural motif inventory','Reusable, but never automatically canonical.','Repeated visual language may guide neutral reconstruction only within each motif’s recorded limits.')}
    <div class="motif-grid">${data.blackWhale3dArchitecturalMotifs.map((x)=>`<article class="motif-card"><code>${escapeHtml(x.id)}</code><h3>${escapeHtml(x.label)}</h3><p>${escapeHtml(x.description)}</p><strong>${x.referenceIds.length} supporting shots</strong></article>`).join('')}</div>
  </section>
  <section class="section" id="roadmap">${sectionHead('Phase 7 roadmap','From evidence to guided experience.','The programme remains measurable: completed foundations, one active next step, and clearly unstarted production stages.')}
    <div class="roadmap-grid">${data.blackWhale3dRoadmap.map((r)=>`<article class="roadmap-card ${r.status}"><div class="card-top"><span class="status ${r.status}">${escapeHtml(r.status)}</span><strong>Phase ${escapeHtml(r.id)}</strong></div><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.summary)}</p></article>`).join('')}</div>
    <aside class="next-callout"><div><p class="kicker">Next production gate</p><h2>Phase 7.2 · Spatial graph</h2><p>Construct the nonvisual ship skeleton: tiers, zones, rooms, connections, access rules, uncertainty, and stable scene identities. Geometry still waits outside.</p></div><strong>7.2</strong></aside>
  </section>`;

  const shots=data.blackWhale3dReferenceShots;
  const tierSelect=document.querySelector('#tier-filter');
  const typeSelect=document.querySelector('#type-filter');
  [...new Set(shots.map((s)=>s.tier))].sort().forEach((value)=>tierSelect.insertAdjacentHTML('beforeend',`<option value="${escapeHtml(value)}">${escapeHtml(humanize(value))}</option>`));
  [...new Set(shots.map((s)=>s.shotType))].sort().forEach((value)=>typeSelect.insertAdjacentHTML('beforeend',`<option value="${escapeHtml(value)}">${escapeHtml(humanize(value))}</option>`));
  let limit=12;
  const renderShots=()=>{
    const q=document.querySelector('#reference-search').value.trim().toLowerCase();
    const tier=tierSelect.value,type=typeSelect.value;
    const filtered=shots.filter((s)=> (tier==='all'||s.tier===tier)&&(type==='all'||s.shotType===type)&&(!q||[s.id,s.title,s.tier,s.shotType,s.cameraView,...s.geometrySignals,...s.permittedUses,...s.limitations].join(' ').toLowerCase().includes(q)));
    const visible=filtered.slice(0,limit);
    document.querySelector('#result-count').textContent=`Showing ${visible.length} of ${filtered.length} matching references · ${shots.length} total`;
    document.querySelector('#reference-grid').innerHTML=visible.map((s)=>`<article class="ref-card"><div class="ref-card__image"><img loading="lazy" src="${escapeHtml(s.localPath)}" alt="${escapeHtml(s.title)} reference" onerror="this.remove();this.parentElement.textContent='Local image unavailable; use source links below.'"></div><div class="ref-card__body"><div class="card-top"><code>${escapeHtml(s.id)}</code><span class="status complete">${escapeHtml(humanize(s.certaintyCeiling))}</span></div><h3>${escapeHtml(s.title)}</h3><div class="tags"><span class="tag">${escapeHtml(humanize(s.tier))}</span><span class="tag">${escapeHtml(humanize(s.shotType))}</span><span class="tag">${escapeHtml(humanize(s.cameraView))}</span></div><h4>Geometry signals</h4><div class="tags">${s.geometrySignals.map((x)=>`<span class="tag">${escapeHtml(x)}</span>`).join('')}</div><h4>Permitted uses</h4><div class="tags">${s.permittedUses.map((x)=>`<span class="tag">${escapeHtml(x)}</span>`).join('')}</div><h4>Limitations</h4>${list(s.limitations)}<div class="ref-card__links"><a href="${escapeHtml(s.articleSource)}" target="_blank" rel="noreferrer">Article source</a><a href="${escapeHtml(s.imageSource)}" target="_blank" rel="noreferrer">Image evidence</a></div></div></article>`).join('');
    const more=document.querySelector('#load-more');more.hidden=visible.length>=filtered.length;more.textContent=`Show more references (${filtered.length-visible.length} remaining)`;
  };
  document.querySelector('#reference-search').addEventListener('input',()=>{limit=12;renderShots()});
  tierSelect.addEventListener('change',()=>{limit=12;renderShots()});typeSelect.addEventListener('change',()=>{limit=12;renderShots()});
  document.querySelector('#load-more').addEventListener('click',()=>{limit+=12;renderShots()});renderShots();
}

fetch(DATA_URL,{headers:{accept:'application/json'}}).then((response)=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json()}).then(render).catch((error)=>{app.innerHTML=`<section class="error"><h2>The progress ledger could not open.</h2><p>${escapeHtml(error.message)}</p><p><a href="/story/succession-contest/black-whale">Return to the 2D atlas</a></p></section>`});
