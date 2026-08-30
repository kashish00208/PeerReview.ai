export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-mono text-sm p-4 md:p-8">
      {/* Outer Card Container */}
      <div className="max-w-5xl mx-auto border border-neutral-800 rounded-lg bg-neutral-900 overflow-hidden shadow-2xl">
        
        {/* Section 1: Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <span className="font-bold tracking-wider text-base">PAPER AGENT</span>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            <span>Agent Online</span>
          </div>
        </header>

        {/* Section 2: URL Input Area */}
        <section className="p-6 border-b border-neutral-800 bg-neutral-950/40">
          <div className="border border-neutral-800 rounded-md p-4 bg-neutral-900/80">
            <label className="block text-xs text-neutral-400 mb-1">arXiv URL</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="https://arxiv.org/abs/2401.xxxxx"
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
              />
              <button className="bg-neutral-100 text-neutral-950 font-medium px-5 py-2 rounded hover:bg-neutral-200 transition-colors">
                Run ▶
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Agent Output Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
          
          {/* Left Column: Agent Execution Logs */}
          <div className="md:col-span-5 p-6 space-y-5">
            <h2 className="text-xs font-semibold text-neutral-400 tracking-wider">
              AGENT EXECUTION
            </h2>

            <div className="space-y-4">
              {/* Log Item: Completed */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">●</span>
                  <span className="text-neutral-500 text-xs">12:41:03</span>
                  <span className="font-medium text-neutral-200">Fetch Paper</span>
                </div>
                <div className="pl-6 text-xs text-emerald-400 font-sans">✓ completed</div>
              </div>

              {/* Log Item: In Progress */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 animate-pulse">●</span>
                  <span className="text-neutral-500 text-xs">12:41:04</span>
                  <span className="font-medium text-neutral-200">Parse PDF</span>
                </div>
                <div className="pl-6 text-xs text-yellow-400 font-sans">⟳ Gemini extracting...</div>
              </div>

              {/* Log Item: Processing */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 animate-pulse">●</span>
                  <span className="text-neutral-500 text-xs">12:41:08</span>
                  <span className="font-medium text-neutral-200">Extract sections</span>
                </div>
                <div className="pl-6 text-xs text-yellow-400 font-sans">⟳ processing chunks 3/8</div>
              </div>

              {/* Log Item: Waiting */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600">○</span>
                  <span className="text-neutral-600 text-xs">12:41:12</span>
                  <span className="text-neutral-400">Extract Claims</span>
                </div>
                <div className="pl-6 text-xs text-neutral-500 font-sans">waiting...</div>
              </div>

              {/* Log Item: Pending */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">○</span>
                <span className="text-neutral-600 text-xs">12:41:15</span>
                <span className="text-neutral-400">Done</span>
              </div>
            </div>
          </div>

          {/* Right Column: Paper Details */}
          <div className="md:col-span-7 p-6 space-y-6">
            <div>
              <h2 className="text-xs font-semibold text-neutral-400 tracking-wider mb-2">
                PAPER
              </h2>
              <div className="text-base font-semibold text-neutral-100">
                Attention Is All You Need
              </div>
              <p className="text-xs text-neutral-400 mt-1 pb-3 border-b border-neutral-800">
                Authors: Vaswani et al.
              </p>
            </div>

            {/* Sections Tree */}
            <div>
              <h3 className="text-xs text-neutral-400 mb-2">Sections</h3>
              <div className="text-xs text-neutral-300 space-y-1 pl-1">
                <div>├── Abstract</div>
                <div>├── 1 Introduction</div>
                <div>├── 2 Background</div>
                <div>├── 3 Model Architecture</div>
                <div>└── 4 Experiments</div>
              </div>
            </div>

            {/* Equations Box */}
            <div>
              <h3 className="text-xs text-neutral-400 mb-2">Equations</h3>
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded text-xs text-neutral-200">
                Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V
              </div>
            </div>

            {/* Tables Preview */}
            <div>
              <h3 className="text-xs text-neutral-400 mb-2">Tables</h3>
              <div className="overflow-x-auto border border-neutral-800 rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400">
                    <tr>
                      <th className="py-2 px-3">Model</th>
                      <th className="py-2 px-3">BLEU</th>
                      <th className="py-2 px-3">...</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    <tr>
                      <td className="py-2 px-3 text-neutral-300">Base</td>
                      <td className="py-2 px-3 text-neutral-300">27.3</td>
                      <td className="py-2 px-3 text-neutral-300">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}