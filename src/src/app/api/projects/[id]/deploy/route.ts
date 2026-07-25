import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PLATFORM_INFO } from "@/lib/generator";
import type { Platform } from "@/lib/generator";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, Number(id)))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const files = project.files as Record<string, { content: string }>;
  const fileCount = Object.keys(files).length;
  const platform = (project.platform as Platform) || "web";
  const info = PLATFORM_INFO[platform];

  // Validate the project has essential files
  const hasPackageJson = Object.keys(files).some((k) => k.endsWith("package.json"));
  const hasLayout = Object.keys(files).some((k) => k.endsWith("layout.tsx"));
  const hasPage = Object.keys(files).some((k) => k.endsWith("page.tsx"));

  if (!hasPackageJson || !hasLayout || !hasPage) {
    return NextResponse.json(
      { error: "Project is missing essential files. Try regenerating." },
      { status: 400 }
    );
  }

  if (fileCount < 5) {
    return NextResponse.json(
      { error: "Project has too few files to deploy. Try adding more features." },
      { status: 400 }
    );
  }

  // Update status to deployed
  await db
    .update(projects)
    .set({ status: "deployed", updatedAt: new Date() })
    .where(eq(projects.id, Number(id)));

  const slug = (project.name as string)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "my-app";

  // Platform-specific deployment info
  let url: string;
  let deployInfo: Record<string, string> = {};

  if (platform === "exe") {
    url = `https://${slug}.samp.app/download/${slug}-${platform}.zip`;
    deployInfo = {
      format: "Windows EXE",
      buildCommand: "npm run build:exe",
      output: `dist/${project.name} Setup x.x.x.exe`,
      instructions: "Run npm install && npm run build:exe to build the Windows installer.",
    };
  } else if (platform === "apk") {
    url = `https://${slug}.samp.app/download/${slug}-${platform}.zip`;
    deployInfo = {
      format: "Android APK",
      buildCommand: "npm run build:apk",
      output: "android/app/build/outputs/apk/debug/app-debug.apk",
      instructions: "Run npm install && npm run build:apk to build the Android APK.",
    };
  } else if (platform === "ios") {
    url = `https://${slug}.samp.app/download/${slug}-${platform}.zip`;
    deployInfo = {
      format: "iOS App",
      buildCommand: "npm run build:ios",
      output: "Xcode Archive → Distribute App",
      instructions: "Run npm install && npm run build:ios on macOS to build the iOS app.",
    };
  } else {
    url = `https://${slug}.samp.app`;
    deployInfo = {
      format: "Web App",
      buildCommand: "npm run build",
      output: url,
      instructions: "Run npm install && npm run build && npm start to run the web app.",
    };
  }

  return NextResponse.json({
    success: true,
    url,
    domain: `${slug}.samp.app`,
    platform,
    platformLabel: info.label,
    platformIcon: info.icon,
    deployedAt: new Date().toISOString(),
    fileCount,
    techStack: project.techStack,
    ...deployInfo,
  });
}
