import { randomUUID } from 'crypto';
import { count } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

import { loanSchema, loansTable } from './schema.db.js';

type LoanDatabase = BetterSQLite3Database<typeof loanSchema>;

const LOAN_COUNT = 30;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateWithin(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - randInt(0, days));
  return date;
}

function addMonths(date: Date, months: number) {
  const copy = new Date(date.getTime());
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function makeLoan(index: number): typeof loansTable.$inferInsert {
  const amount = randInt(50_000, 1_000_000);
  const termMonths = randInt(3, 180); // 3 months to 15 years
  const interestRate = randInt(4, 12) / 100; // simple annual interest
  const totalRepayable = amount * (1 + interestRate);
  const emi = Math.max(500, Math.round(totalRepayable / termMonths));

  const outstanding = randInt(Math.round(amount * 0.2), Math.round(amount * 0.9));
  const overdue =
    Math.random() < 0.5
      ? randInt(50, Math.max(50, Math.min(outstanding, Math.round(amount * 0.25))))
      : 0;

  const start = randomDateWithin(365 * 2); // within the past 2 years
  const end = addMonths(start, termMonths);

  return {
    id: randomUUID(),
    loanNumber: `LN-${String(index + 1).padStart(3, '0')}`,
    amount,
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    emi,
    outstandingAmount: outstanding,
    overdueAmount: overdue,
    isActive: 1,
  };
}

export function seedLoans(db: LoanDatabase) {
  // TODO: DEV ONLY! DEV ONLY! DEV ONLY! DEV ONLY! DEV ONLY! DEV ONLY!!!!!
  db.delete(loansTable).run();
  const seeds = Array.from({ length: LOAN_COUNT }, (_, i) => makeLoan(i));
  db.insert(loansTable).values(seeds).run();
}
