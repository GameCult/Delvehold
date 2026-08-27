# Delvehold Agent Notes

## Project identity

- The title is **DELVE/HOLD** in presentation and `Delvehold` in repository, package, and path names.
- `DELVE` and `HOLD` are two projections of one persistent world, not separate games joined by a synchronization layer.
- Client presentation may weight either half of the title according to the active mode. The canonical project name does not change.

## Architecture

- CultMesh is the typed world-state and capability surface.
- Shared state belongs to world organs, not the Godot client or documentation site.
- One Godot C# client contains both DELVE and HOLD. Mode changes select different projections and interactions over the same persistent world; they do not cross a client boundary.
- One central C# world host owns Delvehold canonical state through explicitly separated internal organs.
- The Godot client and world host communicate through typed CultMesh commands, projections, capabilities, and receipts. Client-local prediction and presentation cannot commit shared truth.
- Authoritative dungeon generation runs in the world host using GameCult.Math (CultMath), including `CultMath.Random`. CultGeometry (`GameCult.Geometry`) owns reusable isosurface extraction and neutral mesh artifacts; Godot only adapts committed results into engine objects.
- Commands cross authority boundaries as typed intents and produce typed receipts.
- The Greathold contains Vault-anchored Holds joined by routes. A workshop has one durable identity and at most one active Hold attachment; dormant workshops create no local pressure. Contracts and other typed relationships preserve ownership, capacity, provenance, and consent without redefining locality.
- DELVE equipment authority lives in the visible gear slots and limited carried inventory. Each player has unlimited private Hold gear storage and exactly five saved loadouts; saves own no items, restore performs no silent acquisition or service, and departure automatically receipts the visible equipped and carried state.
- Dungeon delving is part of a core's lifecycle. Industrial systems must remain legible to dungeon instinct as bounded, contested delving rather than direct tissue damage.
- Greathold canon is owned by `Delvehold/Lore/The Greathold.md`: it is a multigenerationally cleared extension of the world-dungeon along the dwarven mountain spine. Its inherited deep routes and institutions created the global adventurer economy and enabled later industrial exploitation; industry did not discover dwarven deep access.

## Documentation

- `Delvehold/` contains the published Markdown source.
- `site/` contains only Delvehold-specific Quartz configuration and presentation.
- The masthead owns global section routes. Desktop and mobile within-section navigation are projections of the same Quartz content tree and active-section filters; do not maintain separate route lists.
- Shared Quartz machinery remains owned by `GameCult/GameCult-Quartz`; do not vendor it here.
- Generated output under `quartz-site/public/` is disposable and must not become source truth.
- Game design, technical documentation, and lore are public project surfaces. Keep their canonical Markdown reachable through the corresponding masthead section and its projected content tree.

## Lore prose

- Use `F:\Projects\Kalsa\workshop\review-council\critics\AI-Isms and Prose.md` as the review brief for Lore prose. Its named patterns are prompts to reread, not forbidden-token rules or quality metrics.
- Lore canon lives in claims, relationships, chronology, links, and ownership. Existing sentences are replaceable projections; preserve canon through a fact audit, not by protecting wording.
- Accept prose only after full-page reading for voice, rhythm, specificity, continuity, and trust in the reader. Pattern counts can locate pressure but cannot demonstrate quality.
- Commit `15863a7` is rejected prose evidence. Its sentence-local substitutions reduced surface markers while preserving viewpoint chorus, repeated frames, explanatory cadence, and authorial distance. Do not use its replacement passages as positive examples.
