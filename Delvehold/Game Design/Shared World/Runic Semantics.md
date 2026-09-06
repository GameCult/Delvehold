---
title: Runic semantics
description: The shared magical operations and effect graph beneath casting, enchanting, and spell engines.
---

DELVE spellcasting and HOLD runic engineering express one world-owned set of magical semantics through different source structures. Equivalent semantic effect graphs obey the same operation, terminator, mana, material, and resource rules regardless of how they were authored.

The world host commits recognition results and owns lowering, graph validation, interpretation, and receipts. [[Game Design/DELVE/Rune Casting|Rune casting]] owns the stroke-recognition contract. Casting controls, rune libraries, enchanting workbenches, wands, spellbooks, and renderers may project committed state; none may maintain another expansion table or interpreter.

## Source contracts

DELVE supplies an ordered sequence of recognized casting tokens with stroke evidence. The authoritative lowering catalogue maps each token to a semantic graph fragment; one compound token may expand into several nodes and edges. Casting and enchanting forms preserve recognizable topology through that versioned correspondence without requiring one-to-one rune identity or identical geometry. Learning either form does not automatically teach its counterpart.

HOLD supplies explicit enchanting nodes, typed ports, edges, substrate bindings, and fabrication provenance. It does not pass through the casting grammar. The source owners define their own construction lifecycle and learned vocabulary; this owner defines how their committed outputs become semantic effect graphs.

Conceptually:

```text
DELVE strokes
  -> recognized casting runes
  -> sequential casting grammar
  -> compound expansion and lowering
  -> semantic effect graph

HOLD enchanting nodes and typed edges
  -> explicit enchanting graph
  -> semantic effect graph
```

The host-owned lowering catalogue versions every correspondence between a casting rune and its graph fragment. Source maps join strokes and casting tokens to the expanded nodes and edges used for execution. Enchanting graphs preserve their own node, port, edge, substrate, and fabrication provenance.

## Terminators and finalization

Every finalized executable graph requires an outer terminator. Terminators have their own semantics: they decide how an accumulated pattern becomes consequential and may appear inside a larger effect graph.

Null is the cancellation semantic. Source structures may express it through different runes or nodes while producing the same cancellation result. [[Lore/Industry/Runic Engineering#The first rune|Field instruction begins with the null casting rune]].

## Execution outcomes

A finalized source can be:

- **parsed and effective:** lowering produces a valid graph whose execution has an observable result;
- **parsed but apparently useless:** a valid graph executes and consumes resources without producing a result the observer can discern;
- **cancelled:** null closes construction without executing its represented effect; or
- **corrupt:** recognition, source grammar, compound expansion, lowering, or graph validation cannot produce the required terminated graph.

Usefulness is not a parser rule. Rune libraries and workshop tools do not hide, disable, or reject learned combinations because an implementation expects them to waste mana. Players discover useful, useless, and situational constructions by casting, building, testing, and inspecting evidence.

## Authority and evidence

Receipts join one cast attempt or artifact revision to its source evidence, lowering version, semantic graph, resource use, and runtime result. A casting receipt distinguishes recognized gestures, casting tokens, compound expansions, and expanded graph elements. An enchanting receipt preserves explicit topology, substrate bindings, fabrication state, and activation history.

The host may retain deeper execution truth than a character can perceive. Player-facing records expose what the player authored, what their character observed, and what admitted sensory spells or detection devices measured.

See [[Game Design/DELVE/Rune Casting|Rune casting]] for the sequential source language and [[Game Design/HOLD/Enchanting and Wands|Enchanting and wands]] for explicit persistent graphs.
