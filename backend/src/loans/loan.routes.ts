import { Hono } from "hono";
import { LoanService } from "./loan.service.js";

export function createLoanRoutes(service: LoanService) {
    const router = new Hono()

    router.get('/', async (c) => {
        const loans = await service.getLoans()
        return c.json(loans)
    })

    router.post('/', async (c) => {
        const loan = await c.req.json()
        await service.craeteLoan(loan)
        return c.json({ success: true }, 201)
    })

    return router
}