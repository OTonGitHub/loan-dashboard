## Backend tidy-up before frontend

## DONE
Align ID rules: POST currently allows any non-empty loanNumber (loan.schema.ts), but GET /:loanNumber requires LN-<digits> (loanNumberParamSchema). That mismatch will reject records created with other formats. Either add the same regex to loanSchema.loanNumber or relax the param schema so both endpoints accept the same pattern.

Service/HTTP coupling: LoanService throws HTTPException, tying domain to transport. Best practice is to throw a domain error (or null) and map to 404/409 in the route. Not critical for this small app, but worth noting.

## NOT DONE
CORS: no CORS middleware yet. A React frontend on another origin will be blocked. Add app.use('\*', cors()) (from hono/cors) with allowed origins/headers.

Duplicate check inefficiency: craeteLoan calls findAll to check duplicates. Use findByLoanNumber instead to avoid scanning the whole list.

Repo/data: In-memory seed is fine, but if you plan to add internal IDs later, seed them consistently and strip on response; currently no ID support (acceptable for the assignment).

Tooling/docs: no README/setup steps, no CORS note, no tests (tests are optional per prompt). Consider a short README with install/run commands and the /api/v1/loans endpoints. (For this, I wanna later add a swagger page for the backend)