"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/app/AppLayout";
import { AgentTimeline } from "@/components/app/AgentTimeline";
import { ChatPanel } from "@/components/app/ChatPanel";
import { FileExplorer } from "@/components/app/FileExplorer";
import { CodeViewer } from "@/components/app/CodeViewer";
import { PreviewPanel } from "@/components/app/PreviewPanel";
import type { AgentStep, GeneratedFile, Platform } from "@/lib/generator";
import { PLATFORM_INFO } from "@/lib/generator";

interface ProjectData {
  id: number;
  name: string;
  prompt: string;
  platform: Platform;
  status: string;
  techStack: string[];
  features: string[];
  structure: any[];
  files: Record<string, GeneratedFile>;
  previewHtml: string;
  agents: AgentStep[];
  messages: { id: number; role: string; content: string; agent: string | null }[];
}

type View = "code" | "preview";

export default function ProjectWorkspacePage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [activeFile, setActiveFile] = useState<string>("");
  const [view, setView] = useState<View>("preview");
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string>("");
  const initRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runBuildAnimation = (data: ProjectData) => {
    if (initRef.current) return;
    initRef.current = true;
    setBuilding(true);

    const agents = data.agents || [];
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= agents.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setBuilding(false);
        return;
      }
      setProject((prev) => {
        if (!prev) return prev;
        const updated: AgentStep[] = prev.agents.map((a, idx) => ({
          ...a,
          status: (idx < i ? "done" : idx === i ? "active" : "pending") as AgentStep["status"],
        }));
        return { ...prev, agents: updated };
      });
      i++;
    }, 1200);
  };

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load project");
        return res.json();
      })
      .then((data) => {
        // Ensure all required fields exist
        const safeData: ProjectData = {
          ...data,
          platform: data.platform || "web",
          techStack: data.techStack || [],
          features: data.features || [],
          structure: data.structure || [],
          files: data.files || {},
          previewHtml: data.previewHtml || "",
          agents: data.agents || [],
          messages: data.messages || [],
        };
        setProject(safeData);
        const files = Object.keys(safeData.files);
        if (files.length > 0) setActiveFile(files[0]);
        setLoading(false);
        runBuildAnimation(safeData);
      })
      .catch(() => setLoading(false));

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [id]);

  const handleSendMessage = async (content: string) => {
    if (!project || !content.trim()) return;
    const userMsg = {
      id: Date.now(),
      role: "user",
      content,
      agent: null,
    };
    setProject((prev) =>
      prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev
    );

    setBuilding(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      const aiMsg = await res.json();

      // Refresh project data to get updated files
      const updatedRes = await fetch(`/api/projects/${id}`);
      const updated = await updatedRes.json();
      setProject((prev) =>
        prev
          ? {
              ...updated,
              messages: [...prev.messages, userMsg, aiMsg],
            }
          : prev
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setBuilding(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${id}/download`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = (project?.name || "app").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      a.download = `${slug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download project. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    const res = await fetch(`/api/projects/${id}/deploy`, { method: "POST" });
    const data = await res.json();
    setDeployUrl(data.url);
    setDeploying(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    window.location.href = "/projects";
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-500">Loading project...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">Project not found</p>
            <button
              onClick={() => { window.location.href = "/app"; }}
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Create a new project
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Top bar */}
      <header className="h-14 shrink-0 border-b border-[#1f1f1f] bg-[#0d0d0d] flex items-center justify-between px-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
            {project.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold truncate">{project.name}</h2>
              <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {PLATFORM_INFO[project.platform || "web"].icon} {PLATFORM_INFO[project.platform || "web"].label}
              </span>
            </div>
            <p className="text-xs text-zinc-500 truncate">{project.prompt.slice(0, 60)}...</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {project.status === "deployed" && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              ● Deployed
            </span>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 border border-[#27272a] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#1a1a1f] transition-colors disabled:opacity-50"
            title="Download source code"
          >
            {downloading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            )}
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete project"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
          <button
            onClick={handleDeploy}
            disabled={deploying}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {deploying ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Deploying...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Deploy
              </>
            )}
          </button>
        </div>
      </header>

      {/* Deploy banner */}
      {deployUrl && (
        <div className="bg-green-500/10 border-b border-green-500/20 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Deployed successfully!
            <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1">
              {deployUrl}
            </a>
          </div>
          <button onClick={() => setDeployUrl("")} className="text-green-400/60 hover:text-green-400">
            ✕
          </button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-red-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
          <button onClick={() => setError("")} className="text-red-400/60 hover:text-red-400">
            ✕
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat + Agents */}
        <div className="w-[380px] shrink-0 border-r border-[#1f1f1f] flex flex-col">
          {building && <AgentTimeline agents={project.agents} />}
          <ChatPanel
            messages={project.messages}
            onSend={handleSendMessage}
            building={building}
          />
        </div>

        {/* Right: Code / Preview */}
        <div className="flex-1 flex flex-col">
          {/* View toggle */}
          <div className="h-10 shrink-0 border-b border-[#1f1f1f] flex items-center px-2 gap-1">
            <button
              onClick={() => setView("preview")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === "preview" ? "bg-[#1a1a1f] text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setView("code")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === "code" ? "bg-[#1a1a1f] text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              Code
            </button>
            {view === "code" && (
              <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
                <span>{project.techStack.join(" • ")}</span>
              </div>
            )}
          </div>

          {view === "preview" ? (
            <PreviewPanel html={project.previewHtml} name={project.name} />
          ) : (
            <div className="flex-1 flex overflow-hidden">
              <FileExplorer
                structure={project.structure}
                activeFile={activeFile}
                onSelect={setActiveFile}
              />
              <CodeViewer file={project.files[activeFile]} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
