import { useState } from 'react';
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import {
  completeSuccessionOnboardingStep,
  readSuccessionOnboarding,
  resetSuccessionOnboarding,
  skipSuccessionOnboarding,
  successionOnboardingSteps,
} from '../../data/succession/archiveOnboarding';
import './SuccessionOnboardingMission.css';

export default function SuccessionOnboardingMission({ onNavigate }) {
  const [state, setState] = useState(readSuccessionOnboarding);
  const current = successionOnboardingSteps[state.stepIndex] || successionOnboardingSteps[0];
  const completed = state.status === 'completed';
  const skipped = state.status === 'skipped';

  const reset = () => setState(resetSuccessionOnboarding());
  const skip = () => setState(skipSuccessionOnboarding());
  const openMission = () => {
    const nextState = completeSuccessionOnboardingStep(current.id);
    setState(nextState);
    onNavigate(current.target, current.params || {});
  };

  if (completed || skipped) {
    return <aside className="succession-onboarding is-collapsed" data-status={state.status} aria-label="Archive onboarding guide">
      <span>{completed ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />} Archive guide {completed ? 'completed' : 'skipped'}</span>
      <button type="button" onClick={reset}><RotateCcw size={12} aria-hidden="true" /> Reset guide</button>
    </aside>;
  }

  return <aside className="succession-onboarding" data-status="active" aria-labelledby="succession-onboarding-title">
    <header>
      <div><span>First-run mission · local only</span><h2 id="succession-onboarding-title">Learn the archive in four handoffs</h2></div>
      <button type="button" className="is-skip" onClick={skip}><X size={12} aria-hidden="true" /> Skip guide</button>
    </header>
    <div className="succession-onboarding__progress" aria-label={`${state.completedStepIds.length} of ${successionOnboardingSteps.length} onboarding missions completed`}>
      {successionOnboardingSteps.map((step, index) => <span className={state.completedStepIds.includes(step.id) ? 'is-complete' : index === state.stepIndex ? 'is-current' : ''} key={step.id}><i aria-hidden="true" />{String(index + 1).padStart(2, '0')}</span>)}
    </div>
    <section>
      <span>Mission {state.stepIndex + 1} / {successionOnboardingSteps.length}</span>
      <h3>{current.title}</h3>
      <p>{current.description}</p>
      <div><button type="button" onClick={openMission}>Open mission <ArrowRight size={12} aria-hidden="true" /></button><button type="button" onClick={reset}><RotateCcw size={12} aria-hidden="true" /> Reset</button></div>
    </section>
    <p className="succession-onboarding__boundary">Progress is stored only in this browser. Skipping never changes archive data, spoiler boundaries, Reader progress, or research memory.</p>
  </aside>;
}
