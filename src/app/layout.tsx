import "~/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";

import { Suspense } from "react";
import Providers from "~/lib/providers";
import { TRPCReactProvider } from "~/trpc/react";
import Banner from "~components/banner";
import Navbar from "~components/navbar";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Swaip",
  description: "",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.className}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <Providers>
            <Suspense>
              <Banner />
              <div className="relative min-h-screen dark:bg-grid-white/[0.08] bg-grid-black/[0.08]">
                <Navbar />
                {children}
              </div>
            </Suspense>
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
