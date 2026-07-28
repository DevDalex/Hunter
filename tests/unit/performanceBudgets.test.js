import { describe, expect, it } from 'vitest';
import {
  performanceBudgetFor,
  routePerformanceBudgets,
} from '../../src/data/performanceBudgets.js';

describe('route performance budgets', () => {
  it('returns an explicit route and profile budget', () => {
    expect(performanceBudgetFor('home', 'desktop')).toBe(routePerformanceBudgets.home.desktop);
  });

  it('falls back to the reviewed default budget', () => {
    expect(performanceBudgetFor('unregistered-route', 'constrained-mobile')).toBe(
      routePerformanceBudgets.default['constrained-mobile'],
    );
  });

  it('defines every measured release metric as a positive ceiling', () => {
    for (const route of Object.values(routePerformanceBudgets)) {
      for (const budget of Object.values(route)) {
        expect(budget.readyMs).toBeGreaterThan(0);
        expect(budget.transferBytes).toBeGreaterThan(0);
        expect(budget.resourceCount).toBeGreaterThan(0);
        expect(budget.cls).toBeGreaterThan(0);
        expect(budget.longTasks).toBeGreaterThan(0);
      }
    }
  });
});
