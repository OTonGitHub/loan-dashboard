import { useEffect, useRef, useState } from 'react';
import type { NewLoanPayload } from '../types/loan';
import type { FieldError } from '../hooks/useLoans';

type NewLoanDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: NewLoanPayload) => Promise<void>;
};

type FormState = {
  loanNumber: string;
  amount: string;
  startDate: string;
  endDate: string;
  emi: string;
  outstandingAmount: string;
  overdueAmount: string;
};

const initialForm: FormState = {
  loanNumber: '',
  amount: '',
  startDate: '',
  endDate: '',
  emi: '',
  outstandingAmount: '',
  overdueAmount: '',
};

export function NewLoanDialog({ open, onClose, onCreate }: NewLoanDialogProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<FieldError[]>([]);

  const refs = useRef<Record<keyof NewLoanPayload, HTMLInputElement | null>>({
    loanNumber: null,
    amount: null,
    emi: null,
    outstandingAmount: null,
    overdueAmount: null,
    startDate: null,
    endDate: null,
  });

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear any field-specific errors when user edits that field
      if (errorList.some((er) => er.field === field)) {
        setErrorList((prev) => prev.filter((er) => er.field !== field));
      }
    };

  const reset = () => {
    setForm(initialForm);
    setError(null);
    setErrorList([]);
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
      const payload: NewLoanPayload = {
        loanNumber: form.loanNumber,
        amount: Number(form.amount || 0),
        emi: Number(form.emi || 0),
        outstandingAmount: Number(form.outstandingAmount || 0),
        overdueAmount: Number(form.overdueAmount || 0),
        startDate: form.startDate,
        endDate: form.endDate,
      };

      await onCreate(payload);
      reset();
      onClose();
    } catch (err) {
      const field =
        err && typeof err === 'object' && 'field' in err
          ? (err as { field?: keyof NewLoanPayload }).field
          : undefined;
      const errors =
        err && typeof err === 'object' && 'errors' in err
          ? (err as { errors?: FieldError[] }).errors ?? []
          : [];

      setError(
        errors.length > 0
          ? null
          : err instanceof Error
          ? err.message
          : 'Failed to create loan'
      );
      setErrorList(errors);

      const firstField =
        field ||
        (errors.find((e) => e.field)?.field as
          | keyof NewLoanPayload
          | undefined) ||
        null;
      if (firstField) {
        // focus the first invalid field
        setTimeout(() => refs.current[firstField]?.focus(), 0);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const errorFields = new Set(
    errorList.map((e) => e.field).filter(Boolean) as (keyof NewLoanPayload)[]
  );

  const inputClass = (field: keyof NewLoanPayload) =>
    `input input-bordered focus:outline-none ${
      errorFields.has(field)
        ? 'border-error focus:border-error focus:ring-2 focus:ring-error/40'
        : 'focus:border-primary focus:ring-2 focus:ring-primary/30'
    }`;

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
        <h3 className='font-semibold text-lg mb-2'>New Loan</h3>
        <p className='text-sm text-base-content/70 mb-4'>
          Create a new loan facility.
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
          {(() => {
            type FieldName = keyof FormState & keyof NewLoanPayload;
            const inputs: Array<{
              name: FieldName;
              label: string;
              type: 'text' | 'number' | 'date';
              placeholder?: string;
              min?: number;
            }> = [
              {
                name: 'loanNumber',
                label: 'Loan Number',
                type: 'text',
                placeholder: 'LN-011',
              },
              { name: 'amount', label: 'Amount', type: 'number', min: 0 },
              { name: 'emi', label: 'EMI', type: 'number', min: 0 },
              {
                name: 'outstandingAmount',
                label: 'Outstanding Amount',
                type: 'number',
                min: 0,
              },
              {
                name: 'overdueAmount',
                label: 'Overdue Amount',
                type: 'number',
                min: 0,
              },
              { name: 'startDate', label: 'Start Date', type: 'date' },
              { name: 'endDate', label: 'End Date', type: 'date' },
            ];

            return (
              <>
                {inputs.map(({ name, label, type, placeholder, min }) => (
                  <label className='form-control' key={String(name)}>
                    <div className='label'>
                      <span className='label-text'>{label}</span>
                    </div>
                    <input
                      type={type}
                      className={inputClass(name as keyof NewLoanPayload)}
                      value={form[name as keyof FormState]}
                      onChange={handleChange(name as keyof FormState)}
                      placeholder={placeholder}
                      min={min}
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
                      'Create Loan'
                    )}
                  </button>
                </div>
              </>
            );
          })()}
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
