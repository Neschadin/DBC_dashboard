"use client";

import { HeroUIProvider as BaseHeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export function HeroUIProvider({ children }: PropsWithChildren) {
  return (
    <BaseHeroUIProvider>
      <ToastProvider />
      {children}
    </BaseHeroUIProvider>
  );
}

export function AuthSessionProvider({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
