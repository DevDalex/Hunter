from __future__ import annotations

import re
from pathlib import Path

ROOT = Path.cwd()
changed: list[str] = []


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding='utf-8')


def write(path: str, text: str) -> None:
    target = ROOT / path
    original = target.read_text(encoding='utf-8')
    if text != original:
        target.write_text(text, encoding='utf-8')
        changed.append(path)


def regex(path: str, pattern: str, replacement: str, *, count: int = 0, flags: int = re.S, required: bool = True) -> None:
    text = read(path)
    updated, matches = re.subn(pattern, replacement, text, count=count, flags=flags)
    if required and matches == 0:
        raise RuntimeError(f'{path}: pattern did not match: {pattern[:120]}')
    write(path, updated)


def remove_between(path: str, start: str, end: str, replacement: str = '') -> None:
    text = read(path)
    first = text.find(start)
    if first < 0:
        raise RuntimeError(f'{path}: start marker not found: {start}')
    last = text.find(end, first)
    if last < 0:
        raise RuntimeError(f'{path}: end marker not found: {end}')
    last += len(end)
    write(path, text[:first] + replacement + text[last:])


def desktop_viewports(path: str, *, filtered: bool = False) -> None:
    suffix = ".filter((item) => selectedViewport === 'all' || item.id === selectedViewport);" if filtered else ';'
    replacement = (
        "const viewports = [\n"
        "  { id: 'desktop-minimum', width: 1366, height: 900 },\n"
        "  { id: 'desktop', width: 1600, height: 1000 },\n"
        f"]{suffix}"
    )
    regex(path, r"const viewports = \[\n.*?\n\](?:\.filter\(\(item\) => selectedViewport === 'all' \|\| item\.id === selectedViewport\))?;", replacement, count=1)


# Global browser and accessibility gates.
desktop_viewports('scripts/visual-qa.mjs', filtered=True)
desktop_viewports('scripts/accessibility-qa.mjs', filtered=True)
remove_between(
    'scripts/accessibility-qa.mjs',
    "    await recordInteraction('mobile-browser menu contains and restores focus'",
    "    await recordInteraction('family-tree branch controls activate with keyboard'",
    "    await recordInteraction('family-tree branch controls activate with keyboard'",
)
regex(
    'scripts/accessibility-qa.mjs',
    r"await recordInteraction\('Black Whale manifest accepts keyboard focus', \{ width: 390, height: 844 \}",
    "await recordInteraction('Black Whale manifest accepts keyboard focus', { width: 1366, height: 900 }",
    count=1,
)

# Route performance uses two supported desktop widths with no network or CPU emulation.
regex(
    'scripts/performance-qa.mjs',
    r"const profiles = \[\n.*?\n\];",
    "const profiles = [\n  { id: 'desktop-minimum', viewport: { width: 1366, height: 900 }, constrained: false },\n  { id: 'desktop', viewport: { width: 1600, height: 1000 }, constrained: false },\n];",
    count=1,
)

