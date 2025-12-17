/* REFERENCES

TypeScript Setup
https://www.robinwieruch.de/typescript-node-js/

HonoJS
https://hono.dev/docs/

SwashBuckle
https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/


Async auto-wrapping Await in JS is Very Annoying..

IF using ORM, have to re-seed DB every time, which is also Annoying.
So, in-memory Data for this Demo is much easier for Demo Purposes.

Accept both Form & Json/Query in route input, accept multiple

*/

// REFER: https://github.com/honojs/node-server

import 'dotenv/config';
import { serve } from '@hono/node-server';
import { createApp } from './app.js';

const allowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const app = createApp(allowed.length ? allowed : undefined);
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';

console.log(`Server running on ${host}:${port}`);

serve({
  fetch: app.fetch,
  port,
});
