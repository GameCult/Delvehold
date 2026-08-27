---
title: Implementation Map
description: Current runtime body, authority boundaries, and focused verification targets.
aliases:
  - /documentation/implementation-map
---

# Implementation Map

This page describes the body that exists in source. The [[Game Design/index|Game Design Document]] describes the intended game and remains the authority for design.

## Runtime body

- `Delvehold.WorldHost` is the sole writer of canonical local world state. It owns the persistent CultCache, the explicit first-world seed, and admission of typed commands.
- `Delvehold.Client` is one Godot 4.7.2 C# application. DELVE and HOLD are views inside that application, not separate clients or authorities.
- `Delvehold.Protocol` contains the typed CultMesh operation payloads shared by the client and host. It owns no state and performs no simulation.
- CultLib revision `334e60f1928b4212a29dd8b0d19b2c099fe6365e` supplies CultCache, CultNet, and CultMesh. Builds reject another revision or a dirty CultLib worktree. The host targets the installed .NET 10 runtime; Godot's C# client targets its supported .NET 8 surface.

## First live path

The client discovers the host through its CultMesh rendezvous endpoint and sends `delvehold.world/enter`. The host returns and persists an idempotent typed world-entry command receipt. Entering the world does not advance simulation or grant the client write authority.

The seed state names one workshop, one commons, one dungeon core, one contract, and one material. These identifiers make the connection observable; they are not a claim that the first playable slice is complete.

## Forbidden writers

- The Godot scene tree, UI controls, and client session cannot write canonical world state.
- The protocol assembly cannot persist, simulate, or invent defaults on behalf of the host.
- Reconnect and replay cannot manufacture a second receipt for the same idempotency key.
- JSON is not a load-bearing state format. Canonical state and receipts are typed CultCache documents.

## Verification layer

`scripts/verify-runtime.ps1` builds the three projects, starts the host, connects the headless Godot client, rejects an idempotency collision and an invalid projection, restarts the host against the same CultCache, and replays the original enter intent. The smoke compares the complete accepted receipt summary, including its original effective time, across both accepted calls, requires the CultCache state file to remain present, and rejects known canonical-write APIs in client source.

Dungeon generation, CultMath randomness, CultGeometry isosurface extraction, gameplay mutation, and the Ghostlight boundary remain subsequent cuts.
