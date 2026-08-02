const mountExteriorScaleReference = () => {
  const section = document.querySelector('#exterior-blockout');
  if (!section || section.querySelector('[data-view="scale"]')) return;
  const buttonRow = section.querySelector('.button-row');
  const stage = section.querySelector('.exterior-stage');
  if (!buttonRow || !stage) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.view = 'scale';
  button.textContent = 'Human scale';
  button.setAttribute('aria-pressed', 'false');
  buttonRow.append(button);

  const overlay = document.createElement('div');
  overlay.className = 'exterior-scale-reference hidden';
  overlay.setAttribute('role', 'note');
  overlay.innerHTML = `
    <div class="scale-person" aria-hidden="true"><span></span></div>
    <div class="scale-copy">
      <strong>1.7 m working human proxy</strong>
      <span>Diagrammatic comparison only. Its placement is not a canonical exterior access point, and the hull dimensions remain unestablished.</span>
    </div>`;
  stage.append(overlay);

  button.addEventListener('click', () => {
    const active = overlay.classList.toggle('hidden') === false;
    button.setAttribute('aria-pressed', String(active));
    if (active) stage.querySelector('canvas')?.focus();
  });
};

window.setTimeout(mountExteriorScaleReference, 0);
