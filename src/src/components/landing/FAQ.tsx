"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is Smart Application Maker Platform really free?",
    a: "Yes! Smart Application Maker Platform is completely free with no subscription, no credit card, and no hidden fees. You can build and deploy unlimited projects at zero cost.",
  },
  {
    q: "What can I build with Smart Application Maker Platform?",
    a: "Almost anything! SaaS dashboards, e-commerce stores, social apps, booking platforms, internal tools, mobile-first web apps, and more. If you can describe it in plain English, Smart Application Maker Platform can build it.",
  },
  {
    q: "Do I need to know how to code?",
    a: "Not at all. Smart Application Maker Platform is designed for everyone — from non-technical founders to experienced developers. Just describe what you want in natural language and the AI handles the rest.",
  },
  {
    q: "Can I export my code?",
    a: "Absolutely. You own everything you build. Export the full source code anytime. There's no lock-in — your code is yours to take wherever you want.",
  },
  {
    q: "How does the AI agent team work?",
    a: "Six specialized AI agents — Architect, Designer, Developer, Integration, QA, and DevOps — work together autonomously. Each handles a different part of the development lifecycle, from planning to deployment.",
  },
  {
    q: "Can I modify my app after it's built?",
    a: "Yes! Just chat with the AI to add features, fix bugs, redesign UI, or make any changes. The agents will update your code and preview in real-time.",
  },
  {
    q: "What tech stack does Smart Application Maker Platform use?",
    a: "Smart Application Maker Platform generates apps using Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM — the same modern stack used by top startups and tech companies.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All projects are stored securely and you have full control. Authentication uses industry-standard protocols and your data is never shared.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 bg-[#0d0d0d] border-y border-[#1f1f1f]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#1f1f1f] bg-[#131316] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a1a1f] transition-colors"
              >
                <span className="font-medium text-sm md:text-base pr-4">
                  {faq.q}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
