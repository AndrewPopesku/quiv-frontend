# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Runtime

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun install` instead of npm/yarn/pnpm
- Use `bunx <package>` instead of `npx <package>`
- Bun automatically loads `.env`, so don't use dotenv.
- Don't use `express` — use `Bun.serve()`. Don't use `vite` — Bun's bundler handles React/TSX/CSS natively.

## Commands

```sh
bun run dev          # Dev server with HMR on localhost:3000
bun run start        # Production server
bun run build        # Production build to dist/
bun run build:gh     # Build with /quiv-frontend/ public path (GitHub Pages)
bun run format       # Prettier formatting
bun run generate-client  # Regenerate API client from OpenAPI spec (requires backend running)
```

There are no tests currently (`bun test` if added).

## Architecture

This is a **React 19 SPA** for a vocabulary learning platform, served by a Bun HTTP server that proxies API calls to a Django backend.

**Entry points:**
- `src/index.ts` — Bun server: proxies `/api/*` to `API_BASE_URL`, serves `/env.js` (injects `GOOGLE_CLIENT_ID` at runtime), and falls back all routes to `index.html` for SPA routing.
- `src/frontend.tsx` — React root, mounts `<App />` with providers.
- `src/App.tsx` — React Router v7 routes with auth-gated layout.

**Key layers:**

| Layer | Location | Notes |
|---|---|---|
| API client | `src/api/` | Auto-generated from OpenAPI spec via `generate-client`. Do not hand-edit. |
| HTTP client | `src/lib/axios.ts` | Axios instance with JWT refresh interceptor. |
| Auth | `src/context/AuthContext.tsx` | JWT + Google OAuth. Tokens in `localStorage`. |
| Pages | `src/pages/` | One file per route. |
| Components | `src/components/ui/` | shadcn/ui (Radix + Tailwind). `src/components/` for app-specific. |
| Types | `src/types/` | Hand-written domain types (user, vocabulary, exercises). |


**State management:**
- Server state: **TanStack React Query** (query keys, caching, invalidation).
- Auth state: **React Context** (`useAuth()` hook from `AuthContext`).
- Forms: **react-hook-form** + **Zod** validation.

**Routing structure:**
- Unauthenticated: `/` (landing), `/login`
- Authenticated (behind layout with sidebar): `/` (dashboard), `/writing`, `/vocabulary`, `/saved-words`, `/saved-words/:id`, `/exercises/*`, `/profile`

**Environment variables:**
- `API_BASE_URL` — backend URL (default: `http://localhost:8000`)
- `GOOGLE_CLIENT_ID` — injected into the page via `/env.js` at runtime, not baked into the bundle.

## Path Aliases

`@/*` resolves to `./src/*` (configured in `tsconfig.json` and recognized by Bun).

## UI Components

Use shadcn/ui components from `src/components/ui/`. The project uses Tailwind CSS v4 with custom design tokens (gold, blue, sidebar color variants) defined in `src/index.css`.

## Docker

- `docker-compose.yml` — production stack (frontend on port 3002, Django backend on 8002, Redis, Celery).
- `docker-compose.dev.yml` — dev stack with volume mounts and hot reload.