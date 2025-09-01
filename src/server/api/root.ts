import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "~/server/api/routers/auth";
import { customersRouter } from "~/server/api/routers/customers";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  customers: customersRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
