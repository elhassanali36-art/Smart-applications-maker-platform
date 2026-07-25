// Code generation engine — transforms a natural-language prompt into a
// complete, runnable Next.js project scaffold.

export interface FileNode {
  path: string;
  type: "file" | "dir";
  language?: string;
  children?: FileNode[];
}

export interface GeneratedFile {
  path: string;
  language: string;
  content: string;
}

export interface AgentStep {
  agent: string;
  title: string;
  description: string;
  status: "done" | "active" | "pending";
}

export type Platform = "web" | "exe" | "apk" | "ios";

export interface GenerationResult {
  name: string;
  slug: string;
  platform: Platform;
  techStack: string[];
  features: string[];
  structure: FileNode[];
  files: Record<string, GeneratedFile>;
  previewHtml: string;
  agents: AgentStep[];
}

export const PLATFORM_INFO: Record<Platform, { label: string; icon: string; description: string; extension: string }> = {
  web: { label: "Web App", icon: "🌐", description: "Responsive web application", extension: "zip" },
  exe: { label: "Windows EXE", icon: "🪟", description: "Desktop application for Windows", extension: "exe" },
  apk: { label: "Android APK", icon: "🤖", description: "Mobile application for Android", extension: "apk" },
  ios: { label: "iOS App", icon: "🍎", description: "Mobile application for iOS", extension: "ipa" },
};

const AGENTS = [
  { agent: "Architect", title: "Planning architecture", description: "Analyzing requirements and designing system architecture" },
  { agent: "Designer", title: "Designing UI/UX", description: "Creating wireframes and design system" },
  { agent: "Developer", title: "Writing code", description: "Implementing frontend, backend, and database" },
  { agent: "Integration", title: "Integrating services", description: "Connecting APIs, auth, and third-party services" },
  { agent: "QA", title: "Testing & QA", description: "Running automated tests and fixing issues" },
  { agent: "DevOps", title: "Deploying", description: "Building, optimizing, and deploying to production" },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "my-app";
}

