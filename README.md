# DELVE/HOLD

`DELVE/HOLD` is a tiny persistent-world experiment built as a proving ground for CultMesh and the broader Aetheria architecture.

One shared world is projected through two modes:

- **DELVE** — a cooperative Unity RPG in which players enter procedurally generated living dungeons.
- **HOLD** — a cozy browser incremental about a mage's workshop growing into a networked magical factory.

The published project notes live in `Delvehold/`. The site is a thin consumer of the shared [`GameCult-Quartz`](https://github.com/GameCult/GameCult-Quartz) engine and deploys to [delvehold.gamecult.org](https://delvehold.gamecult.org).

## Local documentation build

The launcher expects `GameCult-Quartz` beside this repository or at `GAMECULT_QUARTZ_ROOT`.

```powershell
.\scripts\quartz\quartz.ps1 build
```

Generated output is written to `quartz-site/public/`.

