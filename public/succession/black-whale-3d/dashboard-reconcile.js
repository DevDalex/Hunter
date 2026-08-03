const reconcileDashboard = () => {
  const status = document.querySelector('#status');
  const corpus = document.querySelector('#corpus');
  const roadmap = document.querySelector('#roadmap');
  if (!status || !corpus || !roadmap) return false;

  const statusKicker = status.querySelector('.kicker');
  const statusTitle = status.querySelector('.section__head h2');
  const statusCopy = status.querySelector('.section__head > p');
  const statusBoardTitle = status.querySelector('.status-board h3');
  const statusBoardCopy = status.querySelector('.status-board p');
  if (statusKicker) statusKicker.textContent = 'Current programme state';
  if (statusTitle) statusTitle.textContent = 'Research frozen. Analytical geometry is now visible.';
  if (statusCopy) statusCopy.textContent = 'The chapter corpus, second-pass review, spatial graph, exterior blockout, and five-tier blockout are implemented. Phase 7.4 remains evidence-bounded and stops before routes or rooms.';
  if (statusBoardTitle) statusBoardTitle.textContent = 'Phase 7.4 is merged and awaiting final live verification';
  if (statusBoardCopy) statusBoardCopy.textContent = 'The viewers below are working analytical blockouts, not canonical dimensions or invented floor plans.';

  const corpusKicker = corpus.querySelector('.kicker');
  const corpusTitle = corpus.querySelector('.section__head h2');
  const corpusCopy = corpus.querySelector('.section__head > p');
  if (corpusKicker) corpusKicker.textContent = 'Phase 7.1B–7.1C · Complete';
  if (corpusTitle) corpusTitle.textContent = 'Exhaustive corpus and independent second pass';
  if (corpusCopy) corpusCopy.textContent = 'All requested chapter slots are registered, released material is reviewed, unavailable chapters remain explicitly unavailable, and the evidence corpus has been independently rechecked and frozen for spatial work.';

  const researchGate = corpus.querySelector('.next-callout');
  if (researchGate) {
    const kicker = researchGate.querySelector('.kicker');
    const title = researchGate.querySelector('h2');
    const copy = researchGate.querySelector('p:not(.kicker)');
    const phase = researchGate.querySelector(':scope > strong');
    if (kicker) kicker.textContent = 'Research gate passed';
    if (title) title.textContent = 'Phase 7.2 spatial graph is complete';
    if (copy) copy.textContent = 'Evidence identities, containment, route decisions, and quarantines are frozen without converting unknown space into invented geometry.';
    if (phase) phase.textContent = '7.2';
  }

  const roadmapTitle = roadmap.querySelector('.section__head h2');
  const roadmapCopy = roadmap.querySelector('.section__head > p');
  if (roadmapTitle) roadmapTitle.textContent = 'Evidence first. Analytical geometry now.';
  if (roadmapCopy) roadmapCopy.textContent = 'Phases 7.0 through 7.3 are complete, Phase 7.4 is merged pending final live verification, and Phase 7.5 remains blocked until explicit instruction.';

  document.documentElement.dataset.blackWhaleDashboard = 'reconciled';
  return true;
};

const observer = new MutationObserver(() => {
  if (reconcileDashboard()) observer.disconnect();
});
observer.observe(document.querySelector('#app'), { childList: true, subtree: true });
reconcileDashboard();
