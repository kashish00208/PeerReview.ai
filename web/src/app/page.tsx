"use client";

import { useState, useEffect, useRef } from "react";

import { AgentState } from "../components/types";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<AgentState>({});
  const [error, setError] = useState("");
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.trace]);

  const handleRun = async () => {
    if (!url.trim()) {
      setError("Please enter an arXiv URL");
      return;
    }

    setError("");
    setLoading(true);
    setState({ trace: [] });

    try {
      const response = await fetch(
        `/api/agent/stream?paper_url=${encodeURIComponent(url)}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (!data || data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                setError(parsed.error);
              } else if (parsed && typeof parsed === "object") {
                setState((prev) => ({
                  ...prev,
                  ...parsed,
                  trace: [...(parsed.trace || prev.trace || [])],
                }));
              }
            } catch (err) {
              console.error("Failed to parse chunk:", data, err);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "success"
      ? "text-emerald-500"
      : status === "error"
        ? "text-red-500"
        : "text-yellow-500";
  };

  const getStatusIcon = (status: string) => {
    return status === "success" ? "●" : status === "error" ? "✕" : "⟳";
  };

  const sections = Array.isArray(state.extractedData?.sections)
    ? state.extractedData.sections
    : [];
  const equations = Array.isArray(state.extractedData?.equations)
    ? state.extractedData.equations
    : [];
  const tables = Array.isArray(state.extractedData?.tables)
    ? state.extractedData.tables
    : [];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-mono text-sm p-4 md:p-8">
      <div className="max-w-6xl mx-auto border border-neutral-800 rounded-lg bg-neutral-900 overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <span className="font-bold tracking-wider text-base">
            PAPER AGENT
          </span>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span
              className={`h-2.5 w-2.5 rounded-full ${loading ? "bg-yellow-500 animate-pulse" : "bg-emerald-500"} inline-block`}
            ></span>
            <span>{loading ? "Processing..." : "Ready"}</span>
          </div>
        </header>

        {/* URL Input Area */}
        <section className="p-6 border-b border-neutral-800 bg-neutral-950/40">
          <div className="border border-neutral-800 rounded-md p-4 bg-neutral-900/80">
            <label className="block text-xs text-neutral-400 mb-1">
              arXiv URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleRun()}
                placeholder="https://arxiv.org/abs/2401.xxxxx"
                disabled={loading}
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 disabled:opacity-50"
              />
              <button
                onClick={handleRun}
                disabled={loading}
                className="bg-neutral-100 text-neutral-950 font-medium px-5 py-2 rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "⟳" : "Run ▶"}
              </button>
            </div>
            {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
          {/* Left: Execution Logs */}
          <div className="lg:col-span-2 p-6 space-y-3 max-h-96 overflow-y-auto">
            <h2 className="text-xs font-semibold text-neutral-400 tracking-wider sticky top-0 bg-neutral-900 py-2">
              EXECUTION TRACE
            </h2>

            <div className="space-y-2">
              {state.trace && state.trace.length > 0 ? (
                state.trace.map((log, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(log.status)}>
                        {getStatusIcon(log.status)}
                      </span>
                      <span className="text-neutral-500 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="font-medium text-neutral-200">
                        {log.node}
                      </span>
                    </div>
                    <div className="pl-6 text-xs text-neutral-400">
                      {log.message}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-600">
                  Waiting for input...
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Right: Paper Details */}
          <div className="lg:col-span-3 p-6 space-y-6 max-h-96 overflow-y-auto">
            {state.paper ? (
              <>
                {/* Paper Metadata */}
                <div>
                  <h2 className="text-xs font-semibold text-neutral-400 tracking-wider mb-2">
                    PAPER
                  </h2>
                  <div className="text-base font-semibold text-neutral-100">
                    {state.paper.title || "Untitled"}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 pb-3 border-b border-neutral-800">
                    {state.paper.authors?.join(", ") || "Unknown authors"}
                  </p>
                </div>

                {/* Sections */}
                {sections.length > 0 && (
                  <div>
                    <h3 className="text-xs text-neutral-400 mb-2">
                      Sections ({sections.length})
                    </h3>
                    <div className="text-xs text-neutral-300 space-y-1 pl-1">
                      {sections.map((sec: string, idx: number) => (
                        <div key={idx}>
                          {idx === sections.length - 1 ? "└──" : "├──"} {sec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equations */}
                {equations.length > 0 && (
                  <div>
                    <h3 className="text-xs text-neutral-400 mb-2">
                      Equations ({equations.length})
                    </h3>
                    <div className="p-2 bg-neutral-950 border border-neutral-800 rounded text-xs text-neutral-200 whitespace-pre-wrap overflow-auto max-h-24">
                      {equations.slice(0, 1).join("\n\n")}
                    </div>
                  </div>
                )}

                {/* Tables */}
                {tables.length > 0 && (
                  <div>
                    <h3 className="text-xs text-neutral-400 mb-2">
                      Tables ({tables.length})
                    </h3>
                    <div className="overflow-x-auto border border-neutral-800 rounded text-xs max-h-24">
                      <table className="w-full text-left bg-neutral-950">
                        <thead className="border-b border-neutral-800 text-neutral-400">
                          <tr>
                            <th className="py-1 px-2">Table</th>
                            <th className="py-1 px-2">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                          {tables
                            .slice(0, 3)
                            .map(
                              (tbl: Record<string, unknown>, idx: number) => {
                                const tableName = String(
                                  typeof (tbl as Record<string, unknown>)
                                    ?.name === "string"
                                    ? (tbl as Record<string, unknown>).name
                                    : `Table ${idx + 1}`,
                                );
                                return (
                                  <tr key={idx}>
                                    <td className="py-1 px-2 text-neutral-300">
                                      {tableName}
                                    </td>
                                    <td className="py-1 px-2 text-neutral-400 text-xs">
                                      Data
                                    </td>
                                  </tr>
                                );
                              },
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-neutral-600 py-4">
                Submit a paper URL to begin analysis
              </div>
            )}
          </div>
        </section>

        {/* Bottom: Claims & Issues */}
        {((state.claims && state.claims.length > 0) ||
          (state.verifications && state.verifications.length > 0) ||
          (state.flaggedIssues && state.flaggedIssues.length > 0)) && (
          <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-800 border-t border-neutral-800">
            {/* Claims */}
            <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
              <h3 className="text-xs font-semibold text-neutral-400">
                CLAIMS ({state.claims?.length || 0})
              </h3>
              {state.claims?.map((claim) => (
                <div
                  key={claim.id}
                  className="text-xs border-l-2 border-blue-500 pl-2"
                >
                  <div className="text-neutral-300">{claim.text}</div>
                  <div className="text-neutral-500 text-xs">{claim.type}</div>
                </div>
              ))}
            </div>

            {/* Verifications */}
            <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
              <h3 className="text-xs font-semibold text-neutral-400">
                VERIFIED ({state.verifications?.length || 0})
              </h3>
              {state.verifications?.map((ver) => (
                <div key={ver.claimId} className="text-xs">
                  <div
                    className={
                      ver.status === "verified"
                        ? "text-emerald-400"
                        : ver.status === "failed"
                          ? "text-red-400"
                          : "text-neutral-400"
                    }
                  >
                    ✓ {ver.status}
                  </div>
                  {ver.claimedValue && (
                    <div className="text-neutral-500">
                      Claimed: {ver.claimedValue}
                    </div>
                  )}
                  {ver.computedValue && (
                    <div className="text-neutral-500">
                      Computed: {ver.computedValue}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Issues */}
            <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
              <h3 className="text-xs font-semibold text-neutral-400">
                ISSUES ({state.flaggedIssues?.length || 0})
              </h3>
              {state.flaggedIssues?.map((issue, idx) => (
                <div
                  key={idx}
                  className="text-xs text-red-400 border-l-2 border-red-500 pl-2"
                >
                  {issue}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
