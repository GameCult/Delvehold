---
title: Acceptance criteria
description: Behavioral proofs for the joined game, its authority boundaries, and persistent simulation.
---

The design is proven by visible paths, not by the existence of schemas.

## Joined play

- A workshop decision changes a later expedition through canonical state.
- An expedition outcome changes workshop, contract, civic, or dungeon decisions after reload.
- Either mode remains playable when the other population is absent.
- Failure returns material consequence and future play rather than an empty reset.

## World authority

- Ordinary workshop activity appears externally only in the hourly realized-effects batch.
- A ratified mandate can cross immediately without revealing individual votes.
- Conflicting player behavior becomes observable aggregate effects, never averaged desire.
- A Ghostlight sanction is first an external event, then a Delvehold intent, then a local consequence only after admission.
- Ghostlight cannot mutate the externally controlled `greathold` institution through a Persona or strategic turn.
- Delvehold cannot rewrite a foreign actor's private belief, relationship, goal, or decision.

## Persistence and information

- Duplicate, stale, malformed, or causally invalid documents cannot mutate state. A valid document may admit an explicit subset only as one atomic recipient commit with every item result receipted.
- A newer boundary snapshot cannot double-apply an older effect delta, and a delayed delta cannot overwrite the newer snapshot watermark.
- Private beliefs do not become public news or canonical fact automatically.
- Catch-up is bounded, names the interval it summarizes, and never puppets an absent player.
- The visible news, price, contract, expedition, and workshop changes can be traced to typed events and receipts at the layer where players experience them.

## Procedural dungeon proof

- Identical canonical input, CultMath seed, and generator version reproduce the same dungeon projection after host restart.
- Reconnecting the Godot client does not reroll routes, chambers, hazards, resources, or encounters.
- A pinned generation fixture proves version-bound output and records its input and output digests.
- The world host rejects client-supplied canonical rooms, random choices, and mesh results.
- CultGeometry emits engine-neutral geometry; no Unity, Godot, `System.Random`, or duplicate project-local mesher decides canonical generation.
