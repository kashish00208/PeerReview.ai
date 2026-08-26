# PaperRefinery: Persistent Research Verification Platform

> Not another paper summarizer. PaperRefinery builds a living, cross-paper
> research graph — verifying claims in sandboxed code, catching contradictions
> between papers you've already read, and tracking outcomes over an entire project.

## The Problem
Researchers don't read one paper — they read 20, across weeks. Existing tools
(Elicit, SciSpace, Consensus) summarize each paper in isolation and forget it
the moment you close the tab. Nothing tracks whether Paper #14 contradicts
Paper #3, or whether the claimed results actually reproduce.

## What's Different
- **Persistent project graph** — every paper enriches one cumulative graph, not a one-off session
- **Cross-paper contradiction detection** — the Critic checks new claims against everything already ingested
- **Deterministic math verification** — claims are extracted into executable SymPy/NumPy scripts and run in an isolated sandbox
- **Outcome tracking** — claimed result → verified result → your synthesis note, queryable per project

## Architecture
                        [ User adds paper to a PROJECT ]
                                       │
                                       ▼
                           ┌───────────────────────┐
                           │   Supervisor Agent    │
                           │ (Plan & Model Router) │
                           └───────────┬───────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  Multimodal Parser    │    │  Citation Explorer   │    │   Math/Claim         │
│  (Gemini, chunk+OCR)  │    │  (arXiv/S2 lookup)   │    │   Verifier (E2B)     │
└──────────┬────────────┘    └──────────┬───────────┘    └──────────┬───────────┘
           └─────────────────────────────┼─────────────────────────────┘
                                         ▼
                           ┌───────────────────────┐
                           │  Outcome Extractor    │   claim → claimed result
                           └───────────┬───────────┘
                                       ▼
                           ┌───────────────────────┐
                           │  Entity Resolver       │   dedupe concepts/claims
                           │  (embed + match)       │   against PROJECT GRAPH
                           └───────────┬───────────┘
                                       ▼
                           ┌───────────────────────┐
                           │  Cross-Paper Critic    │   flags contradictions with
                           │  (contradiction check) │   already-ingested papers
                           └───────────┬───────────┘
                                       ▼
                           ┌───────────────────────┐
                           │  Trajectory Advisor    │   "you're missing a baseline
                           │  (gap detection)       │    comparison for X"
                           └───────────┬───────────┘
                                       ▼
                     [ Persistent Project Graph updates + Live UI Stream ]

## Data Model
Project    (id, name, created_at)
Paper      (id, project_id, title, authors, arxiv_id, status)
Concept    (id, project_id, name, embedding)              -- deduped across papers
Claim      (id, paper_id, concept_id, text, type)          -- result/method/assumption
Outcome    (id, claim_id, claimed_value, verified_value, verification_status, sandbox_log_ref)
Edge       (id, project_id, from_id, to_id, type)           -- cites | contradicts | builds_on | verifies

## Tech Stack
- Agent Orchestration: LangGraph (StateGraph, cyclic execution)
- LLM: Gemini 2.0/1.5 Pro & Flash, dynamic routing by task complexity
- Execution: E2B Code Interpreter (sandboxed Python)
- Storage: Postgres + pgvector (relational + embeddings, no separate graph DB)
- External APIs: arXiv, Semantic Scholar
- Frontend: Next.js, TypeScript, Tailwind, React Flow

## Roadmap
[phased plan above]