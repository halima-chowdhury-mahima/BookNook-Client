
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";

import { API_ENDPOINTS } from "../lib/api";

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
  infoLink: string;
  previewLink: string;
}

interface SearchResponse {
  success: boolean;
  totalItems: number;
  books: GoogleBook[];
}

export default function GoogleBooksPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  async function searchBooks(searchTerm: string) {
    const trimmedQuery = searchTerm.trim();

    if (!trimmedQuery || loading) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setBooks([]);

    try {
      const response = await fetch(
        `${API_ENDPOINTS.googleBooks}?q=${encodeURIComponent(trimmedQuery)}`
      );

      const data: SearchResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          "Unable to load books. Please check your connection and try again."
        );
      }

      setBooks(data.books || []);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-14">
      <div className="mx-auto max-w-7xl">

        {/* Hero Section */}
        <section className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#dfd3bd] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#a17b43]">
            <Sparkles size={15} />
            Discover Your Next Read
          </div>

          <h1 className="font-serif text-4xl font-bold leading-tight text-[#173f35] md:text-6xl">
            Explore the World
            <br />
            <span className="text-[#a17b43]">of Books</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600">
            Discover thousands of books from around the world.
            Explore titles, authors, publishers and descriptions
            to find your next favorite read.
          </p>
        </section>

        {/* Search Form */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void searchBooks(query);
          }}
          className="mx-auto mb-14 flex max-w-2xl items-center gap-3 rounded-2xl border border-[#e5dfd1] bg-white p-3 shadow-md"
        >
          <Search
            className="ml-2 shrink-0 text-[#173f35]"
            size={22}
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by book title or author..."
            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-gray-800 outline-none"
          />

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 rounded-xl bg-[#173f35] px-6 py-3 font-semibold text-white transition hover:bg-[#245b4d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
            Search
          </button>
        </form>

        {/* Welcome State */}
        {!searched && !loading && (
          <div className="py-12 text-center">
            <BookOpen
              size={55}
              className="mx-auto mb-5 text-[#a17b43]"
            />

            <h2 className="font-serif text-2xl font-bold text-[#173f35]">
              Find Your Next Favorite Book
            </h2>

            <p className="mt-3 text-gray-500">
              Enter a book title or author above to start exploring.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2
              className="animate-spin text-[#173f35]"
              size={42}
            />
            <p className="mt-4 text-sm text-gray-500">
              Searching the library...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Empty Result */}
        {!loading && searched && books.length === 0 && !error && (
          <div className="py-16 text-center">
            <BookOpen
              size={45}
              className="mx-auto mb-4 text-gray-400"
            />
            <h2 className="font-serif text-2xl font-bold text-[#173f35]">
              No Books Found
            </h2>
            <p className="mt-2 text-gray-500">
              Try another title or author name.
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading && books.length > 0 && (
          <section>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#173f35]">
                  Discover Books
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Search results for your reading journey
                </p>
              </div>

              <span className="rounded-full bg-[#e8eee5] px-4 py-2 text-sm font-semibold text-[#173f35]">
                {totalItems.toLocaleString()} books found
              </span>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <article
                  key={book.id}
                  className="group overflow-hidden rounded-2xl border border-[#e8e1d5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Book Cover */}
                  <div className="flex h-64 items-center justify-center bg-[#f0ede5] p-5">
                    {book.image ? (
                      <Image
                        src={book.image}
                        alt={book.title}
                        width={170}
                        height={230}
                        unoptimized
                        className="h-full w-auto max-w-full object-contain shadow-md transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <BookOpen
                        size={55}
                        className="text-[#a17b43]"
                      />
                    )}
                  </div>

                  {/* Book Information */}
                  <div className="flex min-h-[310px] flex-col p-5">
                    <h3 className="line-clamp-2 font-serif text-lg font-bold text-[#173f35]">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-[#a17b43]">
                      {book.authors.join(", ")}
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                      <p>Publisher: {book.publisher}</p>

                      {book.publishedDate && (
                        <p>Published: {book.publishedDate}</p>
                      )}

                      {book.pageCount && (
                        <p>{book.pageCount} pages</p>
                      )}
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                      {book.description}
                    </p>

                    {book.categories.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {book.categories.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-[#f0ede5] px-3 py-1 text-[10px] font-medium text-[#173f35]"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex gap-3 pt-5">
                      {book.infoLink && (
                        <Link
                          href={book.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#173f35] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245b4d]"
                        >
                          Details
                          <ExternalLink size={15} />
                        </Link>
                      )}

                      {book.previewLink && (
                        <Link
                          href={book.previewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center rounded-lg border border-[#173f35] px-3 py-2.5 text-sm font-semibold text-[#173f35] transition hover:bg-[#f0ede5]"
                        >
                          Preview
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