write('src/data/performanceBudgets.js', """export const PERFORMANCE_BUDGET_VERSION = '2026-07-28 desktop route-level release budgets';

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

/** @typedef {'desktop-minimum' | 'desktop'} PerformanceProfileId */
/** @typedef {Readonly<Record<PerformanceProfileId, Readonly<RoutePerformanceBudget>>>} RoutePerformanceProfile */

const desktopDefault = Object.freeze({
  readyMs: 13_000,
  transferBytes: 15_000_000,
  resourceCount: 180,
  cls: 0.15,
  longTasks: 60,
});

/** @type {Readonly<Record<string, RoutePerformanceProfile>>} */
export const routePerformanceBudgets = Object.freeze({
  default: Object.freeze({ 'desktop-minimum': desktopDefault, desktop: desktopDefault }),
  home: Object.freeze({
    'desktop-minimum': Object.freeze({ readyMs: 8_000, transferBytes: 4_000_000, resourceCount: 80, cls: 0.1, longTasks: 20 }),
    desktop: Object.freeze({ readyMs: 8_000, transferBytes: 4_000_000, resourceCount: 80, cls: 0.1, longTasks: 20 }),
  }),
  'series-research': Object.freeze({
    'desktop-minimum': Object.freeze({ readyMs: 13_000, transferBytes: 12_000_000, resourceCount: 160, cls: 0.15, longTasks: 55 }),
    desktop: Object.freeze({ readyMs: 13_000, transferBytes: 12_000_000, resourceCount: 160, cls: 0.15, longTasks: 55 }),
  }),
  'family-tree': Object.freeze({
    'desktop-minimum': Object.freeze({ readyMs: 11_000, transferBytes: 12_000_000, resourceCount: 150, cls: 0.12, longTasks: 50 }),
    desktop: Object.freeze({ readyMs: 11_000, transferBytes: 12_000_000, resourceCount: 150, cls: 0.12, longTasks: 50 }),
  }),
  'black-whale': Object.freeze({
    'desktop-minimum': Object.freeze({ readyMs: 11_000, transferBytes: 12_000_000, resourceCount: 150, cls: 0.12, longTasks: 50 }),
    desktop: Object.freeze({ readyMs: 11_000, transferBytes: 12_000_000, resourceCount: 150, cls: 0.12, longTasks: 50 }),
  }),
  encyclopedia: Object.freeze({
    'desktop-minimum': Object.freeze({ readyMs: 10_000, transferBytes: 10_000_000, resourceCount: 130, cls: 0.12, longTasks: 45 }),
    desktop: Object.freeze({ readyMs: 10_000, transferBytes: 10_000_000, resourceCount: 130, cls: 0.12, longTasks: 45 }),
  }),
  'hisoka-chrollo': Object.freeze({
    'desktop-minimum': Object.freeze({ readyMs: 9_000, transferBytes: 8_000_000, resourceCount: 110, cls: 0.1, longTasks: 35 }),
    desktop: Object.freeze({ readyMs: 9_000, transferBytes: 8_000_000, resourceCount: 110, cls: 0.1, longTasks: 35 }),
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
""")

# Succession rendered and cross-browser release gates.
desktop_viewports('scripts/succession-final-release-qa.mjs')
regex('scripts/succession-final-release-qa.mjs', r"\n        if \(viewport\.id !== 'tablet'\) \{\n(.*?)\n        \}", r"\n        {\n\1\n        }", count=1)
regex('scripts/succession-final-release-qa.mjs', r"\n          \.\.\.\(viewport\.id !== 'desktop' \? audit\.smallTargets : \[\]\),", '', count=1)
remove_between(
    'scripts/succession-final-release-qa.mjs',
    "  await runInteraction('mobile archive drawer traps Escape and restores focus'",
    "  await runInteraction('assignment result modes are keyboard operable'",
    "  await runInteraction('assignment result modes are keyboard operable'",
)
regex('scripts/succession-final-release-qa.mjs', r'responsive route renders', 'desktop route renders', required=False)
desktop_viewports('scripts/succession-cross-browser-qa.mjs')

# Shared interaction QA: retain real desktop behavior only.
remove_between(
    'scripts/interaction-qa.mjs',
    "  await run('Nen mobile state has no horizontal spill'",
    "  await run('Dedicated relationship workspace filters and links remain readable'",
    "  await run('Dedicated relationship workspace filters and links remain readable'",
)
remove_between(
    'scripts/interaction-qa.mjs',
    "  await run('Dedicated relationship workspace remains contained on mobile'",
    '} finally {',
    '} finally {',
)

# Succession specialist suites.
remove_between(
    'scripts/succession-archive-shell-qa.mjs',
    "  const mobile = await browser.newPage",
    "  await mobile.close();",
    "  await desktop.close();",
)
remove_between(
    'scripts/succession-final-product-qa.mjs',
    "  const mobile = await browser.newPage",
    "  await mobile.close();",
    "  await desktop.close();",
)
remove_between(
    'scripts/succession-reader-qa.mjs',
    "  const mobile = await browser.newPage",
    "  await mobile.close();",
)

# Greed Island specialist suites.
for path in [
    'scripts/greed-island-routing-qa.mjs',
    'scripts/greed-island-qa.mjs',
    'scripts/greed-island-archive-qa.mjs',
    'scripts/greed-island-libraries-qa.mjs',
]:
    remove_between(path, "  const mobile = await browser.newPage", "  await mobile.close();")