function deriveAppName(prompt: string): string {
  const words = prompt
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (words.length === 0) return "My App";
  const stopWords = ["with", "for", "and", "the", "that", "where", "can", "have", "from", "into", "about"];
  const candidates = words.filter((w) => !stopWords.includes(w.toLowerCase())).slice(0, 3);
  if (candidates.length === 0) return words.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  return candidates.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

export function detectFeatures(prompt: string): string[] {
  const features: string[] = [];
  const p = prompt.toLowerCase();
  if (/(auth|login|sign\s?in|register|account|sign\s?up)/.test(p)) features.push("Authentication");
  if (/(database|db|store|save|persist|data)/.test(p)) features.push("Database");
  if (/(payment|stripe|checkout|subscribe|pricing|billing)/.test(p)) features.push("Payments");
  if (/(upload|image|photo|file|avatar)/.test(p)) features.push("File Upload");
  if (/(chat|message|real\s?time|socket|dm)/.test(p)) features.push("Real-time Chat");
  if (/(dashboard|admin|analytics|stats|metrics)/.test(p)) features.push("Dashboard");
  if (/(api|rest|endpoint|webhook)/.test(p)) features.push("REST API");
  if (/(mobile|ios|android|pwa)/.test(p)) features.push("Mobile Ready");
  if (/(search|filter|sort)/.test(p)) features.push("Search");
  if (/(notification|alert|email|push)/.test(p)) features.push("Notifications");
  if (/(crud|create|read|update|delete|post|item|listing|product|recipe|blog|article|task|todo|booking|appointment|order|inventory|manage)/.test(p)) features.push("CRUD");
  if (/(dark|theme|mode)/.test(p)) features.push("Dark Mode");
  if (/(form|validation|input)/.test(p)) features.push("Forms");
  if (/(map|location|geo)/.test(p)) features.push("Maps");
  if (/(calendar|schedule|event)/.test(p)) features.push("Calendar");
  // Database is implied by CRUD, Authentication, or Payments
  if (features.includes("CRUD") || features.includes("Authentication") || features.includes("Payments")) {
    if (!features.includes("Database")) features.push("Database");
  }
  if (features.length === 0) features.push("Responsive UI", "Dark Mode");
  return features;
}

function detectTechStack(prompt: string, platform: Platform = "web"): string[] {
  const p = prompt.toLowerCase();
  const stack = ["Next.js", "TypeScript", "Tailwind CSS"];
  if (/(database|db|store|save|persist|auth|login|data|crud|post|item|product|blog|task|todo|booking|order|inventory)/.test(p)) stack.push("PostgreSQL", "Drizzle ORM");
  if (/(auth|login|register|sign\s?up)/.test(p)) stack.push("NextAuth.js");
  if (/(payment|stripe|checkout|billing)/.test(p)) stack.push("Stripe");
  if (/(upload|image|photo|avatar)/.test(p)) stack.push("UploadThing");
  if (/(chat|message|real\s?time)/.test(p)) stack.push("Pusher");
  if (/(map|location|geo)/.test(p)) stack.push("Mapbox");
  if (platform === "exe") stack.push("Electron", "electron-builder");
  if (platform === "apk" || platform === "ios") stack.push("Capacitor");
  return Array.from(new Set(stack));
}

// ─── File Content Generators ───────────────────────────────────────────────

function packageJson(slug: string, features: string[], platform: Platform = "web"): string {
  const deps: Record<string, string> = {
    next: "^14.2.0",
    react: "^18.3.0",
    "react-dom": "^18.3.0",
    clsx: "^2.1.0",
    "tailwind-merge": "^2.5.0",
  };
  const devDeps: Record<string, string> = {
    typescript: "^5.5.0",
    "@types/react": "^18.3.0",
    "@types/node": "^20.0.0",
    tailwindcss: "^3.4.0",
    postcss: "^8.4.0",
    autoprefixer: "^10.4.0",
    "@tailwindcss/typography": "^0.5.0",
  };
  if (features.includes("Database")) {
    deps["drizzle-orm"] = "^0.33.0";
    deps["postgres"] = "^3.4.0";
    devDeps["drizzle-kit"] = "^0.24.0";
  }
  if (features.includes("Authentication")) {
    deps["next-auth"] = "^5.0.0-beta.20";
    deps["@auth/drizzle-adapter"] = "^1.0.0";
    deps["bcryptjs"] = "^2.4.0";
    devDeps["@types/bcryptjs"] = "^2.4.0";
  }
  if (features.includes("Payments")) {
    deps["stripe"] = "^17.0.0";
  }
  if (features.includes("File Upload")) {
    deps["uploadthing"] = "^7.0.0";
    deps["@uploadthing/react"] = "^7.0.0";
  }
  if (features.includes("Real-time Chat")) {
    deps["pusher"] = "^5.2.0";
    deps["pusher-js"] = "^8.4.0";
  }
  if (features.includes("Maps")) {
    deps["mapbox-gl"] = "^3.0.0";
    deps["@types/mapbox-gl"] = "^3.0.0";
  }
  const scripts: Record<string, string> = {
    dev: "next dev",
    build: "next build",
    start: "next start",
    lint: "next lint",
  };
  if (features.includes("Database")) {
    scripts["db:push"] = "drizzle-kit push";
    scripts["db:studio"] = "drizzle-kit studio";
  }
  if (platform === "exe") {
    deps["electron"] = "^28.0.0";
    devDeps["electron-builder"] = "^24.13.0";
    devDeps["@types/electron"] = "^1.6.0";
    devDeps["concurrently"] = "^8.2.0";
    devDeps["wait-on"] = "^7.2.0";
    scripts["dev:desktop"] = "concurrently \"next dev\" \"wait-on http://localhost:3000 && electron .\"";
    scripts["build:exe"] = "next build && electron-builder --win";
    scripts["build:exe:mac"] = "next build && electron-builder --mac";
    scripts["build:exe:linux"] = "next build && electron-builder --linux";
  }
  if (platform === "apk" || platform === "ios") {
    deps["@capacitor/core"] = "^6.0.0";
    deps["@capacitor/cli"] = "^6.0.0";
    if (platform === "apk") {
      deps["@capacitor/android"] = "^6.0.0";
      scripts["build:apk"] = "next build && npx cap add android && npx cap sync && cd android && ./gradlew assembleDebug";
    }
    if (platform === "ios") {
      deps["@capacitor/ios"] = "^6.0.0";
      scripts["build:ios"] = "next build && npx cap add ios && npx cap sync && npx cap open ios";
    }
    scripts["build:mobile"] = "next build && npx cap sync";
  }

  const pkg: Record<string, unknown> = {
    name: slug,
    version: "1.0.0",
    private: true,
    scripts,
    dependencies: deps,
    devDependencies: devDeps,
  };
  if (platform === "exe") {
    pkg["main"] = "electron-dist/main.js";
  }
  return JSON.stringify(pkg, null, 2);
}

function tsConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: { "@/*": ["./src/*"] },
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"],
  }, null, 2);
}

function nextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
`;
}

function tailwindConfig(): string {
  return `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
`;
}

function postcssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
}

function globalsCss(features: string[]): string {
  const darkMode = features.includes("Dark Mode");
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 214 32% 91%;
    --radius: 0.5rem;
  }
${darkMode ? `
  .dark {
    --background: 222 47% 6%;
    --foreground: 210 40% 98%;
    --card: 222 47% 8%;
    --card-foreground: 210 40% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 222 47% 11%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 63% 45%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 20%;
  }
