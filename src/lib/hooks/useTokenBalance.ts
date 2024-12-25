import { useConnection, useWallet } from "@jup-ag/wallet-adapter";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";
import { api } from "~/trpc/react";

type Balance = {
  value: string;
  usdValue: string;
};

const WRAPPED_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112",
);
export const REFRESH_INTERVAL = 30000; // 30 seconds

// TODO:

export function useTokenBalance(token: TokenDataType | null) {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [refreshCountdown, setRefreshCountdown] =
    useState<number>(REFRESH_INTERVAL);
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { mutateAsync: getJupiterPrice } =
    api.jupiter.tokens.getTokenPrice.useMutation();

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIdRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey || !token) {
      setBalance(null);
      return;
    }

    try {
      const mintAddress = new PublicKey(token.address);
      let balanceValue: number;
      let uiAmountString: string;

      if (token.address === WRAPPED_SOL_MINT.toString()) {
        const solBalance = await connection.getBalance(publicKey);
        balanceValue = solBalance / LAMPORTS_PER_SOL;
        uiAmountString = balanceValue.toString();
      } else {
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintAddress,
          publicKey,
        );
        const accountInfo = await connection.getAccountInfo(
          associatedTokenAddress,
        );

        if (!accountInfo) {
          setBalance({ value: "0", usdValue: "0" });
          return;
        }

        const balanceInfo = await connection.getTokenAccountBalance(
          associatedTokenAddress,
        );
        balanceValue = balanceInfo.value.uiAmount ?? 0;
        uiAmountString = balanceInfo.value.uiAmountString ?? "0";
      }

      const jupiterPrice = await getJupiterPrice(mintAddress.toString());
      const price = jupiterPrice.data[mintAddress.toString()]?.price ?? 0;
      const usdValue = balanceValue * price;

      setBalance({
        value: uiAmountString,
        usdValue: usdValue.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(null);
    }
  }, [publicKey, token, connection, getJupiterPrice]);

  const resetIntervals = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    if (countdownIdRef.current) {
      clearInterval(countdownIdRef.current);
    }

    fetchBalance(); // eslint-disable-line
    setRefreshCountdown(REFRESH_INTERVAL);

    intervalIdRef.current = setInterval(() => {
      fetchBalance(); // eslint-disable-line
      setRefreshCountdown(REFRESH_INTERVAL);
    }, REFRESH_INTERVAL);

    countdownIdRef.current = setInterval(() => {
      setRefreshCountdown((prev) => Math.max(0, prev - 1000));
    }, 1000);
  }, [fetchBalance]);

  useEffect(() => {
    resetIntervals();

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      if (countdownIdRef.current) clearInterval(countdownIdRef.current);
    };
  }, [token, resetIntervals]);

  return { balance, refreshCountdown };
}
