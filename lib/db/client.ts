import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

export const client = createClient({ url: process.env.TURSO_DATABASE_URL as string, authToken: process.env.TURSO_DATABASE_AUTH_TOKEN as string });

export const db = drizzle(client, { schema });
