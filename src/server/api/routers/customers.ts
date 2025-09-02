import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { customers, orders } from "~/server/db/schema";
import {
  eq,
  like,
  and,
  asc,
  desc,
  count,
  inArray,
  or,
  isNotNull,
  gt,
} from "drizzle-orm";

export const customersRouter = createTRPCRouter({
  getCustomers: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
        search: z.string().optional(),
        gender: z.string().optional(),
        country: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, gender, country } = input;

      const conditions = [];

      if (search) {
        conditions.push(
          or(
            like(customers.firstName, `%${search}%`),
            like(customers.lastName, `%${search}%`),
            like(customers.email, `%${search}%`),
          ),
        );
      }

      if (gender) {
        conditions.push(eq(customers.gender, gender));
      }

      if (country) {
        conditions.push(eq(customers.country, country));
      }

      // Cursor-based pagination
      if (cursor) {
        conditions.push(gt(customers.id, cursor));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const results = await ctx.db
        .select()
        .from(customers)
        .where(whereClause)
        .orderBy(asc(customers.id))
        .limit(limit + 1); // Get one extra to check if there's a next page

      const customerIds = results.map((customer) => customer.id);
      const ordersCounts = await ctx.db
        .select({
          customerId: orders.customerId,
          count: count(),
        })
        .from(orders)
        .where(inArray(orders.customerId, customerIds))
        .groupBy(orders.customerId);

      const ordersCountMap = new Map(
        ordersCounts.map((item) => [item.customerId, item.count]),
      );

      const resultsWithOrdersCount = results.map((customer) => ({
        ...customer,
        ordersCount: ordersCountMap.get(customer.id) ?? 0,
      }));

      let nextCursor: string | undefined = undefined;
      if (resultsWithOrdersCount.length > limit) {
        const nextItem = resultsWithOrdersCount.pop();
        nextCursor = nextItem?.id;
      }

      return {
        customers: resultsWithOrdersCount,
        nextCursor,
      };
    }),

  getCustomerById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const customer = await ctx.db.query.customers.findFirst({
        where: eq(customers.id, input.id),
        with: {
          orders: {
            orderBy: [desc(orders.createdAt)],
            limit: 10,
          },
        },
      });

      if (!customer) {
        throw new Error("Customer not found");
      }

      return customer;
    }),

  getCustomerOrders: protectedProcedure
    .input(
      z.object({
        customerId: z.string(),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { customerId, limit, cursor } = input;

      const conditions = [eq(orders.customerId, customerId)];

      if (cursor) {
        conditions.push(gt(orders.id, cursor));
      }

      const results = await ctx.db
        .select()
        .from(orders)
        .where(and(...conditions))
        .orderBy(asc(orders.id))
        .limit(limit + 1);

      let nextCursor: string | undefined = undefined;
      if (results.length > limit) {
        const nextItem = results.pop();
        nextCursor = nextItem?.id;
      }

      return {
        orders: results,
        nextCursor,
      };
    }),

  getFilterOptions: protectedProcedure.query(async ({ ctx }) => {
    const gendersResult = await ctx.db
      .select({ gender: customers.gender })
      .from(customers)
      .where(isNotNull(customers.gender))
      .groupBy(customers.gender)
      .orderBy(asc(customers.gender));

    const countriesResult = await ctx.db
      .select({ country: customers.country })
      .from(customers)
      .where(isNotNull(customers.country))
      .groupBy(customers.country)
      .orderBy(asc(customers.country));

    return {
      genders: gendersResult.map((row) => row.gender).filter(Boolean),
      countries: countriesResult.map((row) => row.country).filter(Boolean),
    };
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const totalCustomersResult = await ctx.db
      .select({ count: count() })
      .from(customers);

    const totalOrdersResult = await ctx.db
      .select({ count: count() })
      .from(orders);

    const deliveredOrdersResult = await ctx.db
      .select({ count: count() })
      .from(orders)
      .where(isNotNull(orders.shippedAt));

    return {
      totalCustomers: totalCustomersResult[0]?.count ?? 0,
      totalOrders: totalOrdersResult[0]?.count ?? 0,
      deliveredOrders: deliveredOrdersResult[0]?.count ?? 0,
    };
  }),
});
