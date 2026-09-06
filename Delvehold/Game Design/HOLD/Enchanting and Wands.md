---
title: Enchanting and wands
description: Binding explicit runic graphs into tools, materials, and persistent workshop artifacts.
---

HOLD enchanting authors explicit graphs over shared [[Game Design/Shared World/Runic Semantics|runic semantics]]. A straightforward graph equivalent to a common cast can be inscribed directly onto an item and work, but generic inscription usually spends more mana and material than a design fitted to its host.

A wand is a tool that stores an explicit persistent effect graph and activates it repeatedly. It does not store a DELVE casting sequence. Wand names do not imply quality. Two wands carrying semantically equivalent graphs may differ sharply in efficiency, concentration, capacity, stability, and failure behaviour because their enchanting runes, conduits, materials, substrates, fabrication, damage, and repairs differ.

An integrated enchantment makes the artifact part of the spell. Weapon geometry can supply concentration or containment; an existing workpiece can receive an attachment without a `Creation` operation allocating a new entity. Auxiliary branches may gather measured waste, redirect it, or feed later operations. They cannot invent mana that the main graph never produced.

## Compound substrate graph

Enchanting is authored as an abstract hierarchical graph rather than a sword-shaped etching canvas. The artifact is the root. Components such as blade and hilt own nested clusters containing the enchanting runes and conduits physically bound to them. Every enchanting rune exposes typed inputs and outputs. Edges connect those ports within a component or across component boundaries.

```text
sword
├─ hilt
│  └─ storage rune
├─ blade
│  └─ containment rune
└─ hilt.storage -> blade.containment
```

Material, geometry, conduit construction, condition, and fabrication precision belong to authoritative component, node, port, and edge state. Renderer coordinates do not. Moving a node in the Sugiyama projection changes presentation only.

Replacing a blade removes the runes and conduits that belong to that blade. Cross-boundary edges become severed or require an explicit rebinding operation; the hilt cannot silently retarget them to a replacement. Repairs, replacements, and reinscription preserve provenance and activation history.

## Materials and conduits

Mana reaches each graph element carrying the flavor of its prior path. A masterwork therefore chooses rune and conduit materials for the local flow rather than applying one artifact-wide quality grade. Multi-material work emerges from those local requirements. Copying its visible palette onto a different graph or substrate may increase loss or distortion; an exact reproduction succeeds through the same physical rules regardless of the maker's status.

Gold is the leading reference material for broadly neutral, reliable conduction and may be the best practical choice for many routes. Its excellence does not require a contrived magical weakness. Other materials earn use through availability, substrate integration, capacity, containment, filtering, transformation, interference, repair, or another measured behaviour. The exact material catalogue and response curves remain prototype work.

Conduit size is consequential. Large channels consume more material and component routing budget while carrying heavier sustained or pulse loads and tolerating more fabrication variation, wear, or future expansion. Oversizing is a valid route to a dependable artifact. Expert optimization fits the conduit to a declared service envelope; it does not make every channel as small as possible.

Each design distinguishes:

- the logical rune graph;
- intended component bindings, conduit materials, sizes, and tolerances;
- the fabricated result and its deviations;
- current condition and repairs; and
- activation and test history for that exact artifact revision.

Visible precious material and massive traces suggest investment and possible capacity. They do not prove a useful graph, adequate mana supply, sound fabrication, current function, or danger.

## Testing and diagnosis

The enchanting workbench projects the compound graph with collapsible substrate clusters, explicit ports and cross-component edges, edit provenance, and observed activation receipts. Graph topology owns meaning; edit order does not. Accessible component trees, connection tables, material ledgers, relational outlines, and timelines expose the same earned facts.

Basic inspection shows the design the workshop authored, visible workmanship, known materials, as-built measurements, and observed results. Internal flavor, loss, interference, and branch behaviour require sensory enchantments or detection devices with sufficient range, calibration, and resolution. Measurements retain their instrument, activation interval, uncertainty, and target provenance.

Tools report evidence rather than solving the design. A structurally valid enchantment may consume resources with no discernible effect. Workshops learn by fabrication, activation, comparison, repair, and revision; the library does not suppress combinations predicted to be useless.

Exact component vocabularies, port types, conduit equations, interference models, fabrication variance, wand power and wear, inscription finalization, and persistent wild-magic behaviour remain prototype work.
