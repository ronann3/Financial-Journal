// functions/src/index.ts
import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

// Helper to coerce/validate output
function normalizeResponse(anyObj: any) {
  const essentials = Array.isArray(anyObj?.essentials)
    ? anyObj.essentials.map(String)
    : [];
  const wasteful = Array.isArray(anyObj?.wasteful)
    ? anyObj.wasteful.map(String)
    : [];
  const analysis = typeof anyObj?.analysis === "string" ? anyObj.analysis : "";
  let score = Number(anyObj?.score);
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
You are a financial wellness assistant. Analyze the following purchases. 
Return ONLY valid JSON in this exact format (no extra text or explanations):

{
  "essentials": ["list of essential purchase names"],
  "wasteful": ["list of wasteful purchase names"],
  "analysis": "summary text",
  "score": 0-100
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
        const text = result.response.text().trim();

        console.log("Raw Gemini output:", text);

        parsed = JSON.parse(text);
      } catch (parseError) {
        logger.warn("Gemini output not valid JSON. Returning raw text.", {
          error: parseError,
        });
        parsed = {
          essentials: [],
          wasteful: [],
          analysis: "Unable to parse JSON from Gemini output",
          score: 0,
        };
      }

      const normalized = normalizeResponse(parsed);

      return {
        feedback: `
Essentials: ${normalized.essentials.join(", ") || "None"}
Wasteful: ${normalized.wasteful.join(", ") || "None"}
Analysis: ${normalized.analysis}
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
