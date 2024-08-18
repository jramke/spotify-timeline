import { spotify, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@/lib/db/client";
import { session, user, user_token } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies().get("spotify_oauth_state")?.value ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await spotify.validateAuthorizationCode(code);
		const spotifyUserResponse = await fetch("https://api.spotify.com/v1/me", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const spotifyUser: SpotifyUser = await spotifyUserResponse.json();

		const existingUser = await db.query.user.findFirst({
            where: eq(user.spotifyId, spotifyUser.id)
        });

		let userId = existingUser?.id ?? '';

		if (existingUser) {
			await db.delete(user_token).where(eq(user_token.userId, existingUser.id));
			await db.delete(session).where(eq(session.userId, existingUser.id));
			const newSession = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(newSession.id);
			cookies().set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		} else {
			userId = generateIdFromEntropySize(10); // 16 characters long
            
			await db.insert(user).values({
                id: userId,
                username: spotifyUser.display_name ?? "",
                spotifyId: spotifyUser.id
            });

			const newSession = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(newSession.id);
			cookies().set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		}

		await db.insert(user_token).values({
			id: generateIdFromEntropySize(10),
			userId: userId,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			expiresAt: tokens.accessTokenExpiresAt.getTime()
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/playlists"
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}

interface SpotifyUser {
	id: string;
	display_name: string;
}