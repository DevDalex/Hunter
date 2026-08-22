import { useMemo, useState } from 'react';
import { Building2, Gavel, Route, Shield, Sparkles, Swords } from 'lucide-react';
import { getEntityById } from '../../data/succession/successionData';
import './SuccessionBlackWhaleInstitutionalOverlays.css';

const militaryIds = new Set(['organization:kakin-military', 'organization:benjamin-private-army']);
const justiceIds = new Set(['organization:kakin-justice-bureau']);
const mafiaIds = new Set(['organization:xi-yu', 'organization:cha-r', 'organization:heil-ly']);

const overlayDefinitions = Object.freeze([
  ['military', 'Military', Shield],
  ['justice', 'Justice', Gavel],
  ['mafia', 'Mafia', Swords],
  ['nen', 'Nen', Sparkles],
  ['routes', 'Routes', Route],
  ['incidents', 'Incidents', Building2],
]);

const explicitOrganizationIds = (record) => {
  const events = (record.state?.events || []).map(getEntityById).filter(Boolean);
  const assignments = (record.state?.assignments || []).map(getEntityById).filter(Boolean);
  return new Set([
    ...events.flatMap((event) => event.organizationIds || []),
    ...assignments.flatMap((assignment) => [assignment.allegianceEntityId, assignment.principalEntityId, assignment.reportingEntityId]),
  ].filter(Boolean));
};

const hasAny = (set, wanted) => [...wanted].some((id) => set.has(id));

const flagsFor = (record) => {
  const organizationIds = explicitOrganizationIds(record);
  const events = (record.state?.events || []).map(getEntityById).filter(Boolean);
  return Object.freeze({
    military: hasAny(organizationIds, militaryIds),
    justice: hasAny(organizationIds, justiceIds),
    mafia: hasAny(organizationIds, mafiaIds),
    nen: events.some((event) => Array.isArray(event.abilityIds) && event.abilityIds.length > 0),
    routes: record.system === 'transport-and-access',
    incidents: (record.state?.events || []).length > 0,
  });
};

export default function SuccessionBlackWhaleInstitutionalOverlays({ records = [] }) {
  const [enabled, setEnabled] = useState(() => new Set(overlayDefinitions.map(([id]) => id)));
  const rows = useMemo(() => records.map((record) => ({ record, flags: flagsFor(record) })), [records]);
  const counts = Object.fromEntries(overlayDefinitions.map(([id]) => [id, rows.filter(({ flags }) => flags[id]).length]));
  const visibleRows = rows.filter(({ flags }) => [...enabled].some((id) => flags[id])).slice(0, 18);

  const toggle = (id) => setEnabled((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return <section className="succession-black-whale-overlays" aria-labelledby="succession-black-whale-overlays-title">
    <header><span>Institutional / operational overlays</span><h4 id="succession-black-whale-overlays-title">Explicit presence signals, never inferred territorial control</h4><p>Military, Justice and Mafia markers require linked records that explicitly identify those organizations. Nen requires linked event ability IDs; Routes use the maintained transport/access infrastructure class; Incidents require active event records.</p></header>
    <nav aria-label="Black Whale institutional overlays">{overlayDefinitions.map(([id, label, Icon]) => <button type="button" className={enabled.has(id) ? 'is-active' : ''} aria-pressed={enabled.has(id)} onClick={() => toggle(id)} key={id}><Icon size={11} aria-hidden="true" /> {label}<small>{counts[id]}</small></button>)}</nav>
    <div className="succession-black-whale-overlays__rows">{visibleRows.map(({ record, flags }) => <article key={record.location.id}><header><b>{record.location.name}</b><small>{record.system.replaceAll('-', ' ')}</small></header><div>{overlayDefinitions.filter(([id]) => enabled.has(id) && flags[id]).map(([id, label, Icon]) => <span key={id}><Icon size={10} aria-hidden="true" /> {label}</span>)}</div><small>{record.state.events.length} events · {record.state.assignments.length} assignments · {record.state.occupants.length} occupants</small></article>)}</div>
    {!enabled.size && <p className="succession-black-whale-overlays__note">All institutional overlays are hidden. Re-enable one or more layers above.</p>}
    {enabled.size > 0 && rows.filter(({ flags }) => [...enabled].some((id) => flags[id])).length > visibleRows.length && <p className="succession-black-whale-overlays__note">Showing {visibleRows.length} of {rows.filter(({ flags }) => [...enabled].some((id) => flags[id])).length} locations matching the enabled overlay layers.</p>}
    <p className="succession-black-whale-overlays__note">A marker means a maintained record is linked to this location at the selected chapter boundary. It does not mean ownership, command, jurisdiction or exclusive control unless a separate canonical record states that.</p>
  </section>;
}
