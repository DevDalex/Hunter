# Succession Contest chapter media

The chapter reader lives at:

```text
/story/succession-contest/chapters
```

It is the first view in the existing Succession **Chapters** workspace. The directory covers Chapters 338–414 and supports continuous and single-page reading modes.

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

## Import a chapter

Place the local chapter images in a temporary directory in reading order. Filenames may be `1.jpg`, `2.jpg`, `10.jpg` or any other naturally sortable names.

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

The command:

1. accepts Chapters 338–414;
2. finds local JPG, PNG, and WebP files;
3. naturally sorts the source filenames;
4. verifies that every file is a real supported image and reads its dimensions;
5. stages the copy in a temporary directory;
6. renames the pages to `001.ext`, `002.ext`, and so on;
7. writes the chapter folder under `public/media/succession-contest/chapters/`;
8. updates the generated media manifest.

The source directory is never modified.

## Validation

Run:

```bash
npm run audit:succession-media
```

This audit is included in the normal build preflight. It checks sequential page numbers, normalized paths, supported file extensions, positive dimensions, duplicate paths, missing files, and chapter directories that are not registered in the manifest.

## Commit boundary

After importing a chapter, commit both:

```text
public/media/succession-contest/chapters/<chapter>/
src/data/successionChapterMedia.generated.js
```

Only import and publish media you are permitted to host. The importer deliberately works from a local directory and does not fetch or republish pages from a third-party manga site.
