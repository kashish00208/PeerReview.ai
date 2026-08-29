// lib/agent/graph.ts
import { StateGraph } from "@langchain/langgraph";
import { AgentState } from "./state";
import { parserNode } from "./../../app/api/papers/parse/route";

const graph = new StateGraph(AgentState)
  .addNode("parser", parserNode)
  .addEdge("__start__", "parser")
  .addEdge("parser", "__end__");

export const compiledGraph = graph.compile();