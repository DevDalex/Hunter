export const PERFORMANCE_BUDGET_VERSION = '2026-07-20 expanded feature-growth headroom';

export const performanceBudgets = Object.freeze({
  entryJs: 500_000,
  startupJs: 1_000_000,
  startupCss: 1_000_000,
  javascriptChunk: 750_000,
  portrait: 160_000,
  portraitLibrary: 2_200_000,
});

export const formatPerformanceBudget = (value) => Number(value).toLocaleString('en-US');
