// app/api/agent/run.ts
import { Request, Response } from "express";
import { compiledGraph } from "../../../../lib/agent/graph";
import { randomUUID } from "crypto";

const activeRuns = new Map<string, ReturnType<typeof compiledGraph.stream>>();

export async function RunAgent(req: Request, res: Response) {
  const { paper_url } = req.body;
  if (!paper_url) return res.status(400).json({ error: "paper_url is required" });

  const runId = randomUUID();
  const stream = compiledGraph.stream({
    paper: {
        arxivId: paper_url, title: "", authors: [],
        paperUrl: ""
    },
  });
  activeRuns.set(runId, stream);

  return res.status(200).json({ runId });
}