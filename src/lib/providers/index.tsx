"use client";

import type { PropsWithChildren } from "react";
import { Toaster } from "~components/ui/sonner";
import { TooltipProvider } from "~components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";
import WalletProvider from "./wallet";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      enableColorScheme={false}
    >
      <TooltipProvider>
        <Toaster />
        <WalletProvider>{children}</WalletProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
