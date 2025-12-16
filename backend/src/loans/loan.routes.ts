import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { LoanService } from './loan.service.js';
import { loanValidation, type LoanCreateDto } from './loan.schema.js';
import { Loan } from './loan.model.js';

export function createLoanRoutes(service: LoanService) {
  const router = new Hono();
  const toPublicLoan = ({ id, ...rest }: Loan) => rest;

  router.get('/', async (c) => {
    const loans = await service.getLoans();
    return c.json(loans.map(toPublicLoan));
  });

  router.get(
    '/:loanNumber',
    zValidator('param', loanValidation.params.loanNumber, (result, c) => {
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
      return c.json(toPublicLoan(loan));
    }
  );

  router.post(
    '/',
    zValidator('json', loanValidation.body, (result, c) => {
      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'root',
          message: issue.message,
        }));
        return c.json({ errors }, 400);
      }
    }),
    async (c) => {
      const loan: LoanCreateDto = c.req.valid('json');

      try {
        await service.createLoan(loan);
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
