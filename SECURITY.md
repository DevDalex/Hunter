# Security policy

## Supported version

The current production release on `main` is the supported version. Historical branches and local development snapshots are not supported security releases.

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public issue.

Use GitHub's private vulnerability-reporting feature for this repository when available. Include:

- the affected route, Worker endpoint, or administrative workflow;
- reproduction steps;
- the expected and actual behavior;
- impact and required privileges;
- relevant request/response samples with secrets removed;
- a suggested mitigation when known.

Do not include credentials, personal data, private tokens, copyrighted source material, or unrelated user information.

## Response targets

- Acknowledge a credible report within 3 business days.
- Triage severity and affected releases within 7 business days.
- Prioritize active exploitation, authorization bypass, secret exposure, and remote code execution immediately.
- Publish a fix or mitigation before public disclosure whenever practical.

## Automated controls

The repository uses:

- locked npm dependencies;
- a high-severity runtime dependency audit;
- CodeQL JavaScript/TypeScript analysis;
- Dependabot update proposals;
- strict archive/media validation;
- production artifact and Worker-routing checks;
- browser and deployment smoke tests.

Repository administrators should also enable GitHub secret scanning, private vulnerability reporting, dependency alerts, protected branches, and required `Release Quality` and `Security Quality` checks.

## Scope notes

The archive contains external source links and media provenance. A broken or unavailable external source is a data-quality issue unless it enables script execution, credential exposure, unauthorized access, or another security impact.
