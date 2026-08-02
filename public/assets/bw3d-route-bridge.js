(() => {
  const target = '/succession/black-whale-3d';
  const isSuccessionPage = () => window.location.pathname.includes('/succession-contest')
    || window.location.pathname.startsWith('/succession/');

  const makeLink = (label, attribute) => {
    const link = document.createElement('a');
    link.href = target;
    link.textContent = label;
    link.setAttribute(attribute, 'true');
    link.setAttribute('aria-label', 'Open Black Whale 3D project progress');
    return link;
  };

  const install = () => {
    if (!isSuccessionPage()) return;

    document.querySelectorAll('.succession-architecture__navigation, .succession-archive-shell__primary-nav, .workspace-nav__desktop').forEach((nav) => {
      if (nav.querySelector('[data-bw3d-route-bridge]')) return;
      nav.append(makeLink('Black Whale 3D', 'data-bw3d-route-bridge'));
    });

    document.querySelectorAll('.ship-source-banner__actions').forEach((actions) => {
      if (actions.querySelector('[data-bw3d-atlas-bridge]')) return;
      actions.prepend(makeLink('Open 3D project', 'data-bw3d-atlas-bridge'));
    });

    if (!document.querySelector('[data-bw3d-floating-bridge]')) {
      const link = makeLink('Black Whale 3D progress', 'data-bw3d-floating-bridge');
      Object.assign(link.style, {
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: '80',
        padding: '10px 13px',
        border: '2px solid #111',
        background: '#fff',
        color: '#111',
        font: '800 12px/1.2 system-ui, sans-serif',
        letterSpacing: '.04em',
        textDecoration: 'none',
        boxShadow: '4px 4px 0 #111',
      });
      document.body.append(link);
    }
  };

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      install();
    });
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
