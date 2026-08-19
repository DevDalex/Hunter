import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const changed = [];

const read = (relative) => readFile(path.join(root, relative), 'utf8');
const write = async (relative, content) => {
  const target = path.join(root, relative);
  const before = await read(relative);
  const next = `${content.trimEnd()}\n`;
  if (before === next) return;
  await writeFile(target, next);
  changed.push(relative);
};
const edit = async (relative, transform) => write(relative, transform(await read(relative)));
const replaceRequired = (source, from, to, label) => {
  if (!source.includes(from)) throw new Error(`Missing expected ${label || 'contract'}: ${from}`);
  return source.replace(from, to);
};

function matchingBrace(source, opening) {
  let depth = 0;
  let quote = null;
  let comment = false;
  for (let i = opening; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];
    if (comment) {
      if (char === '*' && next === '/') { comment = false; i += 1; }
      continue;
    }
    if (quote) {
      if (char === '\\') { i += 1; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === '/' && next === '*') { comment = true; i += 1; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error('Unbalanced CSS while removing unsupported media block');
}

function unsupportedMedia(condition) {
  const normalized = condition.toLowerCase().replace(/\s+/g, ' ');
  const widths = [...normalized.matchAll(/max-(?:device-)?width\s*:\s*(\d+(?:\.\d+)?)px/g)].map((match) => Number(match[1]));
  return widths.some((width) => width <= 1180)
    || normalized.includes('pointer: coarse')
    || normalized.includes('hover: none')
    || normalized.includes('orientation: portrait');
}

function purgeUnsupportedMedia(source) {
  let output = source;
  let cursor = 0;
  while (true) {
    const at = output.indexOf('@media', cursor);
    if (at < 0) break;
    const opening = output.indexOf('{', at);
    if (opening < 0) break;
    const closing = matchingBrace(output, opening);
    const condition = output.slice(at, opening);
    if (unsupportedMedia(condition)) {
      output = `${output.slice(0, at)}\n${output.slice(closing + 1)}`;
      cursor = Math.max(0, at - 1);
    } else {
      cursor = closing + 1;
    }
  }
  return output.replace(/\n{3,}/g, '\n\n');
}

async function cssFiles(directory) {
  const absolute = path.join(root, directory);
  const entries = await readdir(absolute, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await cssFiles(relative));
    else if (entry.isFile() && entry.name.endsWith('.css')) files.push(relative);
  }
  return files;
}

for (const relative of [...await cssFiles('src'), ...await cssFiles('public')]) {
  await edit(relative, purgeUnsupportedMedia);
}

await edit('src/components/succession/SuccessionPhase2PresentationConsistency.css', (source) => source
  .replace(/\/\*[\s\S]*?\*\/\s*@import url\('\/succession-phase-2-presentation-consistency\.css'\);\s*/m, '/* Route-owned desktop-only Phase 2 presentation contract. */\n')
  .replace('@media (min-width: 1024px)', '@media (min-width: 1180px)'));

await edit('scripts/run-succession-runtime-audits-413.mjs', (source) => source.replace(
  ", ['phase-2-presentation-consistency', 'scripts/audit-succession-phase-2-presentation-consistency.mjs']",
  '',
));

await edit('scripts/audit-succession-phase-2-design-system.mjs', (source) => {
  let next = source;
  next = next.replace("  '.succession-archive__mobile-bar',\n  '.succession-drawer',\n", '');
  next = next.replace("  'height: 100dvh !important',", "  'height: 100vh !important',");
  next = replaceRequired(next,
    "assert(shell.includes('succession-archive__layout'), 'canonical shared shell is missing');\nassert(shell.includes('succession-archive__mobile-bar'), 'canonical mobile shell is missing');\nassert(shell.includes('succession-drawer'), 'canonical modal navigation drawer is missing');",
    "assert(shell.includes('succession-archive__layout') && shell.includes('succession-archive__sidebar'), 'canonical desktop shell is missing');\nassert(!shell.includes('succession-archive__mobile-bar') && !shell.includes('succession-drawer'), 'retired mobile shell must stay removed');",
    'Phase 2 shell assertions');
  return next.replace('shared shell, edge-to-edge viewport fill', 'desktop shared shell, edge-to-edge viewport fill');
});

await edit('scripts/audit-succession-archive-shell.mjs', (source) => {
  let next = source;
  next = replaceRequired(next,
    "assert(shell.includes('succession-archive__sidebar') && shell.includes('succession-drawer'), 'desktop sidebar and mobile drawer must both exist');\nassert(shell.includes('focusableSelector') && shell.includes(\"event.key === 'Escape'\"), 'mobile navigation must manage keyboard focus and Escape');",
    "assert(shell.includes('succession-archive__sidebar') && !shell.includes('succession-drawer') && !shell.includes('succession-archive__mobile-bar'), 'desktop sidebar must exist without retired mobile navigation');",
    'desktop shell contract');
  next = replaceRequired(next,
    "assert(searchCss.includes('.succession-search-complete__groups') && searchCss.includes('@media(max-width:620px)'), 'global search requires grouped and mobile design');",
    "assert(searchCss.includes('.succession-search-complete__groups') && !/@media\\s*\\([^)]*max-width:/i.test(searchCss), 'global search requires grouped desktop design without narrow-screen breakpoints');",
    'desktop search contract');
  next = next.replace("for (const selector of ['.succession-archive__layout', '.succession-archive__sidebar', '.succession-page-header', '.succession-entity-link', '.succession-state', '.succession-drawer'])", "for (const selector of ['.succession-archive__layout', '.succession-archive__sidebar', '.succession-page-header', '.succession-entity-link', '.succession-state'])");
  next = replaceRequired(next,
    "assert(css.includes('@media (max-width: 860px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'responsive and reduced-motion rules are required');",
    "assert(!/@media\\s*\\([^)]*max-width:/i.test(css) && css.includes('@media (prefers-reduced-motion: reduce)'), 'desktop-only shell must avoid narrow-width rules and retain reduced motion');",
    'desktop shell CSS contract');
  return next;
});

await edit('scripts/audit-succession-story-intelligence-workspace.mjs', (source) => replaceRequired(source,
  "assert(storyStyles.includes('@media(max-width:720px)') && chapterStyles.includes('@media(max-width:720px)'), 'both Batch 4 workspaces must include mobile layouts');",
  "assert(!/@media\\s*\\([^)]*max-width:/i.test(storyStyles) && !/@media\\s*\\([^)]*max-width:/i.test(chapterStyles), 'Batch 4 story workspaces must remain desktop-only');",
  'Story desktop contract'));

await edit('scripts/audit-succession-events-workspace.mjs', (source) => replaceRequired(source,
  "assert(styles.includes('@media (max-width: 820px)'), 'workspace must include responsive layout handling');",
  "assert(!/@media\\s*\\([^)]*max-width:/i.test(styles), 'event workspace must remain desktop-only');",
  'Events desktop contract').replace('responsive presentation are wired.', 'desktop presentation are wired.'));

await edit('scripts/audit-succession-locations-workspace.mjs', (source) => replaceRequired(source,
  "assert(styles.includes('@media (max-width: 900px)'), 'workspace must include responsive layout handling');",
  "assert(!/@media\\s*\\([^)]*max-width:/i.test(styles), 'location workspace must remain desktop-only');",
  'Locations desktop contract').replace('responsive presentation.', 'desktop presentation.'));

await edit('scripts/audit-succession-foundation-closure.mjs', (source) => replaceRequired(source,
  "assert(styles.includes('@media (max-width:720px)'), 'workspace must include responsive handling');",
  "assert(!/@media\\s*\\([^)]*max-width:/i.test(styles), 'foundation workspace must remain desktop-only');",
  'Foundation desktop contract'));

await edit('scripts/audit-succession-reader.mjs', (source) => {
  let next = replaceRequired(source,
    "assert(css.includes('@media (max-width: 620px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'reader requires mobile and reduced-motion layers');",
    "assert(!/@media\\s*\\([^)]*max-width:/i.test(css) && css.includes('@media (prefers-reduced-motion: reduce)'), 'reader requires desktop-only and reduced-motion layers');",
    'Reader desktop contract');
  next = next.replace("    'Mobile reader is contained',\n", '');
  return next.replace('responsive design verified.', 'desktop design verified.');
});

await edit('scripts/succession-reader-qa.mjs', (source) => source.replace(/\n\s*const mobile = await browser\.newPage\([\s\S]*?await mobile\.close\(\);\n(?=} finally)/m, '\n'));

await edit('scripts/audit-succession-final-product-closure.mjs', (source) => {
  let next = replaceRequired(source,
    "assert(productStyles.includes('@media(max-width:520px)') && productStyles.includes('@media(prefers-reduced-motion:reduce)'), 'product workspaces must include mobile and reduced-motion handling');",
    "assert(!/@media\\s*\\([^)]*max-width:/i.test(productStyles) && productStyles.includes('@media(prefers-reduced-motion:reduce)'), 'product workspaces must remain desktop-only and retain reduced motion');",
    'Product desktop contract');
  next = next.replace("'extended graph links must have mobile-safe styles'", "'extended graph links must retain readable desktop styles'");
  next = replaceRequired(next,
    "assert(searchStyles.includes('@media(max-width:620px)') && searchStyles.includes('font-size: 11px'), 'grouped search must include mobile handling and the readability floor');",
    "assert(!/@media\\s*\\([^)]*max-width:/i.test(searchStyles) && searchStyles.includes('font-size: 11px'), 'grouped search must remain desktop-only and retain the readability floor');",
    'Search desktop contract');
  return next;
});

for (const relative of ['scripts/run-succession-runtime-audits-414.mjs', 'scripts/run-succession-runtime-audits-415.mjs', 'scripts/run-succession-runtime-audits-416.mjs', 'scripts/run-succession-runtime-audits-417.mjs']) {
  const chapter = relative.match(/(414|415|416|417)/)?.[1];
  await edit(relative, (source) => source.replace(/Succession runtime audit sweep passed: \d+\/\d+ audits\./g, `Succession runtime audit sweep passed through Chapter ${chapter}.`));
}

for (const relative of [
  'public/succession-phase-2-presentation-consistency.css',
  'scripts/audit-succession-phase-2-presentation-consistency.mjs',
]) {
  const absolute = path.join(root, relative);
  await rm(absolute, { force: true });
  changed.push(relative);
}

console.log(`Desktop contract CI repair updated ${changed.length} paths.`);
for (const relative of changed) console.log(`- ${relative}`);
