import { Loan } from './loan.model.js';

export interface LoanRepository {
  findPage(
    params: {
      limit: number;
      offset: number;
      sortBy: 'loanNumber' | 'amount' | 'outstandingAmount' | 'emi';
      sortDir: 'asc' | 'desc';
    }
  ): Promise<{ items: Loan[]; total: number }>;
  getAggregates(): Promise<{
    totalAmount: number;
    totalOutstanding: number;
    totalOverdue: number;
  }>;
  findByLoanNumber(loanNumber: string): Promise<Loan | null>;
  create(loan: Loan): Promise<void>;
  deactivate(loanNumber: string): Promise<void>;
  update(loanNumber: string, loan: Loan): Promise<void>;
}
