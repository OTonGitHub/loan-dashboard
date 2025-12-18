// SANITIZER

import { z } from 'zod';

const loanNumberPattern = /^LN-\d+$/;
const loanNumberMessage = 'loanNumber must look like LN-123';
const loanNumberSchema = z
  .string({ error: 'Loan number is required' })
  .regex(loanNumberPattern, loanNumberMessage);

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

const loanSchema = z
  .object({
    loanNumber: loanNumberSchema,
    amount: z.coerce
      .number({ error: 'Amount is required' })
      .positive('Amount must be greater than 0'),
    startDate: dateOnly,
    endDate: dateOnly,
    emi: z.coerce
      .number({ error: 'EMI is required' })
      .positive('EMI must be greater than 0'),
    outstandingAmount: z.coerce
      .number({ error: 'Outstanding Amount is required' })
      .min(0, 'Outstanding Amount cannot be negative'),
    overdueAmount: z.coerce
      .number({ error: 'Overdue Amount is required' })
      .min(0, 'Overdue Amount cannot be negative'),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: 'Loan Start Date must be a valid date',
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Loan End Date must be a valid date',
      });
    }

    if (
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(end.getTime()) &&
      end <= start
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: "Loan's End Date must be after Start Date",
      });
    }

    if (data.emi > data.amount) {
      ctx.addIssue({
        code: 'custom',
        path: ['emi'],
        message: 'EMI cannot exceed Amount',
      });
    }

    if (data.outstandingAmount > data.amount) {
      ctx.addIssue({
        code: 'custom',
        path: ['outstandingAmount'],
        message: 'Outstanding Amount cannot exceed amount',
      });
    }

    if (data.overdueAmount > data.outstandingAmount) {
      ctx.addIssue({
        code: 'custom',
        path: ['overdueAmount'],
        message: 'Overdue Amount cannot exceed Outstanding Amount',
      });
    }
  });

const loanNumberParamSchema = z.object({ loanNumber: loanNumberSchema });

export const loanValidation = {
  body: loanSchema,
  params: {
    loanNumber: loanNumberParamSchema,
  },
};

export type LoanCreateDto = z.output<typeof loanSchema>;

export const loanListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  sortBy: z
    .enum(['loanNumber', 'amount', 'outstandingAmount', 'emi'])
    .default('loanNumber'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
});
