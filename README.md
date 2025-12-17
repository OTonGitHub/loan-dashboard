## DONE

Align ID rules: POST currently allows any non-empty loanNumber (loan.schema.ts), but GET /:loanNumber requires LN-<digits> (loanNumberParamSchema). That mismatch will reject records created with other formats. Either add the same regex to loanSchema.loanNumber or relax the param schema so both endpoints accept the same pattern.

Service/HTTP coupling: LoanService throws HTTPException, tying domain to transport. Best practice is to throw a domain error (or null) and map to 404/409 in the route. Not critical for this small app, but worth noting.

CORS: no CORS middleware yet. A React frontend on another origin will be blocked. Add app.use('\*', cors()) (from hono/cors) with allowed origins/headers.

## NOT DONE

Duplicate check inefficiency: craeteLoan calls findAll to check duplicates. Use findByLoanNumber instead to avoid scanning the whole list.

Add Swagger

Tooling/docs: no README/setup steps, no CORS note, no tests (tests are optional per prompt). Consider a short README with install/run commands and the /api/v1/loans endpoints. (For this, I wanna later add a swagger page for the backend)

## RISKS/QUIRKS

Soft-delete + unique loanNumber: service allows recreating a loanNumber after delete, but the DB UNIQUE constraint will reject the insert, returning a 500 instead of a 409. Consider surfacing a conflict or reactivating the existing row instead of inserting.

Startup migration/seed (db.client.ts) deletes and reseeds the loans table on every server boot. Fine for demos; avoid in production or gate with env.
