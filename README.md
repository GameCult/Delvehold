# DELVE/HOLD

`DELVE/HOLD` is a persistent-world game designed as a proving ground for CultMesh and the broader Aetheria architecture.

One shared world is projected through two modes:

- **DELVE** — cooperative expeditions into procedurally generated living dungeons.
- **HOLD** — cozy workshop play about manual magic growing into a networked magical factory.

One Godot C# client contains both modes. One central C# world host owns the
canonical simulation, and the two processes communicate through CultMesh.

The published project notes live in `Delvehold/`. The site is a thin consumer of the shared [`GameCult-Quartz`](https://github.com/GameCult/GameCult-Quartz) engine and deploys to [delvehold.gamecult.org](https://delvehold.gamecult.org).

## Local documentation build

The launcher expects `GameCult-Quartz` beside this repository or at `GAMECULT_QUARTZ_ROOT`.

```powershell
.\scripts\quartz\quartz.ps1 build
```

Generated output is written to `quartz-site/public/`.

## Local runtime

The first runtime foundation expects the admitted CultLib worktree at
`F:\Projects\CultLib-aetheria-authority` and Godot 4.7.2 Mono at
`F:\Applications\Godot_v4.7.2-stable_mono_win64`. Build and exercise the
Godot-to-host CultMesh path, including a host restart, with:

```powershell
.\scripts\verify-runtime.ps1
```

Open the project in the Godot editor with:

```powershell
.\scripts\open-godot.ps1
```

Validate the source-addressed control-flow map or open its interactive Norn view:

```powershell
.\scripts\control-flow.ps1 validate
.\scripts\control-flow.ps1 view
```
