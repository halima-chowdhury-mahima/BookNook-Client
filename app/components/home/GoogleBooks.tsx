
"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Search,
  Sparkles,
} from "lucide-react";

import { API_ENDPOINTS } from "../../lib/api";

interface GoogleBook {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  image: string;
  categories: string[];
  pageCount: number | null;
  language: string;
  previewLink: string;
  infoLink: string;
}

interface GoogleBooksResponse {
  success: boolean;
  totalItems: number;
  books: GoogleBook[];
}

export default function GoogleBooks() {
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("subject:fiction");
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  // Fetch Google Books API
  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams({
      q: query,
      maxResults: "8",
      startIndex: "0",
    });

    fetch(`${API_ENDPOINTS.googleBooks}?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const result = await response.json().catch(() => null);

          throw new Error(
            result?.message || "Unable to load Google Books."
          );
        }

        return (await response.json()) as GoogleBooksResponse;
      })
      .then((result) => {
        if (controller.signal.aborted) return;

        setBooks(result.books || []);
        setTotalItems(result.totalItems || 0);
        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        console.error("Google Books API Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to connect to Google Books."
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
  }, [query, retryCount]);

  // Search books
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setSearch("");
      setLoading(true);
      setQuery("subject:fiction");
      setRetryCount((previous) => previous + 1);
      return;
    }

    setLoading(true);
    setError("");
    setQuery(trimmedSearch);
    setRetryCount((previous) => previous + 1);
  }

  // Retry API request
  function handleRetry() {
    setLoading(true);
    setError("");
    setRetryCount((previous) => previous + 1);
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[#c47755]">
              <Sparkles size={17} />

              <span className="text-xs font-bold tracking-[0.25em]">
                DISCOVER MORE STORIES
              </span>
            </div>

            <h2 className="section-title">
              Explore Google Books
            </h2>

            <p className="section-description mt-4 max-w-xl">
              Discover thousands of books from around the world.
              Search for your next favourite story.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#737b73]">
            <BookOpen size={18} className="text-[#c47755]" />
            <span>Powered by Google Books</span>
          </div>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="mb-10 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b948a]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search books, authors or subjects..."
              className="w-full rounded-md border border-[#e8e4da] bg-[#f8f5ed] py-4 pl-12 pr-4 text-sm text-[#173f35] outline-none transition focus:border-[#c47755]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-custom justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search size={17} />
            Search Books
          </button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-lg border border-[#e8e4da] bg-white"
              >
                <div className="h-64 bg-[#e8eee5]" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 rounded bg-[#e8eee5]" />
                  <div className="h-4 w-full rounded bg-[#e8eee5]" />
                  <div className="h-3 w-2/3 rounded bg-[#e8eee5]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-lg border border-[#e8e4da] bg-[#f8f5ed] px-6 py-14 text-center">
            <BookOpen
              size={42}
              className="mx-auto text-[#c47755]"
            />

            <h3 className="mt-5 text-serif text-2xl font-semibold text-[#173f35]">
              Books are temporarily unavailable.
            </h3>

            <p className="mt-3 text-sm text-[#737b73]">
              {error}
            </p>

            <button
              onClick={handleRetry}
              className="btn-primary-custom mt-6"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-lg border border-[#e8e4da] bg-[#f8f5ed] px-6 py-14 text-center">
            <BookOpen
              size={42}
              className="mx-auto text-[#c47755]"
            />

            <h3 className="mt-5 text-serif text-2xl font-semibold text-[#173f35]">
              No books found.
            </h3>

            <p className="mt-3 text-sm text-[#737b73]">
              Try searching with another title or author.
            </p>
          </div>
        )}

        {/* Google Books Cards */}
        {!loading && !error && books.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-[#737b73]">
                {totalItems.toLocaleString()} books found
              </p>

              <span className="text-xs font-semibold uppercase tracking-wider text-[#c47755]">
                Showing {books.length} results
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {books.map((book) => (
                <article
                  key={book.id}
                  className="group flex flex-col overflow-hidden rounded-lg border border-[#e8e4da] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Cover */}
                  <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f8f5ed] p-4">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        loading="lazy"
                        className="h-full w-auto max-w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#8b948a]">
                        <BookOpen size={42} />
                        <span className="mt-3 text-xs">
                          Cover unavailable
                        </span>
                      </div>
                    )}

                    <span className="absolute left-3 top-3 rounded-sm bg-[#c47755] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Google Book
                    </span>
                  </div>

                  {/* Information */}
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c47755]">
                      {book.categories?.[0] || "General"}
                    </span>

                    <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-[#173f35]">
                      {book.title}
                    </h3>

                    <p className="mt-2 line-clamp-1 text-xs text-[#737b73]">
                      By {book.authors?.join(", ") || "Unknown Author"}
                    </p>

                    <a
                      href={
                        book.previewLink ||
                        book.infoLink ||
                        "https://books.google.com/"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto mt-5 flex items-center justify-between border-t border-[#e8e4da] pt-4 text-xs font-bold text-[#173f35] transition hover:text-[#c47755]"
                    >
                      Preview Book
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Discover More */}
        <div className="mt-12 text-center">
          <a
            href="https://books.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-custom inline-flex"
          >
            Discover More Books
            <ArrowUpRight size={17} />
          </a>
        </div>

      </div>
    </section>
  );
}
