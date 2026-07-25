import type { AgentStep } from "@/lib/generator";

const agentColors: Record<string, string> = {
  Architect: "from-blue-500 to-cyan-500",
  Designer: "from-purple-500 to-pink-500",
  Developer: "from-indigo-500 to-purple-500",
  Integration: "from-emerald-500 to-teal-500",
  QA: "from-amber-500 to-orange-500",
  DevOps: "from-rose-500 to-red-500",
};

const agentIcons: Record<string, string> = {
  Architect: "🏛️",
  Designer: "🎨",
  Developer: "💻",
  Integration: "🔗",
  QA: "🔍",
  DevOps: "🚀",
};

export function AgentTimeline({ agents }: { agents: AgentStep[] }) {
  return (
    <div className="border-b border-[#1f1f1f] p-3 bg-[#0d0d0d]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-medium text-zinc-400">AI Agents Working</span>
      </div>
      <div className="space-y-1.5">
        {agents.map((agent, i) => (
          <div
            key={agent.agent}
            className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all ${
              agent.status === "active" ? "bg-[#1a1a1f]" : ""
            }`}
          >
            <div className="relative">
              <div
                className={`w-6 h-6 rounded-md bg-gradient-to-br ${
                  agentColors[agent.agent] || "from-zinc-600 to-zinc-700"
                } flex items-center justify-center text-xs ${
                  agent.status === "pending" ? "opacity-40" : ""
                }`}
              >
                {agentIcons[agent.agent] || "⚙️"}
              </div>
              {agent.status === "active" && (
                <div className="absolute -inset-0.5 rounded-md border border-indigo-400 animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${
                    agent.status === "pending" ? "text-zinc-600" : "text-zinc-300"
                  }`}
                >
                  {agent.agent}
                </span>
                {agent.status === "active" && (
                  <span className="dot-typing flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                  </span>
                )}
                {agent.status === "done" && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <p
                className={`text-[10px] truncate ${
                  agent.status === "pending" ? "text-zinc-700" : "text-zinc-500"
                }`}
              >
                {agent.status === "pending" ? "Waiting..." : agent.description}
              </p>
            </div>
            {i < agents.length - 1 && (
              <div
                className={`w-px h-3 ${
                  agent.status === "done" ? "bg-green-500/30" : "bg-[#27272a]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
