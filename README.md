# odin-messaging-app

This is a project submission for The Odin Project NodeJS Course, Project: Messaging App.

This is a full-stack real-time messaging application built as a pnpm monorepo. Users can sign up, log in, create chat rooms, join rooms, and exchange messages in real-time. Authentication and authorization are handled on the backend using Passport, JWT, and Socket.IO middleware.

## Tech Stack

- **Frontend:** React 19, Vite 7, React Router 7, Tailwind CSS 4
- **Backend:** Node.js, Express 5, TypeScript, JWT, Passport.js, Socket.IO
- **Database:** PostgreSQL via Prisma ORM
- **Tooling:** pnpm workspaces, ESLint, Prettier

## Monorepo Structure

```text
apps/
	backend/    # API server & WebSocket backend
	frontend/   # React Single Page Application (SPA)
packages/       # Shared configurations & code
```

## Prerequisites

- Node.js
- pnpm
- PostgreSQL

## Installation

From the repo root:

```bash
pnpm install
```

## Environment Variables

### Backend (`apps/backend/.env`)

Create a `.env` file in the `apps/backend` directory:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_SECRET=replace-with-a-long-random-secret
```

### Frontend (`apps/frontend/.env`)

Create a `.env` file in the `apps/frontend` directory. `VITE_API_URL` should point to your backend url.

```env
VITE_API_URL=http://localhost:3000
```

## Database Setup

```bash
pnpm --filter backend exec prisma migrate dev
```

This applies migrations to your database and generates the Prisma client used by the backend.

## Run Locally

From the repo root, run both frontend and backend development servers simultaneously:

```bash
pnpm dev
```

This starts both apps in watch mode by leveraging the monorepo dev script.

## Available Scripts (root)

- `pnpm dev` - run all workspace dev scripts
- `pnpm build` - build all workspaces
- `pnpm lint` - lint all workspaces
- `pnpm format` - format all workspaces
- `pnpm preview` - preview frontend production build
- `pnpm start` - start backend production build
