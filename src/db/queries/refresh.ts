import { config } from "../../config.js";
import { db } from "../index.js";
import { refresh_tokens, users } from "../schema.js";
import { and, eq, gt, isNull } from 'drizzle-orm';

export async function createRefreshToken(userId: string, token: string) {
    const result = await db.insert(refresh_tokens)
    .values
    ({
        userId: userId,
        token: token,
        expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
        revokedAt: null,
    })
    .returning();
    return result.length > 0;
}

export async function getUserFromRefreshToken(token: string) {
    const [result] = await db
        .select( {user: users} )
        .from(users)
        .innerJoin(refresh_tokens, eq(users.id, refresh_tokens.userId))
        .where(
            and(
                eq(refresh_tokens.token, token),
                isNull(refresh_tokens.revokedAt),
                gt(refresh_tokens.expiresAt, new Date()),
            ),
        )
        .limit(1);

    return result;
}

export async function revokeRefreshToekn(token: string) {
    const [result] = await db.update(refresh_tokens)
        .set({ revokedAt: new Date(), updatedAt: new Date()})
        .where(eq(refresh_tokens.token, token)).returning();
    if(!result) {
        throw new Error("Couldn't revoke token");
    }
} 