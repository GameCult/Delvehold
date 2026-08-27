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

## Holds and workshop presence

- A Vault opens through committed survey, route, provisioning, and settlement state inside the Greathold rather than through server selection.
- Only active workshop sites contribute demand, production, discovery, notification, or infrastructure reservation in their Holds; only the singular civic home supplies ordinary future civic routing.
- At 36-hour lease expiry, automation checkpoints once across every site, unaccepted listings and reservations disappear, accepted obligations settle exactly once under their site-local terms, and the workshop produces no continuing live load.
- Dormancy preserves workshop identity, sites, local facilities and custody, history, relationships, seal identity, debts, completed acts, and already-cast votes.
- Reactivating the workshop replays no dormant production, duplicates no facility or inventory, and moves no committed material between sites without explicit route and custody receipts.
- A workshop may change its civic home or establish another site without gaining another seal; host-Hold policy governs every site regardless of the workshop's civic home.
- A site cannot close while silently owning facilities, inventory, reservations, staff commitments, accepted orders, or contracts; every item settles or receives an explicit terminal receipt.
- Quiet Holds persist, remain recoverable, and are never merged or wiped to repair population balance.

## Equipment and preparation

- Each player has exactly five saved loadout slots; saving overwrites only the selected slot and creates no item movement, reservation, purchase, or service.
- Equipped slots and carried inventory enforce their visible constraints, while private Hold gear storage has no player-facing capacity limit.
- Restore fills only currently accessible saved gear and exposes every unavailable entry with actions to clear, source, replace, repair, or refit it. It never performs those actions silently.
- Unique and provenance-sensitive gear resolves by identity; ordinary consumables may resolve by kind and quantity. Damaged owned gear remains visible as present and repairable rather than disappearing as missing.
- Contract-offered gear is selectable only while custody terms permit and is never auto-equipped or written into a saved slot.
- Departure atomically validates the visible equipped and carried state and records exactly that state without another confirmation screen.
- Saved loadouts and Hold-addressed private gear storage survive dormancy and civic-home changes without creating live pressure or moving remote, lost, escrowed, dispatched, installed, institution-held, or returned-loan items.

## Procedural dungeon proof

- Identical canonical input, CultMath seed, and generator version reproduce the same dungeon projection after host restart.
- Reconnecting the Godot client does not reroll routes, chambers, hazards, resources, or encounters.
- A pinned generation fixture proves version-bound output and records its input and output digests.
- The world host rejects client-supplied canonical rooms, random choices, and mesh results.
- CultGeometry emits engine-neutral geometry; no Unity, Godot, `System.Random`, or duplicate project-local mesher decides canonical generation.
