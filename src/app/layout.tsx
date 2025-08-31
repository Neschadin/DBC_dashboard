import "~/styles/globals.css";

import { Geist } from "next/font/google";
import { TRPCProvider } from "~/trpc/client";
import { HeroUIProvider, AuthSessionProvider } from "./_providers";
import { Navigation } from "./_components/Navigation";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "DBC App",
  description: "DBC App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-gradient-to-br from-gray-200 to-slate-400">
        <HeroUIProvider>
          <AuthSessionProvider>
            <TRPCProvider>
              <div className="flex h-screen flex-col">
                <Navigation />
                <div className="min-h-0 grow-1">{children}</div>
              </div>
            </TRPCProvider>
          </AuthSessionProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
