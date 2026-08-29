//chunk PDF, multimodal extract (sections, equations, tables) via Gemini
import prompt from "../../tools/prompt";
import { generateFromPdf } from "../../gemini";
export async function extractDataFromURL(pdfLink: string) {
  const response = await fetch(pdfLink);

  if (!response.ok) {
    throw new Error(
      `Failed to download PDF: ${response.status} ${response.statusText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  if (!buffer.length) {
    throw new Error("Downloaded PDF is empty");
  }

  //Convert PDF to base64 for Gemini.

  const base64Pdf = buffer.toString("base64");

  const result = await generateFromPdf(prompt, base64Pdf);

  if (!result) {
    throw new Error("Gemini returned no extraction result");
  }


  const cleaned = result
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini returned invalid JSON:");
    console.error(result);

    throw new Error("Failed to parse Gemini PDF extraction response");
  }
}