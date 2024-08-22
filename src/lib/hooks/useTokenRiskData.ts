import { useConnection } from "@jup-ag/wallet-adapter";
import {
  PublicKey,
  type RpcResponseAndContext,
  type TokenAccountBalancePair,
  type TokenAmount,
} from "@solana/web3.js";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";
import { api } from "~/trpc/react";

export type TokenRiskDataType = {
  tokenPriceUsd: number | undefined;
  mintable: string;
  tokenSupply: TokenAmount;
  totalSupply: string | undefined;
  marketCap: number | null | undefined;
  topHolders: RpcResponseAndContext<TokenAccountBalancePair[]>;
  tradingVolume: number | null | undefined;
};

export const useTokenRiskData = () => {
  const { connection } = useConnection();
  const { mutateAsync: getJupiterPrice } =
    api.jupiter.tokens.getTokenPrice.useMutation();

  const fetchTokenRiskData = async (
    token: TokenDataType,
  ): Promise<TokenRiskDataType | null> => {
    try {
      const mint = new PublicKey(token.address);

      const tokenPriceUsd = await getJupiterPrice(token.address).then(
        (data) => data.data[token.address]?.price,
      );
      const mintable = token.mint_authority ? "Yes" : "No";
      const tokenSupply = (await connection.getTokenSupply(mint)).value;
      const totalSupply = tokenSupply.uiAmountString;
      const marketCap =
        tokenSupply.uiAmount &&
        tokenPriceUsd &&
        tokenSupply.uiAmount * tokenPriceUsd;
      const topHolders = await connection.getTokenLargestAccounts(mint);
      const tradingVolume = token.daily_volume;

      return {
        tokenPriceUsd,
        mintable,
        tokenSupply,
        totalSupply,
        marketCap,
        topHolders,
        tradingVolume,
      };
    } catch (error) {
      console.error("Error fetching token risk data:", error);
      throw error;
    }
  };

  return fetchTokenRiskData;
};
