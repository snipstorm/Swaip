import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { env } from "~/env";
import type { TokenRiskDataType } from "~/lib/hooks/useTokenRiskData";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";

const openai = createOpenAI({
  apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const model = openai("gpt-3.5-turbo-0125");

export class SwaipAI {
  async getRiskAssessment(data: TokenRiskDataType, token: TokenDataType) {
    const prompt = `Assess the risk of buying the following token without mentioning the source of this assessment:
    - Chain: Solana
    - Jupiter safety tags: ${token.tags.join(", ") || "N/A"}
    - Daily Volume: ${token.daily_volume ?? "N/A"}
    - Symbol & Name: ${token.symbol} | ${token.name}
    - Address: ${token.address ?? "N/A"}
    - Freeze Authority: ${token.freeze_authority ?? "N/A"}
    - Price (USD): ${data.tokenPriceUsd ?? "N/A"}
    - Market Cap: ${data.marketCap ?? "N/A"}
    - Total Supply: ${data.totalSupply ?? "N/A"}
    - Trading Volume: ${data.tradingVolume ?? "N/A"}
    - Mintable: ${data.mintable}

    Provide a concise risk assessment, including insights on the implications of the Jupiter safety tags and the risk data provided.
    Be like a teacher and explain to user step by step each risk`;

    console.log("Prompt:", prompt);

    const { textStream } = await streamText({
      model,
      prompt,
    });

    return textStream;
  }

  async respondToQuestion(
    question: string,
    data: TokenRiskDataType,
    token: TokenDataType,
  ) {
    const prompt = `Respond to the following question as Swaip AI, without mentioning your identity as an AI tool: ${question}.
    Token data: 
    - Chain: Solana
    - Jupiter safety tags: ${token.tags.join(", ") || "N/A"}
    - Daily Volume: ${token.daily_volume ?? "N/A"}
    - Symbol & Name: ${token.symbol} | ${token.name}
    - Address: ${token.address ?? "N/A"}
    - Freeze Authority: ${token.freeze_authority ?? "N/A"}
    - Price (USD): ${data.tokenPriceUsd ?? "N/A"}
    - Market Cap: ${data.marketCap ?? "N/A"}
    - Total Supply: ${data.totalSupply ?? "N/A"}
    - Trading Volume: ${data.tradingVolume ?? "N/A"}
    - Mintable: ${data.mintable}`;

    const { textStream } = await streamText({
      model,
      prompt,
    });

    return textStream;
  }
}
