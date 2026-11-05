
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  RotateCcw,
  Loader2,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "../lib/auth-client";
import { apiRequest } from "../lib/api-client";

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string;
  borrowedAt: string;
  returnedAt?: string;
  status: "active" | "returned";
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: Borrow[];
  borrows?: Borrow[];
}

export default function MyBorrowsPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState<string | null>(null);

  const userId = session?.user?.id;

  useEffect(() => {
    document.title = "BookNook | My Borrows";
  }, []);

  // Load the logged-in user's borrowing history.
  useEffect(() => {
    if (isPending || !userId) return;

    let cancelled = false;

    async function loadBorrows() {
      try {
        const result = await apiRequest<ApiResponse>("/borrows");

        const borrowList = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.borrows)
            ? result.borrows
            : [];

        if (!cancelled) {
          setBorrows(borrowList);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load borrowing history."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBorrows();

    return () => {
      cancelled = true;
    };
  }, [isPending, userId]);

  // Return a borrowed book.
  async function handleReturn(borrowId: string) {
    try {
      setReturning(borrowId);

      const result = await apiRequest<{
        success: boolean;
        message?: string;
      }>(`/borrows/${borrowId}`, {
        method: "DELETE",
      });

      if (result.success) {
        toast.success("Book returned successfully!");

        setBorrows((previous) =>
          previous.map((borrow) =>
            borrow._id === borrowId
              ? {
                  ...borrow,
                  status: "returned",
                  returnedAt: new Date().toISOString(),
                }
              : borrow
          )
        );
      } else {
        toast.error(result.message || "Unable to return this book.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to return this book."
      );
    } finally {
      setReturning(null);
    }
  }

  // Authentication is still loading.
  if (isPending) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed] dark:bg-[#111d19]">
        <Loader2
          size={36}
          className="animate-spin text-[#173f35] dark:text-[#d6b779]"
        />
      </main>
    );
  }

  // User is not logged in.
  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed] px-5 dark:bg-[#111d19]">
        <div className="rounded-3xl border border-[#e7e2d7] bg-white p-10 text-center shadow-sm dark:border-[#34483d] dark:bg-[#1b2b24]">
          <BookOpen
            size={45}
            className="mx-auto mb-5 text-[#b28a50] dark:text-[#d6b779]"
          />

          <h1 className="font-serif text-3xl font-bold text-[#173f35] dark:text-[#e8eee8]">
            Login Required
          </h1>

          <p className="mt-3 text-sm text-[#718078] dark:text-[#aab8ae]">
            Please log in to view your borrowing history.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-full bg-[#173f35] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#245747] dark:bg-[#d6b779] dark:text-[#173f35] dark:hover:bg-[#f0d9a1]"
          >
            Login Now
          </button>
        </div>
      </main>
    );
  }

  // Borrow history is loading.
  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#f8f5ed] dark:bg-[#111d19]">
        <Loader2
          size={36}
          className="animate-spin text-[#173f35] dark:text-[#d6b779]"
        />
        <p className="text-sm text-[#718078] dark:text-[#aab8ae]">
          Loading your borrowing history...
        </p>
      </main>
    );
  }

  const activeBorrows = borrows.filter(
    (borrow) => borrow.status === "active"
  );

  const returnedBorrows = borrows.filter(
    (borrow) => borrow.status === "returned"
  );

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-14 text-[#173f35] transition-colors duration-300 dark:bg-[#111d19] dark:text-[#e8eee8] md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#b28a50] dark:text-[#d6b779]">
            Your Reading Journey
          </p>

          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            My Borrows
          </h1>

          <p className="mt-4 text-sm text-[#718078] dark:text-[#aab8ae]">
            Manage borrowed books and explore your reading history.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e7e2d7] bg-white p-6 transition-colors dark:border-[#34483d] dark:bg-[#1b2b24]">
            <p className="text-sm text-[#718078] dark:text-[#aab8ae]">
              Total Borrowed
            </p>
            <p className="mt-3 text-3xl font-bold text-[#173f35] dark:text-[#e8eee8]">
              {borrows.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e2d7] bg-white p-6 transition-colors dark:border-[#34483d] dark:bg-[#1b2b24]">
            <p className="text-sm text-[#718078] dark:text-[#aab8ae]">
              Currently Borrowed
            </p>
            <p className="mt-3 text-3xl font-bold text-[#173f35] dark:text-[#e8eee8]">
              {activeBorrows.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e2d7] bg-white p-6 transition-colors dark:border-[#34483d] dark:bg-[#1b2b24]">
            <p className="text-sm text-[#718078] dark:text-[#aab8ae]">
              Returned
            </p>
            <p className="mt-3 text-3xl font-bold text-[#173f35] dark:text-[#e8eee8]">
              {returnedBorrows.length}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {borrows.length === 0 ? (
          <div className="rounded-3xl border border-[#e7e2d7] bg-white px-6 py-16 text-center transition-colors dark:border-[#34483d] dark:bg-[#1b2b24]">
            <BookOpen
              size={45}
              className="mx-auto mb-5 text-[#b28a50] dark:text-[#d6b779]"
            />

            <h2 className="font-serif text-2xl font-bold text-[#173f35] dark:text-[#e8eee8]">
              No Borrowing History
            </h2>

            <p className="mt-3 text-sm text-[#718078] dark:text-[#aab8ae]">
              Discover a book and start your reading journey.
            </p>

            <Link
              href="/all-books"
              className="mt-6 inline-flex rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245747] dark:bg-[#d6b779] dark:text-[#173f35] dark:hover:bg-[#f0d9a1]"
            >
              Explore Books
            </Link>
          </div>
        ) : (
          /* Borrowing History */
          <div className="space-y-5">
            {borrows.map((borrow) => (
              <article
                key={borrow._id}
                className="flex flex-col gap-6 rounded-2xl border border-[#e7e2d7] bg-white p-5 shadow-sm transition hover:shadow-md dark:border-[#34483d] dark:bg-[#1b2b24] dark:hover:shadow-black/20 md:flex-row md:items-center md:p-7"
              >
                {borrow.bookImage ? (
                  <img
                    src={borrow.bookImage}
                    alt={borrow.bookTitle}
                    className="h-36 w-28 rounded-xl bg-[#eeeae0] object-cover dark:bg-[#243a32]"
                  />
                ) : (
                  <div className="flex h-36 w-28 items-center justify-center rounded-xl bg-[#eeeae0] dark:bg-[#243a32]">
                    <BookOpen
                      size={35}
                      className="text-[#b28a50] dark:text-[#d6b779]"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-xl font-bold text-[#173f35] dark:text-[#e8eee8]">
                    {borrow.bookTitle}
                  </h3>

                  <p className="mt-2 text-sm text-[#718078] dark:text-[#aab8ae]">
                    By {borrow.bookAuthor}
                  </p>

                  <p className="mt-4 flex items-center gap-2 text-xs text-[#8b9b91] dark:text-[#91a398]">
                    <CalendarDays size={15} />
                    Borrowed on{" "}
                    {new Date(borrow.borrowedAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                  {borrow.returnedAt && (
                    <p className="mt-2 text-xs text-[#8b9b91] dark:text-[#91a398]">
                      Returned on{" "}
                      {new Date(borrow.returnedAt).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 md:min-w-[170px]">
                  <span
                    className={`rounded-full px-4 py-2 text-center text-xs font-bold ${
                      borrow.status === "active"
                        ? "bg-[#e5f1e8] text-[#286442] dark:bg-[#244b35] dark:text-[#a8e0b7]"
                        : "bg-[#f2eee3] text-[#8a7148] dark:bg-[#403a2b] dark:text-[#e3c783]"
                    }`}
                  >
                    {borrow.status === "active"
                      ? "Currently Borrowed"
                      : "Returned"}
                  </span>

                  {borrow.status === "active" && (
                    <button
                      onClick={() => handleReturn(borrow._id)}
                      disabled={returning === borrow._id}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#173f35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#d6b779] dark:text-[#173f35] dark:hover:bg-[#f0d9a1]"
                    >
                      {returning === borrow._id ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <RotateCcw size={17} />
                      )}
                      Return Book
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
