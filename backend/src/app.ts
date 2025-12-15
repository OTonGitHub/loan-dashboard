/** COMPOSITION ROOT
 *
 */

import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';

import { InMemoryLoanRepository } from './loans/loan.memory.js';
import { LoanService } from './loans/loan.service.js';
import { createLoanRoutes } from './loans/loan.routes.js';

export const app = new Hono();
const loanRepository = new InMemoryLoanRepository();
const loanService = new LoanService(loanRepository);

app.use('*', prettyJSON());
app.route('/loans', createLoanRoutes(loanService));
app.onError((err, c) => {
  console.error(err);
  return c.json({ message: err.message ?? 'Internal Server Error' }, 500);
});
