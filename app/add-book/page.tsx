
"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Upload,
  Loader2,
  ArrowLeft,
  ImagePlus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "../lib/auth-client";
import { apiRequest } from "../lib/api-client";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

interface AddBookResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export default function AddBookPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string>("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState("1");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  // Clean up the preview URL when the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // Handle image selection.
  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    // Remove the previous preview URL.
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    previewUrlRef.current = newPreviewUrl;

    setImageFile(file);
    setImagePreview(newPreviewUrl);
  }

  // Remove selected image.
  function handleRemoveImage() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Upload image to ImgBB.
  async function uploadImage(): Promise<string> {
    if (!imageFile) {
      throw new Error("Please select a book image.");
    }

    if (!IMGBB_API_KEY) {
      throw new Error(
        "ImgBB API key is missing. Configure NEXT_PUBLIC_IMGBB_API_KEY."
      );
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(
          result.error?.message || "Image upload failed."
        );
      }

      return result.data.url as string;
    } finally {
      setUploadingImage(false);
    }
  }

  // Submit book information.
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user) {
      toast.error("Please login before adding a book.");
      return;
    }

    if (
      !title.trim() ||
      !author.trim() ||
      !category ||
      !description.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload a book image.");
      return;
    }

    const copies = Number(totalCopies);

    if (!Number.isInteger(copies) || copies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    setSubmitting(true);

    try {
      toast.loading("Uploading book image...", {
        id: "add-book",
      });

      // Step 1: Upload image.
      const uploadedImageUrl = await uploadImage();

      toast.loading("Saving book information...", {
        id: "add-book",
      });

      // Step 2: Prepare book data.
      const payload = {
        title: title.trim(),
        author: author.trim(),
        category,
        description: description.trim(),
        image: uploadedImageUrl,
        totalCopies: copies,
        availableCopies: copies,
        addedBy: user.email || "",
      };

      // Step 3: Save book in MongoDB through backend API.
      const result = await apiRequest<AddBookResponse>(
        "/books",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      toast.success(
        result?.message || "Book added successfully!",
        {
          id: "add-book",
        }
      );

      router.push("/all-books");
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add book.",
        {
          id: "add-book",
        }
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#e5e7df] bg-[#fcfbf8] px-4 py-3 text-sm text-[#173f35] outline-none transition placeholder:text-[#8b9b91] focus:border-[#173f35] focus:ring-2 focus:ring-[#173f35]/10 dark:border-[#34483d] dark:bg-[#15251e] dark:text-[#e8eee8] dark:placeholder:text-[#91a197]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#173f35] dark:text-[#e8eee8]";

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ed] dark:bg-[#111d19]">
        <Loader2
          className="animate-spin text-[#173f35] dark:text-[#d6b779]"
          size={38}
        />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ed] px-5 dark:bg-[#111d19]">
        <div className="max-w-md rounded-3xl border border-[#e7e2d7] bg-white p-9 text-center dark:border-[#34483d] dark:bg-[#1b2b24]">
          <BookOpen
            className="mx-auto mb-4 text-[#b28a50]"
            size={45}
          />

          <h1 className="font-serif text-2xl font-bold text-[#173f35] dark:text-[#e8eee8]">
            Login Required
          </h1>

          <p className="mt-3 text-sm text-[#718078] dark:text-[#a5b3a9]">
            Please login to add a new book to the library.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-[#173f35] px-7 py-3 text-sm font-semibold text-white dark:bg-[#d6b779] dark:text-[#173f35]"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-12 text-[#173f35] transition-colors dark:bg-[#111d19] dark:text-[#e8eee8] md:px-10">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/all-books"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#718078] transition hover:text-[#173f35] dark:text-[#a5b3a9] dark:hover:text-[#f0d9a1]"
        >
          <ArrowLeft size={17} />
          Back to All Books
        </Link>

        <div className="mb-9 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#b28a50] dark:text-[#d6b779]">
            Expand Our Collection
          </p>

          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            Add a New Book
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#718078] dark:text-[#a5b3a9]">
            Share a new story with our readers by adding a book
            to the BookNook library.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#e7e2d7] bg-white p-6 shadow-sm dark:border-[#34483d] dark:bg-[#1b2b24] md:p-10"
        >
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold">
              Book Information
            </h2>

            <p className="mt-2 text-sm text-[#718078] dark:text-[#a5b3a9]">
              Enter the details of the book you want to add.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className={labelClass}>
                Book Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                maxLength={150}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Author Name *
              </label>

              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                maxLength={100}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Category *
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Select a category</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Total Copies *
              </label>

              <input
                type="number"
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                min={1}
                step={1}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Added By
              </label>

              <input
                type="text"
                value={user.name || ""}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-75`}
              />
            </div>

            <div>
              <label className={labelClass}>
                User Email
              </label>

              <input
                type="email"
                value={user.email || ""}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-75`}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className={labelClass}>
              Short Description *
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description about the book..."
              rows={5}
              maxLength={3000}
              required
              className={`${inputClass} resize-y`}
            />

            <p className="mt-2 text-right text-xs text-[#8b9b91] dark:text-[#91a197]">
              {description.length}/3000
            </p>
          </div>

          <div className="mt-6">
            <label className={labelClass}>
              Book Cover Image *
            </label>

            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d9dfd7] bg-[#fcfbf8] p-6 text-center transition hover:border-[#b28a50] dark:border-[#405448] dark:bg-[#15251e] dark:hover:border-[#d6b779]">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Book cover preview"
                    width={180}
                    height={220}
                    unoptimized
                    className="h-52 w-40 rounded-xl object-cover shadow-md"
                  />

                  <span className="mt-3 block text-xs font-semibold text-[#286442] dark:text-[#9de0b4]">
                    Image selected
                  </span>
                </div>
              ) : (
                <>
                  <ImagePlus
                    size={40}
                    className="mb-3 text-[#b28a50] dark:text-[#d6b779]"
                  />

                  <span className="text-sm font-semibold">
                    Click to upload book cover
                  </span>

                  <span className="mt-2 text-xs text-[#8b9b91] dark:text-[#91a197]">
                    JPG, PNG, WEBP — Maximum 5 MB
                  </span>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imageFile && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f3f6f1] px-4 py-3 text-xs dark:bg-[#243a32]">
                <span className="truncate text-[#173f35] dark:text-[#e8eee8]">
                  {imageFile.name}
                </span>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="ml-3 text-red-500 hover:text-red-700"
                  aria-label="Remove image"
                >
                  <X size={17} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/all-books"
              className="rounded-full border border-[#d9dfd7] px-7 py-3 text-center text-sm font-semibold text-[#718078] transition hover:border-[#173f35] dark:border-[#405448] dark:text-[#a5b3a9]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#d6b779] dark:text-[#173f35] dark:hover:bg-[#f0d9a1]"
            >
              {submitting || uploadingImage ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  {uploadingImage
                    ? "Uploading Image..."
                    : "Adding Book..."}
                </>
              ) : (
                <>
                  <Upload size={17} />
                  Add Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
