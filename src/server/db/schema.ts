import { relations, sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

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
