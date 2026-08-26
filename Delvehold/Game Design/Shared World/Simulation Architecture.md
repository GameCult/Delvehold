---
title: Simulation architecture
description: The owners, data flow, and invariant boundary of the persistent world.
---

The game uses two canonical simulation domains joined by typed exchange.

## Owners

One central C# **Delvehold world host** contains the Greathold organs and owns players, workshops, parties, contracts, expeditions, dungeons, civic state, quantitative goods, production, prices, orders, and local consequences. Process containment does not collapse their internal authority boundaries.

One persistent **Ghostlight WorldKernel** owns the world outside the Greathold: foreign regions, actors, institutions, population Gestalts, their knowledge, relationships, goals, posture, pressure, strategic decisions, external events, and news.

The CultMesh bridge carries documents. It schedules no independent truth and earns no right to repair either side.

One Godot C# client contains the DELVE and HOLD projections. It submits typed
commands and renders typed projections and receipts over CultMesh. Client-local
prediction, navigation presentation, camera state, and animation are derived;
they cannot commit canonical state.

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
