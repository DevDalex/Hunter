const legacyCompositeSelectors = [
  ['.yn-chain-inspector__menu', 'listbox'],
  ['.gi-card-tabs', 'tablist'],
  ['.ca-tabs', 'tablist'],
];

const normalizeLegacyAccessibility = () => {
  for (const [selector, role] of legacyCompositeSelectors) {
    document.querySelectorAll(selector).forEach((node) => {
      if (node.querySelector('[role="option"], [role="tab"]')) node.setAttribute('role', role);
    });
  }

  document.querySelectorAll('.ca-table-wrap').forEach((node) => {
    if (!node.hasAttribute('tabindex')) node.tabIndex = 0;
    if (!node.hasAttribute('aria-label')) node.setAttribute('aria-label', 'Chimera Ant hierarchy table; scroll horizontally for additional columns');
  });
};

export const installAccessibilityRuntime = () => {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return null;
  normalizeLegacyAccessibility();
  const observer = new MutationObserver(normalizeLegacyAccessibility);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  return observer;
};
