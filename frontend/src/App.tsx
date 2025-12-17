import './App.css';
import { SummaryCards } from './components/SummaryCards';
import { LoanTable } from './components/LoanTable';
import { NewLoanDialog } from './components/NewLoanDialog';
import { useLoans } from './hooks/useLoans';
import { useState } from 'react';

function App() {
  const { loans, loading, error, createLoan, deleteLoan } = useLoans();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='navbar bg-base-100 shadow-sm px-4 lg:px-10'>
        <div className='flex-1'>
          <span className='text-xl font-semibold tracking-tight'>
            Loan Dashboard
          </span>
        </div>
        <div className='flex-none gap-2'>
          <button
            className='btn btn-primary btn-sm'
            onClick={() => setModalOpen(true)}
          >
            New Loan
          </button>
        </div>
      </div>

      <main className='max-w-6xl mx-auto px-4 lg:px-0 py-8 space-y-6'>
        <SummaryCards loans={loans} />
        <LoanTable
          loans={loans}
          loading={loading}
          error={error}
          onDelete={(loanNumber) => {
            setDeleteTarget(loanNumber);
            setConfirmOpen(true);
          }}
        />
      </main>

      <NewLoanDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createLoan}
      />

      <dialog
        className={`modal ${confirmOpen ? 'modal-open' : ''}`}
        open={confirmOpen}
      >
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Confirm delete</h3>
          <p className='py-4'>
            Are you sure you want to delete Loan Number:{' '}
            <strong>{deleteTarget}</strong>?
          </p>
          <div className='modal-action'>
            <button className='btn' onClick={() => setConfirmOpen(false)}>
              Cancel
            </button>
            <button
              className='btn btn-error'
              onClick={async () => {
                if (!deleteTarget) return;
                try {
                  await deleteLoan(deleteTarget);
                  setConfirmOpen(false);
                  setConfirmMessage(`Loan Number: ${deleteTarget} deleted`);
                  setTimeout(() => setConfirmMessage(null), 2500);
                } catch (e) {
                  // show simple error message - keep UI minimal
                  setConfirmMessage((e as Error).message || 'Failed to delete');
                  setTimeout(() => setConfirmMessage(null), 2500);
                }
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>

      {confirmMessage && (
        <dialog className='modal modal-open' open>
          <div className='modal-box'>
            <p>{confirmMessage}</p>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default App;
