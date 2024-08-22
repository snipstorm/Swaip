import { z } from "zod";

export const QuoteResponseSchema = z.object({
  inputMint: z.string(),
  inAmount: z.string(),
  outputMint: z.string(),
  outAmount: z.string(),
  otherAmountThreshold: z.string(),
  swapMode: z.enum(["ExactIn", "ExactOut"]),
  slippageBps: z.number(),
  platformFee: z
    .object({
      amount: z.string().nullable().optional(),
      feeBps: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
  priceImpactPct: z.string(),
  routePlan: z.array(
    z.object({
      swapInfo: z.object({
        ammKey: z.string(),
        label: z.string().nullable().optional(),
        inputMint: z.string(),
        outputMint: z.string(),
        inAmount: z.string(),
        outAmount: z.string(),
        feeAmount: z.string(),
        feeMint: z.string(),
      }),
      percent: z.number(),
    }),
  ),
  contextSlot: z.number().nullable().optional(),
  timeTaken: z.number().nullable().optional(),
});

export type QuoteResponseType = z.infer<typeof QuoteResponseSchema>;
