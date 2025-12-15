export interface Loan {
    loanNumber: string
    amount: number
    startDate: string
    endDate: string
    emi: number
    outstandingAmount: number
    overdueAmount: number
}