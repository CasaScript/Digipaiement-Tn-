import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderCode: text('order_code').notNull().unique(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  tool: text('tool').notNull(),
  planDuration: text('plan_duration').notNull(),
  paymentMethod: text('payment_method').notNull(),
  priceTnd: integer('price_tnd').notNull(),
  status: text('status').notNull().default('pending_payment'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  contactMessages: many(contactMessages),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const contactMessagesRelations = relations(contactMessages, ({ one }) => ({
  user: one(users, {
    fields: [contactMessages.userId],
    references: [users.id],
  }),
}));
