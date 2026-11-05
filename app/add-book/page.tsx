
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookPlus, ImagePlus, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { apiRequest } from "../lib/api-client";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BookData {
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

const categories = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Romance",
  "Mystery",
  "Fantasy",
  "Education",
  "Self-Help",
  "Finance",
  "Other",
];

export default function AddBookPage() {
  const router = useRouter();


  useEffect(() => {
  document.title = "BookNook | Add Book";
}, []);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    image: "",
    totalCopies: "1",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (Number(form.totalCopies) < 1) {
      toast.error("At least one copy is required.");
      return;
    }

    setLoading(true);

    try {
      const result = await apiRequest<ApiResponse<BookData>>(
        "/books",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            totalCopies: Number(form.totalCopies),
          }),
        }
      );

      if (result.success) {
        toast.success("Your book has been added successfully!");

        setForm({
          title: "",
          author: "",
          category: "",
          description: "",
          image: "",
          totalCopies: "1",
        });

        router.push("/all-books");
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add book."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-12 text-[#173f35] md:px-10">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#687c72] transition hover:text-[#173f35]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#b28a50]">
            Share Your Collection
          </p>

          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            Add a New Book
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#718078]">
            Add a new title to BookNook and let other readers
            discover their next favourite story.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr]">

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-[#e7e2d7] bg-white p-6 shadow-sm md:p-9"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Book Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter the book title"
                required
                maxLength={150}
                className="w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 outline-none transition focus:border-[#173f35]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Author Name *
              </label>

              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                maxLength={100}
                className="w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 outline-none transition focus:border-[#173f35]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category *
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#173f35]"
              >
                <option value="">Select a category</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Book Cover Image URL *
              </label>

              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/book-cover.jpg"
                required
                className="w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#173f35]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Total Copies *
              </label>

              <input
                type="number"
                name="totalCopies"
                value={form.totalCopies}
                onChange={handleChange}
                min="1"
                step="1"
                required
                className="w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#173f35]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Book Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short description about this book..."
                required
                rows={5}
                maxLength={3000}
                className="w-full resize-y rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#173f35]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#173f35] px-6 py-4 font-semibold text-white transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Adding Book...
                </>
              ) : (
                <>
                  <BookPlus size={19} />
                  Add Book to Library
                </>
              )}
            </button>
          </form>

          <aside className="space-y-6">

            <div className="rounded-3xl bg-[#173f35] p-7 text-white">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <ImagePlus size={24} className="text-[#e9c98b]" />
              </div>

              <h2 className="font-serif text-2xl font-bold">
                A New Story Begins Here
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/70">
                Every book has a story worth sharing. Add your
                collection and help readers explore new ideas,
                adventures and knowledge.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e7e2d7] bg-white p-7">
              <h3 className="mb-5 font-serif text-xl font-bold">
                Before You Publish
              </h3>

              <ul className="space-y-4 text-sm leading-6 text-[#718078]">
                <li>✓ Provide the correct book title and author.</li>
                <li>✓ Select the most relevant category.</li>
                <li>✓ Use a publicly accessible cover image URL.</li>
                <li>✓ Enter the correct number of copies.</li>
                <li>✓ Write a clear and helpful description.</li>
              </ul>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}
