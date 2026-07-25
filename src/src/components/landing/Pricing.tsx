import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Free. Forever.
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            No subscription. No credit card. No hidden fees. Build and deploy
            unlimited apps — completely free.
          </p>
        </div>

        <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-transparent p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              100% Free
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-7xl md:text-8xl font-bold tracking-tight">
                $0
              </span>
              <span className="text-2xl text-zinc-400">/forever</span>
            </div>
            <p className="mt-4 text-zinc-400">
              Everything you need to build and ship production apps
            </p>

            <Link
              href="/app"
              className="inline-flex items-center gap-2 mt-8 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
            >
              Start building free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              {[
                "Unlimited projects",
                "Full-stack code generation",
                "AI agent team (6 agents)",
                "Real database & auth",
                "Live preview & one-click deploy",
                "Export code to GitHub",
                "No credit card required",
                "No rate limits",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-600 mt-8">
          Why free? Because great tools should be accessible to everyone.
          Smart Application Maker Platform is open-source at its core.
        </p>
      </div>
    </section>
  );
}
