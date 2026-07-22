# Hosted chapter administration

The deployed administrator route is:

```text
/admin/chapters
```

It is intentionally absent from the public navigation and carries `noindex`, `nofollow`, and `noarchive` directives.

## What the hosted workflow does

After authentication, the administrator can:

1. paste an allowlisted chapter URL;
2. provide a chapter number or infer it from the URL;
3. inspect the source page;
4. preview every detected page through the authenticated Worker;
5. confirm publication authorization;
6. optionally replace an existing chapter;
7. download and validate the images server-side;
8. create Git blobs for every normalized page;
9. create one Git tree and one commit containing the chapter folder and generated manifest;
10. advance the configured GitHub branch only as a non-forced fast-forward.

The browser never receives the GitHub token, administrator password, or session-signing secret.

## Required Worker secrets

The hosted feature refuses login until all required secrets are configured:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
GITHUB_ADMIN_TOKEN
```

Use the hosting provider's encrypted secret facility. Do not place these values in source files, `hosting.json`, frontend JavaScript, or ordinary plaintext environment variables.

`ADMIN_SESSION_SECRET` must be a separate long random value. It must not match the administrator password.

`GITHUB_ADMIN_TOKEN` should be a fine-grained token restricted to this repository with **Contents: read and write** permission. Do not grant unrelated account or repository permissions.

## Optional Worker configuration

```text
GITHUB_REPOSITORY=DevDalex/Hunter
GITHUB_BRANCH=main
CHAPTER_SOURCE_HOSTS=3asq.online
CHAPTER_IMAGE_HOSTS=3asq.online
```

`GITHUB_REPOSITORY` and `GITHUB_BRANCH` default to the values above. Source and image hosts are comma-separated allowlists. The source allowlist defaults to `3asq.online`; the image allowlist automatically includes the final source-page host and can be extended for a separate trusted CDN.

## Temporary login requested for development

The currently requested temporary username and password should be configured through encrypted Worker secrets rather than committed to the repository. Because those temporary values are weak, change both before making the route broadly discoverable or sharing the site with anyone else.

## Authentication and request protections

- credentials are compared server-side;
- failed logins receive an in-memory rate limit;
- successful login creates a signed two-hour session;
- the session cookie is `HttpOnly`, `Secure`, and `SameSite=Strict`;
- state-changing requests require the session's CSRF token;
- requests with a foreign `Origin` are rejected;
- inspection and preview tokens expire after thirty minutes;
- remote fetches use strict source/image hostname allowlists;
- redirects are revalidated;
- HTML, per-image, and total-chapter byte limits are enforced;
- JPG, PNG, and WebP signatures and dimensions are validated;
- branch publication uses a non-forced reference update so a concurrent branch change causes a conflict instead of being overwritten.

## GitHub publication

The Worker reads the current configured branch head, tree, and generated chapter manifest. It creates image blobs, replaces the selected chapter's manifest entry, deletes stale page files during an explicit replacement, creates a new tree and commit, then attempts a non-forced fast-forward branch update.

If the branch changes while an import is running, publication fails safely and the branch is not overwritten. The administrator should inspect the source again and retry.

A successful GitHub commit does not prove that deployment has completed. The hosted reader updates only after the configured deployment pipeline builds and publishes the new branch commit.

## Development fallback

The existing local tools remain available:

```bash
npm run admin:chapters
npm run import:succession-chapter:url -- <chapter-url> [chapter]
npm run import:succession-chapter -- <chapter> <source-directory>
```

These are useful when hosted secrets are unavailable or when the maintainer wants to inspect repository changes locally before pushing.

## Verification

Run:

```bash
npm run audit:hosted-admin
npm run qa:browser
```

The hosted-admin audit verifies parsing and natural page ordering, image dimensions, manifest round-tripping, the secret boundary, secure cookie flags, CSRF enforcement, hostname allowlists, atomic GitHub Git-data publication, non-forced branch updates, deployed admin endpoints, and recursive Worker packaging.
