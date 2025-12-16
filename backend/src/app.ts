/** COMPOSITION ROOT
 *
 */

import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { HTTPException } from 'hono/http-exception';
import { cors } from 'hono/cors';

import { InMemoryLoanRepository } from './loans/loan.memory.js';
import { LoanService } from './loans/loan.service.js';
import { createLoanRoutes } from './loans/loan.routes.js';
import { LoanConflictError, LoanNotFoundError } from './loans/loan.errors.js';

export function createApp() {
  const app = new Hono();

  const loanRepository = new InMemoryLoanRepository();
  const loanService = new LoanService(loanRepository);

  app.use(
    '*',
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
    })
  );
  app.use('*', prettyJSON());
  app.route('/api/v1/loans', createLoanRoutes(loanService));

  app.onError((err, c) => { // *WHEN* THIS BLOATS -> Switch Case Overflow
    if (err instanceof LoanNotFoundError) {
      return c.json({ message: err.message }, 404);
    }
    if (err instanceof LoanConflictError) {
      return c.json({ message: err.message }, 409);
    }
    if (err instanceof HTTPException) {
      return err.getResponse();
    }
    console.error(err);
    return c.json(
      { message: err.message ?? 'Ultra Oopsie: Server Error' },
      500
    );
  });

  return app;
}
