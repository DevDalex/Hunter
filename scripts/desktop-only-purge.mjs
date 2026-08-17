import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const desktopFloor = 1180;
const report = {
  generatedAt: new Date().toISOString(),
  desktopFloor,
  changedFiles: [],
  changedRuntimeFiles: [],
  removedMediaBlocks: [],
  removedSelectors: [],
  removedDeclarations: [],
  suspiciousRuntimeReferences: [],
  suspiciousCssReferences: [],
  responsiveNamedFiles: [],
};

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist', '.wrangler'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
};

const relative = (file) => path.relative(root, file).replaceAll(path.sep, '/');

const skipQuotedOrComment = (text, index) => {
  if (text.startsWith('/*', index)) {
    const end = text.indexOf('*/', index + 2);
    return end === -1 ? text.length : end + 2;
  }
  const quote = text[index];
  if (quote !== '"' && quote !== "'") return index;
  let i = index + 1;
  while (i < text.length) {
    if (text[i] === '\\') { i += 2; continue; }
    if (text[i] === quote) return i + 1;
    i += 1;
  }
  return text.length;
};

const findOpeningBrace = (text, start) => {
  for (let i = start; i < text.length; i += 1) {
    const skipped = skipQuotedOrComment(text, i);
    if (skipped !== i) { i = skipped - 1; continue; }
    if (text[i] === '{') return i;
  }
  return -1;
};

