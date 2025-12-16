import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { LoanService } from './loan.service.js';
import { loanValidation, type LoanCreateDto } from './loan.schema.js';
import { toLoanResponseDto } from './loan.dto.js';

export function createLoanRoutes(service: LoanService) {
  const router = new Hono();
  
  router.get('/', async (c) => {
    const loans = await service.getLoans();
    return c.json(loans.map(toLoanResponseDto));
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
      return c.json(toLoanResponseDto(loan));
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

      await service.createLoan(loan);
      return c.json({ success: true }, 201);
    }
  );

  return router;
}
