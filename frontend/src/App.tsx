import './App.css';
import { SummaryCards } from './components/SummaryCards';
import { LoanTable } from './components/LoanTable';
import { useLoans } from './hooks/useLoans';

function App() {
  const { loans, loading, error } = useLoans();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-4 lg:px-10">
        <div className="flex-1">
          <span className="text-xl font-semibold tracking-tight">Loan Dashboard</span>
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-primary btn-sm">New Loan</button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 lg:px-0 py-8 space-y-6">
        <SummaryCards loans={loans} />
        <LoanTable loans={loans} loading={loading} error={error} />
      </main>
    </div>
  );
}

export default App;
