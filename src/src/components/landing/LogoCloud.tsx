export function LogoCloud() {
  const techs = [
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Tailwind",
    "Stripe",
    "GitHub",
    "Vercel",
    "React",
  ];
  return (
    <section className="py-12 border-y border-[#1f1f1f] bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm text-zinc-600 mb-8 uppercase tracking-wider">
          Powered by the tools you already love
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {techs.map((tech) => (
            <span
              key={tech}
              className="text-xl font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
