import { Loan } from './loan.model.js'

export interface LoanRepository {
    findAll(): Promise<Loan[]>
    findByLoanNumber(loanNumber: string): Promise<Loan | null>
    create(loan: Loan): Promise<void>
}
