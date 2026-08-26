---
title: Control Flow Map
description: Typed, source-addressed architecture and execution graph rendered through Norn.
aliases:
  - /documentation/control-flow
---

# Control Flow Map

The maintained graph lives in `modeling/control-flow/graph.ts`. It separates two views:

- **Authority body** names the runtime organs, their owners, and which edges may read, write, construct, dispatch, or render.
- **Control flow** follows executable paths through Godot startup, local projection selection, CultMesh discovery and session establishment, host startup, state seeding, entry admission branches, receipt persistence, response projection, shutdown, and verification.

Every node and edge carries source witnesses. The source inventory covers the executable game client, host, protocol, root solution and MSBuild files, and top-level runtime launchers with normalized SHA-256 digests. Changing one of those files makes validation fail until the graph is reviewed and the new digest is explicitly admitted. New executable files inside those surfaces also fail the inventory check. Quartz publishing remains part of the documentation body; this Norn view remains part of the modeling-tool body.

Norn owns graph layout, motion, selection, inspection, and rendering. It does not own the graph's meaning, execute control flow, or issue game commands.

Run the integrity check and build the viewer:

```powershell
.\scripts\control-flow.ps1 validate
```

Open the interactive Norn view:

```powershell
.\scripts\control-flow.ps1 view
```

The viewer runs at `http://127.0.0.1:4176`. Its process ID and logs live under `artifacts/control-flow/`.
