import type { Config } from "drizzle-kit";

const { TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN } = process.env;

if (!TURSO_DATABASE_URL) {
	throw new Error("No url");
}
if (!TURSO_DATABASE_AUTH_TOKEN) {
	throw new Error("No auth token");
}

export default {
	schema: "./lib/db/schema.ts",
	out: "./drizzle",
	driver: "turso",
	dialect: "sqlite",
	dbCredentials: {
		url: TURSO_DATABASE_URL,
		authToken: TURSO_DATABASE_AUTH_TOKEN,
	},
	// strict: true
	verbose: true,
} satisfies Config;
