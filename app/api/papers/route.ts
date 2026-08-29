import { Request, Response } from "express";
import { resolveArxivUrl } from "../../../lib/tools/arxiv";
import { extractDataFromURL } from "../../../lib/agent/parser";

export async function ParsePaper(req: Request, res: Response) {
    try {
        const { paper_url } = req.body;

        if (!paper_url || typeof paper_url !== "string") {
            return res.status(400).json({
                error: "paper_url is required and must be a string",
            });
        }

        const arxivUrl = await resolveArxivUrl(paper_url);
        const response = await extractDataFromURL(arxivUrl);

        return res.status(200).json(response);
    } catch (error) {
        console.error("Failed to parse paper:", error);

        return res.status(500).json({
            error: "Failed to parse paper",
        });
    }
}

export default ParsePaper;
