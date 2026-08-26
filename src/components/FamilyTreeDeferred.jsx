import { lazy, Suspense } from 'react';

const FamilyTree = lazy(() => import('./FamilyTree'));

function FamilyTreePreview() {
  return <main className="succession-progressive-workspace" aria-busy="true" aria-live="polite">
    <span>Kakin Royal Family</span>
    <h1>Royal family hierarchy</h1>
    <p>Opening the interactive royal, guard, and mafia relationship map…</p>
  </main>;
}

export default function FamilyTreeDeferred(props) {
  return <Suspense fallback={<FamilyTreePreview />}>
    <FamilyTree {...props} />
  </Suspense>;
}
