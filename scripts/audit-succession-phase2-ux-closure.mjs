import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 2 UX closure audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [router, onboarding] = await Promise.all([
    vite.ssrLoadModule('/src/lib/appRouter.js'),
    vite.ssrLoadModule('/src/data/succession/archiveOnboarding.js'),
  ]);

  const consolidatedCases = [
    ['/story/succession-contest/mafia', 'organizations', 'mafia'],
    ['/story/succession-contest/military', 'organizations', 'military'],
    ['/story/succession-contest/justice', 'organizations', 'justice'],
    ['/story/succession-contest/cast', 'characters', 'cast'],
    ['/story/succession-contest/royal-family', 'princes', 'royal-family'],
    ['/story/succession-contest/records', 'chapters', 'records'],
    ['/story/succession-contest/chapters', 'reader', 'chapters'],
  ];
  for (const [pathname, target, source] of consolidatedCases) {
    const resolved = router.parseCleanRoute(pathname, '');
    assert(resolved.view === 'succession' && resolved.target === target, `${pathname} did not resolve to ${target}`);
    assert(resolved.params.consolidatedFrom === source, `${pathname} lost consolidatedFrom=${source}`);
  }
  const retiredHash = router.parseLegacyHashRoute('#/succession/mafia');
  assert(retiredHash.target === 'organizations' && retiredHash.params.consolidatedFrom === 'mafia', 'legacy hash retired route lost its consolidation origin');

  assert(onboarding.SUCCESSION_ONBOARDING_VERSION === 1, 'onboarding storage version drifted');
  assert(onboarding.successionOnboardingSteps.length === 4, `expected four onboarding missions, found ${onboarding.successionOnboardingSteps.length}`);
  assert(new Set(onboarding.successionOnboardingSteps.map((step) => step.id)).size === onboarding.successionOnboardingSteps.length, 'onboarding mission IDs are not unique');
  assert(onboarding.successionOnboardingSteps.map((step) => step.target).join('|') === 'story|characters|research|reader', 'onboarding route handoffs drifted');
  const normalized = onboarding.normalizeSuccessionOnboarding({ status: 'skipped', stepIndex: 99, completedStepIds: ['orient', 'orient', 'invalid'] });
  assert(normalized.status === 'skipped' && normalized.stepIndex === 3, 'onboarding normalization lost skipped state or index bounds');
  assert(normalized.completedStepIds.join('|') === 'orient', 'onboarding completion IDs are not deduplicated/bounded');
  const completed = onboarding.normalizeSuccessionOnboarding({ status: 'active', completedStepIds: onboarding.successionOnboardingSteps.map((step) => step.id) });
  assert(completed.status === 'completed', 'all completed onboarding missions do not force completed state');

  const [shell, missionUi, missionCss, noticeUi, noticeCss, routerSource] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveShell.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionOnboardingMission.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionOnboardingMission.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionConsolidatedRouteNotice.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionConsolidatedRouteNotice.css'), 'utf8'),
    readFile(path.join(root, 'src/lib/appRouter.js'), 'utf8'),
  ]);

  assert(shell.includes('SuccessionOnboardingMission') && shell.includes('<SuccessionOnboardingMission onNavigate={onNavigate} />'), 'onboarding mission is not mounted at archive entry');
  assert(shell.includes('SuccessionConsolidatedRouteNotice') && shell.includes('routeParams?.consolidatedFrom'), 'consolidated route notice is not mounted from router state');
  for (const token of ['First-run mission · local only', 'Open mission', 'Skip guide', 'Reset guide', 'Progress is stored only in this browser']) assert(missionUi.includes(token), `onboarding UI is missing ${token}`);
  for (const token of ['Route consolidated', 'retained for bookmarks and incoming links', 'consolidated instead of duplicated']) assert(noticeUi.includes(token), `consolidated route notice is missing ${token}`);
  assert(routerSource.includes('consolidatedFrom: nextParams.consolidatedFrom || nextTarget') && routerSource.includes('consolidatedFrom: params.consolidatedFrom || pathPart'), 'router does not preserve both target-based and path-based consolidation origins');

  for (const css of [missionCss, noticeCss]) {
    assert(!/@media\s*\([^)]*max-width:/i.test(css), 'Phase 2 UX added a forbidden mobile/tablet breakpoint');
    assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'Phase 2 UX lacks reduced-motion handling');
    const sizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
    assert(sizes.every((size) => size >= 11), `Phase 2 UX introduced text below 11px: ${sizes.filter((size) => size < 11).join(', ')}`);
  }

  console.log(`Succession Phase 2 UX closure passed: ${consolidatedCases.length + 1} legacy/retired routes preserve informative origins and ${onboarding.successionOnboardingSteps.length} persistent onboarding missions expose skip/reset behavior.`);
} finally {
  await vite.close();
}
