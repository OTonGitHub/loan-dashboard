export class LoanNotFoundError extends Error {
  constructor(message = 'Loan not found') {
    super(message);
    this.name = 'LoanNotFoundError';
  }
}

export class LoanConflictError extends Error {
  constructor(message = 'Loan number already exists') {
    super(message);
    this.name = 'LoanConflictError';
  }
}
