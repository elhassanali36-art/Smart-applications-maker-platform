"use client";

import { useState } from "react";

export function PreviewPanel({ html, name }: { html: string; name: string }) {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Preview toolbar */}
      <div className="h-9 shrink-0 border-b border-[#1f1f1f] bg-[#0d0d0d] flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="ml-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1a1a1f] text-xs text-zinc-500">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            {name.toLowerCase().replace(/\s+/g, "-")}.samp.app
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={refreshing ? "animate-spin" : ""}
          >
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Preview iframe */}
      <div className="flex-1 bg-white">
        <iframe
          key={refreshKey}
          srcDoc={html}
          className="w-full h-full border-0"
          title={`${name} preview`}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
