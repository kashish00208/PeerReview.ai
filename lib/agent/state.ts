// lib/agent/state.ts
import { Annotation } from "@langchain/langgraph";


export interface PaperMeta {
  arxivId:string
  paperUrl: string;        
  arxivUrl?: string;       
  title?: string;
  authors?: string[];
}

export interface ExtractedClaim {
  id: string;
  text: string;
  type: "result" | "method" | "assumption" | "equation";
  sourceSection?: string;
}

export interface VerificationResult {
  claimId: string;
  status: "verified" | "failed" | "unverifiable";
  claimedValue?: string;
  computedValue?: string;
  sandboxLog?: string;
}

export interface CitationRef {
  title: string;
  arxivId?: string;
  relevance: string;
}

export interface TraceEvent {
  node: string;
  timestamp: number;
  message: string;
  status: "start" | "success" | "error";
}

// Shared Graph State 

export const AgentState = Annotation.Root({
  // input — set once at graph entry, passed through untouched
  paper: Annotation<PaperMeta>,

  // raw output of extractDataFromURL — whatever shape your parser returns
  extractedData: Annotation<unknown>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  // structured claims pulled out of extractedData (populated in M3)
  claims: Annotation<ExtractedClaim[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  verifications: Annotation<VerificationResult[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  citations: Annotation<CitationRef[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  flaggedIssues: Annotation<string[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  // live execution trace — streamed to AgentExecutionFeed.tsx
  trace: Annotation<TraceEvent[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),
});

export type AgentStateType = typeof AgentState.State;