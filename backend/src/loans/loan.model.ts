export interface Loan {
  id: string;
  loanNumber: string;
  amount: number;
  startDate: string;
  endDate: string;
  emi: number;
  outstandingAmount: number;
  overdueAmount: number;
  isActive: boolean;
}
