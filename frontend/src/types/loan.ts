export interface Loan {
  loanNumber: string;
  amount: number;
  startDate: string;
  endDate: string;
  emi: number;
  outstandingAmount: number;
  overdueAmount: number;
  amountDisplay: string;
  emiDisplay: string;
  outstandingDisplay: string;
  overdueDisplay: string;
}

export type LoanSortBy = 'loanNumber' | 'amount' | 'outstandingAmount' | 'emi';

export interface LoanPage {
  items: Loan[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LoanSummary {
  totalAmount: number;
  totalOutstanding: number;
  totalOverdue: number;
}

export interface NewLoanPayload {
  loanNumber: string;
  amount: number;
  startDate: string;
  endDate: string;
  emi: number;
  outstandingAmount: number;
  overdueAmount: number;
}
