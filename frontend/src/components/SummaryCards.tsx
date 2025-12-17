import type { Loan, LoanSummary } from '../types/loan';

const formatCurrency = (value: number) =>
  value.toLocaleString('en-MV', {
    style: 'currency',
    currency: 'MVR',
    currencyDisplay: 'code',
  });

type SummaryCardsProps = {
  loans: Loan[];
  summary?: LoanSummary | null;
};

export function SummaryCards({ loans, summary }: SummaryCardsProps) {
  const pageSummary = loans.reduce(
    (acc, loan) => {
      acc.total += loan.amount;
      acc.outstanding += loan.outstandingAmount;
      acc.overdue += loan.overdueAmount;
      return acc;
    },
    { total: 0, outstanding: 0, overdue: 0 }
  );

  const total = summary?.totalAmount ?? pageSummary.total;
  const outstanding = summary?.totalOutstanding ?? pageSummary.outstanding;
  const overdue = summary?.totalOverdue ?? pageSummary.overdue;

  return (
    <section className='grid gap-4 md:grid-cols-3'>
      <div className='stat bg-base-100 shadow-sm rounded-xl border border-base-100'>
        <div className='stat-title text-sm'>Total Sanctioned</div>
        <div className='stat-value text-primary'>{formatCurrency(total)}</div>
      </div>
      <div className='stat bg-base-100 shadow-sm rounded-xl border border-base-100'>
        <div className='stat-title text-sm'>Outstanding</div>
        <div className='stat-value text-secondary'>
          {formatCurrency(outstanding)}
        </div>
      </div>
      <div className='stat bg-base-100 shadow-sm rounded-xl border border-base-100'>
        <div className='stat-title text-sm'>Overdue</div>
        <div className='stat-value text-error'>{formatCurrency(overdue)}</div>
      </div>
    </section>
  );
}
