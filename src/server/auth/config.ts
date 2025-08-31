import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { env } from "~/env";
import { db } from "~/server/db";
import { signInSchema } from "~/lib/zod";

import type { DefaultSession, NextAuthConfig } from "next-auth";
import { AuthError, ErrorCodes } from "~/lib/errors";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const CredentialsProvider = Credentials({
  name: "Credentials",
  credentials: {
    email: {},
    password: {},
  },

  async authorize(raw) {
    try {
      const parsed = signInSchema.safeParse(raw);

      if (!parsed.success) throw new AuthError(ErrorCodes.INVALID_SCHEMA);
      const { email, password } = parsed.data;

      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.email, email),
      });
      if (!user) throw new AuthError(ErrorCodes.INVALID_CREDENTIALS);

      const ok = await compare(password, user.passwordHash);
      if (!ok) throw new AuthError(ErrorCodes.INVALID_CREDENTIALS);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    } catch (error) {
      console.error("Error during authorization >>>", error);

      throw error instanceof AuthError
        ? error
        : new AuthError(ErrorCodes.UNEXPECTED_ERROR);
    }
  },
});

export const authConfig = {
  secret: env.AUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    generateSessionToken: () => crypto.randomUUID(),
  },

  providers: [CredentialsProvider],

  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
} satisfies NextAuthConfig;
