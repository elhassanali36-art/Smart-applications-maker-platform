"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  role: string;
  content: string;
  agent: string | null;
}

export function ChatPanel({
  messages,
  onSend,
  building,
}: {
  messages: Message[];
  onSend: (content: string) => void;
  building: boolean;
}) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, building]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || building) return;
    onSend(input);
    setInput("");
  };

  const renderContent = (content: string) => {
    // Simple markdown-ish rendering for bold and code
    const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-[#1a1a1f] text-indigo-300 text-xs font-mono"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !building && (
          <div className="text-center text-zinc-600 text-sm py-8">
            Your conversation will appear here.
            <br />
            Ask the AI to make changes to your app.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 animate-slide-in ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                msg.role === "user"
                  ? "bg-zinc-700 text-zinc-200"
                  : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
              }`}
            >
              {msg.role === "user" ? "You" : "AI"}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-500/10 border border-indigo-500/20 text-zinc-200"
                  : "bg-[#131316] border border-[#1f1f1f] text-zinc-300"
              }`}
            >
              {msg.agent && (
                <div className="text-[10px] text-indigo-400 font-medium mb-1">
                  {msg.agent}
                </div>
              )}
              <div className="whitespace-pre-wrap break-words">
                {renderContent(msg.content)}
              </div>
            </div>
          </div>
        ))}
        {building && (
          <div className="flex gap-2.5 animate-slide-in">
            <div className="shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <div className="bg-[#131316] border border-[#1f1f1f] rounded-2xl px-4 py-3">
              <div className="dot-typing flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-[#1f1f1f] p-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to make changes..."
            rows={1}
            disabled={building}
            className="flex-1 bg-[#131316] border border-[#27272a] rounded-xl px-3 py-2.5 text-sm resize-none outline-none focus:border-indigo-500/50 placeholder:text-zinc-600 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={building || !input.trim()}
            className="shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
