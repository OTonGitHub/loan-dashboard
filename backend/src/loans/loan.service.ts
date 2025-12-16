import { HTTPException } from "hono/http-exception";
import { Loan } from "./loan.model.js";
import { LoanRepository } from "./loan.repo.js";

export class LoanService {
    constructor(private readonly repo: LoanRepository) {}

    // QUERY
    async getLoans(): Promise<Loan[]> {
        return this.repo.findAll()
    }

    async getLoan(loanNumber: string): Promise<Loan> {
        const loan = await this.repo.findByLoanNumber(loanNumber)
        if (!loan) {
            throw new HTTPException(404, { message: "Loan not found" })
        }
        return loan
    }

    // COMMAND
    async craeteLoan(loan: Loan): Promise<void> {
        // payload validation handled at the route; service focuses on repo/domain state checks
        const hasDuplicateLoanNumber = (await this.repo.findAll()).some(
            (existing) => existing.loanNumber === loan.loanNumber
        )
        if (hasDuplicateLoanNumber) {
            throw new HTTPException(409, { message: "Loan number already exists" })
        }

        await this.repo.create(loan)
    }
}
