import type { Loan } from '../types/loan';

type LoanTableProps = {
  loans: Loan[];
};

export function LoanTable({ loans }: LoanTableProps) {
  return (
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
            {loans.map((loan) => (
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
  );
}
