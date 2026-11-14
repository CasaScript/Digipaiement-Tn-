import { desc } from 'drizzle-orm';
import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string | null
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName ?? null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName ?? null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Impossible de synchroniser le compte utilisateur.', { cause: error });
  }
}

export async function listAllUsers() {
  try {
    return await db
      .select({
        id: users.id,
        uid: users.uid,
        email: users.email,
        displayName: users.displayName,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));
  } catch (error) {
    console.error('Database query failed in listAllUsers:', error);
    throw new Error('Impossible de charger la liste des clients.', { cause: error });
  }
}
