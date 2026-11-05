
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookMarked,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { API_ENDPOINTS } from "../../lib/api";
import type { Book } from "../../types";

interface BooksApiResponse {
  success?: boolean;
  count?: number;
  data?: Book[];
  books?: Book[];
}

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_ENDPOINTS.books}?limit=8`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Books API error: ${response.status}`);
        }

        return (await response.json()) as BooksApiResponse | Book[];
      })
      .then((payload) => {
        if (controller.signal.aborted) return;

        const result = Array.isArray(payload)
          ? payload
          : payload.data ?? payload.books ?? [];

        setBooks(result.slice(0, 8));
        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        console.error("New Arrivals API Error:", err);

        setError(
          "We couldn't connect to the library right now. Please try again."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [retryCount]);

  function handleRetry() {
    setLoading(true);
    setError("");
    setRetryCount((previous) => previous + 1);
  }

  return (
    <section className="relative overflow-hidden bg-background py-16 text-foreground transition-colors duration-300 sm:py-20 lg:py-24">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-40 top-20 size-96 rounded-full border border-[#c6a45f]/10" />

      <div className="pointer-events-none absolute -right-24 top-36 size-64 rounded-full border border-[#c6a45f]/10" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-[#c6a45f]/[0.04] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-7 md:mb-14 md:flex-row md:items-end">

          <div>
            <div className="mb-5 flex items-center gap-3">

              <span className="h-px w-8 bg-[#b28a50]" />

              <Sparkles
                size={15}
                className="text-[#b28a50] dark:text-[#d6b779]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ad8b49] dark:text-[#d6b779]">
                Fresh From The Shelves
              </span>

            </div>

            <h2 className="font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-[56px]">
              New Arrivals
              <span className="ml-2 text-[#b28a50] dark:text-[#d6b779]">.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
              Discover the latest additions to our library.
              Beautiful stories, timeless ideas, and new adventures
              are waiting for you.
            </p>
          </div>

          <Link
            href="/all-books"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#b28a50] bg-transparent px-6 py-3.5 text-xs font-bold tracking-wide text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_10px_25px_rgba(23,63,53,0.15)]"
          >
            Explore Collection

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

        </div>

        {/* Decorative Divider */}
        <div className="mb-10 flex items-center gap-4">

          <div className="h-px flex-1 bg-gradient-to-r from-[#c6a45f]/40 to-transparent" />

          <BookOpen size={17} className="text-[#b28a50] dark:text-[#d6b779]" />

          <div className="h-px flex-1 bg-gradient-to-l from-[#c6a45f]/40 to-transparent" />

        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">

            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-[22px] border border-border bg-card"
              >

                <div className="aspect-[4/5] bg-muted" />

                <div className="space-y-3 p-4 sm:p-5">
                  <div className="h-2.5 w-20 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                  <div className="mt-5 h-9 rounded-full bg-muted" />
                </div>

              </div>
            ))}

          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-[24px] border border-border bg-card px-6 py-16 text-center text-card-foreground shadow-sm">

            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#c6a45f]/30 bg-secondary">
              <BookOpen size={30} className="text-[#ad8b49] dark:text-[#d6b779]" />
            </div>

            <h3 className="mt-6 font-serif text-2xl font-bold text-primary">
              Our Shelves Are Taking a Rest
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              {error}
            </p>

            <button
              onClick={handleRetry}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#e3c783] to-[#c6a45f] px-7 py-3.5 text-xs font-bold text-[#173f35] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <RefreshCw size={15} />
              Try Again
            </button>

          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-[24px] border border-border bg-card px-6 py-16 text-center text-card-foreground">

            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary">
              <BookMarked size={30} className="text-[#ad8b49] dark:text-[#d6b779]" />
            </div>

            <h3 className="mt-6 font-serif text-2xl font-bold text-primary">
              New Stories Are on Their Way
            </h3>

            <p className="mt-3 text-sm text-muted-foreground">
              Our library is waiting for its first collection of books.
            </p>

            <Link
              href="/all-books"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold text-primary-foreground transition-all hover:opacity-90"
            >
              Explore Library
              <ArrowRight size={15} />
            </Link>

          </div>
        )}

        {/* Latest Eight Books */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">

            {books.map((book) => {
              const isAvailable = book.availableCopies > 0;

              return (
                <article
                  key={book._id}
                  className="group/card relative flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-card text-card-foreground shadow-[0_8px_25px_rgba(23,63,53,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#c6a45f]/60 hover:shadow-[0_22px_45px_rgba(23,63,53,0.13)] dark:hover:shadow-[0_22px_45px_rgba(0,0,0,0.3)]"
                >

                  {/* Book Cover */}
                  <Link
                    href={`/books/${book._id}`}
                    aria-label={`View ${book.title} details`}
                    className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#eee8d9] to-[#e1dacb] dark:from-[#293b30] dark:to-[#17271f]"
                  >

                    {book.image ? (
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-1000 ease-out group-hover/card:scale-110"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3">

                        <BookOpen
                          size={55}
                          strokeWidth={1}
                          className="text-[#173f35]/35 dark:text-[#d6b779]/60"
                        />

                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#173f35]/45 dark:text-[#e8eee8]/50">
                          BookNook Library
                        </span>

                      </div>
                    )}

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102a24]/65 via-transparent to-[#102a24]/10 opacity-70 transition-opacity duration-500 group-hover/card:opacity-100" />

                    {/* Inner Border */}
                    <div className="pointer-events-none absolute inset-3 rounded-[14px] border border-white/20 transition-all duration-500 group-hover/card:inset-4 group-hover/card:border-[#f0d9a1]/50" />

                    {/* Category Badge */}
                    <span className="absolute left-4 top-4 max-w-[65%] truncate rounded-full border border-white/50 bg-[#fffaf0]/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#173f35] shadow-lg backdrop-blur-md">
                      {book.category || "General"}
                    </span>

                    {/* New Badge */}
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-[#f0d9a1]/40 bg-[#173f35]/90 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#f0d9a1] shadow-lg backdrop-blur-md">
                      <Sparkles size={10} />
                      New
                    </span>

                    {/* Availability */}
                    <span
                      className={`absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-bold shadow-lg backdrop-blur-md ${
                        isAvailable
                          ? "border border-emerald-200/70 bg-emerald-50/95 text-emerald-800"
                          : "border border-red-200/70 bg-red-50/95 text-red-700"
                      }`}
                    >
                      {isAvailable ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}

                      {isAvailable ? "Available" : "Out of Stock"}
                    </span>

                  </Link>

                  {/* Book Information */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">

                    <div className="mb-2 flex items-center gap-2">

                      <span className="h-px w-5 bg-[#c6a45f]" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ad8b49] dark:text-[#d6b779]">
                        Curated Collection
                      </span>

                    </div>

                    <h3 className="line-clamp-2 min-h-[44px] font-serif text-base font-bold leading-6 text-card-foreground transition-colors duration-300 group-hover/card:text-[#a17b35] dark:group-hover/card:text-[#e2c58c] sm:text-lg">
                      {book.title}
                    </h3>

                    <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                      By{" "}
                      <span className="font-semibold text-card-foreground">
                        {book.author}
                      </span>
                    </p>

                    {/* Available Copies */}
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">

                      <div>

                        <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                          Available Copies
                        </p>

                        <p
                          className={`mt-1 font-serif text-xl font-bold ${
                            isAvailable
                              ? "text-primary"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {book.availableCopies}

                          <span className="ml-1 text-xs font-medium text-muted-foreground">
                            / {book.totalCopies}
                          </span>
                        </p>

                      </div>

                      <BookMarked
                        size={19}
                        className="text-[#c6a45f]/70 dark:text-[#d6b779]/80"
                      />

                    </div>

                    {/* Details Button */}
                    <Link
                      href={`/books/${book._id}`}
                      className="group/details mt-5 inline-flex items-center justify-between rounded-full border border-[#c6a45f] bg-gradient-to-br from-[#e3c783] to-[#c6a45f] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#173f35] shadow-[0_5px_15px_rgba(198,164,95,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#173f35] hover:from-[#173f35] hover:to-[#245747] hover:text-[#f0d9a1] hover:shadow-lg"
                    >
                      View Details

                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-300 group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5"
                      />
                    </Link>

                  </div>

                  {/* Gold Bottom Accent */}
                  <div className="h-[3px] w-0 bg-gradient-to-r from-[#ad8b49] via-[#f0d9a1] to-[#ad8b49] transition-all duration-700 group-hover/card:w-full" />

                </article>
              );
            })}

          </div>
        )}

        
{/* See All Books */}
<div className="mt-14 flex justify-center">
  <Link
    href="/all-books"
    className="group inline-flex items-center gap-3 rounded-full border border-[#173f35] bg-[#173f35] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] !text-white shadow-[0_8px_20px_rgba(23,63,53,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c6a45f] hover:bg-gradient-to-br hover:from-[#e3c783] hover:to-[#c6a45f] hover:!text-[#173f35] hover:shadow-[0_12px_28px_rgba(23,63,53,0.22)] dark:border-[#d6b779] dark:bg-[#d6b779] dark:!text-[#173f35] dark:hover:border-[#f0d9a1] dark:hover:bg-[#f0d9a1]"
  >
    Discover All Books

    <ArrowRight
      size={16}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  </Link>
</div>


      </div>
    </section>
  );
}
