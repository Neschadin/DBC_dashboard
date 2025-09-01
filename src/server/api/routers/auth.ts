import { hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { signUpSchema } from "~/lib/zod";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      const passwordHash = await hash(password, 12);

      let randomId = Math.floor(Math.random() * 150) + 1;
      let avatarUrl = `https://i.pravatar.cc/${randomId}`;

      let attempts = 0;
      const maxAttempts = 10;

      while (
        !(await checkImageAvailability(randomId)) &&
        attempts < maxAttempts
      ) {
        randomId = Math.floor(Math.random() * 150) + 1;
        avatarUrl = `https://i.pravatar.cc/${randomId}`;
        attempts++;
      }

      try {
        const newUser = await ctx.db
          .insert(users)
          .values({
            name,
            email,
            passwordHash,
            image: avatarUrl,
          })
          .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          });

        return {
          success: true,
          user: newUser[0],
          message: "Registration successful",
        };
      } catch (error) {
        console.error("Database error during registration:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating user",
        });
      }
    }),
});

async function checkImageAvailability(id: number) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`https://i.pravatar.cc/${id}`, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}
