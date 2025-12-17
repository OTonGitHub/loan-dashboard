import { useCallback, useEffect, useState } from 'react';
import type {
  Loan,
  LoanPage,
  LoanSortBy,
  LoanSummary,
  NewLoanPayload,
} from '../types/loan';

type UseLoansResult = {
  loans: Loan[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: LoanSortBy;
  sortDir: 'asc' | 'desc';
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setSort: (sortBy: LoanSortBy) => void;
  refreshList: () => void;
  createLoan: (payload: NewLoanPayload) => Promise<void>;
  deleteLoan: (loanNumber: string) => Promise<void>;
  updateLoan: (loanNumber: string, payload: NewLoanPayload) => Promise<void>;
  summary: LoanSummary | null;
};

export type FieldError = { field?: string; message: string };

type FieldedError = Error & { field?: string };

import { API_BASE } from '../config';

export function useLoans(): UseLoansResult {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState<LoanSortBy>('loanNumber');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<LoanSummary | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchLoans = useCallback(async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sortBy,
        sortDir,
      });
      const res = await fetch(`${API_BASE}/loans?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      const data = (await res.json()) as LoanPage;
      setLoans(data.items);
      setTotal(data.total);
      setPage(data.page);

      // fetch summary in parallel (no pagination effect)
      const summaryRes = await fetch(`${API_BASE}/loans/summary`, {
        signal: controller.signal,
      });
      if (summaryRes.ok) {
        const summaryJson = (await summaryRes.json()) as LoanSummary;
        setSummary(summaryJson);
      } else {
        setSummary(null);
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : 'Failed to load loans');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [page, pageSize, sortBy, sortDir, reloadKey]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const setSort = useCallback(
    (column: LoanSortBy) => {
      setPage(1);
      setSortDir((current) =>
        column === sortBy ? (current === 'asc' ? 'desc' : 'asc') : 'asc'
      );
      setSortBy(column);
    },
    [sortBy]
  );

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

  const goToPage = useCallback((next: number) => {
    setPage(Math.max(1, Math.trunc(next)));
  }, []);

  const refreshList = useCallback(() => {
    setPage(1);
    setSortBy('loanNumber');
    setSortDir('asc');
    setReloadKey((k) => k + 1);
  }, []);

  return {
    loans,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    sortBy,
    sortDir,
    loading,
    error,
    setPage: goToPage,
    setSort,
    refreshList,
    createLoan,
    deleteLoan,
    updateLoan,
    summary,
  };
}