const findClosingBrace = (text, open) => {
  let depth = 1;
  for (let i = open + 1; i < text.length; i += 1) {
    const skipped = skipQuotedOrComment(text, i);
    if (skipped !== i) { i = skipped - 1; continue; }
    if (text[i] === '{') depth += 1;
    else if (text[i] === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
};

const mediaIsUnsupported = (header) => {
  const normalized = header.toLowerCase();
  if (/\(\s*(?:pointer\s*:\s*coarse|hover\s*:\s*none)\s*\)/.test(normalized)) return true;
  if (/\bmax-device-width\s*:/.test(normalized)) return true;
  const widths = [...normalized.matchAll(/\bmax-width\s*:\s*([0-9.]+)\s*(px|em|rem)/g)];
  return widths.some((match) => {
    const numeric = Number.parseFloat(match[1]);
    const px = match[2] === 'px' ? numeric : numeric * 16;
    return Number.isFinite(px) && px < desktopFloor;
  });
};

const stripUnsupportedMedia = (css, file) => {
  const ranges = [];
  for (let i = 0; i < css.length; i += 1) {
    const skipped = skipQuotedOrComment(css, i);
    if (skipped !== i) { i = skipped - 1; continue; }
    if (!css.startsWith('@media', i)) continue;
    const open = findOpeningBrace(css, i + 6);
    if (open === -1) continue;
    const close = findClosingBrace(css, open);
    if (close === -1) continue;
    const header = css.slice(i, open).trim();
    if (mediaIsUnsupported(header)) {
      ranges.push([i, close + 1]);
      report.removedMediaBlocks.push({ file, header });
      i = close;
    }
  }
  if (!ranges.length) return css;
  let out = css;
  for (const [start, end] of ranges.reverse()) out = out.slice(0, start) + out.slice(end);
  return out;
};

const splitSelectors = (header) => {
  const selectors = [];
  let start = 0;
  let round = 0;
  let square = 0;
  for (let i = 0; i < header.length; i += 1) {
    const skipped = skipQuotedOrComment(header, i);
    if (skipped !== i) { i = skipped - 1; continue; }
    if (header[i] === '(') round += 1;
    else if (header[i] === ')') round = Math.max(0, round - 1);
    else if (header[i] === '[') square += 1;
    else if (header[i] === ']') square = Math.max(0, square - 1);
    else if (header[i] === ',' && round === 0 && square === 0) {
      selectors.push(header.slice(start, i));
      start = i + 1;
    }
  }
  selectors.push(header.slice(start));
  return selectors;
};

const selectorIsMobile = (selector) => /(?:^|[\s.#:[>+~_-])mobile(?:[\s.#:[>+~_-]|$)/i.test(selector)
  || /__mobile(?:[\s.#:[>+~_-]|$)/i.test(selector)
  || /mobile-(?:menu|nav|bar|drawer|toggle|only|layout|view|header|footer|panel|control|hint)/i.test(selector);

const stripMobileSelectors = (css, file) => {
  let out = '';
  let cursor = 0;
  while (cursor < css.length) {
    const open = findOpeningBrace(css, cursor);
    if (open === -1) { out += css.slice(cursor); break; }
    const close = findClosingBrace(css, open);
    if (close === -1) { out += css.slice(cursor); break; }

    const beforeOpen = css.slice(cursor, open);
    let headerStart = 0;
    for (let i = beforeOpen.length - 1; i >= 0; i -= 1) {
      if (beforeOpen[i] === ';' || beforeOpen[i] === '}') { headerStart = i + 1; break; }
    }
    const prefix = beforeOpen.slice(0, headerStart);
    const rawHeader = beforeOpen.slice(headerStart);
    const header = rawHeader.trim();
    const body = css.slice(open + 1, close);

    out += prefix;
    if (!header || header.startsWith('@')) {
      const nested = /^@(supports|layer|container|scope|document)\b/i.test(header)
        ? stripMobileSelectors(body, file)
        : body;
      out += rawHeader + '{' + nested + '}';
    } else {
      const selectors = splitSelectors(rawHeader);
      const kept = selectors.filter((selector) => !selectorIsMobile(selector));
      const removed = selectors.filter(selectorIsMobile).map((selector) => selector.trim()).filter(Boolean);
      if (removed.length) report.removedSelectors.push(...removed.map((selector) => ({ file, selector })));
      if (kept.length) out += kept.join(',') + '{' + body + '}';
    }
    cursor = close + 1;
  }
  return out;
};

const removeMobileDeclarations = (css, file) => {
  const declarations = [
    [/\n?[ \t]*touch-action\s*:[^;{}]+;/gi, 'touch-action'],
    [/\n?[ \t]*-webkit-tap-highlight-color\s*:[^;{}]+;/gi, '-webkit-tap-highlight-color'],
    [/\n?[ \t]*--touch-target\s*:[^;{}]+;/gi, '--touch-target'],
  ];
  let out = css.replaceAll('var(--touch-target)', '44px');
  for (const [pattern, label] of declarations) {
    let count = 0;
    out = out.replace(pattern, () => { count += 1; return ''; });
    if (count) report.removedDeclarations.push({ file, declaration: label, count });
  }
  out = out
    .replace(/max\(\s*([^,()]+?)\s*,\s*env\(safe-area-inset-[^)]+\)\s*\)/gi, '$1')
    .replace(/env\(safe-area-inset-[^)]+\)/gi, '0px')
    .replace(/([0-9.]+)dvh\b/gi, '$1vh')
    .replace(/([0-9.]+)svh\b/gi, '$1vh')
    .replace(/([0-9.]+)lvh\b/gi, '$1vh')
    .replace(/([0-9.]+)dvw\b/gi, '$1vw')
    .replace(/([0-9.]+)svw\b/gi, '$1vw')
    .replace(/([0-9.]+)lvw\b/gi, '$1vw')
    .replace(/min-width\s*:\s*320px\s*;/gi, `min-width: ${desktopFloor}px;`);
  return out;
};

const transformCss = (source, file) => {
  let css = source;
  css = stripUnsupportedMedia(css, file);
  css = stripMobileSelectors(css, file);
  css = removeMobileDeclarations(css, file);
  return css.replace(/\n{4,}/g, '\n\n\n');
};

const transformKnownRuntime = (source, rel) => {
  let out = source;
  if (rel === 'src/components/InteractiveWorldMap.jsx') {
    out = out
      .replace('Check, ChevronDown, ChevronUp, Clipboard,', 'Check, Clipboard,')
      .replace('function MapInspector({ location, expanded, onToggle, onCenter, onOpenBlackWhale, onOpenEncyclopedia, onOpenTimeline }) {', 'function MapInspector({ location, onCenter, onOpenBlackWhale, onOpenEncyclopedia, onOpenTimeline }) {')
      .replace('    <aside className={`world-map-inspector${expanded ? \' is-expanded\' : \'\'}`} aria-live="polite">\n      <button type="button" className="world-map-inspector__mobile-toggle" onClick={onToggle} aria-expanded={expanded}>\n        <span><small>Selected place</small><strong>{location.name}</strong></span>{expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}\n      </button>', '    <aside className="world-map-inspector" aria-live="polite">')
      .replace('  const [inspectorExpanded, setInspectorExpanded] = useState(false);\n', '')
      .replace('    setInspectorExpanded(true);\n', '')
      .replace('    setInspectorExpanded(false);\n', '')
      .replace('        <MapInspector location={selected} expanded={inspectorExpanded} onToggle={() => setInspectorExpanded((value) => !value)} onCenter={centerLocation} onOpenBlackWhale={onOpenBlackWhale} onOpenEncyclopedia={onOpenEncyclopedia} onOpenTimeline={onOpenTimeline} />', '        <MapInspector location={selected} onCenter={centerLocation} onOpenBlackWhale={onOpenBlackWhale} onOpenEncyclopedia={onOpenEncyclopedia} onOpenTimeline={onOpenTimeline} />');
  }
  return out;
};

const files = await walk(root);
const cssFiles = files.filter((file) => file.endsWith('.css'));
const runtimeFiles = files.filter((file) => /\.(?:js|jsx|mjs|ts|tsx)$/.test(file));

for (const file of cssFiles) {
  const rel = relative(file);
  if (/responsive|mobile/i.test(path.basename(file))) report.responsiveNamedFiles.push(rel);
  const source = await readFile(file, 'utf8');
  const transformed = transformCss(source, rel);
  if (transformed !== source) {
    await writeFile(file, transformed);
    report.changedFiles.push(rel);
  }
}

for (const file of runtimeFiles) {
  const rel = relative(file);
  if (rel === 'scripts/desktop-only-purge.mjs') continue;
  const source = await readFile(file, 'utf8');
  const transformed = transformKnownRuntime(source, rel);
  if (transformed !== source) {
    await writeFile(file, transformed);
    report.changedRuntimeFiles.push(rel);
  }
}

const suspicious = /\bmobile\b|__mobile|mobile-|\btablet\b|390\s*[,x×]\s*844|768\s*[,x×]\s*1024|safe-area-inset|touch-action|-webkit-tap-highlight-color|pointer\s*:\s*coarse|hover\s*:\s*none/gi;
for (const file of runtimeFiles) {
  const rel = relative(file);
  if (rel === 'scripts/desktop-only-purge.mjs') continue;
  const source = await readFile(file, 'utf8');
  const lines = source.split('\n');
  lines.forEach((line, index) => {
    suspicious.lastIndex = 0;
    if (suspicious.test(line)) report.suspiciousRuntimeReferences.push({ file: rel, line: index + 1, text: line.trim().slice(0, 220) });
  });
}

for (const file of cssFiles) {
  const rel = relative(file);
  const source = await readFile(file, 'utf8');
  const lines = source.split('\n');
  lines.forEach((line, index) => {
    suspicious.lastIndex = 0;
    const widthMatch = line.match(/@media[^\n]*max-width\s*:\s*([0-9.]+)\s*(px|em|rem)/i);
    const unsupportedWidth = widthMatch && ((widthMatch[2].toLowerCase() === 'px' ? Number(widthMatch[1]) : Number(widthMatch[1]) * 16) < desktopFloor);
    if (suspicious.test(line) || unsupportedWidth) report.suspiciousCssReferences.push({ file: rel, line: index + 1, text: line.trim().slice(0, 220) });
  });
}

await writeFile('.desktop-only-purge-report.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(`Desktop-only purge preview changed ${report.changedFiles.length} CSS file(s) and ${report.changedRuntimeFiles.length} runtime file(s).`);
console.log(`Removed ${report.removedMediaBlocks.length} unsupported media block(s), ${report.removedSelectors.length} mobile selector(s), and ${report.removedDeclarations.reduce((sum, item) => sum + item.count, 0)} mobile declaration(s).`);
console.log(`Remaining suspicious runtime references: ${report.suspiciousRuntimeReferences.length}.`);
console.log(`Remaining suspicious CSS references: ${report.suspiciousCssReferences.length}.`);
console.log(`Responsive/mobile-named CSS files still present: ${report.responsiveNamedFiles.length}.`);
