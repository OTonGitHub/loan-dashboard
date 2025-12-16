import './App.css'

type Loan = {
  loanNumber: string
  amount: number
  startDate: string
  endDate: string
  emi: number
  outstandingAmount: number
  overdueAmount: number
  amountDisplay: string
  emiDisplay: string
  outstandingDisplay: string
  overdueDisplay: string
}

const mockLoans: Loan[] = [
  {
    loanNumber: 'LN-001',
    amount: 100000,
    startDate: '2024-01-01',
    endDate: '2026-01-01',
    emi: 4500,
    outstandingAmount: 80000,
    overdueAmount: 0,
    amountDisplay: 'MVR 100,000.00',
    emiDisplay: 'MVR 4,500.00',
    outstandingDisplay: 'MVR 80,000.00',
    overdueDisplay: 'MVR 0.00',
  },
  {
    loanNumber: 'LN-002',
    amount: 250000,
    startDate: '2023-06-15',
    endDate: '2028-06-15',
    emi: 5200,
    outstandingAmount: 200000,
    overdueAmount: 0,
    amountDisplay: 'MVR 250,000.00',
    emiDisplay: 'MVR 5,200.00',
    outstandingDisplay: 'MVR 200,000.00',
    overdueDisplay: 'MVR 0.00',
  },
  {
    loanNumber: 'LN-003',
    amount: 50000,
    startDate: '2022-09-01',
    endDate: '2025-09-01',
    emi: 1500,
    outstandingAmount: 20000,
    overdueAmount: 500,
    amountDisplay: 'MVR 50,000.00',
    emiDisplay: 'MVR 1,500.00',
    outstandingDisplay: 'MVR 20,000.00',
    overdueDisplay: 'MVR 500.00',
  },
]

function App() {
  const summary = mockLoans.reduce(
    (acc, loan) => {
      acc.total += loan.amount
      acc.outstanding += loan.outstandingAmount
      acc.overdue += loan.overdueAmount
      return acc
    },
    { total: 0, outstanding: 0, overdue: 0 }
  )

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-4 lg:px-10">
        <div className="flex-1">
          <span className="text-xl font-semibold tracking-tight">Loan Dashboard</span>
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-primary btn-sm">New Loan</button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 lg:px-0 py-8 space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="stat bg-base-100 shadow-sm rounded-xl">
            <div className="stat-title text-sm">Total Sanctioned</div>
            <div className="stat-value text-primary">
              {summary.total.toLocaleString('en-MV', { style: 'currency', currency: 'MVR', currencyDisplay: 'code' })}
            </div>
          </div>
          <div className="stat bg-base-100 shadow-sm rounded-xl">
            <div className="stat-title text-sm">Outstanding</div>
            <div className="stat-value text-secondary">
              {summary.outstanding.toLocaleString('en-MV', { style: 'currency', currency: 'MVR', currencyDisplay: 'code' })}
            </div>
          </div>
          <div className="stat bg-base-100 shadow-sm rounded-xl">
            <div className="stat-title text-sm">Overdue</div>
            <div className="stat-value text-error">
              {summary.overdue.toLocaleString('en-MV', { style: 'currency', currency: 'MVR', currencyDisplay: 'code' })}
            </div>
          </div>
        </section>

        <section className="bg-base-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-base-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Loan Facilities</h2>
              <p className="text-sm text-base-content/70">List of all loan facilities with repayment status.</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm">Export CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Loan #</th>
                  <th>Amount</th>
                  <th>EMI</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Outstanding</th>
                  <th>Overdue</th>
                </tr>
              </thead>
              <tbody>
                {mockLoans.map((loan) => (
                  <tr key={loan.loanNumber}>
                    <td className="font-medium">{loan.loanNumber}</td>
                    <td>{loan.amountDisplay}</td>
                    <td>{loan.emiDisplay}</td>
                    <td>{loan.startDate}</td>
                    <td>{loan.endDate}</td>
                    <td>{loan.outstandingDisplay}</td>
                    <td>
                      {loan.overdueAmount > 0 ? (
                        <span className="badge badge-error badge-outline">{loan.overdueDisplay}</span>
                      ) : (
                        <span className="badge badge-success badge-outline">On time</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
