import { Loan } from './loan.model.js';
import { LoanRepository } from './loan.repo.js';

export class InMemoryLoanRepository implements LoanRepository {
  async findAll(): Promise<Loan[]> {
    // actually synchronous, but ORM will probably be async
    return this.loans;
  }

  async findByLoanNumber(loanNumber: string): Promise<Loan | null> {
    const loan = this.loans.find((l) => l.loanNumber === loanNumber);
    return loan ?? null;
  }

  async create(loan: Loan): Promise<void> {
    this.loans.push(loan);
  }

  private loans: Loan[] = [
    {
      id: '018ec9b4-1962-7db4-8fd5-866e6132f1e5',
      loanNumber: 'LN-001',
      amount: 100000,
      startDate: '2024-01-01',
      endDate: '2026-01-01',
      emi: 4500,
      outstandingAmount: 80000,
      overdueAmount: 0,
    },
    {
      id: '018ec9b4-1962-7db5-8d6c-396cc56d6b94',
      loanNumber: 'LN-002',
      amount: 250000,
      startDate: '2023-06-15',
      endDate: '2028-06-15',
      emi: 5200,
      outstandingAmount: 200000,
      overdueAmount: 0,
    },
    {
      id: '018ec9b4-1962-7db6-920d-811fa8c0eafe',
      loanNumber: 'LN-003',
      amount: 50000,
      startDate: '2022-09-01',
      endDate: '2025-09-01',
      emi: 1500,
      outstandingAmount: 20000,
      overdueAmount: 500,
    },
    {
      id: '018ec9b4-1962-7db7-8f70-077556269c6a',
      loanNumber: 'LN-004',
      amount: 150000,
      startDate: '2021-03-20',
      endDate: '2026-03-20',
      emi: 3200,
      outstandingAmount: 90000,
      overdueAmount: 1200,
    },
    {
      id: '018ec9b4-1962-7db7-82c1-54c327b4388d',
      loanNumber: 'LN-005',
      amount: 75000,
      startDate: '2024-05-10',
      endDate: '2027-05-10',
      emi: 2100,
      outstandingAmount: 60000,
      overdueAmount: 0,
    },
    {
      id: '018ec9b4-1962-7db8-9d62-63f569eb7c2c',
      loanNumber: 'LN-006',
      amount: 300000,
      startDate: '2020-11-01',
      endDate: '2030-11-01',
      emi: 4500,
      outstandingAmount: 240000,
      overdueAmount: 0,
    },
    {
      id: '018ec9b4-1962-7db9-901d-d7316a654c64',
      loanNumber: 'LN-007',
      amount: 120000,
      startDate: '2023-01-05',
      endDate: '2029-01-05',
      emi: 2700,
      outstandingAmount: 100000,
      overdueAmount: 0,
    },
    {
      id: '018ec9b4-1962-7db9-8d39-00f8cc2993ed',
      loanNumber: 'LN-008',
      amount: 90000,
      startDate: '2022-07-12',
      endDate: '2026-07-12',
      emi: 1900,
      outstandingAmount: 45000,
      overdueAmount: 250,
    },
    {
      id: '018ec9b4-1962-7db9-8325-0a34f3aa8a7c',
      loanNumber: 'LN-009',
      amount: 60000,
      startDate: '2024-02-28',
      endDate: '2027-02-28',
      emi: 1400,
      outstandingAmount: 60000,
      overdueAmount: 0,
    },
    {
      id: '018ec9b4-1962-7dba-9c08-041ea33ee2fb',
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
