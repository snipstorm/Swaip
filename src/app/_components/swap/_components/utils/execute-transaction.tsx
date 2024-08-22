import type { Connection, VersionedTransaction } from "@solana/web3.js";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { transactionSenderAndConfirmationWaiter } from "./transaction-sender";

export const executeTransaction = async (
  transaction: VersionedTransaction,
  connection: Connection,
  router: AppRouterInstance,
  signature: string,
): Promise<void> => {
  try {
    const latestBlockHash = await connection.getLatestBlockhash();
    const serializedTransaction = transaction.serialize();

    const promise = transactionSenderAndConfirmationWaiter({
      connection,
      serializedTransaction,
      blockhashWithExpiryBlockHeight: latestBlockHash,
      sendOptions: {
        skipPreflight: true,
        maxRetries: 2,
      },
    });

    toast.promise(promise, {
      loading: "Confirming transaction...",
      success: () => {
        return "Transaction completed successfully!";
      },
      error: (err) => {
        console.error("Transaction error:", err);
        return "Transaction failed. Please try again.";
      },
      action: {
        label: "View on Explorer",
        onClick: () => router.push(`https://solscan.io/tx/${signature}`),
      },
    });
  } catch (error) {
    console.error("Error during transaction execution:", error);
    toast.error("Error during transaction execution", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
