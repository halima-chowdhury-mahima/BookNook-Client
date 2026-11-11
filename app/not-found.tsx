
import Link from "next/link";
import { ArrowLeft, BookOpen, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#080b12] px-4 py-16">
      <div className="mx-auto w-full max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#d6b36c]/30 bg-[#d6b36c]/10">
          <BookOpen className="h-10 w-10 text-[#d6b36c]" />
        </div>

        <div className="mb-3 flex items-center justify-center gap-2">
          <SearchX className="h-5 w-5 text-[#d6b36c]" />
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d6b36c]">
            Page Not Found
          </span>
        </div>

        <h1 className="text-7xl font-bold tracking-tight text-white sm:text-8xl">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-semibold text-white">
          Lost Between the Pages?
        </h2>

        <p className="mx-auto mt-4 max-w-md leading-7 text-gray-400">
          Sorry! The page you are looking for does not exist or may have been
          moved. Let us help you find your way back to BookNook.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#d6b36c] px-6 py-3 font-semibold text-[#080b12] transition hover:bg-[#f0d9a1]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
