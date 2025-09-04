// functions/src/index.ts
import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

// Helper to coerce/validate output
function normalizeResponse(anyObj: any) {
  const essentials = Array.isArray(anyObj?.["✅ Essentials"])
    ? anyObj["✅ Essentials"].map(String)
    : [];
  const wasteful = Array.isArray(anyObj?.["⚠️ Wasteful"])
    ? anyObj["⚠️ Wasteful"].map(String)
    : [];
  const analysis =
    typeof anyObj?.["📈 Overall Daily Analysis"] === "string"
      ? anyObj["📈 Overall Daily Analysis"]
      : "";
  let score = Number(anyObj?.["📊 Value Score"]);
  if (!Number.isFinite(score) || score < 0 || score > 100) score = 0;
  return { essentials, wasteful, analysis, score };
}

export const getFinancialFeedback = onCall(
  { secrets: [GEMINI_API_KEY], region: "us-west1" },
  async (request) => {
    try {
      const { cases, settings } = request.data || {};
      if (!Array.isArray(cases) || !settings) {
        throw new Error("Missing cases or settings");
      }

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value());

      const prompt = `
You are a highly creative financial wellness assistant, fully immersed in helping users build better spending habits. Analyze the following purchases, considering the context of each item, their price, category, and any notes provided. Evaluate whether each is a preplanned purchase or an impulse buy, and identify emotional purchase types, such as stress shopping, boredom buying, sadness/comfort spending, anger purchases, celebration splurging, tired/lazy spending, or loneliness shopping.

Your entire response must be exclusively the following JSON object, with no additional characters, text, code blocks, markdown, or explanations outside it. Be highly creative and immersive in the 'Overall Daily Analysis' text, using vivid, relatable language to make the emotional impact of wasteful spending personal and motivating, while strictly adhering to the specified format:

{
  \"✅ Essentials\": [\"list of essential purchase names including the price for each item\"],
  \"⚠️ Wasteful\": [\"list of wasteful purchase names including the price for each item\"],
  \"📈 Overall Daily Analysis\": \"summary text, referred to the user in first person (using 'I'). Start with positive notes about legitimate or essential spends. Then address the negatives, discussing in depth why each wasteful spend was wasteful, whether it was an impulse buy or emotional buy, and specify the type of emotional buy (e.g., FOMO, social pressure, stress shopping, boredom buying, sadness/comfort spending, anger purchases, celebration splurging, tired/lazy spending, loneliness shopping). Use vivid, relatable language to highlight how emotions hijacked my wallet and the real consequences (e.g., impact on a $2,000 monthly budget or $500 savings goal, assuming these unless specified). End with a motivational message to encourage improvement.\",
  \"📊 Value Score\": \"number between 0 and 100, where higher indicates more responsible purchases (essentials, preplanned, within budget) and lower indicates more wasteful purchases (impulse or emotional buys). Include the category in parentheses: Strategic (80-100), Controlled (60-79), Unsteady (40-59), Reckless(20-39), Critical (0-19)\"
}

Purchases Today:
${cases
  .map(
    (c: any, i: number) =>
      `${i + 1}. ${c.name} | Price: $${c.price} | Category: ${
        c.category
      } | Note: ${c.note}`
  )
  .join("\n")}
`;

      console.log("Prompt sent to Gemini:", prompt);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      let parsed: any;
      try {
        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();

        console.log("Raw Gemini output:", text);

        if (text.startsWith("```")) {
          text = text.replace(/```json\s*|\s*```/g, "").trim();
        }
        parsed = JSON.parse(text);
      } catch (parseError) {
        logger.warn("Gemini output not valid JSON. Returning raw text.", {
          error: parseError,
        });
        parsed = {
          "✅ Essentials": [],
          "⚠️ Wasteful": [],
          "📈 Overall Daily Analysis":
            "Unable to parse JSON from Gemini output",
          "📊 Value Score": 0,
        };
      }

      const normalized = normalizeResponse(parsed);

      return {
        feedback: `
Essentials: ${normalized.essentials.join("\n") || "None"}
Wasteful: ${normalized.wasteful.join("\n") || "None"}
Analysis: 
${normalized.analysis}

Score: ${normalized.score}/100
        `.trim(),
      };
    } catch (err: any) {
      logger.error("getFinancialFeedback failed:", err);
      throw new Error(
        "Failed to generate financial feedback. Check logs for details."
      );
    }
  }
);
