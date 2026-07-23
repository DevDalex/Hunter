# Temporary chapter importer setup

The temporary chapter importer at `/admin/chapters` uses a server-side GitHub credential to queue a background GitHub Actions job. The page stays one-button: the Worker validates the selected pictures and sends a small request to GitHub, then GitHub downloads the images, updates the manifest, commits to `main`, and triggers deployment.

This avoids Cloudflare Worker CPU and memory limits when importing a complete chapter.

## Required Cloudflare Worker secret

Create a fine-grained GitHub personal access token restricted to the `DevDalex/Hunter` repository with **Contents: Read and write** permission, then store it in the Cloudflare Worker as:

```text
GITHUB_ADMIN_TOKEN
```

The same Contents permission authorizes the repository-dispatch request. The token is never rendered in the page, sent to the browser, or stored in the repository.

Optional Worker variables:

```text
GITHUB_REPOSITORY=DevDalex/Hunter
CHAPTER_SOURCE_HOSTS=3asq.online
CHAPTER_IMAGE_HOSTS=3asq.online
```

After the chapter archive is imported, remove the `/admin/chapters` route and delete the `GITHUB_ADMIN_TOKEN` Worker secret.
