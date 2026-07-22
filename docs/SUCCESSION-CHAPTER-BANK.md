# Succession Chapter Bank

The Chapter Bank is the permanent storage and indexing layer for Hunter × Hunter manga Chapters **339–414**.

It connects four systems:

```text
External chapter source
→ authenticated inspection and review
→ permanent chapter/page storage
→ public Succession reader
```

## Bank boundary

The bank always contains 76 chapter records:

```text
Chapter 339
Chapter 340
…
Chapter 414
```

An empty chapter still has a stable bank identity and appears in the administrator dashboard and public reader directory.

## Chapter records

Canonical derived records are exposed by:

```text
src/data/successionChapterBank.js
```

Each chapter record includes:

```js
{
  id: 'chapter-414',
  chapter: 414,
  label: 'Chapter 414',
  pageCount: 20,
  storedPageCount: 20,
  expectedPageCount: 20,
  missingPages: [],
  status: 'published',
  storage: 'local',
  sourceUrl: 'https://3asq.online/manga/hunter-x-hunter/414/',
  lastUpdated: '...',
  pages: []
}
```

Supported chapter states are:

```text
empty
inspecting
ready-for-review
imported
partially-imported
needs-repair
published
```

## Page records

Every stored image has a stable page identity.

```js
{
  id: 'chapter-414-p001',
  chapter: 414,
  page: 1,
  label: 'p.1',
  filename: '001.jpg',
  src: '/media/succession-contest/chapters/414/001.jpg',
  localPath: '/media/succession-contest/chapters/414/001.jpg',
  sourceUrl: 'https://3asq.online/.../01.jpg',
  width: 1200,
  height: 1800,
  format: 'jpg',
  byteSize: 284521,
  checksum: 'sha256-...',
  status: 'published',
  importedAt: '...'
}
```

The visible label is `p.1`, `p.2`, and so on. Stored filenames remain zero-padded so lexical and numeric order match:

```text
p.1  → 001.jpg
p.2  → 002.jpg
p.10 → 010.jpg
```

## Physical storage

```text
public/media/succession-contest/chapters/
├── 339/
│   ├── 001.jpg
│   ├── 002.jpg
│   └── ...
├── 340/
│   └── ...
└── 414/
    ├── 001.jpg
    ├── 002.jpg
    └── ...
```

Supported formats are JPG, PNG, and WebP. The actual detected format is preserved.

## Generated manifest

Stored page records are written to:

```text
src/data/successionChapterMedia.generated.js
```

The public reader consumes this manifest through `src/data/successionChapterBank.js` and `src/data/successionChapterReader.js`.

Do not edit generated page records manually. Use an importer or the rebuild command.

## Import history

The immutable import ledger is:

```text
src/data/successionChapterImportHistory.generated.js
```

Each operation records the chapter, action, previous and new page counts, source URL or local source type, timestamp, expected page count, missing pages, and publication status.

## Hosted administrator

```text
/admin/chapters
```

The dashboard provides:

- totals for all 76 chapters, stored chapters, empty chapters, pages, and repair records;
- chapter/status search and filtering;
- one detail view per chapter;
- page-level previews and metadata;
- import history;
- external URL inspection;
- explicit replacement confirmation;
- authenticated publication.

Bank APIs:

```text
GET  /api/admin/chapter/bank
GET  /api/admin/chapter/bank/<chapter>
POST /api/admin/chapter/inspect
GET  /api/admin/chapter/preview
POST /api/admin/chapter/import
```

The inspection endpoint must return JSON. Returning the Hunter Archive SPA HTML from an API path is a deployment/routing failure, not a valid inspection result.

## Import transaction

A hosted import performs one Git-data transaction:

1. read the current branch reference, commit, tree, manifest, and history;
2. download and validate every approved page;
3. calculate dimensions, byte size, SHA-256 checksum, page ID, label, filename, source URL, status, and timestamp;
4. create one Git blob for every image;
5. remove stale old page paths only during explicit replacement;
6. create the next manifest blob;
7. create the next history blob;
8. create one Git tree containing images, manifest, and history;
9. create one commit;
10. advance the branch with `force: false`.

A concurrent branch change causes publication to fail rather than overwrite unrelated work.

## Local workflows

```bash
npm run admin:chapters
npm run import:succession-chapter:url -- <chapter-url> [chapter]
npm run import:succession-chapter -- <chapter> <source-directory>
npm run rebuild:succession-bank
```

The URL and local-admin workflows pass source provenance into the local importer through `SUCCESSION_CHAPTER_SOURCE_URL`.

## Rebuild

```bash
npm run rebuild:succession-bank
npm run rebuild:succession-bank -- --dry-run
```

The rebuild command scans stored chapter folders, verifies image signatures and dimensions, recalculates SHA-256 checksums and byte sizes, restores sequential page identities, and rewrites the generated manifest. Existing source URLs and timestamps are preserved when possible.

## Integrity rules

The bank audit rejects:

- chapter keys outside 339–414;
- missing or duplicated page numbers;
- unstable chapter/page IDs;
- incorrect `p.N` labels;
- non-zero-padded filenames;
- unsupported image formats;
- invalid dimensions, byte sizes, or SHA-256 checksums;
- duplicate source paths;
- duplicate page checksums;
- manifest records whose files are missing;
- local files whose byte size does not match the manifest;
- unregistered chapter folders;
- invalid history actions or chapter references.

Run:

```bash
npm run audit:chapter-bank
npm run audit:succession-media
npm run qa:succession-reader
```

## Deployment boundary

A repository commit or successful local build is not proof that the hosted Worker is active. The live deployment is valid only when:

- `/admin/chapters` shows the Chapter Bank build marker;
- `/api/admin/chapter/bank` returns authenticated JSON;
- `/api/admin/chapter/inspect` fetches the supplied external URL server-side;
- no API request falls through to the Hunter Archive SPA `index.html`.
