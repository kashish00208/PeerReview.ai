//Script that takes a local PDF or arXiv link, extracts text, and isolates 1 key equation or baseline metric table.
async function extractData(source: string) {
 const url =
  "http://export.arxiv.org/api/query?search_query=all:electron&start=0&max_results=1";

fetch(url)
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Error:", error);
  });
    
}
