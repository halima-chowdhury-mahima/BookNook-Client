
import { BookOpen, LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="flex min-h-[70vh] flex-col items-center justify-center bg-[#080b12] px-4 text-center"
      aria-label="Loading page"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#d6b36c]/30 bg-[#d6b36c]/10">
        <BookOpen className="h-10 w-10 text-[#d6b36c]" />
      </div>

      <LoaderCircle className="mb-4 h-8 w-8 animate-spin text-[#d6b36c]" />

      <h2 className="text-xl font-semibold text-white">
        Loading BookNook...
      </h2>

      <p className="mt-2 max-w-sm text-sm text-gray-400">
        Please wait while we prepare your reading experience.
      </p>

      <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-[#d6b36c]" />
      </div>
    </main>
  );
}
