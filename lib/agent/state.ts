// lib/agent/state.ts
import { Annotation } from "@langchain/langgraph";

export interface PaperMeta {
  arxivId: string;
  title: string;
  authors: string[];
  pdfBase64: string;
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
  node: string;              // which agent node ran
  timestamp: number;
  message: string;           // human-readable status for the live feed
  status: "start" | "success" | "error";
}

export const AgentState = Annotation.Root({
  // input
  paper: Annotation<PaperMeta>,

  // parser output
  extractedText: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  claims: Annotation<ExtractedClaim[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  // verifier output
  verifications: Annotation<VerificationResult[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  // citation explorer output
  citations: Annotation<CitationRef[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  // critic output
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