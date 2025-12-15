import { Loan } from './loan.model.js'

export interface LoanRepository {
    findAll(): Promise<Loan[]>
    create(loan: Loan): Promise<void>
}