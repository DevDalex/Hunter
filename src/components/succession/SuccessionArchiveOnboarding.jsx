import { BookOpen, Compass, Search, Sparkles } from 'lucide-react';
import { archiveEntryMissions } from '../../data/succession/readingExperience';

const iconByMission = {
  'continue-reading': BookOpen,
  'refresh-story': Sparkles,
  'research-topic': Search,
  'open-complete-archive': Compass,
};

const actionByMission = {
  'continue-reading': 'Continue in reader',
  'refresh-story': 'Open recap',
  'research-topic': 'Search archive',
  'open-complete-archive': 'Open full archive',
};

export default function SuccessionArchiveOnboarding({ spoilerLimit, onNavigate, onOpenSearch }) {
  const chooseMission = (mission) => {
    if (mission.id === 'research-topic') {
      onOpenSearch?.();
      return;
    }
    const complete = mission.id === 'open-complete-archive';
    onNavigate(mission.target, {
      ...(mission.params || {}),
      ...(!complete ? { chapter: spoilerLimit } : {}),
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
          <small>{actionByMission[mission.id]}</small>
        </button>;
      })}
    </div>
  </main>;
}
