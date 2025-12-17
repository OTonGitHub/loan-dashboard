import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const loansTable = sqliteTable('loans', {
  id: text('id').primaryKey(),
  loanNumber: text('loanNumber').notNull().unique(),
  amount: real('amount').notNull(),
  startDate: text('startDate').notNull(),
  endDate: text('endDate').notNull(),
  emi: real('emi').notNull(),
  outstandingAmount: real('outstandingAmount').notNull(),
  overdueAmount: real('overdueAmount').notNull(),
  isActive: integer('isActive').notNull(),
});

export const loanSchema = { loansTable };
