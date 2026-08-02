const ARCHITECTURE_BASE_WIDTH = 1660;
const ARCHITECTURE_BASE_HEIGHT = 1260;
const ARCHITECTURE_MIN_HEIGHT = ARCHITECTURE_BASE_HEIGHT;
const ARCHITECTURE_FIT_PADDING = 12;
const ARCHITECTURE_FIT_PASSES = 6;
const RUNTIME_KEY = '__successionArchitectureViewportRuntime';

function readViewport() {
  const viewport = window.visualViewport;
  const width = Math.max(1, viewport?.width || window.innerWidth || document.documentElement.clientWidth || ARCHITECTURE_BASE_WIDTH);
  const height = Math.max(1, viewport?.height || window.innerHeight || document.documentElement.clientHeight || ARCHITECTURE_BASE_HEIGHT);
  return { width, height };
}

function readBaseGeometry(width, height) {
  const scaleY = height / ARCHITECTURE_BASE_HEIGHT;
  const layoutWidth = Math.max(ARCHITECTURE_BASE_WIDTH, width / scaleY);
  const scaleX = width / layoutWidth;
  return { layoutWidth, scaleX, scaleY };
}

function readNaturalContentHeight(sheet) {
  const footer = sheet.querySelector('.succession-architecture__document-footer');
  const styles = window.getComputedStyle(sheet);
  const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
  const borderBottom = Number.parseFloat(styles.borderBottomWidth) || 0;
  const contentBottom = footer
    ? footer.offsetTop + footer.offsetHeight
    : sheet.scrollHeight;

  return Math.max(
    ARCHITECTURE_MIN_HEIGHT,
    Math.ceil(contentBottom + paddingBottom + borderBottom + ARCHITECTURE_FIT_PADDING),
  );
}

function applyGeometryVariables(board, viewport, layoutHeight) {
  const baseGeometry = readBaseGeometry(viewport.width, viewport.height);
  const scaleY = layoutHeight === ARCHITECTURE_BASE_HEIGHT
    ? baseGeometry.scaleY
    : viewport.height / layoutHeight;
  const layoutWidth = layoutHeight === ARCHITECTURE_BASE_HEIGHT
    ? baseGeometry.layoutWidth
    : Math.max(ARCHITECTURE_BASE_WIDTH, viewport.width / scaleY);
  const scaleX = layoutHeight === ARCHITECTURE_BASE_HEIGHT
    ? baseGeometry.scaleX
    : viewport.width / layoutWidth;

  board.style.setProperty('--architecture-layout-width', `${layoutWidth.toFixed(3)}px`);
  board.style.setProperty('--architecture-layout-height', `${layoutHeight.toFixed(3)}px`);
  board.style.setProperty('--architecture-scale-x', scaleX.toFixed(6));
  board.style.setProperty('--architecture-scale-y', scaleY.toFixed(6));

  return { layoutWidth, scaleX, scaleY };
}

function applyViewportGeometry() {
  const board = document.querySelector('.succession-architecture-board');
  const sheet = board?.querySelector('.succession-architecture__sheet');
  if (!board || !sheet) return;

  const viewport = readViewport();
  let layoutHeight = ARCHITECTURE_MIN_HEIGHT;
  let geometry = null;

  // Width changes can alter text wrapping and therefore document height. Run a
  // small bounded fit loop so the measured content and the painted sheet settle
  // together instead of clipping content against the old 1260px assumption.
  for (let pass = 0; pass < ARCHITECTURE_FIT_PASSES; pass += 1) {
    geometry = applyGeometryVariables(board, viewport, layoutHeight);
    // Force layout before reading offsets after the width/height variables move.
    void sheet.offsetHeight;
    const measuredHeight = readNaturalContentHeight(sheet);
    if (Math.abs(measuredHeight - layoutHeight) < 1) {
      layoutHeight = measuredHeight;
      break;
    }
    layoutHeight = measuredHeight;
  }

  geometry = applyGeometryVariables(board, viewport, layoutHeight);
  void sheet.offsetHeight;
  const finalContentHeight = readNaturalContentHeight(sheet);
  const fitted = finalContentHeight <= layoutHeight + 1;

  board.dataset.architectureHeightFit = fitted ? 'fitted' : 'clipped';
  board.dataset.architectureLayoutHeight = layoutHeight.toFixed(3);
  board.dataset.architectureContentHeight = finalContentHeight.toFixed(3);
  board.dataset.architectureLayoutWidth = geometry.layoutWidth.toFixed(3);
}

function installViewportRuntime() {
  if (window[RUNTIME_KEY]) return;

  let animationFrame = 0;
  const schedule = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = window.requestAnimationFrame(applyViewportGeometry);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('DOMContentLoaded', schedule, { once: true });
  document.addEventListener('load', schedule, true);
  document.fonts?.ready?.then(schedule).catch(() => {});

  window[RUNTIME_KEY] = { schedule, observer };
  schedule();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') installViewportRuntime();
