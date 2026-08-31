---
title: Rune casting
description: Freehand and guided construction of compositional spells during DELVE play.
---

Rune casting is live construction in the shared [[Game Design/Shared World/Runic Language|runic language]]. A caster enters spellcasting mode, adds strokes and runes to one append-only canvas, and presses the same mode control again to finalize and exit. Finalization, not rune recognition, commits the resulting graph.

Three controls have separate jobs:

- the spellcasting-mode control enters construction and exits to finalize it;
- the mana trigger emits mana and defines stroke-down and pen-up boundaries; and
- the rune-library control opens a radial projection of every rune the character has learned.

The learned-rune set is world state. Opening the library does not grant knowledge or create a second casting mode.

## Direct and guided construction

Direct freehand casting records the cursor trajectory while the mana trigger is held. The detector matches completed strokes against familiar runes and appends recognized operations to the active graph.

Guided library casting is available to every player on every cast. Selecting a learned rune places a virtual cursor at the first canonical stroke start. Pointer movement with a positive projection onto the current stroke tangent advances that cursor; orthogonal and backward movement stall without erasing progress. Advancement has a maximum speed and is scaled by directional alignment raised to a tunable exponent. These are balance handles for keeping guided casting competitive while preserving alignment and rhythm as mastery.

Circling, wagging, or exploratory movement is permitted. It eventually advances whenever it contains some useful forward projection, but it does so slowly. The system has no failure threshold, regression rule, or hidden judgement about whether a player's motion looks intentional.

Trigger release finishes the active stroke and stops mana emission. Between disconnected strokes, pointer input guides the virtual cursor toward the next start while the trigger remains released. Pressing the trigger early pauses that transition at its current position; releasing it resumes movement. On arrival the cursor locks until a later trigger-down begins the next mana-bearing stroke.

Both paths use the same ordered stroke geometry, learned rune identity, construction canvas, final graph, and world result. Guided casting removes recall and lateral precision demands while retaining rune order, direction changes, pen-up transitions, trigger cadence, and casting pressure. Players may switch between guided and freehand construction rune by rune within one spell.

## Cancellation and wild magic

Individual strokes cannot be erased from the active canvas. A mistaken construction must be closed with the null terminator, a simple right-to-left rune available in every qualified mage's library. Drawing it freehand is the quick path; guided construction remains available even when the existing canvas is corrupt.

Exiting spellcasting mode finalizes the canvas. A valid graph with an outer terminator executes. A null-terminated graph cancels safely. A corrupt, incomplete, or unterminated graph becomes wild magic.

Wild magic interprets the malformed accumulated pattern and attempts to pull from the caster whatever mana its resulting effect demands. The common failure draws mana into an unstable local charge and detonates roughly one second later, giving the caster and nearby allies time to move. Rarer corrupt patterns can produce stranger or useful outcomes. Exact mana limits, outcome tables, and collateral bounds remain prototype work.

## Spellbook and diagnosis

The spellbook records finalized attempts, including successful, apparently useless, cancelled, and wild results. Its baseline entry contains the submitted stroke evidence, recognized runes, construction order, authoritative parsed graph, final status, ordinary visible mana change, and consequences the character observed. The graph uses a Sugiyama layered projection with an equivalent linear rune list and relational text outline.

Internal mana flavor, branch flow, interference, hidden damage, local material response, and the exact pattern received by a terminator require sensory magic or an enchanted detection device capable of measuring them. Later equipment cannot reveal private historical host state unless an admitted instrument recorded the activation or a physical trace remains available for inspection.

Capability gates what the character can know, not how the player may access earned information. Every available observation needs equivalent graph, text, table, keyboard, non-colour, and screen-reader projections.

Exact freehand tolerances, recognition ambiguity, empty-canvas finalization, incomplete guided strokes, and interruption during construction remain prototype decisions.
