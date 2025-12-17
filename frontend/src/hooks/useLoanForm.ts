import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { NewLoanPayload } from '../types/loan';
import type { FieldError } from '../hooks/useLoans';

type FormState = Record<keyof NewLoanPayload, string>;

const initialForm: FormState = {
  loanNumber: '',
  amount: '',
  emi: '',
  outstandingAmount: '',
  overdueAmount: '',
  startDate: '',
  endDate: '',
};

export function useLoanForm(
  onCreate: (p: NewLoanPayload) => Promise<void>,
  onClose: () => void
) {
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

  const reset = useCallback(() => {
    setForm(initialForm);
    setError(null);
    setErrorList([]);
    setSubmitting(false);
  }, []);

  const handleChange =
    (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((p) => ({ ...p, [field]: value }));
      if (errorList.some((er) => er.field === field)) {
        setErrorList((prev) => prev.filter((er) => er.field !== field));
      }
    };

  const handleSubmit = async (e: FormEvent) => {
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
    } catch (err: unknown) {
      let field: keyof NewLoanPayload | undefined;
      let errors: FieldError[] = [];
      if (typeof err === 'object' && err !== null) {
        const o = err as Record<string, unknown>;
        if ('field' in o) field = o.field as keyof NewLoanPayload | undefined;
        if ('errors' in o && Array.isArray(o.errors))
          errors = o.errors as FieldError[];
      }
      setError(
        errors.length > 0
          ? null
          : err instanceof Error
          ? err.message
          : 'Failed to submit'
      );
      setErrorList(errors);

      const firstField =
        (field ||
          (errors.find((er) => er.field)?.field as
            | keyof NewLoanPayload
            | undefined)) ??
        null;
      if (firstField) setTimeout(() => refs.current[firstField]?.focus(), 0);
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

  return {
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
  } as const;
}
