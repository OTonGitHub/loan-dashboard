import { HTTPException } from 'hono/http-exception';
import { Loan } from './loan.model.js';
import { LoanRepository } from './loan.repo.js';
import { v7 as uuidv7 } from 'uuid';

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
      throw new HTTPException(404, { message: 'Loan not found' });
    }
    return loan;
  }

  // COMMAND
  async createLoan(input: NewLoanInput): Promise<void> {
    const existing = await this.repo.findByLoanNumber(input.loanNumber);
    if (existing) {
      throw new HTTPException(409, { message: 'Loan number already exists' });
    }

    const newLoan: Loan = {
      id: uuidv7(),
      ...input,
    };

    await this.repo.create(newLoan);
  }
}
