import { lazy, Suspense } from 'react';
import { ShipWheel } from 'lucide-react';

const BlackWhaleGuide = lazy(() => import('./BlackWhaleGuide'));

function BlackWhalePreview({ spoilerLimit }) {
  return <section className="succession-progressive-workspace" aria-busy="true" aria-live="polite">
    <ShipWheel size={20} aria-hidden="true" />
    <span>Black Whale 1 spatial intelligence</span>
    <h2>Ship atlas · Chapter {spoilerLimit}</h2>
    <p>Opening the interactive occupancy, movement, and canonical-location overlays…</p>
  </section>;
}

export default function BlackWhaleGuideDeferred(props) {
  return <Suspense fallback={<BlackWhalePreview spoilerLimit={props.spoilerLimit} />}>
    <BlackWhaleGuide {...props} />
  </Suspense>;
}
