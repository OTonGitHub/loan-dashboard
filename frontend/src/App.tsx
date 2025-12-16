import './App.css';
import { SummaryCards } from './components/SummaryCards';
import { LoanTable } from './components/LoanTable';
import type { Loan } from './types/loan';

const mockLoans: Loan[] = [
  {
    loanNumber: 'LN-001',
    amount: 100000,
    startDate: '2024-01-01',
    endDate: '2026-01-01',
    emi: 4500,
    outstandingAmount: 80000,
    overdueAmount: 0,
    amountDisplay: 'MVR 100,000.00',
    emiDisplay: 'MVR 4,500.00',
    outstandingDisplay: 'MVR 80,000.00',
    overdueDisplay: 'MVR 0.00',
  },
  {
    loanNumber: 'LN-002',
    amount: 250000,
    startDate: '2023-06-15',
    endDate: '2028-06-15',
    emi: 5200,
    outstandingAmount: 200000,
    overdueAmount: 0,
    amountDisplay: 'MVR 250,000.00',
    emiDisplay: 'MVR 5,200.00',
    outstandingDisplay: 'MVR 200,000.00',
    overdueDisplay: 'MVR 0.00',
  },
  {
    loanNumber: 'LN-003',
    amount: 50000,
    startDate: '2022-09-01',
    endDate: '2025-09-01',
    emi: 1500,
    outstandingAmount: 20000,
    overdueAmount: 500,
    amountDisplay: 'MVR 50,000.00',
    emiDisplay: 'MVR 1,500.00',
    outstandingDisplay: 'MVR 20,000.00',
    overdueDisplay: 'MVR 500.00',
  },
];

function App() {
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
        <SummaryCards loans={mockLoans} />
        <LoanTable loans={mockLoans} />
      </main>
    </div>
  );
}

export default App;
