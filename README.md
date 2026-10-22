# DELVE/HOLD

`DELVE/HOLD` is a persistent-world game designed as a proving ground for CultMesh and the broader Aetheria architecture.

One shared world is projected through two modes:

- **DELVE** — cooperative expeditions into procedurally generated living dungeons.
- **HOLD** — cozy workshop play about manual magic growing into a networked magical factory.

One Godot C# client contains both modes. One central C# world host owns the
canonical simulation, and the two processes communicate through CultMesh.

**Valuable here:** the design of one persistent world with two projections (`Delvehold/Game Design/index.md`), and a working example of the CultMesh client/host split: a Godot C# client (`client/`) that can only send typed intents, and a single world host (`src/Delvehold.WorldHost`) that is the sole writer of canonical state, persisted as CultCache documents, with the shared operation payloads in `src/Delvehold.Protocol`.

**Problem it solves:** it is a proving ground. It forces CultMesh and the Aetheria architecture (typed commands and receipts, host-owned state, client prediction that cannot commit truth) to carry a whole game instead of a demo.

**Entry points:** `Delvehold/Documentation/Implementation Map.md` (what exists in source) and `Delvehold/Documentation/Authority Map.md`; the design authority is `Delvehold/Game Design/index.md`; `scripts/verify-runtime.ps1` builds and runs the client-to-host smoke path.

**Live versus planned:** live is the first runtime path only: the client discovers the host and sends `delvehold.world/enter`, and the host returns and persists an idempotent receipt for a seeded world (one workshop, one commons, one dungeon core, one contract, one material). The DELVE and HOLD gameplay in the design documents (expeditions, dungeon generation, workshop factory, Greathold) is planned, not implemented.

The published project notes live in `Delvehold/`. The site is a thin consumer of the shared [`GameCult-Quartz`](https://github.com/GameCult/GameCult-Quartz) engine and deploys to [delvehold.gamecult.org](https://delvehold.gamecult.org).

## Local documentation build

The launcher expects `GameCult-Quartz` beside this repository or at `GAMECULT_QUARTZ_ROOT`.

```powershell
.\scripts\quartz\quartz.ps1 build
```

Generated output is written to `quartz-site/public/`.

## Local runtime

The runtime needs a CultLib checkout at the revision pinned in
`Directory.Build.props` (`CultLibRevision`; builds reject another revision or a
dirty worktree) and Godot 4.7.2 Mono. `verify-runtime.ps1` takes them as
`-CultLibRoot` and `-GodotRoot`; its defaults are this workstation's
`F:\Projects\CultLib-aetheria-authority` and
`F:\Applications\Godot_v4.7.2-stable_mono_win64`. Build and exercise the
Godot-to-host CultMesh path, including a host restart, with:

```powershell
.\scripts\verify-runtime.ps1
```

Open the project in the Godot editor with:

```powershell
.\scripts\open-godot.ps1
```
