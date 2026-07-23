# Temporary chapter importer setup

The temporary chapter importer at `/admin/chapters` uses a server-side GitHub credential to commit selected chapter pictures directly from the website.

## Required Cloudflare Worker secret

Create a fine-grained GitHub personal access token restricted to the `DevDalex/Hunter` repository with **Contents: Read and write** permission, then store it in the Cloudflare Worker as:

```text
GITHUB_ADMIN_TOKEN
```

The token is never rendered in the page, sent to the browser, or stored in the repository.

Optional Worker variables:

```text
GITHUB_REPOSITORY=DevDalex/Hunter
GITHUB_BRANCH=main
CHAPTER_SOURCE_HOSTS=3asq.online
CHAPTER_IMAGE_HOSTS=3asq.online
```

After the chapter archive is imported, remove the `/admin/chapters` route and delete the `GITHUB_ADMIN_TOKEN` Worker secret.
