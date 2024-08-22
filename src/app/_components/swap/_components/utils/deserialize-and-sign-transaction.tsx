import type { WalletContextState } from "@jup-ag/wallet-adapter";
import { type Connection, VersionedTransaction } from "@solana/web3.js";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { executeTransaction } from "./execute-transaction";
import { getSignature } from "./get-signature";

export const deserializeAndSignTransaction = async (
  swapTransaction: string,
  connection: Connection,
  wallet: WalletContextState,
  router: AppRouterInstance,
): Promise<string | undefined> => {
  try {
    if (!wallet.signTransaction) {
      throw new Error("Wallet does not support signing transactions");
    }

    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    const signed_transaction = await wallet.signTransaction(transaction);
    const signature = getSignature(signed_transaction);

    const {
      value: { err, logs },
    } = await connection.simulateTransaction(signed_transaction, {
      replaceRecentBlockhash: true,
      commitment: "processed",
    });

    if (err) {
      console.error("Simulation Error:", err);
      console.error("Logs:", logs);
      throw new Error("Transaction simulation failed");
    }

    await executeTransaction(signed_transaction, connection, router, signature);

    return signature;
  } catch (error) {
    console.error("Error in deserializeAndSignTransaction:", error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(
        "An unexpected error occurred while processing the transaction",
      );
    }
    return undefined;
  }
};
