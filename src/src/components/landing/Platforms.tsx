const platforms = [
  {
    icon: "🌐",
    name: "Web App",
    description: "Responsive web applications with Next.js, TypeScript, and Tailwind CSS. Deploy to Vercel with one click.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    color: "from-blue-500 to-cyan-500",
    free: true,
  },
  {
    icon: "🪟",
    name: "Windows EXE",
    description: "Desktop applications for Windows using Electron and electron-builder. Full system access, native menus, and auto-updates.",
    tech: ["Electron", "electron-builder", "Next.js"],
    color: "from-indigo-500 to-purple-500",
    free: true,
  },
  {
    icon: "🤖",
    name: "Android APK",
    description: "Native Android apps using Capacitor. Access device features, push notifications, and Play Store distribution.",
    tech: ["Capacitor", "Android SDK", "Next.js"],
    color: "from-emerald-500 to-teal-500",
    free: true,
  },
  {
    icon: "🍎",
    name: "iOS App",
    description: "Native iOS apps using Capacitor. App Store distribution, Face ID, and Apple Pay integration available.",
    tech: ["Capacitor", "Xcode", "Next.js"],
    color: "from-zinc-500 to-zinc-700",
    free: true,
  },
];

export function Platforms() {
  return (
    <section id="platforms" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
            Multi-Platform
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            One prompt. Every platform.
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Build for Web, Windows, Android, and iOS — all from a single
            description. Choose your target and our AI agents handle the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="group relative rounded-2xl border border-[#1f1f1f] bg-[#131316] p-6 hover:border-indigo-500/50 transition-all hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-3xl mb-4`}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#1a1a1f] text-zinc-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.free && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    100% Free
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            All platforms use only open-source tools. No license fees, ever.
          </div>
        </div>
      </div>
    </section>
  );
}
