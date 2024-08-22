import { z } from "zod";
import { QuoteResponseSchema } from "./quote";

export const SwapTransactionInputSchema = z.object({
  userPublicKey: z.string(),
  wrapAndUnwrapSol: z.boolean().nullable().optional().default(true),
  useSharedAccounts: z.boolean().nullable().optional().default(true),
  feeAccount: z.string().nullable().optional(),
  trackingAccount: z.string().nullable().optional(),
  computeUnitPriceMicroLamports: z
    .union([z.number(), z.literal("auto")])
    .nullable()
    .optional(),
  prioritizationFeeLamports: z
    .union([
      z.number(),
      z.literal("auto"),
      z.object({ autoMultiplier: z.number() }),
      z.object({ jitoTipLamports: z.number() }),
      z.object({
        priorityLevelWithMaxLamports: z.object({
          priorityLevel: z.enum(["medium", "high", "veryHigh"]),
          maxLamports: z.number(),
        }),
      }),
    ])
    .nullable()
    .optional(),
  asLegacyTransaction: z.boolean().nullable().optional().default(false),
  useTokenLedger: z.boolean().nullable().optional().default(false),
  destinationTokenAccount: z.string().nullable().optional(),
  dynamicComputeUnitLimit: z.boolean().nullable().optional().default(false),
  skipUserAccountsRpcCalls: z.boolean().nullable().optional().default(false),
  quoteResponse: QuoteResponseSchema,
});

export const SwapTransactionResponseSchema = z.object({
  swapTransaction: z.string(),
  lastValidBlockHeight: z.number(),
  prioritizationFeeLamports: z.number().nullable().optional(),
});

export type SwapTransactionInputType = z.infer<
  typeof SwapTransactionInputSchema
>;

export type SwapTransactionResponseType = z.infer<
  typeof SwapTransactionResponseSchema
>;
