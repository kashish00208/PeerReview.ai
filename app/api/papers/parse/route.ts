import { AgentStateType, TraceEvent } from "../../../../lib/agent/state";
import { resolveArxivUrl } from "../../../../lib/tools/arxiv";
import { extractDataFromURL } from "../../../../lib/agent/nodes/parser";


export async function parserNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  const trace: TraceEvent[] = [
    {
      node: "parser",
      timestamp: Date.now(),
      message: "resolve arxiv URL",
      status: "start",
    },
  ];
  try {
    const arxivUrl = await resolveArxivUrl(state.paper.arxivId);
    const extracted = await extractDataFromURL(arxivUrl);

    trace.push({
      node: "parser",
      timestamp: Date.now(),
      message: "Extraction complete",
      status: "success",
    });

    return {
      extractedData: JSON.stringify(extracted),
      trace,
    };
  } catch (err) {
    trace.push({
      node: "parser",
      timestamp: Date.now(),
      message: err instanceof Error ? err.message : "Parser failed",
      status: "error",
    });
    return { trace };
  }
}
