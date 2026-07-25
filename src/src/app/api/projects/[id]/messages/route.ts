import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateProject, detectFeatures } from "@/lib/generator";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.projectId, Number(id)))
    .orderBy(messages.createdAt);
  return NextResponse.json(msgs);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, Number(id)))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Save user message
  await db.insert(messages).values({
    projectId: Number(id),
    role: "user",
    content,
  });

  // Detect new features from the message
  const existingFeatures = (project.features as string[]) || [];
  const newFeatures = detectFeatures(content);
  const combinedFeatures = Array.from(new Set([...existingFeatures, ...newFeatures]));

  // Preserve the platform
  const platform = (project.platform as string) || "web";

  // Regenerate with combined prompt, features, and preserved platform
  const regenerated = generateProject(
    `${project.prompt} ${content} ${combinedFeatures.join(" ")}`,
    platform as any
  );

  const aiResponse = `I've updated your project based on: "${content}"

**Changes applied:**
${newFeatures.length > 0 ? `• New features: ${newFeatures.join(", ")}\n` : ""}• Total features: ${regenerated.features.join(", ")}
• Tech stack: ${regenerated.techStack.join(", ")}
• Files: ${Object.keys(regenerated.files).length} (was ${Object.keys(project.files as object).length})
• Updated live preview

You can download the updated source code or deploy the changes.`;

  const [aiMsg] = await db
    .insert(messages)
    .values({
      projectId: Number(id),
      role: "assistant",
      content: aiResponse,
      agent: "Developer",
    })
    .returning();

  // Update project with refreshed files and features
  await db
    .update(projects)
    .set({
      files: regenerated.files,
      structure: regenerated.structure,
      previewHtml: regenerated.previewHtml,
      techStack: regenerated.techStack,
      features: regenerated.features,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, Number(id)));

  return NextResponse.json(aiMsg, { status: 201 });
}
