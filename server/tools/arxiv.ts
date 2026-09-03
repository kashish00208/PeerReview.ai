//Script that extract research paper data from URL
import { XMLParser } from "fast-xml-parser";

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

