import {
  type BlockhashWithExpiryBlockHeight,
  type Connection,
  type SendOptions,
  TransactionExpiredBlockheightExceededError,
  type VersionedTransactionResponse,
} from "@solana/web3.js";
import promiseRetry from "promise-retry";
import { wait } from "./wait";

type TransactionSenderAndConfirmationWaiterArgs = {
  connection: Connection;
  serializedTransaction: Uint8Array;
  blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
  sendOptions: SendOptions;
};

export async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
  blockhashWithExpiryBlockHeight,
  sendOptions,
}: TransactionSenderAndConfirmationWaiterArgs): Promise<VersionedTransactionResponse | null> {
  const txid = await connection.sendRawTransaction(
    serializedTransaction,
    sendOptions,
  );

  const controller = new AbortController();
  const abortSignal = controller.signal;

  // Background resender function
  const abortableResender = async () => {
    while (true) {
      await wait(2_000);
      if (abortSignal.aborted) return;
      try {
        await connection.sendRawTransaction(serializedTransaction, sendOptions);
      } catch (e) {
        console.warn("Failed to resend transaction:", e);
      }
    }
  };

  try {
    // Start the background resender (intentionally not awaited)
    abortableResender(); // eslint-disable-line

    const lastValidBlockHeight =
      blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

    // Race between WebSocket confirmation and manual polling
    await Promise.race([
      connection.confirmTransaction(
        {
          ...blockhashWithExpiryBlockHeight,
          lastValidBlockHeight,
          signature: txid,
          abortSignal,
        },
        "confirmed",
      ),
      (async () => {
        while (!abortSignal.aborted) {
          await wait(2_000);
          const tx = await connection.getSignatureStatus(txid, {
            searchTransactionHistory: false,
          });
          if (tx?.value?.confirmationStatus === "confirmed") {
            return tx;
          }
        }
      })(),
    ]);
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      console.warn("Transaction expired:", e);
      return null;
    } else {
      console.error("Error confirming transaction:", e);
      throw e;
    }
  } finally {
    controller.abort();
  }

  // Retry mechanism for fetching confirmed transaction
  const response = await promiseRetry(
    async (retry, attempt) => {
      console.log(`Attempting to fetch transaction (attempt ${attempt})...`);
      const response = await connection.getTransaction(txid, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (!response) {
        retry(new Error("Transaction not found"));
      }
      return response;
    },
    {
      retries: 5,
      minTimeout: 1000,
      factor: 2,
    },
  );

  return response;
}
