/** COMPOSITION ROOT
 *
 */

import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { HTTPException } from 'hono/http-exception';

import { InMemoryLoanRepository } from './loans/loan.memory.js';
import { LoanService } from './loans/loan.service.js';
import { createLoanRoutes } from './loans/loan.routes.js';

export function createApp() {
  const app = new Hono();

  const loanRepository = new InMemoryLoanRepository();
  const loanService = new LoanService(loanRepository);

  app.use('*', prettyJSON());
  app.route('/api/v1/loans', createLoanRoutes(loanService));

  app.onError((err, c) => {
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
