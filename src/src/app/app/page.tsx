"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { PLATFORM_INFO } from "@/lib/generator";
import type { Platform } from "@/lib/generator";

const suggestions = [
  {
    icon: "📊",
    title: "SaaS Dashboard",
    prompt: "A SaaS analytics dashboard with user authentication, Stripe subscriptions, and data visualization charts",
  },
  {
    icon: "🛒",
    title: "E-commerce Store",
    prompt: "An e-commerce store with product catalog, shopping cart, Stripe checkout, and order management",
  },
  {
    icon: "💬",
    title: "Chat Application",
    prompt: "A real-time chat application with user accounts, direct messages, and group channels",
  },
  {
    icon: "📅",
    title: "Booking Platform",
    prompt: "A booking platform where users can schedule appointments, pay deposits, and receive email reminders",
  },
  {
    icon: "📝",
    title: "Task Manager",
    prompt: "A task management app with boards, drag-and-drop cards, team collaboration, and deadlines",
  },
  {
    icon: "🎓",
    title: "Learning Platform",
    prompt: "An online learning platform with video courses, quizzes, progress tracking, and certificates",
  },
];

const platforms: Platform[] = ["web", "exe", "apk", "ios"];

export default function AppBuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState<Platform>("web");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), platform }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create project");
      }
      const data = await res.json();
      if (!data.id) throw new Error("Invalid response from server");
      window.location.href = `/app/${data.id}`;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI Agents Ready • 100% Free
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              What do you want to build?
            </h1>
            <p className="mt-3 text-zinc-400">
              Describe your app in plain English. Our AI agents will design,
              code, and deploy it for you.
            </p>
          </div>

          {/* Platform selector */}
          <div className="mb-6">
            <p className="text-xs text-zinc-500 mb-2 text-center uppercase tracking-wider">
              Choose your target platform
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {platforms.map((p) => {
                const info = PLATFORM_INFO[p];
                const isActive = platform === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      isActive
                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                        : "border-[#1f1f1f] bg-[#131316] text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    <div className="text-2xl mb-1">{info.icon}</div>
                    <div className="text-xs font-medium">{info.label}</div>
                    <div className="text-[10px] text-zinc-600 mt-0.5 leading-tight">
                      {info.description}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-zinc-600 text-center mt-2">
              💚 All platforms are 100% free — no subscription, no hidden fees
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative bg-[#131316] border border-[#27272a] rounded-2xl p-3 flex items-end gap-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A recipe sharing app where users can post recipes, follow chefs, and save favorites..."
                  rows={4}
                  className="flex-1 bg-transparent resize-none outline-none px-3 py-2 text-sm placeholder:text-zinc-600"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
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
            <p className="mt-2 text-xs text-zinc-600 text-center">
              Press Enter to build • Shift + Enter for new line
            </p>
            {error && (
              <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-center">
                {error}
              </div>
            )}
          </form>

          <div className="mt-10">
            <p className="text-sm text-zinc-500 mb-4 text-center">
              Or start with a template
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestions.map((s) => (
                <button
                  key={s.title}
                  onClick={() => setPrompt(s.prompt)}
                  className="text-left p-4 rounded-xl border border-[#1f1f1f] bg-[#131316] hover:border-indigo-500/50 hover:bg-[#1a1a1f] transition-all group"
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-medium text-sm mb-1">{s.title}</div>
                  <div className="text-xs text-zinc-500 line-clamp-2">
                    {s.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
