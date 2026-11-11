
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Loader2,
  RefreshCw,
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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchMyBooks() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/books`);

      if (!response.ok) {
        throw new Error("Unable to load books.");
      }

      const result = await response.json();

      const allBooks: Book[] = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.books)
          ? result.books
          : [];

      const userId = session?.user?.id;

      setBooks(
        allBooks.filter((book) => book.addedBy === userId)
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  
useEffect(() => {
  if (isPending) return;

  let cancelled = false;

  async function loadMyBooks() {
    if (!session?.user) {
      if (!cancelled) {
        setLoading(false);
      }
      return;
    }

    try {
      const response = await fetch(`${API_URL}/books`);

      if (!response.ok) {
        throw new Error("Unable to load books.");
      }

      const result = await response.json();

      const allBooks: Book[] = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.books)
          ? result.books
          : [];

      if (!cancelled) {
        setBooks(
          allBooks.filter(
            (book) => book.addedBy === session.user.id
          )
        );
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

  loadMyBooks();

  return () => {
    cancelled = true;
  };
}, [isPending, session]);


  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

      const result = await apiRequest<ApiResponse<unknown>>(
        `/books/${id}`,
        { method: "DELETE" }
      );

      if (result.success) {
        setBooks((previous) =>
          previous.filter((book) => book._id !== id)
        );

        toast.success("Book deleted successfully.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete book."
      );
    } finally {
      setDeleting(null);
    }
  }

  if (isPending || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed]">
        <Loader2 className="animate-spin text-[#173f35]" size={35} />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed] px-5">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <BookOpen size={45} className="mx-auto mb-5 text-[#b28a50]" />
          <h1 className="font-serif text-3xl font-bold text-[#173f35]">
            Login Required
          </h1>
          <p className="mt-3 text-sm text-[#718078]">
            Please log in to manage your books.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-full bg-[#173f35] px-7 py-3 text-sm font-semibold text-white"
          >
            Login Now
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-14 text-[#173f35] md:px-10">
      <div className="mx-auto max-w-7xl">

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

        <div className="mb-8 flex items-center justify-between rounded-2xl border border-[#e7e2d7] bg-white p-6">
          <div>
            <p className="text-sm text-[#718078]">Books Added</p>
            <p className="mt-1 text-3xl font-bold">{books.length}</p>
          </div>

          <button
            onClick={fetchMyBooks}
            className="rounded-full border border-[#e7e2d7] p-3 transition hover:bg-[#f8f5ed]"
            aria-label="Refresh books"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {books.length === 0 ? (
          <div className="rounded-3xl border border-[#e7e2d7] bg-white px-6 py-16 text-center">
            <BookOpen size={45} className="mx-auto mb-5 text-[#b28a50]" />
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
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-16 w-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold">{book.title}</p>
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
                            className="rounded-lg bg-[#f2eee3] p-2 text-[#173f35]"
                          >
                            <BookOpen size={17} />
                          </Link>

                          <Link
                            href={`/my-books/edit/${book._id}`}
                            title="Edit book"
                            className="rounded-lg bg-blue-50 p-2 text-blue-700"
                          >
                            <Edit size={17} />
                          </Link>

                          <button
                            onClick={() => handleDelete(book._id)}
                            disabled={deleting === book._id}
                            title="Delete book"
                            className="rounded-lg bg-red-50 p-2 text-red-600 disabled:opacity-50"
                          >
                            {deleting === book._id ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
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
    </main>
  );
}
