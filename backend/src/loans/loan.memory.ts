import { Loan } from './loan.model.js';
import { LoanRepository } from './loan.repo.js';

export class InMemoryLoanRepository implements LoanRepository {
  async findAll(): Promise<Loan[]> {
    // actually synchrnnous, but ORM will probably be async
    return this.loans;
  }

  async findByLoanNumber(loanNumber: string): Promise<Loan | null> {
    const loan = this.loans.find((l) => l.loanNumber === loanNumber);
    return loan ?? null;
  }

  async create(loan: Loan): Promise<void> {
    // '''
    this.loans.push(loan);
  }

  private loans: Loan[] = [
    {
      loanNumber: 'LN-001',
      amount: 100000,
      startDate: '2024-01-01',
      endDate: '2026-01-01',
      emi: 4500,
      outstandingAmount: 80000,
      overdueAmount: 0,
    },
    {
      loanNumber: 'LN-002',
      amount: 250000,
      startDate: '2023-06-15',
      endDate: '2028-06-15',
      emi: 5200,
      outstandingAmount: 200000,
      overdueAmount: 0,
    },
    {
      loanNumber: 'LN-003',
      amount: 50000,
      startDate: '2022-09-01',
      endDate: '2025-09-01',
      emi: 1500,
      outstandingAmount: 20000,
      overdueAmount: 500,
    },
    {
      loanNumber: 'LN-004',
      amount: 150000,
      startDate: '2021-03-20',
      endDate: '2026-03-20',
      emi: 3200,
      outstandingAmount: 90000,
      overdueAmount: 1200,
    },
    {
      loanNumber: 'LN-005',
      amount: 75000,
      startDate: '2024-05-10',
      endDate: '2027-05-10',
      emi: 2100,
      outstandingAmount: 60000,
      overdueAmount: 0,
    },
    {
      loanNumber: 'LN-006',
      amount: 300000,
      startDate: '2020-11-01',
      endDate: '2030-11-01',
      emi: 4500,
      outstandingAmount: 240000,
      overdueAmount: 0,
    },
    {
      loanNumber: 'LN-007',
      amount: 120000,
      startDate: '2023-01-05',
      endDate: '2029-01-05',
      emi: 2700,
      outstandingAmount: 100000,
      overdueAmount: 0,
    },
    {
      loanNumber: 'LN-008',
      amount: 90000,
      startDate: '2022-07-12',
      endDate: '2026-07-12',
      emi: 1900,
      outstandingAmount: 45000,
      overdueAmount: 250,
    },
    {
      loanNumber: 'LN-009',
      amount: 60000,
      startDate: '2024-02-28',
      endDate: '2027-02-28',
      emi: 1400,
      outstandingAmount: 60000,
      overdueAmount: 0,
    },
    {
      loanNumber: 'LN-010',
      amount: 180000,
      startDate: '2021-08-01',
      endDate: '2026-08-01',
      emi: 3600,
      outstandingAmount: 120000,
      overdueAmount: 800,
    },
  ];
}
