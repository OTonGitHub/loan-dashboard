import { useEffect, useState } from 'react';
import type { Loan } from '../types/loan';

type UseLoansResult = {
  loans: Loan[];
  loading: boolean;
  error: string | null;
};

const apiBase =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:3000/api/v1';

export function useLoans(): UseLoansResult {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBase}/loans`, { signal: controller.signal });
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
    }

    load();

    return () => controller.abort();
  }, []);

  return { loans, loading, error };
}
