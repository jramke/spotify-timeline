import { Lucia } from "lucia";
import { Spotify } from "arctic";
import { client } from "@/lib/db/client";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { cookies } from "next/headers";
import { cache } from "react";

import type { Session, User } from "lucia";

const adapter = new LibSQLAdapter(client, {
    user: "user",
	session: "session"
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === "production",
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			spotifyId: attributes.spotifyId,
			username: attributes.username
		};
	}
});

export const spotify = new Spotify(process.env.SPOTIFY_CLIENT_ID as string, process.env.SPOTIFY_CLIENT_SECRET as string, process.env.SPOTIFY_REDIRECT_URI as string);

export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return result;
	}
);

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	spotifyId: string;
	username: string;
}