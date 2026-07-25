const steps = [
  {
    number: "01",
    title: "Describe your idea",
    description:
      "Type what you want to build in plain English. No technical jargon required — just describe your vision.",
    icon: "💬",
  },
  {
    number: "02",
    title: "AI agents get to work",
    description:
      "Our team of AI agents plans the architecture, designs the UI, writes the code, and sets up the database — all autonomously.",
    icon: "🤖",
  },
  {
    number: "03",
    title: "Review & refine",
    description:
      "See your app come to life with a live preview. Iterate by chatting with the AI to add features or make changes.",
    icon: "👀",
  },
  {
    number: "04",
    title: "Deploy with one click",
    description:
      "Ship to production instantly. Get a live URL, custom domain, and automatic scaling — no DevOps needed.",
    icon: "🚀",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#0d0d0d] border-y border-[#1f1f1f]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
            How it works
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            From prompt to production in 4 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              <div className="p-6 rounded-2xl border border-[#1f1f1f] bg-[#131316] h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{step.icon}</span>
                  <span className="text-2xl font-bold text-zinc-700">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
