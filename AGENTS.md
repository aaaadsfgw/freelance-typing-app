# Dev Desk

タイピングで伸ばす、今どきの IT 企業 Web エンジニア体験。

- 仕様: `docs/specs/mvp.md`
- 完成条件: `docs/tasks/mvp_acceptance_checklist.md`
- UI モック: `ui-proposals/game-c.html`（C ベース + A の返信感）

コマンドは `just` 経由。JS の lint / format / test / build は Vite+（`vp`）に任せる。

```
just dev
just check
just deploy
just db-migrate
just db-seed
```
