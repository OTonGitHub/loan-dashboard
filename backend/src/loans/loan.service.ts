import { v7 as uuidv7 } from 'uuid';
import { Loan } from './loan.model.js';
import { LoanRepository } from './loan.repo.js';
import { LoanConflictError, LoanNotFoundError } from './loan.errors.js';

type NewLoanInput = Omit<Loan, 'id'>;

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
    return loan;
  }

  // COMMAND
  async createLoan(input: NewLoanInput): Promise<void> {
    const existing = await this.repo.findByLoanNumber(input.loanNumber);
    if (existing) {
      throw new LoanConflictError();
    }

    const newLoan: Loan = {
      id: uuidv7(),
      ...input,
    };

    await this.repo.create(newLoan);
  }
}
