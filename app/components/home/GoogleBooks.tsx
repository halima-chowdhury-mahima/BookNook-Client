
"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Search,
  Sparkles,
  RefreshCw,
  LibraryBig,
  BookMarked,
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
          throw new Error(result?.message || "Unable to load Google Books.");
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

    return () => controller.abort();
  }, [query, retryCount]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedSearch = search.trim();

    setLoading(true);
    setError("");

    if (!trimmedSearch) {
      setSearch("");
      setQuery("subject:fiction");
      setRetryCount((previous) => previous + 1);
      return;
    }

    setQuery(trimmedSearch);
    setRetryCount((previous) => previous + 1);
  }

  function handleRetry() {
    setLoading(true);
    setError("");
    setRetryCount((previous) => previous + 1);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6ef]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#12382f]">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[480px] w-[480px] rounded-full border border-[#d6b879]/15" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-[350px] w-[350px] rounded-full border border-[#d6b879]/15" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[400px] w-[400px] rounded-full bg-[#d6b879]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6b879]/30 bg-white/5 px-4 py-2 text-[#e4c98e]">
              <Sparkles size={15} />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                The World of Books
              </span>
            </div>

            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-[#faf8f0] sm:text-5xl lg:text-6xl">
              Discover Your Next
              <span className="mt-2 block italic text-[#d6b879]">
                Great Read.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#d4ded6] sm:text-base">
              Explore an extensive collection of books from around the world.
              Find inspiring stories, discover new authors and let your next
              favourite book find you.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5 text-xs text-[#dce5dc]">
              <span className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#d6b879]" />
                Explore thousands of titles
              </span>
              <span className="flex items-center gap-2">
                <LibraryBig size={16} className="text-[#d6b879]" />
                Powered by Google Books
              </span>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-[#173f35] via-[#d6b879] to-[#173f35]" />
      </section>

      {/* Main Content */}
      <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Heading */}
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[#a4864f]">
                <span className="h-px w-8 bg-[#c6a66b]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                  Your Reading Collection
                </span>
              </div>

              <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#173f35] sm:text-4xl">
                Explore Google Books
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#737b73]">
                Search for books by title, author or subject and discover
                something wonderful to read.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-lg border border-[#e7dfce] bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3efe4] text-[#a4864f]">
                <BookMarked size={19} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#173f35]">
                  Global Collection
                </p>
                <p className="mt-1 text-[10px] text-[#8b948a]">
                  Google Books Library
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mb-10 rounded-xl border border-[#e8e1d2] bg-white p-3 shadow-[0_12px_40px_rgba(23,63,53,0.05)] sm:p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4864f]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search books, authors or subjects..."
                  aria-label="Search Google Books"
                  className="h-14 w-full rounded-lg border border-transparent bg-[#f8f6ef] pl-12 pr-4 text-sm text-[#173f35] outline-none transition placeholder:text-[#9a9e94] focus:border-[#c6a66b] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 items-center justify-center gap-2 rounded-lg bg-[#173f35] px-8 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#245748] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search size={17} />
                Search Books
              </button>
            </div>
          </form>

          {/* Results Heading */}
          {!loading && !error && books.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#173f35]">
                  {query === "subject:fiction"
                    ? "Popular Discoveries"
                    : "Search Results"}
                </h3>
                <p className="mt-1 text-xs text-[#858b80]">
                  Curated discoveries for curious readers
                </p>
              </div>

              <div className="rounded-full border border-[#e5dcc9] bg-white px-4 py-2 text-xs font-semibold text-[#8d7549]">
                {totalItems.toLocaleString()} books found
                <span className="mx-2 text-[#c6a66b]">·</span>
                Showing {books.length}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-[#e8e1d2] bg-white"
                >
                  <div className="h-56 animate-pulse bg-[#e9e9df] sm:h-64" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-[#e9e9df]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#e9e9df]" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-[#e9e9df]" />
                    <div className="mt-5 h-8 animate-pulse rounded bg-[#f1eee5]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-[#e8e1d2] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3efe4] text-[#a4864f]">
                <BookOpen size={29} />
              </div>

              <h3 className="mt-6 font-serif text-2xl font-semibold text-[#173f35]">
                Books are temporarily unavailable.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#737b73]">
                {error}
              </p>

              <button
                onClick={handleRetry}
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#173f35] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#245748]"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && books.length === 0 && (
            <div className="rounded-xl border border-[#e8e1d2] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3efe4] text-[#a4864f]">
                <Search size={28} />
              </div>

              <h3 className="mt-6 font-serif text-2xl font-semibold text-[#173f35]">
                No books found.
              </h3>

              <p className="mt-3 text-sm text-[#737b73]">
                Try another title, author or subject.
              </p>
            </div>
          )}

          {/* Book Cards */}
          {!loading && !error && books.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {books.map((book) => (
                <article
                  key={book.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#e8e1d2] bg-white shadow-[0_5px_20px_rgba(23,63,53,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#c6a66b]/60 hover:shadow-[0_18px_40px_rgba(23,63,53,0.11)]"
                >
                  {/* Cover */}
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#f0eee5] p-5 sm:h-64">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />

                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        loading="lazy"
                        className="relative h-full max-w-full object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.16)] transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#a49b85]">
                        <BookOpen size={42} strokeWidth={1.2} />
                        <span className="mt-3 text-[10px] uppercase tracking-wider">
                          Cover unavailable
                        </span>
                      </div>
                    )}

                    <span className="absolute left-3 top-3 rounded-sm bg-[#173f35] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#f4dfad] shadow-sm">
                      Google Books
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c6a66b]" />
                      <span className="truncate text-[9px] font-bold uppercase tracking-[0.16em] text-[#a4864f]">
                        {book.categories?.[0] || "General"}
                      </span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 min-h-[44px] font-serif text-sm font-semibold leading-6 text-[#173f35] transition group-hover:text-[#9b7941] sm:text-base">
                      {book.title}
                    </h3>

                    <p className="mt-2 line-clamp-1 text-xs text-[#858b80]">
                      {book.authors?.join(", ") || "Unknown Author"}
                    </p>

                    {book.publisher && (
                      <p className="mt-2 line-clamp-1 text-[10px] text-[#a0a296]">
                        {book.publisher}
                      </p>
                    )}

                    <div className="mt-auto pt-5">
                      <div className="mb-3 h-px w-full bg-[#eee9de]" />

                      <a
                        href={
                          book.previewLink ||
                          book.infoLink ||
                          "https://books.google.com/"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#173f35] transition hover:text-[#a4864f]"
                      >
                        <span className="flex items-center gap-2">
                          Preview Book
                          <ExternalLink size={13} />
                        </span>
                        <ArrowUpRight
                          size={16}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Discover More */}
          <div className="mt-16 overflow-hidden rounded-xl bg-[#173f35] px-6 py-10 text-center sm:px-10 sm:py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b879]/40 bg-white/5 text-[#d6b879]">
              <Sparkles size={21} />
            </div>

            <h3 className="mt-5 font-serif text-2xl font-semibold text-[#faf8f0] sm:text-3xl">
              There is always another story.
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#d4ded6]">
              Keep exploring the world of books and find your next reading
              adventure.
            </p>

            <a
              href="https://books.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#d6b879] px-6 py-3 text-xs font-bold uppercase tracking-[0.13em] text-[#173f35] transition hover:bg-[#e6cb91]"
            >
              Discover More Books
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
