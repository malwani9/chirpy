import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from 'drizzle-orm';

export async function createUser(user: NewUser) {
    const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
    return result;
}

export async function getUserByEmail(email: string) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
}

export async function updateUserById(userId: string, hashedPassword: string, email: string) {
    const [result] = await db
        .update(users)
        .set({ hashed_password: hashedPassword, email: email })
        .where(eq(users.id, userId))
        .returning();

    return result;
}

export async function reset() {
    await db.delete(users)
}