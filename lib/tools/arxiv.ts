//Script that extract research paper data from URL
import { XMLParser } from "fast-xml-parser";
import prompt from "../tools/prompt";
import { generateFromPdf } from "../gemini";

export async function resolveArxivUrl(inputURL: string) {
  const arXivIdMatch = inputURL.match(
    /arxiv\.org\/(?:abs|pdf)\/([0-9]+\.[0-9]+(?:v[0-9]+)?)/i,
  );

  if (!arXivIdMatch) {
    if (inputURL.endsWith(".pdf")) return inputURL;
    throw new Error("Invalid arXiv URL Format");
  }

  const arxivID = arXivIdMatch[1];

  const apiUrl = `http://export.arxiv.org/api/query?id_list=${arxivID}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`arXiv API request failed: ${response.status}`);
  }
  const xmlData = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const parsed = parser.parse(xmlData);
  const entry = parsed.feed?.entry;

  if (!entry) {
    return `https://arxiv.org/pdf/${arxivID}.pdf`;
  }

  const links = Array.isArray(entry.link) ? entry.link : [entry.link];

  const pdfLink = links.find(
    (l: Record<string, string>) =>
      l["@_title"] === "pdf" || l["@_type"] === "application/pdf",
  );

  return pdfLink ? pdfLink["@_href"] : `https://arxiv.org/pdf/${arxivID}.pdf`;
}

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
