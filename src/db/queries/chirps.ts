import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { and, eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning();
    return result;
}

export async function getAllChirps() {
    const result = await db.select().from(chirps).orderBy(chirps.createdAt);
    return result;
}

export async function getChirpById(chirpId: string) {
    const result = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    if (result.length === 0) {
        return;
    }
    return result[0];
}

export async function deleteChirpById(chirpId: string) {
    const result =  await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId))
        .returning();
    return result.length > 0;
}