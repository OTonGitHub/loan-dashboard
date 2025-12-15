import { Loan } from "./loan.model.js";
import { LoanRepository } from "./loan.repo.js";

export class LoanService {
    constructor(private readonly repo: LoanRepository) {}

    // QUERY
    async getLoans(): Promise<Loan[]> {
        return this.repo.findAll()
    }

    // COMMAND
    async craeteLoan(loan: Loan): Promise<void> {
        if (loan.amount <= 0) {
            throw new Error('Loan amount must be greater than Zero')
        }

        if (!loan.loanNumber) {
            throw new Error('Loan number is required')
        }

        await this.repo.create(loan)
    }
}