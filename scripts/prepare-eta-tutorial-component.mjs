import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentPath = resolve(process.cwd(), 'src/components/greed-island/EtaTutorial.jsx');
const etaImport = "import EtaDialogueStage from './EtaDialogueStage';";
const interactiveCardImport = "import InteractiveCard from './InteractiveCard';";
const currentPlaceholder = `        <div className="gi-eta-course__eta" aria-hidden="true"><i /><span>ETA</span><i /><b /></div>
        <div className="gi-eta-course__dialogue">
          <span>Lesson {lesson.number} / 12</span>
          <h3 id={\`gi-lesson-\${lesson.id}\`}>{lesson.title}</h3>
          <p>{lesson.summary}</p>
          <p className="gi-eta-course__announcement" role="status" aria-live="polite">{announcement}</p>
        </div>`;
const approvedScene = '        <EtaDialogueStage lesson={lesson} announcement={announcement} onAdvance={nextLesson} />';

let source = readFileSync(componentPath, 'utf8');

if (!source.includes(etaImport)) {
  if (!source.includes(interactiveCardImport)) throw new Error('Eta tutorial import insertion point was not found.');
  source = source.replace(interactiveCardImport, `${interactiveCardImport}\n${etaImport}`);
}

if (!source.includes(approvedScene)) {
  if (!source.includes(currentPlaceholder)) throw new Error('Current Eta tutorial placeholder was not found.');
  source = source.replace(currentPlaceholder, approvedScene);
}

if (!source.includes(etaImport) || !source.includes(approvedScene) || source.includes('gi-eta-course__eta')) {
  throw new Error('Eta tutorial component did not reach the approved scene state.');
}

writeFileSync(componentPath, source);
console.log('Eta tutorial component prepared for the approved animated scene.');
