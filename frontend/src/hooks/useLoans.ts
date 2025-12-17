import { useCallback, useEffect, useState } from 'react';
import type { Loan, NewLoanPayload } from '../types/loan';

type UseLoansResult = {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createLoan: (payload: NewLoanPayload) => Promise<void>;
  deleteLoan: (loanNumber: string) => Promise<void>;
  updateLoan: (loanNumber: string, payload: NewLoanPayload) => Promise<void>;
};

export type FieldError = { field?: string; message: string };

type FieldedError = Error & { field?: string };

import { API_BASE } from '../config';

export function useLoans(): UseLoansResult {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = useCallback(async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/loans`, {
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      const data = (await res.json()) as Loan[];
      setLoans(data);
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : 'Failed to load loans');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const createLoan = useCallback(
    async (payload: NewLoanPayload) => {
      const res = await fetch(`${API_BASE}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body?.message ||
          body?.errors?.[0]?.message ||
          'Failed to create loan';
        const field = body?.errors?.[0]?.field as string | undefined;
        const errors = (body?.errors ?? []) as FieldError[];
        const err = new Error(message) as FieldedError & {
          errors?: FieldError[];
        };
        err.field = field;
        err.errors = errors;
        throw err;
      }

      await fetchLoans();
    },
    [fetchLoans]
  );

  const deleteLoan = useCallback(
    async (loanNumber: string) => {
      const res = await fetch(`${API_BASE}/loans/${loanNumber}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.message || 'Failed to delete loan';
        throw new Error(message);
      }
      await fetchLoans();
    },
    [fetchLoans]
  );

  const updateLoan = useCallback(
    async (loanNumber: string, payload: NewLoanPayload) => {
      const res = await fetch(`${API_BASE}/loans/${loanNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body?.message ||
          body?.errors?.[0]?.message ||
          'Failed to update loan';
        const err = new Error(message) as Error & {
          field?: string;
          errors?: FieldError[];
        };
        if (body?.errors) err.errors = body.errors as FieldError[];
        if (body?.errors?.[0]?.field) err.field = body.errors[0].field;
        throw err;
      }
      await fetchLoans();
    },
    [fetchLoans]
  );

  return {
    loans,
    loading,
    error,
    refetch: fetchLoans,
    createLoan,
    deleteLoan,
    updateLoan,
  };
}
