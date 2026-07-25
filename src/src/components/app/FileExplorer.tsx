"use client";

import { useState } from "react";
import type { FileNode } from "@/lib/generator";

interface FileExplorerProps {
  structure: FileNode[];
  activeFile: string;
  onSelect: (path: string) => void;
}

const fileIcons: Record<string, string> = {
  tsx: "⚛️",
  ts: "🔷",
  json: "📋",
  css: "🎨",
  md: "📝",
  dotenv: "🔐",
};

function getFileIcon(path: string): string {
  if (path.startsWith(".")) return "⚙️";
  const ext = path.split(".").pop() || "";
  return fileIcons[ext] || "📄";
}

function FileTree({
  nodes,
  activeFile,
  onSelect,
  depth = 0,
}: {
  nodes: FileNode[];
  activeFile: string;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div>
      {nodes.map((node) => {
        const isExpanded = expanded[node.path] ?? depth < 2;
        if (node.type === "dir") {
          return (
            <div key={node.path}>
              <button
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [node.path]: !prev[node.path],
                  }))
                }
                className="w-full flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-400 hover:bg-[#1a1a1f] rounded transition-colors"
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="shrink-0">📁</span>
                <span className="truncate">{node.path.split("/").pop()}</span>
              </button>
              {isExpanded && node.children && (
                <FileTree
                  nodes={node.children}
                  activeFile={activeFile}
                  onSelect={onSelect}
                  depth={depth + 1}
                />
              )}
            </div>
          );
        }
        return (
          <button
            key={node.path}
            onClick={() => onSelect(node.path)}
            className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors text-left ${
              activeFile === node.path
                ? "bg-indigo-500/10 text-indigo-300"
                : "text-zinc-400 hover:bg-[#1a1a1f]"
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            <span className="shrink-0">{getFileIcon(node.path)}</span>
            <span className="truncate">{node.path.split("/").pop()}</span>
          </button>
        );
      })}
    </div>
  );
}

export function FileExplorer({ structure, activeFile, onSelect }: FileExplorerProps) {
  return (
    <div className="w-56 shrink-0 border-r border-[#1f1f1f] bg-[#0d0d0d] overflow-y-auto">
      <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-zinc-600 font-medium border-b border-[#1f1f1f]">
        Explorer
      </div>
      <div className="py-1">
        <FileTree
          nodes={structure}
          activeFile={activeFile}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
