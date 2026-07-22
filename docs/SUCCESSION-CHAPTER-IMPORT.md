# Succession Contest chapter media

The public chapter reader lives at:

```text
/story/succession-contest/chapters
```

That route remains inside **Story → Succession Contest**. It renders the illustrated Succession Contest arc page and opens the reader as an embedded arc section. The separate route `/story/succession-contest/records` remains the research workspace for the chapter ledger, deaths, objects, and mysteries.

The reader directory covers Chapters 338–414 and supports continuous and single-page reading modes.

## Storage contract

Each chapter owns one directory. Each page is numbered in reading order with a three-digit filename.

```text
public/media/succession-contest/chapters/
└── 414/
    ├── 001.jpg
    ├── 002.jpg
    ├── 003.jpg
    └── 020.jpg
```

The importer preserves JPG, PNG, or WebP format. It normalizes `.jpeg` to `.jpg`; it does not recompress or convert the supplied media.

The generated manifest is:

```text
src/data/successionChapterMedia.generated.js
```

A Chapter 414 entry has this shape:

```js
414: [
  {
    page: 1,
    src: '/media/succession-contest/chapters/414/001.jpg',
    width: 1200,
    height: 1800,
  },
]
```

The reader sorts by `page`, calculates `pageCount`, labels pages as `Chapter 414 · Page 1`, and exposes previous/next chapter and page controls automatically.

## Recommended workflow: local Admin → Import Chapter

The hosted website is static and cannot safely write repository files. The import interface therefore runs locally and writes directly into the checked-out repository.

Start it from the repository root:

```bash
npm run admin:chapters
```

The command prints a one-time address similar to:

```text
http://127.0.0.1:4174/?token=<temporary-token>
```

Open that exact address. The server binds only to `127.0.0.1`, so the interface is not exposed to other computers or to the public site.

The admin workflow is:

1. paste the source chapter URL;
2. supply the chapter number or allow it to be inferred from the URL;
3. click **Inspect pages**;
4. review the detected count and every page preview;
5. confirm that the media may be stored;
6. optionally allow replacement of an existing chapter;
7. click **Confirm and import**.

The server then:

1. validates that the source is a public HTTP or HTTPS URL;
2. rejects local, private-network, link-local, and reserved-network destinations;
3. follows a limited number of validated redirects;
4. fetches the HTML with size and timeout limits;
5. detects chapter images from common manga-reader markup, lazy-load attributes, `srcset`, and embedded image arrays;
6. groups and naturally orders likely page images while rejecting logos, avatars, comments, icons, and advertisements;
7. proxies every preview through the authenticated local server;
8. downloads the confirmed images with per-file size limits and source-page referrer support;
9. passes the downloaded pages through the normal image-signature and dimension validator;
10. stages and writes the chapter folder;
11. updates the generated manifest.

The temporary admin token expires when the process stops. Press `Ctrl+C` to stop the local server.

## URL import from the terminal

The same URL inspection and confirmation flow is available without the browser interface.

Preview and receive an interactive confirmation prompt:

```bash
npm run import:succession-chapter:url -- https://example.com/manga/hunter-x-hunter/414/
```

Preview only:

```bash
npm run import:succession-chapter:url -- https://example.com/manga/hunter-x-hunter/414/ --dry-run
```

Supply the chapter manually when it cannot be inferred:

```bash
npm run import:succession-chapter:url -- https://example.com/chapter/latest 414
```

Replace an existing import after reviewing the detected list:

```bash
npm run import:succession-chapter:url -- https://example.com/manga/hunter-x-hunter/414/ --replace
```

For non-interactive automation, `--confirm` replaces the prompt. It should only be used after the detection output has been reviewed.

## Local-directory fallback

A directory that already contains the chapter pages can still be imported directly.

Preview without changing the repository:

```bash
npm run import:succession-chapter -- 414 ./incoming/chapter-414 --dry-run
```

Import:

```bash
npm run import:succession-chapter -- 414 ./incoming/chapter-414
```

Replace an existing local import:

```bash
npm run import:succession-chapter -- 414 ./incoming/chapter-414 --replace
```

The local importer naturally sorts the supplied files, verifies real JPG/PNG/WebP signatures and dimensions, stages the copy, normalizes filenames to `001.ext`, `002.ext`, and so on, writes the chapter directory, and updates the manifest. The supplied source directory is never modified.

## Validation

Run:

```bash
npm run audit:succession-media
```

This audit is included in the normal build preflight. It checks:

- syntax of the local, URL, and admin import tools;
- deterministic WP Manga and generic embedded-array extraction;
- natural page order and duplicate removal;
- chapter-number inference;
- supported image signatures;
- private-network and non-HTTP URL rejection;
- sequential manifest page numbers;
- normalized paths and extensions;
- positive image dimensions;
- duplicate paths, missing files, and unregistered chapter directories.

The dedicated browser QA verifies that the public chapter route keeps the illustrated Story arc shell, mounts the reader inside `#arc-chapters`, keeps chapter/page navigation on the Story route, and does not fall back to the generic Succession records workspace.

## Commit boundary

After importing a chapter, review and commit both:

```text
public/media/succession-contest/chapters/<chapter>/
src/data/successionChapterMedia.generated.js
```

Only import and publish media that you are permitted to store and distribute.
