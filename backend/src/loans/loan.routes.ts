import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { LoanService } from './loan.service.js';
import { loanSchema, loanNumberParamSchema } from './loan.schema.js';

export function createLoanRoutes(service: LoanService) {
  const router = new Hono();

  router.get('/', async (c) => {
    const loans = await service.getLoans();
    return c.json(loans);
  });

  router.get(
    '/:loanNumber',
    zValidator('param', loanNumberParamSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            errors: result.error.issues.map((issue) => ({
              field: issue.path.join('.') || 'loanNumber',
              message: issue.message,
            })),
          },
          400
        );
      }
    }),
    async (c) => {
      const { loanNumber } = c.req.valid('param');
      const loan = await service.getLoan(loanNumber);
      return c.json(loan);
    }
  );

  router.post(
    '/',
    zValidator('json', loanSchema, (result, c) => {
      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'root',
          message: issue.message,
        }));
        return c.json({ errors }, 400);
      }
    }),
    async (c) => {
      const loan = c.req.valid('json');

      try {
        await service.craeteLoan(loan);
        return c.json({ success: true }, 201);
      } catch (err) {
        if (err instanceof HTTPException) {
          return err.getResponse();
        }
        throw err;
      }
    }
  );

  return router;
}
