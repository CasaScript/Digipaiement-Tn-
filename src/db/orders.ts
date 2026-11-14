import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { orders, users } from './schema.ts';

export interface CreateOrderInput {
  orderCode: string;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  tool: string;
  planDuration: string;
  paymentMethod: string;
  priceTnd: number;
  notes?: string;
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const result = await db
      .insert(orders)
      .values({
        orderCode: input.orderCode,
        userId: input.userId,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        tool: input.tool,
        planDuration: input.planDuration,
        paymentMethod: input.paymentMethod,
        priceTnd: input.priceTnd,
        status: 'pending_payment',
        notes: input.notes ?? null,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in createOrder:', error);
    throw new Error('Impossible d’enregistrer la commande pour le moment.', { cause: error });
  }
}

export async function listOrdersByUserUid(uid: string) {
  try {
    return await db
      .select({
        id: orders.orderCode,
        fullName: orders.fullName,
        email: orders.email,
        phone: orders.phone,
        tool: orders.tool,
        planDuration: orders.planDuration,
        paymentMethod: orders.paymentMethod,
        priceTnd: orders.priceTnd,
        status: orders.status,
        createdAt: orders.createdAt,
        notes: orders.notes,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(eq(users.uid, uid))
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Database query failed in listOrdersByUserUid:', error);
    throw new Error('Impossible de charger vos commandes pour le moment.', { cause: error });
  }
}

export async function listAllOrders() {
  try {
    return await db
      .select({
        id: orders.id,
        orderCode: orders.orderCode,
        userId: orders.userId,
        fullName: orders.fullName,
        email: orders.email,
        phone: orders.phone,
        tool: orders.tool,
        planDuration: orders.planDuration,
        paymentMethod: orders.paymentMethod,
        priceTnd: orders.priceTnd,
        status: orders.status,
        notes: orders.notes,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Database query failed in listAllOrders:', error);
    throw new Error('Impossible de charger la liste des commandes.', { cause: error });
  }
}

export async function updateOrderAdmin(
  orderCode: string,
  updates: { status?: string; notes?: string | null }
) {
  try {
    const setPayload: { status?: string; notes?: string | null } = {};
    if (updates.status !== undefined) {
      setPayload.status = updates.status;
    }
    if (updates.notes !== undefined) {
      setPayload.notes = updates.notes;
    }

    const result = await db
      .update(orders)
      .set(setPayload)
      .where(eq(orders.orderCode, orderCode))
      .returning();

    return result[0] ?? null;
  } catch (error) {
    console.error('Database query failed in updateOrderAdmin:', error);
    throw new Error('Impossible de mettre à jour la commande.', { cause: error });
  }
}

export async function deleteOrderByCode(orderCode: string) {
  try {
    const result = await db
      .delete(orders)
      .where(eq(orders.orderCode, orderCode))
      .returning({ id: orders.id, orderCode: orders.orderCode });

    return result[0] ?? null;
  } catch (error) {
    console.error('Database query failed in deleteOrderByCode:', error);
    throw new Error('Impossible de supprimer la commande.', { cause: error });
  }
}
