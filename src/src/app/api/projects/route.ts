import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects, messages } from "@/db/schema";
import { generateProject } from "@/lib/generator";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(projects).orderBy(desc(projects.createdAt));
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const { prompt, platform = "web" } = await req.json();
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const validPlatforms = ["web", "exe", "apk", "ios"];
  const plat = validPlatforms.includes(platform) ? platform : "web";
  const generated = generateProject(prompt, plat as any);

  const [row] = await db
    .insert(projects)
    .values({
      name: generated.name,
      prompt,
      platform: plat,
      status: "planning",
      techStack: generated.techStack,
      features: generated.features,
      structure: generated.structure,
      files: generated.files,
      previewHtml: generated.previewHtml,
      agents: generated.agents,
    })
    .returning();

  // Add initial AI message summarizing what was built
  await db.insert(messages).values({
    projectId: row.id,
    role: "assistant",
    content: `I've built **${generated.name}** for **${generated.platform.toUpperCase()}** platform based on your description.

**What was generated:**
• ${Object.keys(generated.files).length} files — frontend, backend, database & config
• Platform: ${generated.platform.toUpperCase()} (${generated.platform === "exe" ? "Windows Desktop" : generated.platform === "apk" ? "Android Mobile" : generated.platform === "ios" ? "iOS Mobile" : "Web App"})
• Tech stack: ${generated.techStack.join(", ")}
• Features: ${generated.features.join(", ")}
• Live preview ready in the Preview tab

**Next steps:**
• Review code in the Code tab
• Click **Download** ⬇ to get the full source as a ZIP
• Click **Deploy** 🚀 to get a live URL
• Chat with me to add features or make changes

Try: "add a search bar" or "create a settings page"`,
    agent: "Architect",
  });

  // Update project status to building
  await db.update(projects).set({ status: "building" }).where(eq(projects.id, row.id));

  return NextResponse.json(row, { status: 201 });
}
