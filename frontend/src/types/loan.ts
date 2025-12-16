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
