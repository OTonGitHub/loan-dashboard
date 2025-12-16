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

import {serve} from '@hono/node-server'
import { createApp } from './app.js';

const app = createApp();
const port = 3000

console.log(`Server Running On http://localhost:${port} Yayy 🚀`)

serve({
    fetch: app.fetch,
    port
})