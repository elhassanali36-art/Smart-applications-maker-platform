const agents = [
  {
    name: "Architect",
    role: "System Design",
    description:
      "Analyzes requirements and designs the full system architecture — database schema, API structure, and component hierarchy.",
    color: "from-blue-500 to-cyan-500",
    icon: "🏛️",
  },
  {
    name: "Designer",
    role: "UI/UX",
    description:
      "Creates beautiful, responsive interfaces with a consistent design system, accessible components, and modern aesthetics.",
    color: "from-purple-500 to-pink-500",
    icon: "🎨",
  },
  {
    name: "Developer",
    role: "Full-Stack Code",
    description:
      "Writes production-grade frontend and backend code with TypeScript, React, Next.js, and proper API routes.",
    color: "from-indigo-500 to-purple-500",
    icon: "💻",
  },
  {
    name: "Integration",
    role: "Services & APIs",
    description:
      "Connects third-party services — authentication, payments, file uploads, and external APIs — seamlessly.",
    color: "from-emerald-500 to-teal-500",
    icon: "🔗",
  },
  {
    name: "QA",
    role: "Testing & Debugging",
    description:
      "Runs automated tests, catches bugs, and fixes issues autonomously. Your app works before you even see it.",
    color: "from-amber-500 to-orange-500",
    icon: "🔍",
  },
  {
    name: "DevOps",
    role: "Deployment",
    description:
      "Builds, optimizes, and deploys your app to a global CDN. SSL, custom domains, and automatic scaling included.",
    color: "from-rose-500 to-red-500",
    icon: "🚀",
  },
];

export function Agents() {
  return (
    <section id="agents" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
            AI Agents
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Meet your AI engineering team
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Six specialized agents work in concert to design, build, test, and
            deploy your application — no humans required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="group relative p-6 rounded-2xl border border-[#1f1f1f] bg-[#131316] hover:border-transparent transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              />
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl`}
                  >
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    <p className="text-xs text-zinc-500">{agent.role}</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {agent.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
