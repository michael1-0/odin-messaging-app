# monorepo-template

A minimal full-stack monorepo template using `pnpm` workspaces.

## Stack

- Frontend: React + Vite + TypeScript, with React Router for routing
- Backend: Express + TypeScript
- Database: Prisma + PostgreSQL
- Tooling: shared ESLint, Prettier, and TypeScript configs

## Workspace Layout

```text
apps/
  backend/    # Express API + Prisma
  frontend/   # React app (Vite)
packages/
  eslint-config/
  prettier-config/
  typescript-config/
```

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL

## Getting Started

Install dependencies from the repository root:

```bash
pnpm install
```

Create a backend env file at `apps/backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
PORT=5000
```

Apply Prisma migrations:

```bash
pnpm --filter backend exec prisma migrate dev
```

Run the full monorepo in development mode:

```bash
pnpm dev
```

## Root Scripts

- `pnpm dev` — run all workspace `dev` scripts
- `pnpm dev:backend` — run only backend in watch mode
- `pnpm dev:frontend` — run only frontend
- `pnpm build` — build all workspaces
- `pnpm lint` — lint all workspaces
- `pnpm format` — format all workspaces
- `pnpm test` — run tests where available
- `pnpm start` — run backend production build
- `pnpm preview` — preview frontend production build

## Contributing

Contributions are welcome.

## Notes

- Prisma client output is generated under `apps/backend/src/db/generated/prisma/`.
- Shared config packages are consumed by apps via workspace dependencies.
- This repository is intended as a starting point; replace app code, add or remove dependencies with your project domain logic.