` : ""}
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90;
  }
  .btn-secondary {
    @apply inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold transition hover:bg-accent;
  }
  .input {
    @apply w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50;
  }
  .card {
    @apply rounded-lg border border-border bg-card text-card-foreground;
  }
}
`;
}

function layoutTsx(name: string, prompt: string, features: string[]): string {
  const darkMode = features.includes("Dark Mode");
  return `import type { Metadata } from "next";
import "./globals.css";
${features.includes("Dark Mode") ? `import { ThemeProvider } from "@/components/theme-provider";\n` : ""}
export const metadata: Metadata = {
  title: "${name}",
  description: "${prompt.slice(0, 160)}",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"${darkMode ? ` suppressHydrationWarning` : ""}>
      <body className="antialiased">
        ${darkMode ? `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</ThemeProvider>` : `{children}`}
      </body>
    </html>
  );
}
`;
}

function homePage(name: string, prompt: string, features: string[]): string {
  const hasDashboard = features.includes("Dashboard");
  const hasAuth = features.includes("Authentication");
  const hasCRUD = features.includes("CRUD");
  return `import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            ✨ Powered by SAMP
          </span>
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to ${name}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            ${prompt.slice(0, 200)}
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            ${hasDashboard ? `<Button asChild><a href="/dashboard">Get Started</a></Button>` : `<Button>Get Started</Button>`}
            ${hasAuth ? `<Button variant="secondary" asChild><a href="/login">Sign In</a></Button>` : ""}
          </div>
        </section>

        ${hasCRUD ? `
        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${features.slice(0, 6).map((f) => `
            <Card>
              <CardHeader>
                <CardTitle>${f}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ${f} functionality is fully integrated and ready to use.
                </p>
              </CardContent>
            </Card>`).join("\n            ")}
          </div>
        </section>` : ""}

        ${hasDashboard ? `
        {/* Stats Preview */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Total Users", "Active Now", "Revenue"].map((label) => (
              <Card key={label}>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-3xl font-bold mt-2">—</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>` : ""}
      </main>
      <Footer />
    </div>
  );
}
`;
}

function navbar(name: string, features: string[]): string {
  const links: string[] = [];
  if (features.includes("Dashboard")) links.push(`<a href="/dashboard" className="text-sm hover:opacity-70">Dashboard</a>`);
  if (features.includes("CRUD")) links.push(`<a href="/items" className="text-sm hover:opacity-70">Browse</a>`);
  if (features.includes("Authentication")) links.push(`<a href="/login" className="text-sm hover:opacity-70">Login</a>`);
  return `"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
${features.includes("Dark Mode") ? `import { ThemeToggle } from "@/components/ThemeToggle";\n` : ""}
export function Navbar() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">${name}</Link>
        <div className="flex items-center gap-6">
          ${links.join("\n          ")}
          ${features.includes("Dark Mode") ? `<ThemeToggle />` : ""}
          ${features.includes("Authentication") ? `<Button asChild><a href="/register">Get Started</a></Button>` : `<Button>Get Started</Button>`}
        </div>
      </nav>
    </header>
  );
}
`;
}

function footer(name: string): string {
  return `import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ${name}. Built with Smart Application Maker Platform.</p>
      </div>
    </footer>
  );
}
`;
}

function utilsTs(): string {
  return `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}
`;
}

function typesTs(name: string, features: string[]): string {
  const types: string[] = [];
  if (features.includes("Authentication")) {
    types.push(`export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}`);
  }
  if (features.includes("CRUD")) {
    types.push(`export interface Item {
  id: string;
  title: string;
  description: string;
  ${features.includes("File Upload") ? `imageUrl?: string;` : ""}
  createdAt: string;
  updatedAt: string;
}`);
  }
  if (features.includes("Payments")) {
    types.push(`export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
}`);
  }
  if (types.length === 0) {
    types.push(`export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}`);
  }
  return `// Shared types for ${name}
${types.join("\n\n")}
`;
}

function dbSchema(features: string[]): string {
  const tables: string[] = [];
  if (features.includes("Authentication")) {
    tables.push(`export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});`);
  }
  if (features.includes("CRUD")) {
    tables.push(`export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  ${features.includes("File Upload") ? `imageUrl: text("image_url"),` : ""}
  ${features.includes("Authentication") ? `userId: integer("user_id").references(() => users.id),` : ""}
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});`);
  }
  if (features.includes("Payments")) {
    tables.push(`export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  ${features.includes("Authentication") ? `userId: integer("user_id").references(() => users.id),` : `email: text("email").notNull(),`}
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan").notNull().default("free"),
  status: text("status").notNull().default("inactive"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});`);
  }
  return `import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

