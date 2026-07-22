# Hosted Chapter Bank administration

The deployed administrator route is:

```text
/admin/chapters
```

It is intentionally absent from public navigation and carries `noindex`, `nofollow`, and `noarchive` directives.

The complete storage schema is documented in `docs/SUCCESSION-CHAPTER-BANK.md`.

## What the hosted workflow does

After authentication, the administrator can:

1. inspect all permanent Chapter Bank records from Chapter 339 through Chapter 414;
2. search and filter empty, published, and repair-needed chapters;
3. open a chapter detail view with every `p.N` page record and import-history entry;
4. paste an allowlisted external chapter URL;
5. provide a chapter number or infer it from the URL;
6. fetch the supplied chapter page server-side;
7. preview every detected page through the authenticated Worker;
8. confirm publication authorization;
9. optionally replace an existing chapter;
10. download and validate all approved images;
11. calculate page IDs, `p.N` labels, dimensions, formats, byte sizes, SHA-256 checksums, source URLs, and timestamps;
12. create one Git tree and one commit containing the chapter folder, generated page manifest, and import history;
13. advance the configured GitHub branch only as a non-forced fast-forward.

The browser never receives the GitHub token, administrator password, or session-signing secret.

## Required Worker secrets

```text
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
GITHUB_ADMIN_TOKEN
```

Use the hosting provider's encrypted secret facility. Do not place these values in source files, `.openai/hosting.json`, frontend JavaScript, or ordinary plaintext configuration.

`ADMIN_SESSION_SECRET` must be a separate long random value. It must not match the administrator password.

`GITHUB_ADMIN_TOKEN` should be a fine-grained token restricted to this repository with **Contents: read and write** permission.

## Optional Worker configuration

```text
GITHUB_REPOSITORY=DevDalex/Hunter
GITHUB_BRANCH=main
CHAPTER_SOURCE_HOSTS=3asq.online
CHAPTER_IMAGE_HOSTS=3asq.online
```

`GITHUB_REPOSITORY` and `GITHUB_BRANCH` default to the values above. Source and image hosts are comma-separated allowlists. The source allowlist defaults to `3asq.online`; the image allowlist automatically includes the final source-page host and can be extended for a separate trusted CDN.

## Authentication and request protections

- credentials are compared server-side;
- failed logins receive an in-memory rate limit;
- successful login creates a signed two-hour session;
- the session cookie is `HttpOnly`, `Secure`, and `SameSite=Strict`;
- state-changing requests require the session's CSRF token;
- requests with a foreign `Origin` are rejected;
- inspection and preview tokens expire after thirty minutes;
- source and image hosts are allowlisted;
- redirects are revalidated;
- HTML, per-image, and total-chapter byte limits are enforced;
- JPG, PNG, and WebP signatures and dimensions are validated;
- page checksums use SHA-256;
- branch publication uses a non-forced reference update.

## Chapter Bank endpoints

```text
POST /api/admin/chapter/login
GET  /api/admin/chapter/session
POST /api/admin/chapter/logout
GET  /api/admin/chapter/bank
GET  /api/admin/chapter/bank/<chapter>
POST /api/admin/chapter/inspect
GET  /api/admin/chapter/preview?token=...
POST /api/admin/chapter/import
```

The bank endpoints read the configured GitHub branch's generated manifest and history. They return all 76 chapter records or one chapter with its complete page list and history.

The inspection endpoint accepts:

```json
{
  "sourceUrl": "https://3asq.online/manga/hunter-x-hunter/414/",
  "chapter": 414
}
```

It must return JSON with a `pages` array. If it returns the Hunter Archive homepage HTML, the deployed host has fallen through to the static SPA instead of mounting the Worker backend.

## Atomic GitHub publication

The Worker reads the current branch reference, commit, tree, page manifest, and import history. It then:

1. downloads and validates every approved page;
2. creates image blobs;
3. builds enriched page records;
4. removes stale paths only during explicit replacement;
5. creates the next page-manifest blob;
6. creates the next history blob;
7. creates one tree containing images, manifest, and history;
8. creates one commit;
9. advances the branch with `force: false`.

If the branch changes during import, publication fails safely instead of overwriting the newer branch state.

A successful GitHub commit does not prove that deployment completed. The live reader updates only after the hosting project builds and publishes that commit.

## Local fallback and recovery

```bash
npm run admin:chapters
npm run import:succession-chapter:url -- <chapter-url> [chapter]
npm run import:succession-chapter -- <chapter> <source-directory>
npm run rebuild:succession-bank
```

The rebuild command reconstructs enriched page records from stored files and preserves existing provenance where possible.

## Verification

```bash
npm run audit:hosted-admin
npm run audit:chapter-bank
npm run audit:succession-media
npm run qa:browser
```

The audits verify source parsing and natural order, signatures and dimensions, stable page identities, `p.N` labels, byte sizes and checksums, manifest/history round-tripping, authentication, CSRF, allowlists, bank endpoints, one-tree Git publication, non-forced branch updates, SPA-fallback diagnostics, and recursive Worker packaging.
