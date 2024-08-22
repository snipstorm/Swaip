import { PublicKey } from "@solana/web3.js";
import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";

interface JupiterPriceResponse {
  // eslint-disable-next-line
  data: {
    [key: string]: {
      id: string;
      mintSymbol: string;
      vsToken: string;
      vsTokenSymbol: string;
      price: number;
    };
  };
}

export const getTokenPrice = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    const mintAddress = new PublicKey(input);
    const url = `https://price.jup.ag/v6/price?ids=${mintAddress.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const priceData: JupiterPriceResponse = await response.json();

      // eslint-disable-next-line
      if (!priceData.data || !priceData.data[mintAddress.toString()]) {
        throw new Error(
          `No price data found for token ${mintAddress.toString()}`,
        );
      }

      return priceData;
    } catch (error) {
      throw error;
    }
  });
