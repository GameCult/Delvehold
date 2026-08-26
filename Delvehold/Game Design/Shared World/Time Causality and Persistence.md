---
title: Time, causality, and persistence
description: Immediate events, hourly epochs, bounded catch-up, revisions, and durable receipts.
---

Each canonical domain owns a monotonic world time and revision. Cross-domain documents name both the source revision and causal event set; they do not force two stores into one transaction.

## Exchange cadence

Major committed events cross promptly: ratified mandates entering action, treaty decisions, attacks, route closures, major expedition discoveries, and severe ecological or supply shocks. Ordinary production, consumption, trade, and contract outcomes close into UTC-aligned hourly epochs.

After each accepted boundary update, Ghostlight may run a bounded strategic wave. Delvehold validates resulting external intents before they affect Greathold state. A declaration can already be true in the external world while its requested local consequence remains pending or rejected; both facts are recorded honestly.

## Downtime

On recovery, the bridge replays at most eight missed hourly epochs. Older time is summarized into one coarse strategic horizon with its covered interval, source aggregates, uncertainty, and provenance. Catch-up cannot invent player actions, silently accept pending intent, or conceal lost intervals.

## Delivery rules

- Stable idempotency keys make retries harmless.
- Digests bind payload and causal references.
- Stale revisions, malformed envelopes, digest conflicts, and invalid causal structure leave the recipient unchanged.
- After envelope validation, semantically independent items may be accepted or rejected individually, but the accepted subset commits atomically or not at all.
- Each item receives a result in one direction-neutral receipt; no acceptance is emitted before commit.
- Boundary snapshots replace their declared projected fields at a source-revision watermark. Effect batches are deltas over explicit revision intervals; batches at or below an accepted snapshot or stream watermark are stale.
- Human-readable projections can be regenerated from typed `.cc` state and receipts.
- JSON is limited to schema publication, inspection, and external system boundaries.
