import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src/components/succession', 'src/lib/succession', 'src/data/succession'];
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.mjs']);
const files = [];
const walk = (directory) => {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if ([...SOURCE_EXTENSIONS].some((extension) => path.endsWith(extension))) files.push(path);
  }
};
for (const root of ROOTS) walk(root);

const violations = [];
const inspect = (path, source) => {
  const rel = relative(process.cwd(), path);
  const lines = source.split('\n');
  lines.forEach((line, index) => {
    const number = index + 1;
    if (/dangerouslySetInnerHTML/.test(line) && !/spoiler|sanitize|safe/i.test(line)) violations.push(`${rel}:${number} uses unsanitized HTML without a spoiler-safety marker.`);
    if (/(title|aria-label|alt)=\{?[^\n]*(latest|future|final status)/i.test(line)) violations.push(`${rel}:${number} may leak future knowledge through metadata or accessibility text.`);
    if (/JSON\.stringify\([^)]*(allRecords|allEntities|successionData)/.test(line) && !/filter|boundary|spoiler/i.test(line)) violations.push(`${rel}:${number} serializes broad archive data without a visible boundary filter.`);
    if (/searchParams\.(set|append)\([^,]+,\s*(record|entity)\.(name|title|summary)/.test(line) && !/chapter|boundary|spoiler/i.test(line)) violations.push(`${rel}:${number} places entity content in a URL without an explicit spoiler boundary.`);
    if (/application\/ld\+json|og:description|twitter:description/.test(line) && !/chapter|boundary|spoiler/i.test(source)) violations.push(`${rel}:${number} exposes structured/social metadata without a spoiler contract.`);
  });
};
for (const path of files) inspect(path, readFileSync(path, 'utf8'));

const requiredContracts = [
  ['src/lib/succession/chapterBoundary.js', ['filterRecordsAtChapter', 'isRecordAvailableAtChapter']],
  ['src/components/succession/SuccessionArchiveContextBar.jsx', ['laterInformationHidden', 'Chapter']],
  ['src/lib/succession/shareAndExport.js', ['chapter', 'filters']],
];
for (const [path, tokens] of requiredContracts) {
  const source = readFileSync(path, 'utf8');
  for (const token of tokens) if (!source.includes(token)) violations.push(`${path} is missing spoiler contract token ${token}.`);
}

if (violations.length) {
  console.error(`Spoiler surface audit failed with ${violations.length} issue(s):`);
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}
console.log(`Spoiler surface audit passed across ${files.length} source files: metadata, DOM, alt text, URLs, exports, and structured data contracts checked.`);
