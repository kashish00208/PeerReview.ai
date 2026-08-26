import { XMLParser } from "fast-xml-parser";

//Script that takes a local PDF or arXiv link, extracts text, and isolates 1 key equation or baseline metric table.
async function resolveArxivUrl(inputURL: string)  {
  console.log("Here we are ")
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
  const xmlData = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const parsed = parser.parse(xmlData);

  const entry = parsed.feed?.entry;
  if (!entry) {
    // Fallback directly to pdf url pattern if feed response is empty
    return `https://arxiv.org/pdf/${arxivID}.pdf`;
  }

  // Find PDF link from atom feed links
  const links = Array.isArray(entry.link) ? entry.link : [entry.link];
  const pdfLink = links.find(
    (l: Record<string, string>) =>
      l["@_title"] === "pdf" || l["@_type"] === "application/pdf",
  );

  return pdfLink ? pdfLink["@_href"] : `https://arxiv.org/pdf/${arxivID}.pdf`;
}

export default resolveArxivUrl