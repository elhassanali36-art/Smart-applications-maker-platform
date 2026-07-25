"use client";

import { useState } from "react";

const examples = [
  "A SaaS dashboard for managing invoices",
  "A mobile app for tracking workouts",
  "An e-commerce store with Stripe payments",
  "A real-time chat application",
  "A booking platform for appointments",
];

export function Hero() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), platform: "web" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create project");
      }
      const data = await res.json();
      if (!data.id) throw new Error("Invalid response from server");
      // Use window.location for reliable navigation
      window.location.href = `/app/${data.id}`;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Free forever — no subscription required
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-in">
          Build production-ready
          <br />
          apps through{" "}
          <span className="gradient-text">conversation</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto animate-fade-in">
          Chat with AI agents that design, code, and deploy your application
          from start to finish. No subscription. No credit card. Just build.
        </p>

        {/* Prompt input */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 max-w-2xl mx-auto animate-fade-in"
        >
          <div className="relative">
            <div className="relative bg-[#131316] border border-[#27272a] rounded-2xl p-2 flex items-end gap-2 shadow-2xl shadow-indigo-500/10">
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError("");
                }}
                placeholder="Describe the app you want to build..."
                rows={3}
                className="flex-1 bg-transparent resize-none outline-none px-4 py-3 text-sm placeholder:text-zinc-600 text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Building...
                  </>
                ) : (
                  <>
                    Build
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 animate-fade-in">
              {error}
            </div>
          )}

          {/* Example prompts */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setPrompt(ex);
                  setError("");
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-[#27272a] bg-[#131316] text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        </form>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            No signup required
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Full-stack code generation
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            One-click deploy
          </div>
        </div>
      </div>
    </section>
  );
}
