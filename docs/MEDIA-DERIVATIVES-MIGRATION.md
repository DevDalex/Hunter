# Responsive media derivatives and storage migration

## Current source of truth

Priority character portraits and Black Whale room images are already stabilized as verified local WebP originals under `public/media/portraits/` and `public/media/rooms/`. Canonical remote URLs remain provenance only; generated manifests mirror the approved article/image sources, dimensions, focal points, local storage state, and review date.

The original local WebP remains authoritative for runtime media identity and future regeneration. Responsive files are **generated delivery derivatives**, not a second canonical media registry.

## Derivative contract

`scripts/generate-media-derivatives.mjs` reads only the two verified generated manifests:

- `src/data/priorityMedia.generated.js`
- `src/data/blackWhaleMedia.generated.js`

When ImageMagick is available it generates smaller 320w, 640w, and 960w WebPs only when the target is smaller than the original. Output lives under `public/media/derivatives/` with deterministic paths. It then writes `src/data/mediaDerivatives.generated.js`, whose `srcSet` always retains the verified original as the largest source candidate.

`SafeImage` consumes the derivative map by original local `src`. A missing/empty derivative manifest therefore falls back to the original without a runtime lookup, remote request, or broken `srcset` candidate.

## Build portability

ImageMagick is an optional accelerator, not a deployment prerequisite. The generator checks `magick` and `convert`. If neither exists it clears stale derivative output, writes an explicit `MEDIA_DERIVATIVES_AVAILABLE = false` manifest, and exits successfully. This keeps builds reproducible on environments that do not provision ImageMagick.

When generation succeeds, `--verify-only` checks every generated path and WebP dimension before Vite packages the public directory.

## Storage migration policy

1. New canonical media is first stabilized locally through the existing portrait/room pipeline with approved provenance.
2. Responsive derivatives are generated only from those verified local originals.
3. Remote source URLs never become the runtime fallback for an already-stabilized asset; they remain provenance and recovery inputs.
4. Original WebPs are not deleted after derivative generation.
5. Derivative paths may be regenerated or replaced without changing canonical record IDs or provenance.
6. A future object-storage/CDN migration should preserve the same original→derivative manifest contract and must update ADR-0004 if runtime delivery stops being repository-local.

## Verification

- `npm run prepare:media-derivatives` — generate when a converter exists, otherwise publish the safe original-only manifest.
- `npm run audit:media-derivatives` — verify the generated manifest/files and runtime integration contract.
- `npm run audit:media` — continue validating the canonical stabilized originals and provenance.