remove_between(
    'scripts/greed-island-systems-qa.mjs',
    "  const mobile = await browser.newPage",
    "  await mobileLocations.close();",
)

# Static audits no longer demand narrow breakpoints, drawers, touch layouts, or narrow-width documentation.
audit_files = [
    'scripts/audit-succession-visual-foundation.mjs',
    'scripts/audit-succession-shell-redesign.mjs',
    'scripts/audit-succession-page-header-redesign.mjs',
    'scripts/audit-succession-breadcrumb-redesign.mjs',
    'scripts/audit-succession-batch-2-completion.mjs',
    'scripts/audit-succession-character-command.mjs',
    'scripts/audit-succession-royal-command.mjs',
    'scripts/audit-succession-batch-3-closure.mjs',
    'scripts/audit-succession-batch-5-final.mjs',
]
for path in audit_files:
    lines = read(path).splitlines(keepends=True)
    kept = []
    for line in lines:
        lowered = line.lower()
        if any(term in lowered for term in ('mobile', 'tablet', 'responsive', 'touch-action', 'hover: none', 'pointer: coarse')):
            continue
        kept.append(line)
    write(path, ''.join(kept))

# The foundation principle now states the real product contract.
regex(
    'src/data/succession/visualDesignSystem.js',
    r"freezeRecord\(\{ id: 'responsive', rule: 'Mobile layouts reorder by importance instead of shrinking desktop arrangements\.' \}\),",
    "freezeRecord({ id: 'desktop-contract', rule: 'Layouts are composed and verified for the supported 1366px-and-wider desktop canvas.' }),",
    count=1,
)

# Workflow wording and manual diagnostics use only supported desktop widths.
workflow_files = [
    '.github/workflows/succession-visual-redesign.yml',
    '.github/workflows/succession-visual-redesign-batch-5.yml',
    '.github/workflows/release-quality.yml',
]
for path in workflow_files:
    text = read(path)
    text = text.replace('all viewports', 'both supported desktop widths')
    text = text.replace('responsive, accessibility, performance, and cross-browser', 'desktop, accessibility, performance, and cross-browser')
    text = text.replace('responsive and cross-browser', 'desktop and cross-browser')
    write(path, text)

# Remove narrow-platform language from active prose/config outside legacy CSS and components.
for root_name in ('docs', '.github/workflows'):
    for target in (ROOT / root_name).rglob('*'):
        if not target.is_file() or target.suffix.lower() not in {'.md', '.yml', '.yaml'}:
            continue
        text = target.read_text(encoding='utf-8')
        updated = re.sub(r'(?i)\bmobile\b', 'unsupported narrow-width', text)
        updated = re.sub(r'(?i)\btablet\b', 'unsupported narrow-width', updated)
        updated = re.sub(r'(?i)\bresponsive\b', 'desktop', updated)
        if updated != text:
            target.write_text(updated, encoding='utf-8')
            relative = str(target.relative_to(ROOT))
            if relative not in changed:
                changed.append(relative)

# Active requirements must not contain narrow-width profiles or dimensions.
violations: list[str] = []
scan_roots = [ROOT / 'scripts', ROOT / 'docs', ROOT / '.github/workflows', ROOT / 'src/data']
for scan_root in scan_roots:
    for target in scan_root.rglob('*'):
        if not target.is_file() or target.suffix.lower() not in {'.js', '.mjs', '.py', '.md', '.yml', '.yaml', '.json'}:
            continue
        if target.name == 'retire-narrow-width-contracts.py':
            continue
        text = target.read_text(encoding='utf-8', errors='ignore')
        for line_number, line in enumerate(text.splitlines(), start=1):
            if re.search(r'(?i)\b(mobile|tablet|constrained-mobile)\b|\b390\b|\b768\b', line):
                violations.append(f'{target.relative_to(ROOT)}:{line_number}: {line.strip()}')

if violations:
    raise RuntimeError('Narrow-width requirements remain:\n' + '\n'.join(violations[:200]))

print(f'Updated {len(changed)} files:')
for path in sorted(changed):
    print(f'- {path}')
