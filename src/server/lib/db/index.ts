import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import * as schema from './schema';

// Supabase's transaction pooler doesn't support prepared statements. The driver
// connects on the first query, not here.
export const db = drizzle(postgres(env.DATABASE_URL, { prepare: false }), { schema });
