import type { Loan } from '../types/loan';

type LoanTableProps = {
  loans: Loan[];
  loading?: boolean;
  error?: string | null;
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  sortBy: 'loanNumber' | 'amount' | 'outstandingAmount' | 'emi';
  sortDir: 'asc' | 'desc';
  onSort?: (sortBy: LoanTableProps['sortBy']) => void;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
  onDelete?: (loanNumber: string) => void;
  onEdit?: (loan: Loan) => void;
};

export function LoanTable({
  loans,
  loading,
  error,
  total,
  page,
  pageSize,
  pageCount,
  sortBy,
  sortDir,
  onSort,
  onPageChange,
  onRefresh,
  onDelete,
  onEdit,
}: LoanTableProps) {
  const pageStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEnd = Math.min(total, pageStart + loans.length - 1);

  const sortableHeader = (label: string, column: LoanTableProps['sortBy']) => {
    const isActive = sortBy === column;
    const SortIcon = () => (
      <span className='ml-1 flex flex-col items-center w-4' aria-hidden>
        <svg
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={`w-3 h-3 ${
            isActive && sortDir === 'asc' ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <path
            d='M6 15l6-6 6 6'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <svg
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={`w-3 h-3 ${
            isActive && sortDir === 'desc' ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <path
            d='M18 9l-6 6-6-6'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </span>
    );

    return (
      <button
        className={`inline-flex items-center gap-1 font-semibold text-sm ${
          isActive ? 'text-primary' : ''
        }`}
        onClick={() => onSort?.(column)}
        type='button'
      >
        <span>{label}</span>
        <SortIcon />
      </button>
    );
  };

  return (
    <section className='bg-base-100 shadow-sm rounded-2xl overflow-hidden'>
      <div className='p-4 border-b border-base-200 flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>Loan Facilities</h2>
          <p className='text-sm text-base-content/70'>
            List of all loan facilities with repayment status.
          </p>
        </div>
        <div className='flex gap-2'>
          <button className='btn btn-outline btn-sm' onClick={() => onRefresh?.()}>
            Refresh
          </button>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='table table-zebra'>
          <thead>
            <tr>
              <th>Loan #</th>
              <th>{sortableHeader('Amount', 'amount')}</th>
              <th>{sortableHeader('EMI', 'emi')}</th>
              <th>Start</th>
              <th>End</th>
              <th>{sortableHeader('Outstanding', 'outstandingAmount')}</th>
              <th>Overdue</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div className='flex items-center gap-2 py-6 justify-center text-sm text-base-content/70'>
                    <span className='loading loading-spinner loading-sm' />
                    Loading loans...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7}>
                  <div className='alert alert-error my-4'>
                    <span>{error}</span>
                  </div>
                </td>
              </tr>
            ) : loans.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className='py-6 text-center text-sm text-base-content/70'>
                    No loans to display.
                  </div>
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan.loanNumber}>
                  <td className='font-medium'>{loan.loanNumber}</td>
                  <td>{loan.amountDisplay}</td>
                  <td>{loan.emiDisplay}</td>
                  <td>{loan.startDate}</td>
                  <td>{loan.endDate}</td>
                  <td>{loan.outstandingDisplay}</td>
                  <td>
                    {loan.overdueAmount > 0 ? (
                      <span className='badge badge-error badge-outline'>
                        {loan.overdueDisplay}
                      </span>
                    ) : (
                      <span className='badge badge-success badge-outline'>
                        On time
                      </span>
                    )}
                  </td>
                  <td className='text-right pr-4 flex gap-2 justify-end'>
                    <button
                      className='btn btn-ghost btn-sm'
                      onClick={() => onEdit?.(loan)}
                    >
                      Edit
                    </button>
                    <button
                      className='btn btn-ghost btn-sm text-error font-medium'
                      onClick={() => onDelete?.(loan.loanNumber)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className='p-4 border-t border-base-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm'>
        <div>
          Showing {pageStart}-{pageEnd} of {total} loans
        </div>
        <div className='join'>
          <button
            className='btn btn-sm join-item'
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </button>
          <button
            className='btn btn-sm join-item'
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= pageCount}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
