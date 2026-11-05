
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  Search,
  BookOpen,
  Loader2,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  image: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: string;
  createdAt?: string;
}

interface BooksResponse {
  success?: boolean;
  data?: Book[];
  books?: Book[];
}

type AvailabilityFilter = "All" | "Available" | "Unavailable";
type SortOption = "newest" | "oldest" | "az" | "za";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function extractBooks(result: BooksResponse): Book[] {
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.books)) return result.books;
  return [];
}

function AllBooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();


  useEffect(() => {
  document.title = "BookNook | All Books";
}, []);

  const category = searchParams.get("category") || "All";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("All");
  const [sort, setSort] = useState<SortOption>("newest");

  // Load books automatically.
  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/books`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load books.");
        }

        const result: BooksResponse = await response.json();

        if (!controller.signal.aborted) {
          setBooks(extractBooks(result));
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => controller.abort();
  }, []);

  // Refresh books manually.
  async function fetchBooks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/books`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load books.");
      }

      const result: BooksResponse = await response.json();
      setBooks(extractBooks(result));
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  // Dynamic categories.
  const categories = useMemo(() => {
    const bookCategories = books
      .map((book) => book.category)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(
        new Set([
          ...bookCategories,
          ...(category !== "All" ? [category] : []),
        ])
      ).sort(),
    ];
  }, [books, category]);

  // Search, filter and sort.
  const filteredBooks = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    const result = books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(searchText) ||
        book.author?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || book.category === category;

      const matchesAvailability =
        availability === "All" ||
        (availability === "Available"
          ? book.availableCopies > 0
          : book.availableCopies <= 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );

        case "az":
          return a.title.localeCompare(b.title);

        case "za":
          return b.title.localeCompare(a.title);

        case "newest":
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });
  }, [books, search, category, availability, sort]);

  // Update category in URL.
  function handleCategoryChange(value: string) {
    if (value === "All") {
      router.push("/all-books");
    } else {
      router.push(
        `/all-books?category=${encodeURIComponent(value)}`
      );
    }
  }

  // Clear all filters.
  function clearFilters() {
    setSearch("");
    setAvailability("All");
    setSort("newest");
    router.push("/all-books");
  }

  const hasActiveFilters =
    search !== "" ||
    category !== "All" ||
    availability !== "All" ||
    sort !== "newest";

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-14 text-[#173f35] md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#b28a50]">
            Explore Our Collection
          </p>

          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            Discover Your Next Story
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#718078]">
            Explore our growing library of stories, knowledge
            and inspiration. Find a book that speaks to you.
          </p>

          <div className="mt-7 flex justify-center">
            <Link
              href="/add-book"
              className="rounded-full bg-[#173f35] px-7 py-3 text-sm font-semibold !text-white transition hover:bg-[#245747]"
            >
              + Add a Book
            </Link>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-9 rounded-2xl border border-[#e7e2d7] bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal
              size={19}
              className="text-[#b28a50]"
            />

            <h2 className="font-serif text-xl font-bold">
              Find Your Perfect Book
            </h2>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9b91]"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by book title or author..."
              className="w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#173f35] focus:ring-2 focus:ring-[#173f35]/10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Category */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#718078]">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  handleCategoryChange(e.target.value)
                }
                className="w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 text-sm outline-none focus:border-[#173f35]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#718078]">
                Availability
              </label>

              <select
                value={availability}
                onChange={(e) =>
                  setAvailability(
                    e.target.value as AvailabilityFilter
                  )
                }
                className="w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 text-sm outline-none focus:border-[#173f35]"
              >
                <option value="All">All Books</option>
                <option value="Available">Available Books</option>
                <option value="Unavailable">Not Available</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#718078]">
                Sort By
              </label>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as SortOption)
                }
                className="w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 text-sm outline-none focus:border-[#173f35]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">Title: A to Z</option>
                <option value="za">Title: Z to A</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-5 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm font-semibold text-[#b46c4b] transition hover:text-[#173f35]"
              >
                <X size={16} />
                Clear All Filters
              </button>
            </div>
          )}
        </section>

        {/* Collection Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold">
              Library Collection
            </h2>

            <p className="mt-1 text-sm text-[#718078]">
              Showing {filteredBooks.length} of {books.length} books
            </p>
          </div>

          <button
            onClick={fetchBooks}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-[#d9dfd7] bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-[#173f35] disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Loading / Error / Empty / Books */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
            <Loader2
              size={35}
              className="animate-spin text-[#173f35]"
            />

            <p className="text-sm text-[#718078]">
              Loading your library...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-12 text-center">
            <p className="text-red-600">{error}</p>

            <button
              onClick={fetchBooks}
              className="mt-5 rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[#245747]"
            >
              Try Again
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-3xl border border-[#e7e2d7] bg-white px-6 py-16 text-center">
            <BookOpen
              size={45}
              className="mx-auto mb-5 text-[#b28a50]"
            />

            <h3 className="font-serif text-2xl font-bold">
              No Books Found
            </h3>

            <p className="mt-3 text-sm text-[#718078]">
              Try changing your search or filters to find books.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[#245747]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <article
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-[#e7e2d7] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-[280px] overflow-hidden bg-[#eeeae0]">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen
                        size={55}
                        className="text-[#b28a50]"
                      />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#173f35]">
                    {book.category}
                  </span>

                  <span
                    className={`absolute bottom-4 right-4 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      book.availableCopies > 0
                        ? "bg-[#e5f1e8] text-[#286442]"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {book.availableCopies > 0
                      ? `${book.availableCopies} Available`
                      : "Not Available"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 font-serif text-xl font-bold">
                    {book.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#718078]">
                    By {book.author}
                  </p>

                  <div className="my-5 h-px bg-[#eeeae0]" />

                  <div className="mb-5 flex justify-between text-xs text-[#718078]">
                    <span>Total Copies</span>

                    <span className="font-semibold text-[#173f35]">
                      {book.totalCopies}
                    </span>
                  </div>

                  <Link
                    href={`/books/${book._id}`}
                    className="flex items-center justify-between rounded-xl bg-[#173f35] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[#245747]"
                  >
                    View Details
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-[#8b9b91]">
            <ArrowUpDown size={15} />
            Search, filter and sort books to find your next read.
          </div>
        )}
      </div>
    </main>
  );
}

export default function AllBooksPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f8f5ed]">
          <Loader2
            size={35}
            className="animate-spin text-[#173f35]"
          />
        </main>
      }
    >
      <AllBooksContent />
    </Suspense>
  );
}
