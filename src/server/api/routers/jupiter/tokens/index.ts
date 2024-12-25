import { TRPCError } from "@trpc/server";
import { publicProcedure } from "~/server/api/trpc";
import type { TokenDataType } from "./types";

export const getTokens = publicProcedure.query(async () => {
  try {
    const response = await fetch(
      `https://tokens.jup.ag/tokens/tradable?tags=verified,community,strict,lst,pump,clone,birdeye-trending`,
      {
        next: { tags: ["tokens"] },
        headers: {
          Referer: `https://${process.env.VERCEL_URL ?? "localhost:3000"}`,
          Origin: `https://${process.env.VERCEL_URL ?? "localhost:3000"}`,
        },
        cache: "force-cache",
      },
    );

    if (!response.ok) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching tokens.",
      });
    }

    // eslint-disable-next-line
    const data: TokenDataType[] = await response.json();

    data.sort((a, b) => (b.daily_volume ?? 0) - (a.daily_volume ?? 0));

    return data;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching tokens.",
    });
  }
});
