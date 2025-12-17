import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { loanSchema } from './schema.db.js';
import { seedLoans } from './loan.seed.js';

const dbPath = process.env.SQLITE_PATH
  ? path.resolve(process.cwd(), process.env.SQLITE_PATH)
  : path.resolve(process.cwd(), 'data', 'loans.db');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const connection = new Database(dbPath);

export const db = drizzle(connection, { schema: loanSchema });

migrate(db, { migrationsFolder: path.resolve(process.cwd(), 'drizzle') });
seedLoans(db);
