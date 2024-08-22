import { z } from "zod";

export const TokenDataSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  logoURI: z.string(),
  tags: z.array(z.string()),
  daily_volume: z.number().nullable().optional(),
  freeze_authority: z.string().nullable().optional(),
  mint_authority: z.string().nullable().optional(),
});

export type TokenDataType = z.infer<typeof TokenDataSchema>;
