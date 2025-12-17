Quick Cloudflare deploy notes

This project uses Hono for the backend and Vite for the frontend.
The Worker entry lives at `backend/src/worker-entry.ts` and is compiled to `backend/dist/worker-entry.js` by `tsc`.

Recommended workflow (from repo root):

1. Build backend (TypeScript -> dist)

   From the repo root you can run the helper script:

   ```bash
   npm run build:backend
   ```

   Or run directly:

   ```bash
   cd backend
   npm run build
   cd ..
   ```

2. Test Worker locally

   From the repo root you can run the helper script which uses the built file:

   ```bash
   npm run dev:worker
   ```

   Or run Wrangler directly:

   ```bash
   wrangler dev ./backend/dist/worker-entry.js
   ```

   The Worker will be available at a local URL (e.g. http://localhost:8788). Test endpoints like `/api/v1/loans`.

3. Publish Worker

   ```bash
   wrangler publish
   ```

   Wrangler will use `main` configured in `wrangler.toml` which points to `backend/dist/worker-entry.js`.

4. Build and publish frontend to Pages

   ```bash
   cd frontend
   npm run build
   npx wrangler pages publish dist --project-name=loan-dashboard-pages
   ```

   Or connect the repo to Pages in the Cloudflare dashboard and set build command `npm run build` and output folder `dist`.

Environment notes

- Use Workers/Pages environment variables (Dashboard or `wrangler secret put`) for secrets and `ALLOWED_ORIGINS`.
- `VITE_API_BASE` should be set in Pages to the Worker URL (e.g. `https://your-worker.workers.dev/api/v1`) or your domain's API route.

Persistence

- Current repo uses in-memory storage; for production use Cloudflare D1, KV, or Durable Objects.

Troubleshooting

- If `wrangler dev` complains about missing files, ensure you're running from repo root so relative `main` resolves.
- If you get runtime errors about `process` or Node-only APIs, ensure `createApp()` doesn't import Node-only modules when running under Workers. The code uses `createApp(allowedOrigins)` to accept environment bindings.
