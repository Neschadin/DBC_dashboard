import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.customers.getStats.prefetch();
    redirect("/dashboard");
  }

  return (
    <HydrateClient>
      <main className="container mx-auto grid h-full place-items-center p-4">
        <h1 className="text-center text-5xl font-bold text-gray-500 md:text-7xl">
          DBC Test App
        </h1>
      </main>
    </HydrateClient>
  );
}
