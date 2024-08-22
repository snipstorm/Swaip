"use client";

import { useWallet } from "@jup-ag/wallet-adapter";
import { ArrowsDownUp, Warning } from "@phosphor-icons/react";
import React, {
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { useDebouncedValue } from "~/lib/hooks/useDebouncedValue";
import { useTokens } from "~/lib/hooks/useTokens";
import { isEffectivelyZero } from "~/lib/utils/is-effectively-zero";
import { parseUnits } from "~/lib/utils/parse-units";
import type { QuoteResponseType } from "~/server/api/routers/jupiter/swap/types/quote";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";
import { api } from "~/trpc/react";
import { Button } from "~components/ui/button";
import SwapButton from "./_components/swap-button";
import SwapSection from "./_components/swap-section";
import SwapSectionSkeleton from "./_components/swap-section-skeleton";
import SwapSettings from "./_components/swap-settings";

type Props = {
  buyToken: TokenDataType | null;
  setBuyToken: React.Dispatch<SetStateAction<TokenDataType | null>>;
};

export default function Swap({ buyToken, setBuyToken }: Props) {
  const [slippageBps, setSlippageBps] = useState<number>(50);
  const [sellToken, setSellToken] = useState<TokenDataType | null>(null);
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [debouncedSellAmount] = useDebouncedValue(sellAmount, 500);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [sellError, setSellError] = useState<string | undefined>();
  const [buyError, setBuyError] = useState<string | undefined>();
  const [quoteResponse, setQuoteResponse] = useState<
    QuoteResponseType | undefined
  >(undefined);

  const wallet = useWallet();
  const { data: tokens, status } = useTokens();
  const { mutateAsync: getQuote } = api.jupiter.swap.getQuote.useMutation();

  useEffect(() => {
    if (tokens) {
      const defaultSellToken = tokens.find(
        (token) => token.symbol.toLowerCase() === "sol",
      );
      const defaultBuyToken = tokens.find(
        (token) => token.symbol.toLowerCase() === "usdt",
      );

      setSellToken(defaultSellToken ?? null);
      setBuyToken(defaultBuyToken ?? null);
    }
  }, [tokens]); // eslint-disable-line

  const fetchQuote = useCallback(async () => {
    if (
      !sellToken ||
      !buyToken ||
      !debouncedSellAmount ||
      isEffectivelyZero(debouncedSellAmount)
    ) {
      setBuyAmount("");
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const res = await getQuote({
        inputMint: sellToken.address,
        outputMint: buyToken.address,
        amount: parseUnits(debouncedSellAmount, sellToken.decimals).toString(),
        slippageBps,
      });

      setError(undefined);
      setBuyAmount(
        String(Number(res?.outAmount) / 10 ** buyToken.decimals) ?? "",
      );
      setQuoteResponse(res);
    } catch (error) {
      toast.error("Error fetching quote", {
        description: (error as Error).message,
      });
      setError("Failed to fetch quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSellAmount, sellToken, buyToken, getQuote, slippageBps]);

  useEffect(() => {
    if (!error && !sellError && !buyError) {
      fetchQuote(); // eslint-disable-line
    }
  }, [fetchQuote, error, sellError, buyError]);

  const handleSwapTokens = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setSellAmount(buyAmount);
    setBuyAmount(sellAmount);
    setSellError(buyError);
    setBuyError(sellError);
  };

  const isSwapDisabled =
    !sellToken ||
    !buyToken ||
    !sellAmount ||
    !buyAmount ||
    !wallet.connected ||
    !!error ||
    !!sellError ||
    !!buyError ||
    loading;

  const swapError = sellError ?? buyError ?? error;

  if (status === "failed") {
    return (
      <div
        role="alert"
        className="p-4 bg-card border border-destructive rounded-md shadow-md space-y-4"
      >
        <div className="flex items-center gap-4">
          <Warning className="size-10 text-destructive" />
          <div>
            <p className="font-bold text-destructive">Failed to load tokens</p>
            <p className="text-sm text-destructive">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
        <Button variant="destructive" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <main className="border w-full space-y-4 rounded-md bg-card p-6 text-card-foreground">
      <header className="relative flex w-full items-center justify-center">
        <h1 className="text-xl">Swap</h1>
        <SwapSettings
          slippageBps={slippageBps}
          setSlippageBps={setSlippageBps}
        />
      </header>

      {status === "fetched" && tokens ? (
        <SwapSection
          label="Swap from"
          amount={sellAmount}
          setAmount={setSellAmount}
          token={sellToken}
          setToken={setSellToken}
          otherTokenAddress={buyToken?.address}
          tokens={tokens}
          loading={loading}
          setError={setSellError}
          isWalletConnected={wallet.connected}
        />
      ) : (
        <SwapSectionSkeleton />
      )}

      <div className="relative flex w-full justify-end">
        <div className="absolute left-1/2 top-1/2 z-0 w-full -translate-x-1/2 -translate-y-1/2 border" />
        <Button
          size="icon"
          className="z-10 mr-4 rounded-full"
          aria-label="Change swap direction"
          onClick={handleSwapTokens}
        >
          <ArrowsDownUp className="size-5" />
        </Button>
      </div>

      {status === "fetched" && tokens ? (
        <SwapSection
          label="Swap to"
          amount={buyAmount}
          setAmount={setBuyAmount}
          token={buyToken}
          setToken={setBuyToken}
          otherTokenAddress={sellToken?.address}
          tokens={tokens}
          loading={loading}
          setError={setBuyError}
          isWalletConnected={wallet.connected}
        />
      ) : (
        <SwapSectionSkeleton />
      )}

      <SwapButton
        wallet={wallet}
        isDisabled={isSwapDisabled}
        error={swapError}
        quoteResponse={quoteResponse}
      />
    </main>
  );
}
