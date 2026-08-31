// app/api/agent/stream.ts
import { Request, Response } from "express";
import { compiledGraph } from "../../../lib/agent/graph";

export async function StreamAgent(req: Request, res: Response) {
  let { paper_url } = req.query;

  // Handle both query string and body
  if (!paper_url && req.body?.paper_url) {
    paper_url = req.body.paper_url;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    // Validate paper_url is provided
    if (!paper_url) {
      res.write(`data: ${JSON.stringify({ error: "Missing required parameter: paper_url" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    const paperUrlStr = paper_url.toString().trim();

    const stream = compiledGraph.stream(
      {
        paper: {
          paperUrl: paperUrlStr,
          arxivId: paperUrlStr,
          title: "",
          authors: [],
        },
      },
      { streamMode: "values" }
    );

    for await (const chunk of await stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
}
