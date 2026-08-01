# ArenaX WebApp

Frontend for the ArenaX platform: a web3 esports client for tournament
participation, marketplace trading, leaderboards, and on-chain reward
payouts. Companion to the [ArenaX Backend](https://github.com/roastellar-org/GameBackend).

> Demo codebase — commits follow a full feature evolution timeline
> (see `git log --oneline`).

## Stack

| Layer       | Technology                                             |
| ----------- | ------------------------------------------------------ |
| Framework   | React 18, TypeScript, Vite                             |
| Styling     | Tailwind CSS 3 (light/dark themes via CSS variables)   |
| Routing     | React Router 6 (lazy-loaded routes)                    |
| Data        | TanStack Query (caching, prefetching, invalidation)    |
| Realtime    | socket.io-client (live tournament/notification events) |
| Web3        | ethers.js (BrowserProvider, message signing)           |
| Testing     | Vitest                                                 |
| CI          | GitHub Actions                                         |

## Folder structure

```
src/
  api/             # typed API layer + React Query hooks per domain
  auth/            # session bootstrap, wallet auth context
  components/      # UI kit + feature components
  hooks/           # useWallet, useLiveUpdates, usePrefetch
  lib/             # theme provider, status maps, query client
  pages/           # route-level pages (all lazy-loaded)
  types/           # shared domain types matching the backend contract
  utils/           # wallet/format helpers + unit tests
.github/workflows/ # CI pipeline (lint, typecheck, test, build)
```

## Getting started

The app expects the ArenaX backend on `http://localhost:3000` (see the
backend README for setup).

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Wallet features require an injected EVM
wallet (MetaMask, Coinbase Wallet, Rainbow).

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Vite dev server with HMR             |
| `npm run build`     | Typecheck + production build         |
| `npm run typecheck` | TypeScript type checking             |
| `npm run lint`      | ESLint                               |
| `npm test`          | Vitest unit tests                    |

## Architecture notes

- **Wallet auth**: `useWallet` connects via the injected provider with
  Safari-friendly error normalization and a `wallet_requestPermissions`
  fallback; `AuthContext` exchanges a signed challenge for JWT access/
  refresh tokens and revalidates the session on boot.
- **Data fetching**: every API call is a typed TanStack Query hook;
  tournaments and rewards use 10s `staleTime` (no backend cache), the
  leaderboard polls every 30s to counter the backend's 60s cache, and
  navigation hover-prefetches the three hottest routes.
- **Performance**: all pages are lazy-loaded with vendor chunk splitting
  (react, router, query, ethers, socket) so the first paint only ships the
  landing chunk.
- **Theming**: light/dark/system modes driven by CSS variable tokens
  (`app`, `panel`, `elevated`, `line`, `strong`, `body`, `muted`) with
  `.dark` overrides; the setting persists under `arenax.theme`.
- **Live updates**: `useLiveUpdates` subscribes to Socket.IO rooms and
  invalidates the matching query keys when tournaments, rewards or
  notifications change.

## Documentation

- Backend API reference: `docs/API.md` in the
  [ArenaX Backend](https://github.com/roastellar-org/GameBackend) repository.
