import assert from 'node:assert/strict';
import {
  assertPublicHttpUrl,
  detectImageType,
  extractChapterImageUrls,
  inferChapterNumber,
} from './lib/succession-chapter-url-source.mjs';

const source = 'https://reader.example/manga/hunter-x-hunter/414/';
const chapterTags = Array.from({ length: 20 }, (_, index) => {
  const page = String(index + 1).padStart(2, '0');
  return `<div class="page-break"><img class="wp-manga-chapter-img img-responsive" data-src="https://reader.example/wp-content/uploads/WP-manga/data/hxh/hash/${page}.jpg" alt="Page ${page}"></div>`;
}).join('\n');
const html = `<!doctype html><html><head><title>Chapter 414</title></head><body>
<img src="https://reader.example/logo.png" alt="logo">
${chapterTags}
<img src="https://reader.example/avatar/comment-user.jpg" alt="comment avatar">
</body></html>`;

const pages = extractChapterImageUrls(html, source);
assert.equal(pages.length, 20, 'WP Manga markup must produce exactly twenty chapter pages');
assert.ok(pages[0].endsWith('/01.jpg'), 'first page must retain reading order');
assert.ok(pages[19].endsWith('/20.jpg'), 'last page must retain reading order');
assert.equal(new Set(pages).size, pages.length, 'detected chapter pages must be unique');
assert.equal(inferChapterNumber(source), 414, 'chapter number must be inferred from a clean chapter URL');
assert.equal(inferChapterNumber('https://reader.example/chapter/latest'), null, 'non-numeric URLs must not invent a chapter number');

const genericHtml = `
<img src="/assets/logo.jpg">
<script>window.pages=[
  "https://cdn.example/chapter/001.webp",
  "https://cdn.example/chapter/002.webp",
  "https://cdn.example/chapter/003.webp"
]</script>`;
const genericPages = extractChapterImageUrls(genericHtml, 'https://reader.example/read/');
assert.deepEqual(genericPages.map((url) => url.split('/').pop()), ['001.webp', '002.webp', '003.webp'], 'embedded page arrays must be grouped and naturally sorted');

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xdb]);
const png = Buffer.concat([Buffer.from([0x89]), Buffer.from('PNG\r\n\x1a\n')]);
const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP')]);
assert.equal(detectImageType(jpeg).extension, '.jpg');
assert.equal(detectImageType(png).extension, '.png');
assert.equal(detectImageType(webp).extension, '.webp');

await assert.rejects(() => assertPublicHttpUrl('http://127.0.0.1/private'), /private-network/i, 'loopback SSRF targets must be rejected');
await assert.rejects(() => assertPublicHttpUrl('file:///etc/passwd'), /HTTP and HTTPS/i, 'non-HTTP source schemes must be rejected');

console.log('Succession URL import audit passed: WP Manga extraction, generic grouping, natural order, image signatures, chapter inference, and private-network rejection.');
