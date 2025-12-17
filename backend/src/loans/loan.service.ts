import { v7 as uuidv7 } from 'uuid';
import { Loan } from './loan.model.js';
import { LoanRepository } from './loan.repo.js';
import { LoanConflictError, LoanNotFoundError } from './loan.errors.js';

type NewLoanInput = Omit<Loan, 'id' | 'isActive'>;

export class LoanService {
  constructor(private readonly repo: LoanRepository) {}

  // QUERY
  async getLoans(): Promise<Loan[]> {
    return this.repo.findAll();
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
