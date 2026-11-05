
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Library,
  CheckCircle2,
} from "lucide-react";

import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api-client";

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

// Book Details Content
function BookDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const bookId = params.id;
  useEffect(() => {
  document.title = "BookNook | Book Details";
}, []);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  // Fetch Book Details
  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/books/${bookId}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Book not found."
          );
        }

        setBook(result.data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load book."
        );

        setBook(null);
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  // Borrow Book
  async function handleBorrow() {
    if (!book) return;

    if (book.availableCopies <= 0) {
      toast.error("This book is currently unavailable.");
      return;
    }

    try {
      setBorrowing(true);

      const result = await apiRequest<ApiResponse<unknown>>(
        "/borrows",
        {
          method: "POST",
          body: JSON.stringify({
            bookId: book._id,
          }),
        }
      );

      if (result.success) {
        toast.success("Book borrowed successfully!");

        setBook((previous) =>
          previous
            ? {
                ...previous,
                availableCopies: Math.max(
                  0,
                  previous.availableCopies - 1
                ),
              }
            : null
        );

        router.push("/my-borrows");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to borrow this book."
      );
    } finally {
      setBorrowing(false);
    }
  }

  // Loading State
  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed]">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-[#173f35]"
          />

          <p className="mt-4 text-sm text-[#718078]">
            Loading book details...
          </p>
        </div>
      </main>
    );
  }

  // Book Not Found
  if (!book) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed] px-5">
        <div className="text-center">
          <BookOpen
            size={48}
            className="mx-auto mb-5 text-[#b28a50]"
          />

          <h1 className="font-serif text-3xl font-bold text-[#173f35]">
            Book Not Found
          </h1>

          <p className="mt-3 text-sm text-[#718078]">
            This book may have been removed from the library.
          </p>

          <Link
            href="/all-books"
            className="mt-7 inline-flex rounded-full bg-[#173f35] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#245747]"
          >
            Back to Library
          </Link>
        </div>
      </main>
    );
  }

  const available = book.availableCopies > 0;

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-12 text-[#173f35] md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          href="/all-books"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#718078] transition hover:text-[#173f35]"
        >
          <ArrowLeft size={17} />
          Back to Library
        </Link>

        {/* Book Details Card */}
        <div className="grid gap-12 rounded-3xl border border-[#e7e2d7] bg-white p-6 shadow-sm md:p-10 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Book Image */}
          <div className="flex items-start justify-center">
            <div className="w-full max-w-[390px] overflow-hidden rounded-2xl bg-[#eeeae0] shadow-lg">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="max-h-[560px] min-h-[350px] w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[350px] items-center justify-center">
                  <BookOpen
                    size={65}
                    className="text-[#b28a50]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Book Information */}
          <div className="flex flex-col justify-center py-3">

            <span className="mb-5 w-fit rounded-full bg-[#f2eee3] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#a17b43]">
              {book.category}
            </span>

            <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
              {book.title}
            </h1>

            <p className="mt-5 text-base text-[#718078]">
              Written by{" "}
              <span className="font-semibold text-[#173f35]">
                {book.author}
              </span>
            </p>

            <div className="my-8 h-px bg-[#eeeae0]" />

            <h2 className="mb-4 font-serif text-2xl font-bold">
              About This Book
            </h2>

            <p className="whitespace-pre-line text-sm leading-8 text-[#718078]">
              {book.description}
            </p>

            {/* Copies Information */}
            <div className="my-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-[#f8f5ed] p-5">
                <Library
                  size={22}
                  className="mb-3 text-[#b28a50]"
                />

                <p className="text-xs text-[#718078]">
                  Total Copies
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {book.totalCopies}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f5ed] p-5">
                <CheckCircle2
                  size={22}
                  className="mb-3 text-[#b28a50]"
                />

                <p className="text-xs text-[#718078]">
                  Available Copies
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {book.availableCopies}
                </p>
              </div>

            </div>

            {/* Availability Status */}
            <div className="mb-6">
              {available ? (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#286442]">
                  <span className="h-2 w-2 rounded-full bg-[#4d9b69]" />
                  Available for borrowing
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Currently unavailable
                </span>
              )}
            </div>

            {/* Borrow Button */}
            <button
              onClick={handleBorrow}
              disabled={!available || borrowing}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#173f35] px-7 py-4 font-semibold text-white transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:bg-[#9aa69f]"
            >
              {borrowing ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  Processing...
                </>
              ) : available ? (
                <>
                  <BookOpen size={19} />
                  Borrow This Book
                </>
              ) : (
                "Not Available"
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-[#8b9b91]">
              You need to be logged in to borrow a book.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}

// Main Page with Suspense
export default function BookDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f5ed]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#173f35] border-t-transparent" />

            <p className="mt-4 text-sm font-medium text-[#173f35]">
              Loading book details...
            </p>
          </div>
        </div>
      }
    >
      <BookDetailsContent />
    </Suspense>
  );
}
