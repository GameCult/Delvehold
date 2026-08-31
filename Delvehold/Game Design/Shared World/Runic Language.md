---
title: Runic language
description: The shared compositional language used by live spellcasting, enchanting, and spell engines.
---

DELVE spellcasting and HOLD runic engineering use one world-owned language. Rune identity, learned state, stroke geometry, graph construction, terminator semantics, and interpretation do not change with the client projection. Controls, tools, resource sources, and persistence do.

## Construction

Runes build an append-only effect graph. Recognizing a familiar rune adds its operation to the current construction; it does not execute the graph or clear prior work. Construction is inner-first, so the visible phrase follows the work being assembled:

```text
fire · spherical containment · attach · creation · throw
```

Here containment stabilizes a hovering fire construct. `Attach` carries that construct forward as a pending relationship, `Creation` allocates the empty dynamic entity that satisfies the relationship, and `Throw` acts on the resulting carrier. Adventurers may call the result a fire bolt, but canonical identity belongs to the recognized rune versions, their construction order, and the graph derived from them. The general rules for forward relationships and multi-input runes remain prototype work; this construction fixes the responsibilities of those operations without declaring a universal stack grammar.

The language is compositional rather than a flat list. A rune may close one expression and later become the payload of another operation. Runes may also open typed relationships that later runes satisfy. Exact arity, attachment, branching, merge, and feedback rules remain prototype work; every adopted rule must be shared by live casting, enchanting, and automation.

## Terminators

Every finalized executable graph requires an outer terminator. Terminators have their own semantics: they decide how a completed pattern becomes consequential and may themselves be nested inside a larger construction. A complete-looking graph remains open until its owner finalizes it.

Null termination is the cancellation operation. Null closes the entire active construction without executing the effect it otherwise describes. It is a real learned rune rather than a client escape command; [[Lore/Industry/Runic Engineering#The first rune|magical instruction begins with it]].

## Execution outcomes

A finalized graph can be:

- **parsed and effective:** the graph executes and produces an observable result;
- **parsed but apparently useless:** the graph executes, consumes the mana its operations require, and produces no result the caster can discern;
- **cancelled:** null closes the construction without executing its represented effect; or
- **corrupt:** the canvas cannot produce the required terminated graph and crosses the relevant wild-magic or fabrication-failure boundary.

Usefulness is not a parser rule. Rune libraries and workshop tools do not hide, disable, or reject learned combinations because an implementation expects them to waste mana. Players discover useful, useless, and situational constructions by casting, building, testing, and inspecting evidence.

## Authority and evidence

The world host owns recognized rune spans, the parsed graph, structural status, mana transactions, material interactions, runtime effects, and receipts. DELVE pointer input and HOLD authoring interfaces are projections over that authority. Neither may maintain a second interpreter or commit a result locally.

Receipts join one attempt or artifact revision to its rune evidence, graph, resource use, and observed result. The host may retain deeper execution truth than a character can perceive. Player-facing records expose what the player authored, what their character observed, and what admitted sensory spells or detection devices measured.

See [[Game Design/DELVE/Rune Casting|Rune casting]] for live construction and [[Game Design/HOLD/Enchanting and Wands|Enchanting and wands]] for persistent realization.
