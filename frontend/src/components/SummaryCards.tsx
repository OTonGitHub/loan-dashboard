import type { Loan } from '../types/loan';

const formatCurrency = (value: number) =>
  value.toLocaleString('en-MV', {
    style: 'currency',
    currency: 'MVR',
    currencyDisplay: 'code',
  });

type SummaryCardsProps = {
  loans: Loan[];
};

export function SummaryCards({ loans }: SummaryCardsProps) {
  const summary = loans.reduce(
    (acc, loan) => {
      acc.total += loan.amount;
      acc.outstanding += loan.outstandingAmount;
      acc.overdue += loan.overdueAmount;
      return acc;
    },
    { total: 0, outstanding: 0, overdue: 0 }
  );

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="stat bg-base-100 shadow-sm rounded-xl">
        <div className="stat-title text-sm">Total Sanctioned</div>
        <div className="stat-value text-primary">{formatCurrency(summary.total)}</div>
      </div>
      <div className="stat bg-base-100 shadow-sm rounded-xl">
        <div className="stat-title text-sm">Outstanding</div>
        <div className="stat-value text-secondary">{formatCurrency(summary.outstanding)}</div>
      </div>
      <div className="stat bg-base-100 shadow-sm rounded-xl">
        <div className="stat-title text-sm">Overdue</div>
        <div className="stat-value text-error">{formatCurrency(summary.overdue)}</div>
      </div>
    </section>
  );
}
