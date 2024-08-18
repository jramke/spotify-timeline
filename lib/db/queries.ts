import { spotify } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { user_token, type SelectUser } from "./schema";

export async function updateAccessToken(user: SelectUser, refreshToken: string) {
    const newTokens = await spotify.refreshAccessToken(refreshToken);

    const updatedToken = await db.update(user_token)
        .set({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            expiresAt: newTokens.accessTokenExpiresAt.getTime()
        })
        .where(eq(user_token.userId, user.id))
        .returning();
    
    return updatedToken[0];
}