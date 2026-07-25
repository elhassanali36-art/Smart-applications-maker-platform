"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app/AppLayout";

interface Project {
  id: number;
  name: string;
  prompt: string;
  platform: string;
  status: string;
  techStack: string[];
  features: string[];
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDownload = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}/download`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      a.download = `${slug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download project. Please try again.");
    }
  };

  const statusColors: Record<string, string> = {
    planning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    building: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    deployed: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Projects</h1>
              <p className="text-sm text-zinc-500 mt-1">
                {projects.length} project{projects.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link
              href="/app"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Project
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
              <p className="text-sm text-zinc-500 mb-6">
                Start building your first app with AI
              </p>
              <Link
                href="/app"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group relative rounded-xl border border-[#1f1f1f] bg-[#131316] p-5 hover:border-indigo-500/50 transition-all cursor-pointer"
                  onClick={() => { window.location.href = `/app/${project.id}`; }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                        {project.name.charAt(0)}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {project.platform === "exe" ? "🪟 EXE" : project.platform === "apk" ? "🤖 APK" : project.platform === "ios" ? "🍎 iOS" : "🌐 Web"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          statusColors[project.status] || statusColors.planning
                        }`}
                      >
                        {project.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(project);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-500 hover:text-indigo-400 transition-all"
                        title="Download source code"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-500 hover:text-red-400 transition-all"
                        title="Delete project"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{project.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                    {project.prompt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {project.features.slice(0, 4).map((feature) => (
                        <span
                          key={feature}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-600">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
