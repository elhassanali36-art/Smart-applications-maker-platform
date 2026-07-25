import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
        <p className="text-zinc-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-white text-black px-6 py-3 rounded-lg font-medium text-sm hover:bg-zinc-200 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/app"
            className="border border-[#27272a] text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-[#131316] transition-colors"
          >
            Start building
          </Link>
        </div>
      </div>
    </div>
  );
}
