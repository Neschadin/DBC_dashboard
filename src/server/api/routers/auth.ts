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

      const randomId = Math.floor(Math.random() * 150) + 1;
      const avatarUrl = `https://i.pravatar.cc/150?img=${randomId}`;

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

  // getMe: publicProcedure.query(async ({ ctx }) => {
  //   const session = ctx.session;
  //   if (!session?.user?.id) {
  //     return null;
  //   }

  //   const user = await ctx.db.query.users.findFirst({
  //     where: (users, { eq }) => eq(users.id, session.user.id),
  //     columns: {
  //       id: true,
  //       name: true,
  //       email: true,
  //       image: true,
  //     },
  //   });

  //   return user;
  // }),
});
