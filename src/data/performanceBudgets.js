export const PERFORMANCE_BUDGET_VERSION = '2026-07-28 route-level release budgets';

export const performanceBudgets = Object.freeze({
  entryJs: 500_000,
  startupJs: 1_000_000,
  startupCss: 1_000_000,
  javascriptChunk: 750_000,
  portrait: 160_000,
  portraitLibrary: 2_200_000,
});

/**
 * @typedef {{
 *   readyMs: number;
 *   transferBytes: number;
 *   resourceCount: number;
 *   cls: number;
 *   longTasks: number;
 * }} RoutePerformanceBudget
 */

/** @typedef {'desktop' | 'constrained-mobile'} PerformanceProfileId */
/** @typedef {Readonly<Record<PerformanceProfileId, Readonly<RoutePerformanceBudget>>>} RoutePerformanceProfile */

const desktopDefault = Object.freeze({
  readyMs: 13_000,
  transferBytes: 15_000_000,
  resourceCount: 180,
  cls: 0.15,
  longTasks: 60,
});

const constrainedDefault = Object.freeze({
  readyMs: 13_000,
  transferBytes: 15_000_000,
  resourceCount: 180,
  cls: 0.15,
  longTasks: 80,
});

/** @type {Readonly<Record<string, RoutePerformanceProfile>>} */
export const routePerformanceBudgets = Object.freeze({
  default: Object.freeze({
    desktop: desktopDefault,
    'constrained-mobile': constrainedDefault,
  }),
  home: Object.freeze({
    desktop: Object.freeze({ readyMs: 8_000, transferBytes: 4_000_000, resourceCount: 80, cls: 0.1, longTasks: 20 }),
    'constrained-mobile': Object.freeze({ readyMs: 12_000, transferBytes: 4_000_000, resourceCount: 80, cls: 0.1, longTasks: 35 }),
  }),
  'series-research': Object.freeze({
    desktop: Object.freeze({ readyMs: 13_000, transferBytes: 12_000_000, resourceCount: 160, cls: 0.15, longTasks: 55 }),
    'constrained-mobile': Object.freeze({ readyMs: 13_000, transferBytes: 12_000_000, resourceCount: 160, cls: 0.15, longTasks: 75 }),
  }),
  'family-tree': Object.freeze({
    desktop: Object.freeze({ readyMs: 11_000, transferBytes: 12_000_000, resourceCount: 150, cls: 0.12, longTasks: 50 }),
    'constrained-mobile': Object.freeze({ readyMs: 13_000, transferBytes: 12_000_000, resourceCount: 150, cls: 0.15, longTasks: 70 }),
  }),
  'black-whale': Object.freeze({
    desktop: Object.freeze({ readyMs: 11_000, transferBytes: 12_000_000, resourceCount: 150, cls: 0.12, longTasks: 50 }),
    'constrained-mobile': Object.freeze({ readyMs: 13_000, transferBytes: 12_000_000, resourceCount: 150, cls: 0.15, longTasks: 70 }),
  }),
  encyclopedia: Object.freeze({
    desktop: Object.freeze({ readyMs: 10_000, transferBytes: 10_000_000, resourceCount: 130, cls: 0.12, longTasks: 45 }),
    'constrained-mobile': Object.freeze({ readyMs: 13_000, transferBytes: 10_000_000, resourceCount: 130, cls: 0.15, longTasks: 65 }),
  }),
  'hisoka-chrollo': Object.freeze({
    desktop: Object.freeze({ readyMs: 9_000, transferBytes: 8_000_000, resourceCount: 110, cls: 0.1, longTasks: 35 }),
    'constrained-mobile': Object.freeze({ readyMs: 12_000, transferBytes: 8_000_000, resourceCount: 110, cls: 0.12, longTasks: 55 }),
  }),
});

/**
 * @param {string} routeId
 * @param {PerformanceProfileId} profileId
 * @returns {Readonly<RoutePerformanceBudget>}
 */
export function performanceBudgetFor(routeId, profileId) {
  return routePerformanceBudgets[routeId]?.[profileId] ?? routePerformanceBudgets.default[profileId];
}

/** @param {number} value */
export const formatPerformanceBudget = (value) => Number(value).toLocaleString('en-US');
