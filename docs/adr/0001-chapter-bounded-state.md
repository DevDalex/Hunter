# ADR 0001: Chapter-bounded archive state

## Status
Accepted.

## Context
Succession Contest information changes continuously. Later revelations must not leak into earlier reading boundaries through search, filters, graphs, metadata, exports, or accessibility text.

## Decision
Every user-facing research surface receives an explicit chapter boundary. Records with introduction, validity, evidence, or resolution chapters beyond that boundary are excluded before rendering. Shared boundary utilities and regression audits are the canonical enforcement layer.

## Consequences
Domain workspaces must expose chapter metadata consistently. Search indexes, comparison views, exports, social metadata, and generated descriptions must use the same boundary. Records without sufficient chapter metadata remain visibly uncertain rather than being silently treated as timeless.
