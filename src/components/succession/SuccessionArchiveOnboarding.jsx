import { useEffect, useState } from 'react';
import { BookOpen, Compass, RotateCcw, Search, Sparkles } from 'lucide-react';
import { archiveEntryMissions } from '../../data/succession/readingExperience';

const PREFERENCE_KEY = 'hunter:succession:onboarding:v1';
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
const readPreference = () => {
  try { return JSON.parse(globalThis.localStorage?.getItem(PREFERENCE_KEY) || 'null'); }
  catch { return null; }
};

export default function SuccessionArchiveOnboarding({ spoilerLimit, onNavigate, onOpenSearch }) {
  const [rememberChoice, setRememberChoice] = useState(() => Boolean(readPreference()?.skip));
  const [automaticMission, setAutomaticMission] = useState(() => readPreference()?.skip ? readPreference()?.mission : '');
  const chooseMission = (mission, automatic = false) => {
    if (!automatic && rememberChoice && globalThis.localStorage) {
      globalThis.localStorage.setItem(PREFERENCE_KEY, JSON.stringify({ mission: mission.id, skip: true }));
    }
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
  useEffect(() => {
    if (!automaticMission) return;
    const mission = archiveEntryMissions.find((item) => item.id === automaticMission);
    setAutomaticMission('');
    if (mission) chooseMission(mission, true);
  }, [automaticMission]);
  const resetPreference = () => {
    globalThis.localStorage?.removeItem(PREFERENCE_KEY);
    setRememberChoice(false);
    setAutomaticMission('');
  };

  return <main className="succession-onboarding" aria-labelledby="succession-onboarding-title">
    <header>
      <p>Succession Contest Archive</p>
      <h1 id="succession-onboarding-title">What are you here to do?</h1>
      <span>The archive will preserve your Chapter {spoilerLimit} reading boundary unless you explicitly open the complete record.</span>
      <div className="succession-onboarding__preference">
        <label><input type="checkbox" checked={rememberChoice} onChange={(event) => setRememberChoice(event.target.checked)} /> Remember my mission and skip this screen next time</label>
        {readPreference()?.mission && <button type="button" onClick={resetPreference}><RotateCcw size={15} aria-hidden="true" /> Reset saved mission</button>}
      </div>
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
