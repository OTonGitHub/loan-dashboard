import { v7 as uuidv7 } from 'uuid';
import { Loan } from './loan.model.js';
import { LoanRepository } from './loan.repo.js';
import { LoanConflictError, LoanNotFoundError } from './loan.errors.js';

type NewLoanInput = Omit<Loan, 'id' | 'isActive'>;

export class LoanService {
  constructor(private readonly repo: LoanRepository) {}

  // QUERY
  async getLoans(params: {
    page?: number;
    pageSize?: number;
    sortBy?: 'loanNumber' | 'amount' | 'outstandingAmount' | 'emi';
    sortDir?: 'asc' | 'desc';
  }): Promise<{ items: Loan[]; total: number; page: number; pageSize: number }> {
    const page = Math.max(1, Math.trunc(params.page ?? 1));
    const pageSize = Math.min(50, Math.max(1, Math.trunc(params.pageSize ?? 10)));
    const sortBy = params.sortBy ?? 'loanNumber';
    const sortDir = params.sortDir ?? 'asc';

    const { items, total } = await this.repo.findPage({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      sortBy,
      sortDir,
    });

    return { items, total, page, pageSize };
  }

  async getAggregates(): Promise<{
    totalAmount: number;
    totalOutstanding: number;
    totalOverdue: number;
  }> {
    return this.repo.getAggregates();
  }

  async getLoan(loanNumber: string): Promise<Loan> {
    const loan = await this.repo.findByLoanNumber(loanNumber);
    if (!loan) {
      throw new LoanNotFoundError();
    }
    // ensure soft-deleted loans are treated as not found
    if (loan.isActive === false) throw new LoanNotFoundError();
    return loan;
  }

  // COMMAND
  async createLoan(input: NewLoanInput): Promise<void> {
    const existing = await this.repo.findByLoanNumber(input.loanNumber);
    // Only conflict when an active loan with the same loanNumber exists.
    if (existing && existing.isActive !== false) {
      throw new LoanConflictError();
    }

    const newLoan: Loan = {
      id: uuidv7(),
      ...input,
      isActive: true,
    };

    await this.repo.create(newLoan);
  }

  async deactivateLoan(loanNumber: string): Promise<void> {
    const loan = await this.repo.findByLoanNumber(loanNumber);
    if (!loan || loan.isActive === false) {
      throw new LoanNotFoundError(`Loan ${loanNumber} not found`);
    }
    await this.repo.deactivate(loanNumber);
  }

  async updateLoan(loanNumber: string, input: NewLoanInput): Promise<void> {
    if (input.loanNumber !== loanNumber) {
      throw new LoanConflictError('Cannot change loanNumber via update');
    }

    const existing = await this.repo.findByLoanNumber(loanNumber);
    if (!existing || existing.isActive === false) {
      throw new LoanNotFoundError(`Loan ${loanNumber} not found`);
    }

    const updated: Loan = {
      id: existing.id,
      ...input,
      isActive: existing.isActive,
    };

    await this.repo.update(loanNumber, updated);
  }
}
