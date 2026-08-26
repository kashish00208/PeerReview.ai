import { PDFParse } from "pdf-parse";
import { extractDataFromURL, resolveArxivUrl } from "../lib/tools/arxiv";

async function main() {
  const urlpaper = await resolveArxivUrl("https://arxiv.org/abs/1706.03762");
  const dataofpaper = await extractDataFromURL(urlpaper)
  console.log(dataofpaper)
}

main().catch(console.error);
