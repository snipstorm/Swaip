"use client";

import {
  useConnection,
  useUnifiedWalletContext,
  type WalletContextState,
} from "@jup-ag/wallet-adapter";
import { CircleNotch } from "@phosphor-icons/react";
import type { Connection } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "~/lib/utils/cn";
import type { QuoteResponseType } from "~/server/api/routers/jupiter/swap/types/quote";
import { api } from "~/trpc/react";
import { Button } from "~components/ui/button";
import { deserializeAndSignTransaction } from "./utils/deserialize-and-sign-transaction";

type Props = {
  wallet: WalletContextState;
  isDisabled: boolean;
  error: string | undefined;
  quoteResponse: QuoteResponseType | undefined;
};

export default function SwapButton({
  wallet,
  isDisabled,
  error,
  quoteResponse,
}: Props) {
  const router = useRouter();
  const { connection } = useConnection();
  const connect = useUnifiedWalletContext();
  const [isSwapping, setIsSwapping] = useState(false);

  const { mutateAsync: getTransaction, isPending: isGettingTransaction } =
    api.jupiter.swap.getTransaction.useMutation();

  const handleSwap = async (connection: Connection) => {
    if (!quoteResponse || !wallet.publicKey) {
      toast.error("Quote response or wallet public key is undefined");
      return;
    }

    setIsSwapping(true);
    try {
      const swapParams = {
        quoteResponse,
        userPublicKey: wallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
        // TODO:
        // feeAccount: "5jTQn7nEiVxBc9wMeEYCowFWx4YEBUVYuH5Nt7PhBWVQ",
      };

      const { swapTransaction } = await getTransaction(swapParams);

      const signature = await deserializeAndSignTransaction(
        swapTransaction,
        connection,
        wallet,
        router,
      );

      if (signature) {
        toast.success("Swap successful!", {
          description: `Transaction signature: ${signature}`,
        });
      }
    } catch (error) {
      console.error("Error during swap:", error);
      if (error instanceof Error) {
        toast.error("Error during swap", {
          description: error.message,
        });
      } else {
        toast.error("An unexpected error occurred during the swap");
      }
    } finally {
      setIsSwapping(false);
    }
  };

  if (!wallet.connected || !wallet.publicKey) {
    return (
      <Button
        size="lg"
        variant="secondary"
        className={cn("w-full text-lg flex items-center gap-2", {
          "text-destructive": error,
        })}
        onClick={() => connect.setShowModal(true)}
      >
        {wallet.connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      variant="secondary"
      className={cn("w-full text-lg flex items-center gap-2", {
        "text-destructive": error,
      })}
      disabled={isDisabled || isGettingTransaction || isSwapping}
      aria-label="Swap"
      onClick={() => handleSwap(connection)}
    >
      {(isGettingTransaction || isSwapping) && (
        <CircleNotch className="size-6 animate-spin" />
      )}
      {error
        ? error
        : isSwapping
          ? "Swapping..."
          : wallet.connected
            ? "Swap"
            : "Connect Wallet"}
    </Button>
  );
}
