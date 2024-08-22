"use client";

import { ArrowSquareOut } from "@phosphor-icons/react";
import Link from "next/link";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~components/ui/dropdown-menu";

type Props = {
  token: TokenDataType | null;
};

export default function TokenRedirects({ token }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ArrowSquareOut className="size-5 text-muted-foreground hover:text-muted-foreground/90" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link
            target="_blank"
            href={`https://solscan.io/token/${token?.address}`}
            className="w-full h-full"
          >
            Solscan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            target="_blank"
            href={`https://birdeye.so/token/${token?.address}?chain=solana`}
            className="w-full h-full"
          >
            Chart
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            target="_blank"
            href={`https://dexscreener.com/solana/${token?.address}`}
            className="w-full h-full"
          >
            Dexscreener
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
