import { z } from 'zod';

const loanNumberPattern = /^LN-\d+$/;
const loanNumberMessage = 'loanNumber must look like LN-123';
const loanNumberSchema = z
  .string()
  .min(1, 'loanNumber is required')
  .regex(loanNumberPattern, loanNumberMessage);

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

const loanSchema = z
  .object({
    loanNumber: loanNumberSchema,
    amount: z.coerce.number().positive('amount must be greater than 0'),
    startDate: dateOnly,
    endDate: dateOnly,
    emi: z.coerce.number().positive('emi must be greater than 0'),
    outstandingAmount: z.coerce
      .number()
      .min(0, 'outstandingAmount cannot be negative'),
    overdueAmount: z.coerce.number().min(0, 'overdueAmount cannot be negative'),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: 'startDate must be a valid date',
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'endDate must be a valid date',
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
        message: 'endDate must be after startDate',
      });
    }

    if (data.outstandingAmount > data.amount) {
      ctx.addIssue({
        code: 'custom',
        path: ['outstandingAmount'],
        message: 'outstandingAmount cannot exceed amount',
      });
    }

    if (data.overdueAmount > data.outstandingAmount) {
      ctx.addIssue({
        code: 'custom',
        path: ['overdueAmount'],
        message: 'overdueAmount cannot exceed outstandingAmount',
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
