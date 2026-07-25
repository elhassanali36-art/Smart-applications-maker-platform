import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl border border-[#1f1f1f] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ready to build something
              <br />
              <span className="gradient-text">amazing?</span>
            </h2>
            <p className="mt-6 text-lg text-zinc-400 max-w-xl mx-auto">
              Join thousands of builders turning ideas into production-ready
              apps. Free forever, no subscription required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
              >
                Start building now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 border border-[#27272a] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#131316] transition-colors"
              >
                View projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
