import { migrate } from 'drizzle-orm/libsql/migrator';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const { TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN } = process.env;
if (!TURSO_DATABASE_URL) {
	throw new Error('No url');
}
if (!TURSO_DATABASE_AUTH_TOKEN) {
	throw new Error('No auth token');
}

const client = createClient({ url: TURSO_DATABASE_URL as string, authToken: TURSO_DATABASE_AUTH_TOKEN as string });
const db = drizzle(client);

async function main() {
	try {
		console.log('Migration started...');
		await migrate(db, {
			migrationsFolder: 'drizzle'
		});
		console.log('Tables migrated!');
		process.exit(0);
	} catch (error) {
		console.error('Error performing migration: ', error);
		process.exit(1);
  	}
}
main();