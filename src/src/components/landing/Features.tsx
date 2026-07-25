const features = [
  {
    icon: "⚡",
    title: "Instant Generation",
    description:
      "Describe your app in plain English and watch it come to life in seconds. No setup, no boilerplate — just your idea, realized.",
  },
  {
    icon: "🤖",
    title: "Autonomous AI Agents",
    description:
      "A team of specialized AI agents — architect, designer, developer, and DevOps — work together to build production-grade software.",
  },
  {
    icon: "📦",
    title: "Multi-Platform Output",
    description:
      "Generate Web, Windows EXE, Android APK, and iOS apps — all from a single prompt. Choose your target platform and build for it.",
  },
  {
    icon: "🗄️",
    title: "Real Databases",
    description:
      "Get a fully configured PostgreSQL database with schema, migrations, and ORM set up out of the box.",
  },
  {
    icon: "🔐",
    title: "Built-in Authentication",
    description:
      "Secure login, registration, and session management are automatically wired up with industry-standard protocols.",
  },
  {
    icon: "💳",
    title: "Payment Integration",
    description:
      "Accept payments instantly with Stripe integration. Subscriptions, one-time purchases, and invoicing — all configured.",
  },
  {
    icon: "🚀",
    title: "One-Click Deploy",
    description:
      "Deploy to a global CDN with a single click. Custom domains, SSL, and automatic rollbacks included.",
  },
  {
    icon: "🔄",
    title: "Iterate in Conversation",
    description:
      "Refine and extend your app by chatting with the AI. Add features, fix bugs, and redesign — all through natural language.",
  },
  {
    icon: "📱",
    title: "Responsive by Default",
    description:
      "Every app is mobile-first and responsive. Beautiful on desktop, tablet, and phone — no extra work needed.",
  },
  {
    icon: "🔧",
    title: "Export & Download",
    description:
      "Own everything you build. Download the full source code as a ZIP or export to GitHub anytime. No lock-in, ever.",
  },
  {
    icon: "💰",
    title: "100% Free Forever",
    description:
      "No subscription, no credit card, no hidden fees. All platforms — Web, EXE, APK, iOS — are completely free to generate and download.",
  },
  {
    icon: "⚙️",
    title: "Production-Grade Code",
    description:
      "Clean, maintainable TypeScript code with proper architecture, type safety, and best practices built in.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
            Features
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to ship
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            From idea to production — Smart Application Maker Platform handles the entire development
            lifecycle so you can focus on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-[#1f1f1f] bg-[#131316] hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
