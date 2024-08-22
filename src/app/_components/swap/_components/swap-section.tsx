"use client";

import { useCallback, useEffect } from "react";
import { REFRESH_INTERVAL, useTokenBalance } from "~/lib/hooks/useTokenBalance";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";
import { Skeleton } from "~components/ui/skeleton";
import CircularTimer from "./circular-timer";
import SelectToken from "./select-token";
import TokenRedirects from "./token-redirects";

type SwapSectionProps = {
  label: string;
  amount: string;
  setAmount: (amount: string) => void;
  token: TokenDataType | null;
  setToken: (token: TokenDataType | null) => void;
  otherTokenAddress?: string;
  tokens: TokenDataType[];
  loading: boolean;
  setError: (error: string | undefined) => void;
  isWalletConnected: boolean;
};

export default function SwapSection({
  label,
  amount,
  setAmount,
  token,
  setToken,
  otherTokenAddress,
  tokens,
  loading,
  setError,
  isWalletConnected,
}: SwapSectionProps) {
  const { balance, refreshCountdown } = useTokenBalance(token);

  const checkBalance = useCallback(() => {
    if (balance && label === "Swap from") {
      const numAmount = parseFloat(amount);
      const numBalance = parseFloat(balance.value);

      if (amount !== "") {
        if (isNaN(numAmount) || isNaN(numBalance)) {
          setError("Invalid amount or balance");
        } else if (numAmount > numBalance) {
          setError("Insufficient balance");
        } else {
          setError(undefined);
        }
      } else {
        setError(undefined);
      }
    }
  }, [amount, balance, label, setError]);

  useEffect(() => {
    checkBalance();
  }, [checkBalance, amount, balance, loading]);

  const renderInput = () => (
    <input
      type="text"
      inputMode="decimal"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      onBlur={checkBalance}
      placeholder="0"
      className="w-1/2 bg-transparent text-4xl outline-none"
      disabled={loading && label !== "Swap from"}
    />
  );

  return (
    <section className="space-y-3" aria-label={label}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg">{label}</h2>
        <div className="flex items-center gap-2">
          <TokenRedirects token={token} />
          <CircularTimer
            timeLeft={refreshCountdown}
            totalTime={REFRESH_INTERVAL}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        {loading && label !== "Swap from" ? (
          <Skeleton className="h-12 w-1/2" />
        ) : (
          renderInput()
        )}
        <SelectToken
          selectedToken={token}
          setSelectedToken={setToken}
          otherTokenAddress={otherTokenAddress}
          tokens={tokens}
        />
      </div>
      <div className="w-full">
        {isWalletConnected ? (
          balance ? (
            <div className="text-muted-foreground flex items-center justify-between">
              <h2>Balance: {Number(balance.value).toFixed(5)}</h2>
              <p>{Number(balance.usdValue).toFixed(5)}$</p>
            </div>
          ) : (
            <Skeleton className="h-6 w-full" />
          )
        ) : null}
      </div>
    </section>
  );
}
