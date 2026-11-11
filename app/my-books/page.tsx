
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Loader2,
  RefreshCw,
  X,
  AlertTriangle,
} from "lucide-react";

import toast from "react-hot-toast";
import { authClient } from "../lib/auth-client";
import { apiRequest } from "../lib/api-client";

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
}

interface BooksApiResponse {
  success?: boolean;
  data?: Book[];
  books?: Book[];
}

interface DeleteApiResponse {
  success?: boolean;
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const userId = session?.user?.id;

  // Initial books loading.
  useEffect(() => {
    if (isPending || !userId) return;

    let cancelled = false;

    async function loadBooks() {
      try {
        // Ensure state updates happen asynchronously.
        await Promise.resolve();

        if (!API_URL) {
          throw new Error("Backend API URL is not configured.");
        }

        const response = await fetch(`${API_URL}/books`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load your books.");
        }

        const result: BooksApiResponse = await response.json();

        const allBooks = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.books)
            ? result.books
            : [];

        if (!cancelled) {
          const myBooks = allBooks.filter(
            (book) => book.addedBy === userId
          );

          setBooks(myBooks);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBooks();

    return () => {
      cancelled = true;
    };
  }, [isPending, userId]);

  // Refresh books.
  const fetchMyBooks = useCallback(async () => {
    if (!userId || refreshing) return;

    try {
      setRefreshing(true);

      if (!API_URL) {
        throw new Error("Backend API URL is not configured.");
      }

      const response = await fetch(`${API_URL}/books`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to refresh your books.");
      }

      const result: BooksApiResponse = await response.json();

      const allBooks = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.books)
          ? result.books
          : [];

      setBooks(
        allBooks.filter((book) => book.addedBy === userId)
      );

      toast.success("Books refreshed successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setRefreshing(false);
    }
  }, [userId, refreshing]);

  // Open delete confirmation modal.
  function handleDeleteClick(book: Book) {
    setSelectedBook(book);
  }

  // Close delete confirmation modal.
  function closeDeleteModal() {
    if (deleting) return;
    setSelectedBook(null);
  }

  // Delete selected book.
  async function confirmDelete() {
    if (!selectedBook || deleting) return;

    const bookId = selectedBook._id;

    try {
      setDeleting(true);

      const result = await apiRequest<DeleteApiResponse>(
        `/books/${bookId}`,
        {
          method: "DELETE",
        }
      );

      if (!result.success) {
        throw new Error(
          result.message || "Unable to delete this book."
        );
      }

      setBooks((previous) =>
        previous.filter((book) => book._id !== bookId)
      );

      setSelectedBook(null);

      toast.success("Book deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete book."
      );
    } finally {
      setDeleting(false);
    }
  }

  // Authentication loading.
  if (isPending) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed]">
        <Loader2
          className="animate-spin text-[#173f35]"
          size={35}
        />
      </main>
    );
  }

  // Login required.
  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed] px-5">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <BookOpen
            size={45}
            className="mx-auto mb-5 text-[#b28a50]"
          />

          <h1 className="font-serif text-3xl font-bold text-[#173f35]">
            Login Required
          </h1>

          <p className="mt-3 text-sm text-[#718078]">
            Please log in to manage your books.
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 rounded-full bg-[#173f35] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#245747]"
          >
            Login Now
          </button>
        </div>
      </main>
    );
  }

  // Initial books loading.
  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed]">
        <Loader2
          className="animate-spin text-[#173f35]"
          size={35}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-14 text-[#173f35] md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#b28a50]">
              Your Collection
            </p>

            <h1 className="font-serif text-4xl font-bold md:text-5xl">
              My Books
            </h1>

            <p className="mt-4 text-sm text-[#718078]">
              Manage the books you have contributed to BookNook.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245747]"
          >
            <Plus size={18} />
            Add New Book
          </Link>
        </div>

        {/* Books Count */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-[#e7e2d7] bg-white p-6">
          <div>
            <p className="text-sm text-[#718078]">
              Books Added
            </p>

            <p className="mt-1 text-3xl font-bold">
              {books.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchMyBooks()}
            disabled={refreshing}
            className="rounded-full border border-[#e7e2d7] p-3 transition hover:bg-[#f8f5ed] disabled:opacity-50"
            aria-label="Refresh books"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="rounded-3xl border border-[#e7e2d7] bg-white px-6 py-16 text-center">
            <BookOpen
              size={45}
              className="mx-auto mb-5 text-[#b28a50]"
            />

            <h2 className="font-serif text-2xl font-bold">
              No Books Added Yet
            </h2>

            <p className="mt-3 text-sm text-[#718078]">
              Your added books will appear here.
            </p>

            <Link
              href="/add-book"
              className="mt-6 inline-flex rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          /* Books Table */
          <div className="overflow-hidden rounded-2xl border border-[#e7e2d7] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-[#173f35] text-white">
                  <tr>
                    <th className="p-5">Book</th>
                    <th className="p-5">Category</th>
                    <th className="p-5">Total Copies</th>
                    <th className="p-5">Available</th>
                    <th className="p-5">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      className="border-b border-[#eeeae0] last:border-0"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          {book.image ? (
                            <img
                              src={book.image}
                              alt={book.title}
                              className="h-16 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-[#f2eee3]">
                              <BookOpen size={20} />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold">
                              {book.title}
                            </p>

                            <p className="mt-1 text-xs text-[#718078]">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-5">{book.category}</td>
                      <td className="p-5">{book.totalCopies}</td>
                      <td className="p-5">{book.availableCopies}</td>

                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/books/${book._id}`}
                            title="View book"
                            aria-label={`View ${book.title}`}
                            className="rounded-lg bg-[#f2eee3] p-2 text-[#173f35] transition hover:bg-[#e7e0cf]"
                          >
                            <BookOpen size={17} />
                          </Link>

                          <Link
                            href={`/my-books/edit/${book._id}`}
                            title="Edit book"
                            aria-label={`Edit ${book.title}`}
                            className="rounded-lg bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                          >
                            <Edit size={17} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteClick(book)}
                            title="Delete book"
                            aria-label={`Delete ${book.title}`}
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="relative w-full max-w-md rounded-3xl border border-[#e7e2d7] bg-white p-7 shadow-2xl"
          >
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleting}
              aria-label="Close modal"
              className="absolute right-5 top-5 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={19} />
            </button>

            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle
                size={30}
                className="text-red-600"
              />
            </div>

            <h2
              id="delete-modal-title"
              className="mt-5 text-center font-serif text-2xl font-bold text-[#173f35]"
            >
              Delete This Book?
            </h2>

            <p className="mt-3 text-center text-sm leading-7 text-[#718078]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#173f35]">
                {selectedBook.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 rounded-full border border-[#e7e2d7] px-5 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#f8f5ed] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete Book
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
