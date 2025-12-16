import { useEffect, useState } from 'react';
import type { NewLoanPayload } from '../types/loan';

type NewLoanDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: NewLoanPayload) => Promise<void>;
};

const initialForm: NewLoanPayload = {
  loanNumber: '',
  amount: 0,
  startDate: '',
  endDate: '',
  emi: 0,
  outstandingAmount: 0,
  overdueAmount: 0,
};

export function NewLoanDialog({ open, onClose, onCreate }: NewLoanDialogProps) {
  const [form, setForm] = useState<NewLoanPayload>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof NewLoanPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setForm(initialForm);
    setError(null);
    setSubmitting(false);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onCreate(form);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create loan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog className="modal" open={open}>
      <div className="modal-box max-w-2xl">
        <h3 className="font-semibold text-lg mb-2">New Loan</h3>
        <p className="text-sm text-base-content/70 mb-4">Create a new loan facility.</p>
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Loan Number</span>
            </div>
            <input
              type="text"
              className="input input-bordered focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={form.loanNumber}
              onChange={handleChange('loanNumber')}
              placeholder="LN-011"
              required
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Amount</span>
            </div>
            <input
              type="number"
              className="input input-bordered focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={form.amount}
              onChange={handleChange('amount')}
              min={0}
              required
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">EMI</span>
            </div>
            <input
              type="number"
              className="input input-bordered focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={form.emi}
              onChange={handleChange('emi')}
              min={0}
              required
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Outstanding Amount</span>
            </div>
            <input
              type="number"
              className="input input-bordered focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={form.outstandingAmount}
              onChange={handleChange('outstandingAmount')}
              min={0}
              required
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Overdue Amount</span>
            </div>
            <input
              type="number"
              className="input input-bordered focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={form.overdueAmount}
              onChange={handleChange('overdueAmount')}
              min={0}
              required
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Start Date</span>
            </div>
            <input
              type="date"
              className="input input-bordered focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={form.startDate}
              onChange={handleChange('startDate')}
              required
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">End Date</span>
            </div>
            <input
              type="date"
              className="input input-bordered focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={form.endDate}
              onChange={handleChange('endDate')}
              required
            />
          </label>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <span className="loading loading-spinner" /> : 'Create Loan'}
            </button>
          </div>
        </form>
      </div>
      <form
        method="dialog"
        className="modal-backdrop"
        onSubmit={() => {
          reset();
          onClose();
        }}
      >
        <button>close</button>
      </form>
    </dialog>
  );
}
