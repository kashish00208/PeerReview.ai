//Script that takes a local PDF or arXiv link, extracts text, and isolates 1 key equation or baseline metric table.
export async function extractPaper(paper_url:string) {
    const url = paper_url;
    console.log("Paper Url : ",url)

    const response = fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({url})
    })
    console.log("Response of raw PDF line : " , response )
}

