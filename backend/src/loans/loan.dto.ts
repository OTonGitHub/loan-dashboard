import { Loan } from './loan.model.js';

// Kept Here since Just Exam, Ideally I'd Inject From .ENV into a Helper Class
const currencyFormatter = new Intl.NumberFormat('en-MV', {
  style: 'currency',
  currency: 'MVR',
  currencyDisplay: 'code',
  minimumFractionDigits: 2,
});

export interface LoanResponseDto {
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

export const toLoanResponseDto = (loan: Loan): LoanResponseDto => ({
  loanNumber: loan.loanNumber,
  amount: loan.amount,
  startDate: loan.startDate,
  endDate: loan.endDate,
  emi: loan.emi,
  outstandingAmount: loan.outstandingAmount,
  overdueAmount: loan.overdueAmount,
  amountDisplay: currencyFormatter.format(loan.amount),
  emiDisplay: currencyFormatter.format(loan.emi),
  outstandingDisplay: currencyFormatter.format(loan.outstandingAmount),
  overdueDisplay: currencyFormatter.format(loan.overdueAmount),
});
