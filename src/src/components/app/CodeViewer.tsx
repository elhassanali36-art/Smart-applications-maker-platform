"use client";

import { useState } from "react";
import type { GeneratedFile } from "@/lib/generator";

export function CodeViewer({ file }: { file: GeneratedFile | undefined }) {
  const [copied, setCopied] = useState(false);

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
        Select a file to view its code
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = file.content.split("\n").length;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* File header */}
      <div className="h-9 shrink-0 border-b border-[#1f1f1f] bg-[#0d0d0d] flex items-center justify-between px-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="font-mono">{file.path}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-600">{lineCount} lines</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="flex-1 overflow-auto bg-[#0a0a0a]">
        <pre className="code-block p-4 text-zinc-300">
          <code>
            {file.content.split("\n").map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-zinc-700 w-8 shrink-0 text-right pr-4">
                  {i + 1}
                </span>
                <span className="flex-1 whitespace-pre">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
