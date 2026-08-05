import { Info } from 'lucide-react';

const notices = Object.freeze({
  characters: Object.freeze({ sources: ['Hunters', 'Deaths', 'Succession Roster'], reason: 'Character identity, life state, roles, and chapter history now have one authoritative dossier.' }),
  princes: Object.freeze({ sources: ['Queens', 'Family Tree', 'Royal Family'], reason: 'Queens, princes, households, and protection circles now share one canonical royal workspace.' }),
  organizations: Object.freeze({ sources: ['Mafia', 'Military', 'Politics', 'Justice', 'Power Blocs'], reason: 'Authority, hierarchy, territory, personnel, and institutional evidence now live in one connected organization model.' }),
  research: Object.freeze({ sources: ['Media'], reason: 'Media provenance is maintained with sources, confidence, evidence, and research gaps.' }),
  timeline: Object.freeze({ sources: ['Succession Timeline'], reason: 'The maintained chronology is voyage-only and chapter-bounded.' }),
  'guardian-spirit-beasts': Object.freeze({ sources: ['Beasts'], reason: 'Guardian Spirit Beast records now use host state, ritual state, evidence, and chapter-safe mechanics.' }),
});

export default function SuccessionConsolidationNotice({ routeId }) {
  const notice = notices[routeId];
  if (!notice) return null;
  return <aside className="succession-consolidation-notice" role="note" aria-label="Consolidated route notice">
    <Info size={17} aria-hidden="true" />
    <div><strong>Consolidated workspace</strong><p>{notice.sources.join(', ')} were merged here. {notice.reason}</p></div>
  </aside>;
}
