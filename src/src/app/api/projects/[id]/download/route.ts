import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import JSZip from "jszip";
import { PLATFORM_INFO } from "@/lib/generator";
import type { Platform } from "@/lib/generator";

export async function GET(
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
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const files = project.files as Record<string, { path: string; content: string }>;
  const platform = (project.platform as Platform) || "web";
  const info = PLATFORM_INFO[platform];
  const slug = (project.name as string)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "my-app";

  const zip = new JSZip();
  const rootFolder = zip.folder(slug)!;

  for (const [key, file] of Object.entries(files)) {
    const content = file.content ?? "";
    const relativePath = file.path || key;
    const parts = relativePath.split("/");
    let folder = rootFolder;
    for (let i = 0; i < parts.length - 1; i++) {
      folder = folder.folder(parts[i])!;
    }
    const fileName = parts[parts.length - 1];
    folder.file(fileName, content);
  }

  // Add platform-specific build instructions if not already in files
  if (platform === "exe" && !files["BUILD_EXE.md"]) {
    rootFolder.file(
      "BUILD_EXE.md",
      `# Build Instructions - Windows EXE\n\n` +
        `This project is configured to build as a Windows desktop application using Electron.\n\n` +
        `## Prerequisites\n` +
        `- Node.js 18+\n` +
        `- Windows OS (or Wine for cross-compilation)\n\n` +
        `## Build Steps\n\n` +
        `\`\`\`bash\n` +
        `# 1. Install dependencies\n` +
        `npm install\n\n` +
        `# 2. Build the Next.js app\n` +
        `npm run build\n\n` +
        `# 3. Build the Windows EXE\n` +
        `npm run build:exe\n` +
        `\`\`\`\n\n` +
        `The installer will be at: \`dist/${project.name} Setup x.x.x.exe\`\n` +
        `The portable EXE will be at: \`dist/win-unpacked/${project.name}.exe\`\n\n` +
        `## 100% Free\n` +
        `Electron and electron-builder are open-source and free to use. No license fees, no subscriptions.\n`
    );
  }

  if (platform === "apk" && !files["BUILD_APK.md"]) {
    rootFolder.file(
      "BUILD_APK.md",
      `# Build Instructions - Android APK\n\n` +
        `This project is configured to build as an Android app using Capacitor.\n\n` +
        `## Prerequisites\n` +
        `- Node.js 18+\n` +
        `- Android Studio (for SDK)\n` +
        `- JDK 17+\n\n` +
        `## Build Steps\n\n` +
        `\`\`\`bash\n` +
        `# 1. Install dependencies\n` +
        `npm install\n\n` +
        `# 2. Build the Next.js app\n` +
        `npm run build\n\n` +
        `# 3. Add Android platform (first time only)\n` +
        `npx cap add android\n\n` +
        `# 4. Sync web assets\n` +
        `npx cap sync\n\n` +
        `# 5. Build the APK\n` +
        `cd android\n` +
        `./gradlew assembleDebug\n` +
        `\`\`\`\n\n` +
        `The APK will be at: \`android/app/build/outputs/apk/debug/app-debug.apk\`\n\n` +
        `## 100% Free\n` +
        `Capacitor is open-source and free. Android SDK is free. No license fees, no subscriptions.\n`
    );
  }

  if (platform === "ios" && !files["BUILD_IOS.md"]) {
    rootFolder.file(
      "BUILD_IOS.md",
      `# Build Instructions - iOS App\n\n` +
        `This project is configured to build as an iOS app using Capacitor.\n\n` +
        `## Prerequisites\n` +
        `- Node.js 18+\n` +
        `- macOS with Xcode 15+\n` +
        `- Apple Developer account (free tier available)\n\n` +
        `## Build Steps\n\n` +
        `\`\`\`bash\n` +
        `# 1. Install dependencies\n` +
        `npm install\n\n` +
        `# 2. Build the Next.js app\n` +
        `npm run build\n\n` +
        `# 3. Add iOS platform (first time only)\n` +
        `npx cap add ios\n\n` +
        `# 4. Sync web assets\n` +
        `npx cap sync\n\n` +
        `# 5. Open in Xcode\n` +
        `npx cap open ios\n` +
        `\`\`\`\n\n` +
        `In Xcode: Product → Archive → Distribute App\n\n` +
        `## 100% Free\n` +
        `Capacitor is open-source and free. Xcode is free on macOS. Apple Developer free tier allows sideloading.\n`
    );
  }

  // Add a public folder placeholder if no public files
  if (!Object.keys(files).some((k) => k.startsWith("public/"))) {
    rootFolder.folder("public")!.file(".gitkeep", "");
  }

  const arr = await zip.generateAsync({ type: "array" });
  const buf = Buffer.from(arr);

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}-${platform}.zip"`,
    },
  });
}
