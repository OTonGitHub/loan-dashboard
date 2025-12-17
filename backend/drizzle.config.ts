import { defineConfig } from 'drizzle-kit';

// Minimal drizzle-kit config for this project (drizzle-kit >=0.21)
export default defineConfig({
  schema: './src/loans/schema.db.ts',
  out: './drizzle',
  dialect: 'sqlite',
  // dbCredentials can be overridden via SQLITE_PATH env var when running drizzle-kit
  dbCredentials: {
    url: './data/loans.db',
  },
});
