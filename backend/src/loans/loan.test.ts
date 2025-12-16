import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../app.js'
import type { Loan } from './loan.model.js'

test('GET /loans returns an array', async () => {
  const app = createApp()

  const res = await app.request('/api/v1/loans')
  assert.equal(res.status, 200)

  const data = (await res.json()) as unknown
  assert.ok(Array.isArray(data))
})

test('POST /loans creates a loan and then GET shows it', async () => {
  const app = createApp()

  const newLoan: Loan = {
    loanNumber: 'LN-TEST-015',
    amount: 50000,
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    emi: 2000,
    outstandingAmount: 50000,
    overdueAmount: 0
  }

  const postRes = await app.request('/api/v1/loans', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newLoan)
  })
  assert.equal(postRes.status, 201)

  const getRes = await app.request('/api/v1/loans')
  assert.equal(getRes.status, 200)

  const loans = (await getRes.json()) as Loan[]
  assert.ok(loans.some((l) => l.loanNumber === 'LN-TEST-015'))
})
