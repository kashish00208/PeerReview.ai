export interface TraceEvent {
  node: string;
  timestamp: number;
  message: string;
  status: 'start' | 'success' | 'error';
}

export interface ExtractedClaim {
  id: string;
  text: string;
  type: 'result' | 'method' | 'assumption' | 'equation';
  sourceSection?: string;
}

export interface VerificationResult {
  claimId: string;
  status: 'verified' | 'failed' | 'unverifiable';
  claimedValue?: string;
  computedValue?: string;
  sandboxLog?: string;
}

export interface CitationRef {
  title: string;
  arxivId?: string;
  relevance: string;
}

export interface AgentState {
  paper?: { title?: string; authors?: string[]; paperUrl?: string };
  extractedData?: Record<string, unknown>;
  claims?: ExtractedClaim[];
  verifications?: VerificationResult[];
  citations?: CitationRef[];
  flaggedIssues?: string[];
  trace?: TraceEvent[];
}
