import type { customers, orders } from "~/server/db/schema";

export type Customer = Omit<typeof customers.$inferSelect, "updatedAt"> & {
  ordersCount: number;
};

export type Order = typeof orders.$inferSelect;