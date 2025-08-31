"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import SuperJSON from "superjson";
import { createQueryClient } from "./query-client";

import type { QueryClient } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  clientQueryClientSingleton ??= createQueryClient();

  return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const getBaseUrl = () =>
  typeof window !== "undefined"
    ? window.location.origin
    : `http://localhost:${process.env.PORT ?? 3000}`;

const createTRPCClient = () =>
  api.createClient({
    links: [
      loggerLink({
        enabled: (op) =>
          process.env.NODE_ENV === "development" ||
          (op.direction === "down" && op.result instanceof Error),
      }),
      httpBatchStreamLink({
        transformer: SuperJSON,
        url: getBaseUrl() + "/api/trpc",
        headers: () => {
          const headers = new Headers();
          headers.set("x-trpc-source", "nextjs-react");
          return headers;
        },
      }),
    ],
  });

export function TRPCProvider(props: PropsWithChildren) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(createTRPCClient);

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
