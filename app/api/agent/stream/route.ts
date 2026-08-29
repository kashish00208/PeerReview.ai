// app/api/agent/stream.ts
import { Request, Response } from "express";
import { compiledGraph } from "../../../lib/agent/graph";

export async function StreamAgent(req: Request, res: Response) {
  const { paper_url } = req.query;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = await compiledGraph.stream({
    paper: { arxivId: paper_url as string, title: "", authors: [], pdfBase64: "" },
  });

  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }

  res.end();
}