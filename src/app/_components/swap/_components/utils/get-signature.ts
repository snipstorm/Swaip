import type { Transaction, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";

export function getSignature(
  transaction: Transaction | VersionedTransaction,
): string {
  let signature: Buffer | Uint8Array | null | undefined;

  if ("signature" in transaction) {
    signature = transaction.signature;
  } else if (transaction.signatures.length > 0) {
    signature = transaction.signatures[0];
  } else {
    throw new Error("Transaction has no signatures");
  }

  if (!signature) {
    throw new Error(
      "Missing transaction signature, the transaction was not signed by the fee payer",
    );
  }

  return bs58.encode(signature);
}
