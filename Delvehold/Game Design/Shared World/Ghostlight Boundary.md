---
title: Ghostlight boundary
description: The forced ontology, aggregate Greathold institution, and typed external-world exchange.
---

Ghostlight provides the reactive world outside the Greathold. DELVE/HOLD supplies an authored ontology and fixed seed instead of asking Ghostlight's Session Zero world compiler to invent the setting. Compiler bypass is only a generation decision: the seed and every later input still pass through Ghostlight's WorldKernel validation, closed mutation authority, persistence, and receipts.

Ghostlight reuses its multiresolution agency graph, institution and Gestalt simulation, strategic waves, knowledge boundaries, Projector–Persona–Interpreter membrane, CultCache state, and CultMesh/Eve publication. The outside world begins as a coarse global skeleton and gains detail where active pressure makes it causally relevant.

## The Greathold institution

Ghostlight contains one institution-shaped subject with stable ID `greathold`. It is externally controlled and represents the Greathold's observable macro effects, not a sovereign government, person, population average, or alternate copy of player state.

- Only Delvehold documents accepted by Ghostlight update its external condition.
- It receives no Ghostlight Persona turn.
- It cannot autonomously speak, choose posture, spend resources, or act for players.
- Ghostlight actors may perceive it, form beliefs and relationships toward it, and direct actions at it.
- Effects requiring a Greathold change become outbound intents. Delvehold may accept, reject, or partially admit them within its own authority.

## Boundary contracts

All four documents carry schema, world ID, epoch ID, source revision, effective time, causal references, provenance, payload digest, and idempotency key.

### `delvehold.greathold_boundary_state.v0`

An absolute, replaceable projection of externally visible Greathold condition: current realized supply dependencies, Greathold ingress access and capacity, public institutional posture, ratified mandates already acted upon, expedition and ecological pressure, and public facts. External route IDs and status may be mirrored from accepted Ghostlight responses for reference, but remain Ghostlight-owned.

The projection names its complete field set and a Delvehold source-revision watermark. Ghostlight replaces those projected fields only after accepting a newer snapshot. It never treats snapshot totals as new flows.

### `delvehold.greathold_effect_batch.v0`

Committed deltas for one epoch: realized imports and exports, completed capacity shifts visible outside, institutional actions, expedition effects, ecological disturbance, diplomatic acts, and public signals. Pending orders, votes, contracts, and intentions are excluded. Each batch names the preceding and resulting Delvehold source revision. Ghostlight admits it only when that interval advances beyond the per-stream watermark; a later snapshot supersedes all earlier deltas and delayed deltas at or below its watermark are stale.

### `ghostlight.external_response_batch.v0`

Foreign decisions and events with exact owners: offers, demands, sanctions, route changes, treaties, mobilization, conflict, reports, ecological signals, and proposed consequences for Greathold-owned state. Private foreign knowledge and motivation remain Ghostlight-owned.

### `delvehold.boundary_receipt.v0`

A direction-neutral admission result issued by whichever canonical domain receives a boundary document. It names sender and recipient domain, source document and digest, every item's accepted or rejected result, reason codes, the recipient's resulting revision, and committed event references.

Malformed envelopes, stale revisions, digest conflicts, and invalid causal structure reject the whole document without mutation. Once the envelope is valid, semantically independent items may resolve to an explicit accepted subset. The recipient commits that entire subset atomically or commits nothing; the one receipt records every item result. A repeated idempotency key and digest returns the same receipt. The receipt never transfers ownership back to the sender.

## Privacy membrane

The boundary excludes player identities, private workshop state, pending votes, unaccepted contracts, private communications, hidden dungeon knowledge, and inferred collective desire. Aggregation reports what the Greathold materially did, not what its players supposedly wanted.
