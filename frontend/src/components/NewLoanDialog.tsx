import { useEffect } from 'react';
import { useLoanForm } from '../hooks/useLoanForm';
import type { NewLoanPayload } from '../types/loan';

type NewLoanDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: NewLoanPayload) => Promise<void>;
  initial?: NewLoanPayload;
  title?: string;
  submitLabel?: string;
};

export function NewLoanDialog({
  open,
  onClose,
  onSubmit,
  initial,
  title = 'New Loan',
  submitLabel = 'Create Loan',
}: NewLoanDialogProps) {
  const {
    form,
    setForm,
    handleChange,
    handleSubmit,
    reset,
    refs,
    submitting,
    error,
    errorList,
    inputClass,
  } = useLoanForm(onSubmit, onClose);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        loanNumber: initial.loanNumber,
        amount: String(initial.amount),
        emi: String(initial.emi),
        outstandingAmount: String(initial.outstandingAmount),
        overdueAmount: String(initial.overdueAmount),
        startDate: initial.startDate,
        endDate: initial.endDate,
      });
    } else {
      reset();
    }
  }, [open, initial, reset, setForm]);

  const fieldLabels: Partial<Record<keyof NewLoanPayload, string>> = {
    loanNumber: 'Loan number',
    amount: 'Amount',
    emi: 'EMI',
    outstandingAmount: 'Outstanding amount',
    overdueAmount: 'Overdue amount',
    startDate: 'Start date',
    endDate: 'End date',
  };

  return (
    <dialog className='modal' open={open}>
      <div className='modal-box max-w-2xl'>
        <h3 className='font-semibold text-lg mb-2'>{title}</h3>
        <p className='text-sm text-base-content/70 mb-4'>
          {initial ? 'Edit loan details.' : 'Create a new loan facility.'}
        </p>
        {(error || errorList.length > 0) && (
          <div className='alert alert-error mb-4'>
            <div className='flex flex-col gap-1'>
              <span className='font-semibold'>
                {errorList.length > 0
                  ? 'Please fix the fields below'
                  : error || 'Please fix the fields below'}
              </span>
              {errorList.length > 0 && (
                <ul className='list-disc list-inside text-sm'>
                  {errorList.map((e, idx) => {
                    const fieldKey = e.field as
                      | keyof NewLoanPayload
                      | undefined;
                    const label = fieldKey
                      ? fieldLabels[fieldKey] ?? fieldKey
                      : null;
                    return (
                      <li key={`${e.field ?? 'global'}-${idx}`}>
                        {label ? (
                          <>
                            <strong>{label}</strong>: {e.message}
                          </>
                        ) : (
                          e.message
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
        <form className='grid gap-4 md:grid-cols-2' onSubmit={handleSubmit}>
          {(
            [
              ['loanNumber', 'Loan Number', 'text', 'LN-011'],
              ['amount', 'Amount', 'number'],
              ['emi', 'EMI', 'number'],
              ['outstandingAmount', 'Outstanding Amount', 'number'],
              ['overdueAmount', 'Overdue Amount', 'number'],
              ['startDate', 'Start Date', 'date'],
              ['endDate', 'End Date', 'date'],
            ] as const
          ).map(([name, label, type]) => (
            <label className='form-control' key={name}>
              <div className='label'>
                <span className='label-text'>{label}</span>
              </div>
              <input
                type={type}
                className={inputClass(name as keyof NewLoanPayload)}
                value={form[name as keyof typeof form]}
                onChange={handleChange(name as keyof typeof form)}
                ref={(el) => {
                  refs.current[name as keyof NewLoanPayload] = el;
                }}
                required
              />
            </label>
          ))}
          <div className='md:col-span-2 flex justify-end gap-2 pt-2'>
            <button
              type='button'
              className='btn btn-ghost'
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={submitting}
            >
              {submitting ? (
                <span className='loading loading-spinner' />
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>
      <form
        method='dialog'
        className='modal-backdrop'
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
