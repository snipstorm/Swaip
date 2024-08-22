import { TRPCError } from "@trpc/server";
import { publicProcedure } from "~/server/api/trpc";
import {
  SwapTransactionInputSchema,
  SwapTransactionResponseSchema,
  type SwapTransactionResponseType,
} from "./types/transaction";

export const getTransaction = publicProcedure
  .input(SwapTransactionInputSchema)
  .output(SwapTransactionResponseSchema)
  .mutation(async ({ input }): Promise<SwapTransactionResponseType> => {
    try {
      const response = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch swap transaction",
        });
      }

      const res = await response.json();
      return res;
    } catch (error) {
      if (error instanceof Error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `An error occurred while processing the swap transaction: ${error.message}`,
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An unknown error occurred while processing the swap transaction",
      });
    }
  });
