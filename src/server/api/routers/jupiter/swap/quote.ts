import { z } from "zod";
import { objectToUrlParams } from "~/lib/utils/object-to-url-params";
import { publicProcedure } from "~/server/api/trpc";
import { QuoteResponseSchema } from "./types/quote";

export const getQuote = publicProcedure
  .input(
    z.object({
      inputMint: z.string(),
      outputMint: z.string(),
      amount: z.string(),
      slippageBps: z.number(),
    }),
  )
  .output(QuoteResponseSchema)
  .mutation(async ({ input }) => {
    const params = {
      inputMint: input.inputMint,
      outputMint: input.outputMint,
      amount: input.amount,
      slippageBps: input.slippageBps,
      // platformFeeBps: 30,
    };

    const url = `https://quote-api.jup.ag/v6/quote?${objectToUrlParams(params)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const quoteResponse = await response.json();

      return quoteResponse;
    } catch (error) {
      throw error;
    }
  });
