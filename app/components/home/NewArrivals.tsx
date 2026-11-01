
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
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

        return (await response.json()) as
          | BooksApiResponse
          | Book[];
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
    <section className="section-padding bg-[#f8f5ed]">
      <div className="container-custom">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[#c47755]">
              <Sparkles size={17} />

              <span className="text-xs font-bold tracking-[0.25em]">
                FRESH FROM THE SHELVES
              </span>
            </div>

            <h2 className="section-title">
              New Arrivals
            </h2>

            <p className="section-description mt-4 max-w-xl">
              Explore the latest additions to our little library.
              There is always another wonderful story to discover.
            </p>
          </div>

          <Link
            href="/all-books"
            className="btn-outline-custom w-fit"
          >
            View All Books
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-lg border border-[#e8e4da] bg-white"
              >
                <div className="h-56 bg-[#e8eee5]" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 rounded bg-[#e8eee5]" />
                  <div className="h-4 w-full rounded bg-[#e8eee5]" />
                  <div className="h-3 w-2/3 rounded bg-[#e8eee5]" />
                  <div className="h-9 rounded bg-[#e8eee5]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-lg border border-[#e8e4da] bg-white px-6 py-14 text-center">
            <BookOpen
              size={42}
              className="mx-auto text-[#c47755]"
            />

            <h3 className="mt-5 text-serif text-2xl font-semibold text-[#173f35]">
              Our shelves are taking a little rest.
            </h3>

            <p className="mt-3 text-sm text-[#737b73]">
              {error}
            </p>

            <button
              onClick={handleRetry}
              className="btn-primary-custom mt-6"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-lg border border-[#e8e4da] bg-white px-6 py-16 text-center">
            <BookOpen
              size={42}
              className="mx-auto text-[#c47755]"
            />

            <h3 className="mt-5 text-serif text-2xl font-semibold text-[#173f35]">
              New stories are on their way.
            </h3>

            <p className="mt-3 text-sm text-[#737b73]">
              Our library is waiting for its first collection of books.
            </p>

            <Link
              href="/all-books"
              className="btn-primary-custom mt-6"
            >
              Explore Library
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Latest Eight Book Cards */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <article
                key={book._id}
                className="book-card group flex flex-col"
              >
                {/* Book Image */}
                <div
                  role="img"
                  aria-label={book.title}
                  className="relative h-52 overflow-hidden bg-[#e8eee5] bg-cover bg-center sm:h-64"
                  style={{
                    backgroundImage: book.image
                      ? `url("${book.image}")`
                      : "none",
                  }}
                >
                  <span className="absolute left-3 top-3 rounded-sm bg-[#173f35] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    New
                  </span>
                </div>

                {/* Book Information */}
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c47755]">
                    {book.category}
                  </span>

                  <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-[#173f35] sm:text-base">
                    {book.title}
                  </h3>

                  <p className="mt-2 line-clamp-1 text-xs text-[#737b73]">
                    By {book.author}
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-auto mt-5 flex items-center justify-between border-t border-[#e8e4da] pt-4 text-xs font-bold text-[#173f35] transition hover:text-[#c47755]"
                  >
                    View Details

                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* See All Books */}
        <div className="mt-12 text-center">
          <Link
            href="/all-books"
            className="btn-primary-custom"
          >
            See All Books
            <ArrowRight size={17} />
          </Link>
        </div>

      </div>
    </section>
  );
}
