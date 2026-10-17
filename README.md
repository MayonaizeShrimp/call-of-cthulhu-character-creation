# Call of Cthulhu 7e — Character Creation

A web app for building Call of Cthulhu 7th edition investigators for a homebrew campaign
(2026 modern Indonesia, no magic). Players create their character here and copy the values
into the VTT by hand. All data stays in the browser's localStorage.

## Requirements

- Node 24 (`nvm use` reads `.nvmrc`)
- npm (bundled with Node)

## Scripts

| Command                 | What it does                                |
| ----------------------- | ------------------------------------------- |
| `npm start`             | Dev server at http://localhost:4200         |
| `npm run build`         | Production build to `dist/`                 |
| `npm run preview`       | Serve the production build locally          |
| `npm test`              | Run unit tests once (Vitest)                |
| `npm run test:watch`    | Run tests in watch mode                     |
| `npm run test:coverage` | Tests with coverage report in `coverage/`   |
| `npm run typecheck`     | TypeScript type check                       |
| `npm run lint`          | Biome lint + format check                   |
| `npm run check:fix`     | Apply Biome fixes and formatting            |

## Structure

```
src/
  client/      React UI (antd), providers and hooks
  core/        Framework-free logic, including the Zustand store (zustand/vanilla)
  game-rules/  7e rules data and types (characteristics, skills, occupations)
```

Dependency direction is `client → core → game-rules`. Biome enforces it with
`noRestrictedImports` (see `biome.json`). Import across folders with the
`@client/*`, `@core/*` and `@game-rules/*` aliases.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `master` (or manually from the Actions
tab): it lints, type-checks, tests and builds, then deploys to GitHub Pages at
`/call-of-cthulhu-character-creation/`. Pull requests are not checked in CI; run
`npm run lint && npm run typecheck && npm test` locally before merging.

One-time setup: in the GitHub repository go to **Settings → Pages** and set
**Source** to **GitHub Actions**.
