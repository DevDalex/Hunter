import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/components/succession/SuccessionArchiveApp.jsx';
const current = await readFile(path, 'utf8');
const before = `<TimelineWorkspace requestedArc="succession-contest" requestedScope={routeParams.scope || 'events'} requestedSearch={routeParams.search || ''} spoilerLimit={spoilerLimit} onNavigate={(params) => onNavigate('timeline', params)} onOpenLocation={(room) => onNavigate('black-whale', { room })} />`;
const after = `<TimelineWorkspace embedded requestedArc="succession-contest" requestedScope={routeParams.scope || 'events'} requestedSearch={routeParams.search || ''} spoilerLimit={spoilerLimit} onNavigate={(params) => onNavigate('timeline', params)} onOpenLocation={(room) => onNavigate('black-whale', { room })} />`;

if (current.includes(after)) {
  console.log('Embedded timeline heading context already applied.');
} else {
  if (!current.includes(before)) throw new Error('Embedded TimelineWorkspace target was not found.');
  await writeFile(path, current.replace(before, after));
  console.log('Embedded timeline heading context applied.');
}
