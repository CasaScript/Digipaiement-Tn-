import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { contactMessages } from './schema.ts';

export interface CreateContactMessageInput {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function createContactMessage(input: CreateContactMessageInput) {
  try {
    const result = await db
      .insert(contactMessages)
      .values({
        userId: input.userId,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        subject: input.subject,
        message: input.message,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in createContactMessage:', error);
    throw new Error('Impossible d’enregistrer votre message pour le moment.', { cause: error });
  }
}

export async function listAllContactMessages() {
  try {
    return await db
      .select({
        id: contactMessages.id,
        userId: contactMessages.userId,
        name: contactMessages.name,
        email: contactMessages.email,
        phone: contactMessages.phone,
        subject: contactMessages.subject,
        message: contactMessages.message,
        createdAt: contactMessages.createdAt,
      })
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  } catch (error) {
    console.error('Database query failed in listAllContactMessages:', error);
    throw new Error('Impossible de charger les messages.', { cause: error });
  }
}

export async function deleteContactMessageById(id: number) {
  try {
    const result = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning({ id: contactMessages.id });

    return result[0] ?? null;
  } catch (error) {
    console.error('Database query failed in deleteContactMessageById:', error);
    throw new Error('Impossible de supprimer ce message.', { cause: error });
  }
}
