const ARCHITECTURE_BASE_WIDTH = 1660;
const ARCHITECTURE_BASE_HEIGHT = 1260;
const RUNTIME_KEY = '__successionArchitectureViewportRuntime';

function readViewport() {
  const viewport = window.visualViewport;
  const width = Math.max(1, viewport?.width || window.innerWidth || document.documentElement.clientWidth || ARCHITECTURE_BASE_WIDTH);
  const height = Math.max(1, viewport?.height || window.innerHeight || document.documentElement.clientHeight || ARCHITECTURE_BASE_HEIGHT);
  return { width, height };
}

function applyViewportGeometry() {
  const board = document.querySelector('.succession-architecture-board');
  if (!board) return;

  const { width, height } = readViewport();
  const scaleY = height / ARCHITECTURE_BASE_HEIGHT;
  const layoutWidth = Math.max(ARCHITECTURE_BASE_WIDTH, width / scaleY);
  const scaleX = width / layoutWidth;

  board.style.setProperty('--architecture-layout-width', `${layoutWidth.toFixed(3)}px`);
  board.style.setProperty('--architecture-layout-height', `${ARCHITECTURE_BASE_HEIGHT}px`);
  board.style.setProperty('--architecture-scale-x', scaleX.toFixed(6));
  board.style.setProperty('--architecture-scale-y', scaleY.toFixed(6));
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
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('DOMContentLoaded', schedule, { once: true });

  window[RUNTIME_KEY] = { schedule, observer };
  schedule();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') installViewportRuntime();
