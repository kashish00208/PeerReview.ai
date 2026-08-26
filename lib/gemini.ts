// Gemini client configuration
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment");
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const MODELS = {
  flash: "gemini-2.5-flash", 
  pro: "gemini-2.5-pro",   
} as const;

export async function generateText(prompt: string, model: string = MODELS.flash) {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });
  return response.text;
}

export async function generateFromPdf(
  prompt: string,
  base64Pdf: string,
  model: string = MODELS.flash
) {
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "application/pdf", data: base64Pdf } },
        ],
      },
    ],
  });
  return response.text;
}