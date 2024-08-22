"use client";

import { useState } from "react";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";
import AI from "~components/ai";
import Swap from "~components/swap";

export default function Home() {
  const [buyToken, setBuyToken] = useState<TokenDataType | null>(null);

  return (
    <div className="md:h-[calc(100vh-160px)] flex items-center justify-center max-md:py-12">
      <section
        className="w-full z-10 max-w-5xl grid gap-4 md:grid-cols-2 px-4"
        aria-label="Token Swap Interface"
      >
        <AI token={buyToken} />
        <Swap buyToken={buyToken} setBuyToken={setBuyToken} />
      </section>
      {/* Background corner dim */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  );
}
