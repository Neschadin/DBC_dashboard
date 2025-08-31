import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  // const session = await auth();

  // if (!session?.user) return null

  // if (session?.user) {
  //   void api.post.getLatest.prefetch();
  // }

  return (
    // <HydrateClient>
    <main className="container mx-auto grid h-full place-items-center p-4">
      <h1 className="text-5xl md:text-7xl font-bold text-gray-500 text-center">DBC Test App</h1>
    </main>
    // </HydrateClient>
  );
}
