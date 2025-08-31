import { relations, sql } from "drizzle-orm";
import { index, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

// export const posts = sqliteTable(
//   "post",
//   (d) => ({
//     id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
//     name: d.text({ length: 256 }),
//     createdById: d
//       .text({ length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: d
//       .integer({ mode: "timestamp" })
//       .default(sql`(unixepoch())`)
//       .notNull(),
//     updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
//   }),
//   (t) => [
//     index("created_by_idx").on(t.createdById),
//     index("name_idx").on(t.name),
//   ],
// );

export const users = sqliteTable("user", (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }),
  email: d.text({ length: 255 }).notNull().unique(),
  emailVerified: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
  image: d.text({ length: 255 }),
  passwordHash: d.text({ length: 255 }).notNull(),
}));

// export const usersRelations = relations(users, ({ many }) => ({
//   accounts: many(accounts),
// }));

// export const accounts = sqliteTable(
//   "account",
//   (d) => ({
//     userId: d
//       .text({ length: 255 })
//       .notNull()
//       .references(() => users.id),
//     type: d.text({ length: 255 }).$type<AdapterAccountType>().notNull(),
//     provider: d.text({ length: 255 }).notNull(),
//     providerAccountId: d.text({ length: 255 }).notNull(),
//     refresh_token: d.text(),
//     access_token: d.text(),
//     expires_at: d.integer(),
//     token_type: d.text({ length: 255 }),
//     scope: d.text({ length: 255 }),
//     id_token: d.text(),
//     session_state: d.text({ length: 255 }),
//   }),
//   (t) => [
//     primaryKey({
//       columns: [t.provider, t.providerAccountId],
//     }),
//     index("account_user_id_idx").on(t.userId),
//   ],
// );

// export const accountsRelations = relations(accounts, ({ one }) => ({
//   user: one(users, { fields: [accounts.userId], references: [users.id] }),
// }));

// export const sessions = sqliteTable(
//   "session",
//   (d) => ({
//     sessionToken: d.text({ length: 255 }).notNull().primaryKey(),
//     userId: d
//       .text({ length: 255 })
//       .notNull()
//       .references(() => users.id),
//     expires: d.integer({ mode: "timestamp" }).notNull(),
//   }),
//   (t) => [index("session_userId_idx").on(t.userId)],
// );

// export const sessionsRelations = relations(sessions, ({ one }) => ({
//   user: one(users, { fields: [sessions.userId], references: [users.id] }),
// }));

// export const verificationTokens = sqliteTable(
//   "verification_token",
//   (d) => ({
//     identifier: d.text({ length: 255 }).notNull(),
//     token: d.text({ length: 255 }).notNull(),
//     expires: d.integer({ mode: "timestamp" }).notNull(),
//   }),
//   (t) => [primaryKey({ columns: [t.identifier, t.token] })],
// );

export const customers = sqliteTable(
  "customer",
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    firstName: d.text({ length: 200 }),
    lastName: d.text({ length: 200 }),
    email: d.text({ length: 254 }).notNull().unique(),
    gender: d.text({ length: 50 }),
    country: d.text({ length: 100 }),
    city: d.text({ length: 100 }),
    state: d.text({ length: 100 }),
    postCode: d.text({ length: 20 }),
    street: d.text({ length: 255 }),
    streetNumber: d.text({ length: 20 }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("customer_fullName_idx").on(t.firstName, t.lastName),
    index("customer_firstName_idx").on(t.firstName),
    index("customer_lastName_idx").on(t.lastName),
  ],
);

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const orders = sqliteTable(
  "order",
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    customerId: d
      .text({ length: 255 })
      .notNull()
      .references(() => customers.id),
    orderNumber: d.integer({ mode: "number" }).notNull().unique(),
    price: d.real().notNull(),
    currency: d.text({ length: 10 }).notNull(),
    itemName: d.text({ length: 255 }).notNull(),
    amount: d.integer({ mode: "number" }).notNull(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    shippedAt: d.integer({ mode: "timestamp" }),
  }),
  (t) => [
    index("order_orderNumber_idx").on(t.orderNumber),
    index("order_itemName_idx").on(t.itemName),
    index("order_createdAt_idx").on(t.createdAt),
  ],
);

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
}));
