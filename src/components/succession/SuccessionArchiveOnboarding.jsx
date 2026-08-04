import { BookOpen, Compass, Search, Sparkles } from 'lucide-react';
import { archiveEntryMissions } from '../../data/succession/readingExperience';

const iconByMission = {
  continue: BookOpen,
  refresh: Sparkles,
  research: Search,
  complete: Compass,
};

export default function SuccessionArchiveOnboarding({ spoilerLimit, onNavigate, onOpenSearch }) {
  const chooseMission = (mission) => {
    if (mission.id === 'research') {
      onOpenSearch?.();
      return;
    }
    onNavigate(mission.target, {
      ...(mission.params || {}),
      chapter: mission.id === 'complete' ? undefined : spoilerLimit,
      mission: mission.id,
    });
  };

  return <main className="succession-onboarding" aria-labelledby="succession-onboarding-title">
    <header>
      <p>Succession Contest Archive</p>
      <h1 id="succession-onboarding-title">What are you here to do?</h1>
      <span>The archive will preserve your Chapter {spoilerLimit} reading boundary unless you explicitly open the complete record.</span>
    </header>
    <div className="succession-onboarding__missions">
      {archiveEntryMissions.map((mission) => {
        const Icon = iconByMission[mission.id] || Compass;
        return <button type="button" key={mission.id} onClick={() => chooseMission(mission)}>
          <Icon size={22} aria-hidden="true" />
          <strong>{mission.label}</strong>
          <span>{mission.description}</span>
          <small>{mission.actionLabel}</small>
        </button>;
      })}
    </div>
  </main>;
}
