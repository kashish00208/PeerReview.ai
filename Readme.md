# PaperRefinery: Autonomous Academic Research & Verification Swarm

> An adversarial, multi-agent research engine that automates literature reviews, traces prerequisite citation graphs, and mathematically audits paper claims in isolated execution sandboxes.

---

## Target Category

- **Primary:** Productivity & Intelligent Assistants / Enterprise & ML Applications
- **Specialty:** Best Multi-Agent System & Dynamic Tool Orchestration

---

## System Architecture

                            [ User Query / DOI / ArXiv Link ]
                                             │
                                             ▼
                                 ┌───────────────────────┐
                                 │   Supervisor Agent    │
                                 │ (Plan & Model Router) │
                                 └───────────┬───────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
    ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
    │  Multimodal Vision   │      │   Citation Graph     │      │   Symbolic Math &    │
    │    & Document Parser │      │    Explorer Agent    │      │    Claim Verifier    │
    └──────────┬───────────┘      └──────────┬───────────┘      └──────────┬───────────┘
               │                             │                             │
               │ • Chunk & OCR Tables/Charts │ • ArXiv / Semantic Scholar  │ • SymPy Equation Extr.
               │ • Gemini 1.5/2.0 Pro        │ • Prerequisite Mapping      │ • Claims vs. Metrics
               │                             │                             │
               └─────────────────────────────┼─────────────────────────────┘
                                             │
                                             ▼
                                 ┌───────────────────────┐
                                 │ Python Code Sandbox   │
                                 │ (E2B / Pyodide Runtime)│
                                 └───────────┬───────────┘
                                             │ (Execution Logs / Stdout)
                                             ▼
                                 ┌───────────────────────┐
                                 │  Adversarial Critic   │
                                 │ (Hallucination Audit) │
                                 └───────────┬───────────┘
                                             │
                                             ▼
                                 [ Live Observability UI ]
                            (Annotated PDF + Real-time DAG Stream)

## Key Features

- **Dynamic Model-Aware Routing:** The Supervisor analyzes task complexity and context length—routing dense visual charts to multimodal large-context models (Gemini Pro), algebraic proofs to reasoning models, and quick summarizations to fast local/flash models.
- **Deterministic Math Sandbox:** Extracts formulas and tabular baselines into executable SymPy/NumPy scripts, running them in an isolated sandbox to detect math discrepancies and unreproducible claims.
- **Autonomous Citation Prerequisite Tree:** Scrapes references via the arXiv API, building an interactive knowledge graph that explains prerequisite concepts required to understand complex sections.
- **Adversarial Red-Teaming:** A Critic Agent audits the Synthesizer's output against actual paper excerpts before displaying it to the user.
- **Real-time Observability Panel:** Streams the internal agent state graph, tool calls, model transitions, and code outputs in real time.

---

## Tech Stack

- **Agent Orchestration:** LangGraph (StateGraph, Cyclic Execution Loops)
- **LLM Layer:** Google Gemini 2.0 / 1.5 Pro & Flash (Tool-calling & Long-context Multimodal)
- **Execution Environment:** E2B Code Interpreter / Sandboxed Python
- **External APIs:** ArXiv API, Semantic Scholar API
- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Flow (DAG visualizer)

---
