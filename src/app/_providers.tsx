"use client";

import { HeroUIProvider as BaseHeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export function HeroUIProvider({ children }: PropsWithChildren) {
  return <BaseHeroUIProvider>{children}</BaseHeroUIProvider>;
}

export function AuthSessionProvider({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
