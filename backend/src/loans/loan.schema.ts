import { z } from 'zod';

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const loanSchema = z
  .object({
    loanNumber: z.string().min(1, 'loanNumber is required'),
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

export type LoanInput = z.infer<typeof loanSchema>;
