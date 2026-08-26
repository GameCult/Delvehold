---
title: Simulation architecture
description: The owners, data flow, and invariant boundary of the persistent world.
---

The game uses two canonical simulation domains joined by typed exchange.

## Owners

The **Delvehold world organ** owns the Greathold: players, workshops, parties, contracts, expeditions, dungeons, civic state, quantitative goods, production, prices, orders, and local consequences.

One persistent **Ghostlight WorldKernel** owns the world outside the Greathold: foreign regions, actors, institutions, population Gestalts, their knowledge, relationships, goals, posture, pressure, strategic decisions, external events, and news.

The CultMesh bridge carries documents. It schedules no independent truth and earns no right to repair either side.

```text
Delvehold committed state
  -> derived Greathold boundary state and realized effects
  -> Ghostlight command validation and atomic commit
  -> external strategic simulation
  -> typed external response intents
  -> Delvehold command validation and atomic commit
  -> direction-neutral admission receipt returned to the sender
```

## Shared invariants

- Every canonical mutation passes through its owner's typed command and atomic commit path.
- Models and clients propose; they do not write.
- Revisions remain local and are joined by causal references, not a distributed transaction.
- Retry is idempotent. An invalid envelope changes nothing; an explicit semantically valid subset is committed as one atomic recipient transaction or not at all.
- News is an attributed claim; knowledge is observer-scoped; neither is omniscient truth.
- Manual, automated, imported, scheduled, and background actions obey the same domain rules.
- Neither side may use a reconciliation loop to conceal split authority.
