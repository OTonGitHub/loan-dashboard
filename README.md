# Loan Dashboard

TypeScript full-stack demo for loan facility management. App specifically made for SME Digital's 4-day Take-Home Exam. Ships with seed data for a quick walkthrough.

## Prerequisites

- Node.js 20+ (tested with 20.x)
- npm (comes with Node)

## Quick start

```bash
# install deps (root -> both apps)
npm install --prefix backend && npm install --prefix frontend

# run backend (Hono on 0.0.0.0:3000 by default)
npm run dev:backend

# in another shell, run frontend (Vite on 5173)
npm run dev:frontend
```

Or run both in one shot (same port defaults): `npm run dev` from the repo root.

## Build

- Backend: `npm run build:backend` (outputs to backend/dist)
- Frontend: `npm run build:frontend` (outputs to frontend/dist)

## Archive

Using Git to archive and package current tracked files. Omits things like DB:

- `git archive --format=tar.gz -o loan-dashboard-src.tar.gz HEAD`

## Environment

Backend:

- `PORT` (default 3000), `HOST` (default 0.0.0.0)
- `ALLOWED_ORIGINS` comma-separated list for CORS (default allows localhost:5173)
- `SQLITE_PATH` to override DB path (default `backend/data/loans.db`)

Frontend:

- `VITE_API_BASE` (default `http://localhost:3000/api/v1`)

## Data & migrations

- SQLite migrations auto-run on startup.
- Seed wipes and repopulates the `loans` table on each backend boot (dev/demo only).

## API endpoints (base `/api/v1`)

- `GET /loans` list with pagination/sorting (`page`, `pageSize`, `sortBy`, `sortDir`)
- `GET /loans/summary` totals
- `GET /loans/:loanNumber` fetch one
- `POST /loans` create
- `PUT /loans/:loanNumber` update (body loanNumber must match param)
- `DELETE /loans/:loanNumber` soft delete

See `.HTTP` for ready-to-run sample requests.

## Tech stack

- Backend: Hono, @hono/node-server, Drizzle ORM, SQLite (better-sqlite3), Zod
- Frontend: React 19, Vite, Tailwind CSS v4, DaisyUI

## Notes / Status

**Not done (future)**

- Swagger/OpenAPI docs not added.
- Duplicate-check in service could be tightened (uses findByLoanNumber in repo; ensure conflict handling stays consistent).
- No automated tests; `.HTTP` has manual scenarios.

**Risks / quirks**

- Soft-delete + unique loanNumber: recreating a deleted loanNumber will hit DB unique and return 500 (would ideally be 409 or reactivation).
- Seed wipes and reloads loans table on each backend start (dev/demo only).
