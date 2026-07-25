import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  prompt: text("prompt").notNull(),
  platform: varchar("platform", { length: 10 }).notNull().default("web"),
  status: varchar("status", { length: 50 }).notNull().default("planning"),
  techStack: jsonb("tech_stack").notNull().default([]),
  features: jsonb("features").notNull().default([]),
  structure: jsonb("structure").notNull().default([]),
  files: jsonb("files").notNull().default({}),
  previewHtml: text("preview_html"),
  agents: jsonb("agents").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  agent: varchar("agent", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
