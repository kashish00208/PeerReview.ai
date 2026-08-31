import { AgentStateType, TraceEvent } from "../../../lib/agent/state";
import { resolveArxivUrl } from "../../../lib/tools/arxiv";
import { extractDataFromURL } from "../../../lib/agent/nodes/parser";

export async function parserNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  const trace: TraceEvent[] = [
    {
      node: "parser",
      timestamp: Date.now(),
      message: "Resolve arXiv URL",
      status: "start",
    },
  ];

  try {
    const paperUrl = state.paper?.paperUrl?.trim();

    console.log("Parser received URL:", paperUrl);

    if (!paperUrl) {
      throw new Error("Missing paper URL");
    }

    const arxivUrl = await resolveArxivUrl(paperUrl);

    console.log("Resolved URL:", arxivUrl);

    const extracted = await extractDataFromURL(arxivUrl);

    trace.push({
      node: "parser",
      timestamp: Date.now(),
      message: "Extraction complete",
      status: "success",
    });

    return {
      extractedData: extracted,
      trace,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Parser failed";

    console.error("Parser error:", message);

    trace.push({
      node: "parser",
      timestamp: Date.now(),
      message,
      status: "error",
    });

    return { trace };
  }
}
