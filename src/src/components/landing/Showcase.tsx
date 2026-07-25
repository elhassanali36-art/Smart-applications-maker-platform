const examples = [
  {
    title: "SaaS Dashboard",
    description: "Analytics dashboard with auth, billing, and charts",
    prompt: "A SaaS analytics dashboard where users can sign up, view charts, and manage subscriptions with Stripe",
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "E-commerce Store",
    description: "Full online store with cart, checkout, and inventory",
    prompt: "An e-commerce store with product listings, shopping cart, Stripe checkout, and order management",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Social App",
    description: "Real-time social platform with posts and messaging",
    prompt: "A social media app where users can create posts, follow others, and chat in real-time",
    color: "from-pink-500 to-rose-600",
  },
  {
    title: "Booking Platform",
    description: "Appointment scheduling with calendar and payments",
    prompt: "A booking platform where users can schedule appointments, pay deposits, and get email reminders",
    color: "from-amber-500 to-orange-600",
  },
];

export function Showcase() {
  return (
    <section className="py-24 px-6 bg-[#0d0d0d] border-y border-[#1f1f1f]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
            Showcase
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Build anything you can imagine
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            From SaaS dashboards to social apps — if you can describe it,
            Smart Application Maker Platform can build it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((ex) => (
            <div
              key={ex.title}
              className="group relative rounded-2xl border border-[#1f1f1f] bg-[#131316] overflow-hidden hover:border-indigo-500/50 transition-all"
            >
              <div className={`h-40 bg-gradient-to-br ${ex.color} relative`}>
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1">{ex.title}</h3>
                <p className="text-sm text-zinc-400 mb-3">{ex.description}</p>
                <p className="text-xs text-zinc-600 font-mono">
                  "{ex.prompt}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