${tables.join("\n\n")}
`;
}

function dbTs(): string {
  return `import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);
`;
}

function authTs(): string {
  return `import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);
        if (!user) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;
        return { id: String(user.id), name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
`;
}

function middlewareTs(): string {
  return `import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/settings");

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
`;
}

function loginPage(): string {
  return `"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
`;
}

function registerPage(): string {
  return `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
`;
}

function dashboardPage(name: string): string {
  return `import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const stats = [
    { label: "Total Users", value: "1,234" },
    { label: "Active Now", value: "56" },
    { label: "Revenue", value: "$12.4k" },
    { label: "Growth", value: "+12.5%" },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome back, {session.user?.name || "User"}! Here&apos;s your ${name} overview.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity. Start by creating your first item.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

function itemsPage(): string {
  return `"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Item } from "@/lib/types";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Browse Items</h1>
        <Button>+ New Item</Button>
      </div>
      <Input
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
`;
}

function apiItemsRoute(): string {
  return `import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(items).orderBy(desc(items.createdAt));
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const { title, description } = await req.json();
  const [row] = await db
    .insert(items)
    .values({ title, description })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
`;
}

function apiItemsIdRoute(): string {
  return `import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [item] = await db
    .select()
    .from(items)
    .where(eq(items.id, Number(id)))
    .limit(1);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const [updated] = await db
    .update(items)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(items.id, Number(id)))
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(items).where(eq(items.id, Number(id)));
  return NextResponse.json({ success: true });
}
`;
}

function apiAuthRegisterRoute(): string {
  return `import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning();
  return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
}
`;
}

function apiAuthNextAuthRoute(): string {
  return `import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
`;
}

function apiHealthRoute(name: string): string {
  return `import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "${name}",
    timestamp: new Date().toISOString(),
  });
}
`;
}

function uiButton(): string {
  return `import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild, ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:opacity-90",
      secondary: "bg-muted text-foreground hover:bg-accent",
      outline: "border border-border hover:bg-accent",
      destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
    };
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };
    const classes = cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none",
      variants[variant],
      sizes[size],
      className
    );
    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(props.children as React.ReactElement<any>, {
        className: cn(classes, (props.children as any).props.className),
      });
    }
    return <button ref={ref} className={classes} {...props} />;
  }
);
Button.displayName = "Button";
`;
}

function uiCard(): string {
  return `import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground", className)} {...props} />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
`;
}

function uiInput(): string {
  return `import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/50 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
`;
}

function uiBadge(): string {
  return `import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
      {...props}
    />
  );
}
`;
}

function themeProvider(): string {
  return `"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);

  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) setTheme(stored);
    else if (enableSystem) {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, enableSystem]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
});

export const useTheme = () => React.useContext(ThemeContext);
`;
}

function themeToggle(): string {
  return `"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}
`;
}

function envLocal(slug: string, features: string[]): string {
  const lines = [
    `# Environment variables for ${slug}`,
    `DATABASE_URL=postgresql://localhost:5432/${slug}`,
  ];
  if (features.includes("Authentication")) {
    lines.push("NEXTAUTH_SECRET=your-secret-key-here");
    lines.push("NEXTAUTH_URL=http://localhost:3000");
  }
  if (features.includes("Payments")) {
    lines.push("STRIPE_SECRET_KEY=sk_test_...");
    lines.push("STRIPE_WEBHOOK_SECRET=whsec_...");
  }
  if (features.includes("File Upload")) {
    lines.push("UPLOADTHING_SECRET=...");
    lines.push("UPLOADTHING_APP_ID=...");
  }
  if (features.includes("Real-time Chat")) {
    lines.push("PUSHER_APP_ID=...");
    lines.push("NEXT_PUBLIC_PUSHER_APP_KEY=...");
    lines.push("PUSHER_APP_SECRET=...");
  }
  return lines.join("\n") + "\n";
}

function gitignore(): string {
  return `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# typescript
*.tsbuildinfo
next-env.d.ts
`;
}

function readme(name: string, prompt: string, features: string[], techStack: string[], platform: Platform = "web"): string {
  const platformSection = platform === "exe" ? electronBuildInstructions(name) :
    platform === "apk" ? capacitorBuildInstructions("apk", name) :
    platform === "ios" ? capacitorBuildInstructions("ios", name) : "";

  const platformNote = platform !== "web" ? `\n## 🎯 Target Platform: ${PLATFORM_INFO[platform].label}\n` : "";

  return `# ${name}

${prompt}
${platformNote}
## ✨ Features

${features.map((f) => `- [x] ${f}`).join("\n")}

## 🛠 Tech Stack

${techStack.map((t) => `- ${t}`).join("\n")}

## 🚀 Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run the development server
npm run dev
${features.includes("Database") ? "\n# Push database schema\nnpm run db:push" : ""}
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Build for Web

\`\`\`bash
npm run build
npm start
\`\`\`
${platformSection}
## ☁️ Deploy (Web)

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to set environment variables in your Vercel project settings.

## 💰 Cost

**100% Free** — This project uses only open-source tools. No license fees, no subscriptions, no hidden costs.

## 📄 License

MIT

---

Built with [Smart Application Maker Platform](https://samp.app) — the AI-native product engineering platform.
`;
}

function nextEnvDts(): string {
  return `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`;
}

function drizzleConfig(): string {
  return `import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
`;
}

// ─── Preview HTML ───────────────────────────────────────────────────────────

function buildPreviewHtml(name: string, features: string[], prompt: string): string {
  const featureCards = features
    .map(
      (f) => `
      <div class="feature-card">
        <div class="feature-icon">✦</div>
        <div class="feature-title">${f}</div>
        <div class="feature-desc">Automatically configured and ready to use.</div>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0a0a0a; color: #fff; min-height: 100vh;
  }
  .nav { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem; border-bottom: 1px solid #1f1f1f; }
  .logo { font-weight: 700; font-size: 1.25rem; }
  .nav-links { display: flex; gap: 1.5rem; font-size: 0.875rem; color: #a1a1aa; }
  .hero { text-align: center; padding: 6rem 2rem 4rem; background: radial-gradient(ellipse at top, rgba(99,102,241,0.15), transparent 60%); }
  .badge { display: inline-block; padding: 0.375rem 0.875rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 999px; font-size: 0.75rem; color: #a5b4fc; margin-bottom: 1.5rem; }
  .hero h1 { font-size: 3.5rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
  .hero p { margin-top: 1.5rem; font-size: 1.25rem; color: #a1a1aa; max-width: 600px; margin-left: auto; margin-right: auto; }
  .cta { margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; }
  .btn-primary { background: #6366f1; color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; font-size: 0.95rem; }
  .btn-secondary { background: transparent; color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: 1px solid #3f3f46; cursor: pointer; font-size: 0.95rem; }
  .features { padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; }
  .features h2 { text-align: center; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
  .features-sub { text-align: center; color: #a1a1aa; margin-bottom: 3rem; }
  .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
  .feature-card { background: #131316; border: 1px solid #1f1f1f; border-radius: 1rem; padding: 1.75rem; transition: border-color 0.2s; }
  .feature-card:hover { border-color: #6366f1; }
  .feature-icon { font-size: 1.5rem; color: #6366f1; margin-bottom: 1rem; }
  .feature-title { font-weight: 600; margin-bottom: 0.5rem; }
  .feature-desc { font-size: 0.875rem; color: #a1a1aa; }
  .footer { text-align: center; padding: 2rem; color: #52525b; font-size: 0.875rem; border-top: 1px solid #1f1f1f; }
</style>
</head>
<body>
  <nav class="nav">
    <div class="logo">${name}</div>
    <div class="nav-links">
      <span>Features</span>
      <span>Docs</span>
      <span>Sign in</span>
    </div>
  </nav>
  <section class="hero">
    <div class="badge">✨ Generated by SAMP</div>
    <h1>${name}</h1>
    <p>${prompt.slice(0, 140)}</p>
    <div class="cta">
      <button class="btn-primary">Get Started</button>
      <button class="btn-secondary">View on GitHub</button>
    </div>
  </section>
  <section class="features">
    <h2>Features</h2>
    <p class="features-sub">Everything you need, built in.</p>
    <div class="feature-grid">${featureCards}</div>
  </section>
  <footer class="footer">© ${new Date().getFullYear()} ${name} — Built with SAMP</footer>
</body>
</html>`;
}

// ─── Platform-specific Generators ───────────────────────────────────────────

function electronMainTs(name: string): string {
  return `import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "${name}",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // In production, load the built Next.js app
  if (process.env.NODE_ENV === "production") {
    mainWindow.loadFile(path.join(__dirname, "../out/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
`;
}

function electronPreloadTs(): string {
  return `import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  getVersion: () => ipcRenderer.invoke("get-version"),
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
});
`;
}

function electronBuilderYml(slug: string, name: string): string {
  return `appId: com.samp.${slug}
productName: ${name}
copyright: Copyright © ${new Date().getFullYear()}
directories:
  output: dist
  buildResources: build
files:
  - out/**/*
  - electron/**/*
  - package.json
win:
  target:
    - target: nsis
      arch:
        - x64
  icon: build/icon.ico
nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true
`;
}

function capacitorConfig(slug: string, name: string): string {
  return `import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.samp.${slug}",
  appName: "${name}",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
`;
}

function capacitorBuildInstructions(platform: Platform, name: string): string {
  if (platform === "apk") {
    return `## 📱 Build Android APK

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Build the Next.js app (static export)
npm run build

# 3. Add Android platform
npx cap add android

# 4. Sync web assets
npx cap sync

# 5. Build the APK
cd android
./gradlew assembleDebug

# The APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
\`\`\`

### Requirements
- Node.js 18+
- Android Studio (for SDK)
- JDK 17+

> 💡 **100% Free**: Capacitor is open-source and free to use. No license fees, no subscriptions.`;
  }
  if (platform === "ios") {
    return `## 📱 Build iOS App

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Build the Next.js app (static export)
npm run build

# 3. Add iOS platform
npx cap add ios

# 4. Sync web assets
npx cap sync

# 5. Open in Xcode and build
npx cap open ios

# In Xcode: Product → Archive → Distribute App
\`\`\`

### Requirements
- Node.js 18+
- macOS with Xcode 15+
- Apple Developer account (free tier available)

> 💡 **100% Free**: Capacitor is open-source and free. Xcode is free on macOS. Apple Developer free tier allows sideloading.`;
  }
  return "";
}

function electronBuildInstructions(name: string): string {
  return `## 🪟 Build Windows EXE

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Build the Next.js app (static export)
npm run build

# 3. Build the Electron app for Windows
npm run build:exe

# The installer will be at: dist/${name} Setup x.x.x.exe
# The portable EXE will be at: dist/win-unpacked/${name}.exe
\`\`\`

### Requirements
- Node.js 18+
- Windows (or Wine on Linux/macOS for cross-compilation)

> 💡 **100% Free**: Electron and electron-builder are open-source and free. No license fees, no subscriptions.`;
}

// ─── Structure Builder ──────────────────────────────────────────────────────

function buildStructure(features: string[], platform: Platform = "web"): FileNode[] {
  const tree: FileNode[] = [
    { path: "package.json", type: "file", language: "json" },
    { path: "tsconfig.json", type: "file", language: "json" },
    { path: "next.config.ts", type: "file", language: "typescript" },
    { path: "tailwind.config.ts", type: "file", language: "typescript" },
    { path: "postcss.config.mjs", type: "file", language: "javascript" },
    { path: ".env.local", type: "file", language: "dotenv" },
    { path: ".gitignore", type: "file", language: "text" },
    { path: "next-env.d.ts", type: "file", language: "typescript" },
    { path: "README.md", type: "file", language: "markdown" },
    {
      path: "src",
      type: "dir",
      children: [
        {
          path: "app",
          type: "dir",
          children: [
            { path: "layout.tsx", type: "file", language: "tsx" },
            { path: "page.tsx", type: "file", language: "tsx" },
            { path: "globals.css", type: "file", language: "css" },
            ...(features.includes("Authentication") ? [
              { path: "login", type: "dir" as const, children: [{ path: "page.tsx", type: "file" as const, language: "tsx" }] },
              { path: "register", type: "dir" as const, children: [{ path: "page.tsx", type: "file" as const, language: "tsx" }] },
            ] : []),
            ...(features.includes("Dashboard") ? [
              { path: "dashboard", type: "dir" as const, children: [{ path: "page.tsx", type: "file" as const, language: "tsx" }] },
            ] : []),
            ...(features.includes("CRUD") ? [
              { path: "items", type: "dir" as const, children: [{ path: "page.tsx", type: "file" as const, language: "tsx" }] },
            ] : []),
            {
              path: "api",
              type: "dir",
              children: [
                { path: "health", type: "dir" as const, children: [{ path: "route.ts", type: "file" as const, language: "tsx" }] },
                ...(features.includes("CRUD") ? [
                  { path: "items", type: "dir" as const, children: [
                    { path: "route.ts", type: "file" as const, language: "tsx" },
                    { path: "[id]", type: "dir" as const, children: [{ path: "route.ts", type: "file" as const, language: "tsx" }] },
                  ]},
                ] : []),
                ...(features.includes("Authentication") ? [
                  { path: "auth", type: "dir" as const, children: [
                    { path: "register", type: "dir" as const, children: [{ path: "route.ts", type: "file" as const, language: "tsx" }] },
                    { path: "[...nextauth]", type: "dir" as const, children: [{ path: "route.ts", type: "file" as const, language: "tsx" }] },
                  ]},
                ] : []),
              ],
            },
          ],
        },
        {
          path: "components",
          type: "dir",
          children: [
            { path: "Navbar.tsx", type: "file", language: "tsx" },
            { path: "Footer.tsx", type: "file", language: "tsx" },
            ...(features.includes("Dark Mode") ? [
              { path: "theme-provider.tsx", type: "file" as const, language: "tsx" },
              { path: "ThemeToggle.tsx", type: "file" as const, language: "tsx" },
            ] : []),
            {
              path: "ui",
              type: "dir",
              children: [
                { path: "Button.tsx", type: "file", language: "tsx" },
                { path: "Card.tsx", type: "file", language: "tsx" },
                { path: "Input.tsx", type: "file", language: "tsx" },
                { path: "Badge.tsx", type: "file", language: "tsx" },
              ],
            },
          ],
        },
        {
          path: "lib",
          type: "dir",
          children: [
            { path: "utils.ts", type: "file", language: "typescript" },
            { path: "types.ts", type: "file", language: "typescript" },
            ...(features.includes("Database") ? [{ path: "db.ts", type: "file" as const, language: "typescript" }] : []),
            ...(features.includes("Authentication") ? [{ path: "auth.ts", type: "file" as const, language: "typescript" }] : []),
          ],
        },
        ...(features.includes("Database") ? [
          { path: "db", type: "dir" as const, children: [{ path: "schema.ts", type: "file" as const, language: "typescript" }] },
        ] : []),
        ...(features.includes("Authentication") ? [
          { path: "middleware.ts", type: "file" as const, language: "typescript" },
        ] : []),
      ],
    },
    { path: "public", type: "dir", children: [{ path: "favicon.ico", type: "file", language: "binary" }] },
    ...(features.includes("Database") ? [
      { path: "drizzle.config.ts", type: "file" as const, language: "typescript" },
    ] : []),
    ...(platform === "exe" ? [
      { path: "electron", type: "dir" as const, children: [
        { path: "main.ts", type: "file" as const, language: "typescript" },
        { path: "preload.ts", type: "file" as const, language: "typescript" },
        { path: "tsconfig.json", type: "file" as const, language: "json" },
      ]},
      { path: "electron-builder.yml", type: "file" as const, language: "yaml" },
    ] : []),
    ...(platform === "apk" || platform === "ios" ? [
      { path: "capacitor.config.ts", type: "file" as const, language: "typescript" },
    ] : []),
  ];
  return tree;
}

// ─── Main Generator ─────────────────────────────────────────────────────────

export function generateProject(prompt: string, platform: Platform = "web"): GenerationResult {
  const name = deriveAppName(prompt);
  const slug = slugify(name);
  const features = detectFeatures(prompt);
  const techStack = detectTechStack(prompt, platform);
  const structure = buildStructure(features, platform);
  const files = buildFiles(name, slug, features, prompt, techStack, platform);
  const previewHtml = buildPreviewHtml(name, features, prompt);
  const agents: AgentStep[] = AGENTS.map((a, i) => ({
    ...a,
    status: i === 0 ? "active" : "pending",
  }));

  return { name, slug, platform, techStack, features, structure, files, previewHtml, agents };
}

function buildFiles(
  name: string,
  slug: string,
  features: string[],
  prompt: string,
  techStack: string[],
  platform: Platform = "web"
): Record<string, GeneratedFile> {
  const files: Record<string, GeneratedFile> = {};

  // Config files
  files["package.json"] = { path: "package.json", language: "json", content: packageJson(slug, features, platform) };
  files["tsconfig.json"] = { path: "tsconfig.json", language: "json", content: tsConfig() };
  files["next.config.ts"] = { path: "next.config.ts", language: "typescript", content: nextConfig() };
  files["tailwind.config.ts"] = { path: "tailwind.config.ts", language: "typescript", content: tailwindConfig() };
  files["postcss.config.mjs"] = { path: "postcss.config.mjs", language: "javascript", content: postcssConfig() };
  files["next-env.d.ts"] = { path: "next-env.d.ts", language: "typescript", content: nextEnvDts() };
  files[".env.local"] = { path: ".env.local", language: "dotenv", content: envLocal(slug, features) };
  files[".gitignore"] = { path: ".gitignore", language: "text", content: gitignore() };
  files["README.md"] = { path: "README.md", language: "markdown", content: readme(name, prompt, features, techStack, platform) };

  // App files
  files["src/app/layout.tsx"] = { path: "src/app/layout.tsx", language: "tsx", content: layoutTsx(name, prompt, features) };
  files["src/app/page.tsx"] = { path: "src/app/page.tsx", language: "tsx", content: homePage(name, prompt, features) };
  files["src/app/globals.css"] = { path: "src/app/globals.css", language: "css", content: globalsCss(features) };

  // Auth pages
  if (features.includes("Authentication")) {
    files["src/app/login/page.tsx"] = { path: "src/app/login/page.tsx", language: "tsx", content: loginPage() };
    files["src/app/register/page.tsx"] = { path: "src/app/register/page.tsx", language: "tsx", content: registerPage() };
    files["src/app/api/auth/register/route.ts"] = { path: "src/app/api/auth/register/route.ts", language: "tsx", content: apiAuthRegisterRoute() };
    files["src/app/api/auth/[...nextauth]/route.ts"] = { path: "src/app/api/auth/[...nextauth]/route.ts", language: "tsx", content: apiAuthNextAuthRoute() };
    files["src/middleware.ts"] = { path: "src/middleware.ts", language: "typescript", content: middlewareTs() };
  }

  // Dashboard
  if (features.includes("Dashboard")) {
    files["src/app/dashboard/page.tsx"] = { path: "src/app/dashboard/page.tsx", language: "tsx", content: dashboardPage(name) };
  }

  // CRUD
  if (features.includes("CRUD")) {
    files["src/app/items/page.tsx"] = { path: "src/app/items/page.tsx", language: "tsx", content: itemsPage() };
    files["src/app/api/items/route.ts"] = { path: "src/app/api/items/route.ts", language: "tsx", content: apiItemsRoute() };
    files["src/app/api/items/[id]/route.ts"] = { path: "src/app/api/items/[id]/route.ts", language: "tsx", content: apiItemsIdRoute() };
  }

  // API health
  files["src/app/api/health/route.ts"] = { path: "src/app/api/health/route.ts", language: "tsx", content: apiHealthRoute(name) };

  // Components
  files["src/components/Navbar.tsx"] = { path: "src/components/Navbar.tsx", language: "tsx", content: navbar(name, features) };
  files["src/components/Footer.tsx"] = { path: "src/components/Footer.tsx", language: "tsx", content: footer(name) };
  files["src/components/ui/Button.tsx"] = { path: "src/components/ui/Button.tsx", language: "tsx", content: uiButton() };
  files["src/components/ui/Card.tsx"] = { path: "src/components/ui/Card.tsx", language: "tsx", content: uiCard() };
  files["src/components/ui/Input.tsx"] = { path: "src/components/ui/Input.tsx", language: "tsx", content: uiInput() };
  files["src/components/ui/Badge.tsx"] = { path: "src/components/ui/Badge.tsx", language: "tsx", content: uiBadge() };

  if (features.includes("Dark Mode")) {
    files["src/components/theme-provider.tsx"] = { path: "src/components/theme-provider.tsx", language: "tsx", content: themeProvider() };
    files["src/components/ThemeToggle.tsx"] = { path: "src/components/ThemeToggle.tsx", language: "tsx", content: themeToggle() };
  }

  // Lib
  files["src/lib/utils.ts"] = { path: "src/lib/utils.ts", language: "typescript", content: utilsTs() };
  files["src/lib/types.ts"] = { path: "src/lib/types.ts", language: "typescript", content: typesTs(name, features) };

  if (features.includes("Database")) {
    files["src/lib/db.ts"] = { path: "src/lib/db.ts", language: "typescript", content: dbTs() };
    files["src/db/schema.ts"] = { path: "src/db/schema.ts", language: "typescript", content: dbSchema(features) };
    files["drizzle.config.ts"] = { path: "drizzle.config.ts", language: "typescript", content: drizzleConfig() };
  }

  if (features.includes("Authentication")) {
    files["src/lib/auth.ts"] = { path: "src/lib/auth.ts", language: "typescript", content: authTs() };
  }

  // Platform-specific files
  if (platform === "exe") {
    files["electron/main.ts"] = { path: "electron/main.ts", language: "typescript", content: electronMainTs(name) };
    files["electron/preload.ts"] = { path: "electron/preload.ts", language: "typescript", content: electronPreloadTs() };
    files["electron-builder.yml"] = { path: "electron-builder.yml", language: "yaml", content: electronBuilderYml(slug, name) };
    files["electron/tsconfig.json"] = { path: "electron/tsconfig.json", language: "json", content: JSON.stringify({
      compilerOptions: { target: "ES2020", module: "commonjs", lib: ["ES2020"], outDir: "../electron-dist", rootDir: ".", strict: true, esModuleInterop: true, skipLibCheck: true, forceConsistentCasingInFileNames: true },
      include: ["**/*.ts"],
    }, null, 2) };
  }

  if (platform === "apk" || platform === "ios") {
    files["capacitor.config.ts"] = { path: "capacitor.config.ts", language: "typescript", content: capacitorConfig(slug, name) };
  }

  return files;
}

export function flattenFiles(files: Record<string, GeneratedFile>): GeneratedFile[] {
  return Object.values(files).sort((a, b) => a.path.localeCompare(b.path));
}
