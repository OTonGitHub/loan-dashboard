import { asc, count, desc, eq } from 'drizzle-orm';
import { db } from './db.client.js';
import { loansTable } from './schema.db.js';
import { Loan } from './loan.model.js';
import { LoanRepository } from './loan.repo.js';

function rowToLoan(row: any): Loan {
  return {
    id: row.id,
    loanNumber: row.loanNumber,
    amount: Number(row.amount),
    startDate: row.startDate,
    endDate: row.endDate,
    emi: Number(row.emi),
    outstandingAmount: Number(row.outstandingAmount),
    overdueAmount: Number(row.overdueAmount),
    isActive: Boolean(row.isActive),
  };
}

export class DrizzleLoanRepository implements LoanRepository {
  async findPage(params: {
    limit: number;
    offset: number;
    sortBy: 'loanNumber' | 'amount' | 'outstandingAmount' | 'emi';
    sortDir: 'asc' | 'desc';
  }): Promise<{ items: Loan[]; total: number }> {
    const { limit, offset, sortBy, sortDir } = params;
    const sortColumn = {
      loanNumber: loansTable.loanNumber,
      amount: loansTable.amount,
      outstandingAmount: loansTable.outstandingAmount,
      emi: loansTable.emi,
    }[sortBy];
    const sorter = sortDir === 'desc' ? desc(sortColumn) : asc(sortColumn);

    const totalRow = await db
      .select({ total: count() })
      .from(loansTable)
      .where(eq(loansTable.isActive, 1))
      .get();

    const rows = await db
      .select()
      .from(loansTable)
      .where(eq(loansTable.isActive, 1))
      .orderBy(sorter, loansTable.loanNumber)
      .limit(limit)
      .offset(offset)
      .all();

    return { items: rows.map(rowToLoan), total: Number(totalRow?.total ?? 0) };
  }

  async findByLoanNumber(loanNumber: string): Promise<Loan | null> {
    const row = await db
      .select()
      .from(loansTable)
      .where(eq(loansTable.loanNumber, loanNumber))
      .limit(1)
      .get();
    if (!row) return null;
    return rowToLoan(row);
  }

  async create(loan: Loan): Promise<void> {
    await db
      .insert(loansTable)
      .values({
        id: loan.id,
        loanNumber: loan.loanNumber,
        amount: loan.amount,
        startDate: loan.startDate,
        endDate: loan.endDate,
        emi: loan.emi,
        outstandingAmount: loan.outstandingAmount,
        overdueAmount: loan.overdueAmount,
        isActive: loan.isActive ? 1 : 0,
      })
      .run();
  }

  async update(loanNumber: string, loan: Loan): Promise<void> {
    await db
      .update(loansTable)
      .set({
        amount: loan.amount,
        startDate: loan.startDate,
        endDate: loan.endDate,
        emi: loan.emi,
        outstandingAmount: loan.outstandingAmount,
        overdueAmount: loan.overdueAmount,
        isActive: loan.isActive ? 1 : 0,
      })
      .where(eq(loansTable.loanNumber, loanNumber))
      .run();
  }

  async deactivate(loanNumber: string): Promise<void> {
    await db
      .update(loansTable)
      .set({ isActive: 0 })
      .where(eq(loansTable.loanNumber, loanNumber))
      .run();
  }
}
