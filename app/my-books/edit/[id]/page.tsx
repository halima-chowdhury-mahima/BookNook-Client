
"use client";

import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  BookOpen,
  Save,
  Loader2,
} from "lucide-react";

import { authClient } from "../../../lib/auth-client";
import { apiRequest } from "../../../lib/api-client";
import { API_URL } from "../../../lib/api";

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

interface BookForm {
  title: string;
  author: string;
  category: string;
  description: string;
  image: string;
  totalCopies: number;
}

const initialForm: BookForm = {
  title: "",
  author: "",
  category: "",
  description: "",
  image: "",
  totalCopies: 1,
};

// Main Edit Book Content
function EditBookContent() {
  const params = useParams<{ id: string }>();
  const bookId = params.id;

  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  const [form, setForm] = useState<BookForm>(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load selected book.
  useEffect(() => {
  if (isPending || !userId || !bookId) return;

  let cancelled = false;

  async function loadBook() {
    try {
      const response = await fetch(
        `${API_URL}/books/${bookId}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to find this book.");
      }

      const result = await response.json();

      const book: Book =
        result.data ?? result.book ?? result;

      if (book.addedBy !== userId) {
        throw new Error(
          "You can only edit your own books."
        );
      }

      if (!cancelled) {
        setForm({
          title: book.title ?? "",
          author: book.author ?? "",
          category: book.category ?? "",
          description: book.description ?? "",
          image: book.image ?? "",
          totalCopies: book.totalCopies ?? 1,
        });

        setLoading(false);
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );

        setLoading(false);
      }
    }
  }

  void loadBook();

  return () => {
    cancelled = true;
  };
}, [isPending, userId, bookId]);


  // Handle form inputs.
  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "totalCopies"
          ? Number(value)
          : value,
    }));
  }

  // Submit updated book.
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.title.trim() || !form.author.trim()) {
      toast.error(
        "Please enter the book title and author."
      );
      return;
    }

    if (
      !Number.isInteger(form.totalCopies) ||
      form.totalCopies < 1
    ) {
      toast.error(
        "Total copies must be at least 1."
      );
      return;
    }

    setSaving(true);

    try {
      await apiRequest(`/books/${bookId}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          author: form.author.trim(),
          category: form.category.trim(),
          description: form.description.trim(),
        }),
      });

      toast.success("Book updated successfully!");

      router.push("/my-books");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to update book."
      );
    } finally {
      setSaving(false);
    }
  }

  // Authentication loading.
  if (isPending || (userId && loading)) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2
          className="h-9 w-9 animate-spin text-[#173f35]"
        />
      </main>
    );
  }

  // Login required.
  if (!userId) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-[#173f35]" />

        <h1 className="text-2xl font-bold text-[#173f35]">
          Login Required
        </h1>

        <p className="mt-2 text-gray-500">
          Please login to edit your books.
        </p>

        <Link
          href="/login"
          className="mt-6 rounded-full bg-[#173f35] px-7 py-3 text-white"
        >
          Login
        </Link>
      </main>
    );
  }

  // Book loading error.
  if (error) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-bold text-red-700">
          Unable to Edit Book
        </h1>

        <p className="mt-3 text-gray-500">
          {error}
        </p>

        <Link
          href="/my-books"
          className="mt-6 rounded-full bg-[#173f35] px-7 py-3 text-white"
        >
          Back to My Books
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back Navigation */}
        <Link
          href="/my-books"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#173f35] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to My Books
        </Link>

        <div className="grid overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-[0.8fr_1.2fr]">

          {/* Left Side */}
          <div className="bg-[#173f35] p-8 text-white md:p-10">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d5b879]">
              BookNook Library
            </span>

            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
              Update Your Book
            </h1>

            <p className="mt-5 leading-7 text-white/70">
              Keep your library information accurate.
              Update your book details, cover image, and
              available collection.
            </p>

            {/* Book Cover Preview */}
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4">
              {form.image ? (
                <Image
                  src={form.image}
                  alt={form.title || "Book cover"}
                  width={220}
                  height={280}
                  unoptimized
                  className="mx-auto h-64 w-auto rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <BookOpen
                    size={65}
                    className="text-white/50"
                  />
                </div>
              )}

              <p className="mt-4 text-center font-serif text-lg">
                {form.title || "Your Book Cover"}
              </p>
            </div>
          </div>

          {/* Right Side - Edit Form */}
          <div className="p-6 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-[#173f35]">
              Book Information
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Update the fields below and save your changes.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Book Title *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#173f35]"
                  placeholder="Enter book title"
                />
              </div>

              {/* Author */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Author *
                </label>

                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173f35]"
                  placeholder="Enter author name"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173f35]"
                  placeholder="e.g. Fiction, Science, History"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Book Cover Image URL
                </label>

                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173f35]"
                  placeholder="https://example.com/book.jpg"
                />
              </div>

              {/* Total Copies */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Total Copies
                </label>

                <input
                  name="totalCopies"
                  type="number"
                  min="1"
                  step="1"
                  value={form.totalCopies}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173f35]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173f35]"
                  placeholder="Write a short description about this book..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173f35] px-6 py-4 font-semibold text-white transition hover:bg-[#245b4c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={19} />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

// Page Component with Suspense
export default function EditBookPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed]">
          <Loader2
            size={35}
            className="animate-spin text-[#173f35]"
          />
        </main>
      }
    >
      <EditBookContent />
    </Suspense>
  );
}
