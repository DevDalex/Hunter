## Problem

Describe the user-visible, data, media, infrastructure, or maintenance problem.

## Implementation

Describe the approach and the durable contracts affected.

## Fix

State the resulting behavior and remaining limitations.

## Affected surfaces

- Routes:
- Canonical records:
- Media IDs:
- Worker/server endpoints:

## Verification

- [ ] `npm run foundation:check`
- [ ] `npm run preflight:build`
- [ ] `npm run build`
- [ ] Relevant Playwright or route-specific QA
- [ ] New or updated regression tests
- [ ] No new unmanaged media paths
- [ ] No new brittle exact-source audit unless unavoidable

## Visual review

- [ ] Minimum supported viewport reviewed
- [ ] Standard desktop reviewed
- [ ] Tablet/mobile reviewed for responsive routes
- [ ] Long-copy, empty, loading, and failed-media states reviewed
- [ ] Focus, reduced motion, and contrast reviewed

Attach or link the most useful preview or screenshot evidence. Do not commit diagnostic artifacts to the repository.

## Data and evidence

- [ ] Stable IDs preserved
- [ ] Zod validation updated when needed
- [ ] Sources and provenance attached
- [ ] Chapter/episode and spoiler boundaries checked
- [ ] Schema migration included when required

## Performance and security

- [ ] Bundle or route-budget impact reviewed
- [ ] Runtime dependency audit remains clean
- [ ] No secrets, credentials, or private diagnostic files included

## Release readiness

- [ ] `Release Quality` is green
- [ ] `Security Quality` has no new blocking finding
- [ ] Human visual review completed for major UI changes
