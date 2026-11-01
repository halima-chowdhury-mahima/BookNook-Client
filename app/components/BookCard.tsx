
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export interface Book {
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

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e9e4d9] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <Link
        href={`/books/${book._id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#f0ede5]"
      >
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen size={52} className="text-[#173f35]/40" />
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-[#f8f5ed] px-3 py-1 text-xs font-semibold text-[#173f35] shadow-sm">
          {book.category || "General"}
        </span>

        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
            isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isAvailable ? "Available" : "Not Available"}
        </span>
      </Link>

      <div className="p-5">
        <h3 className="line-clamp-1 font-serif text-xl font-bold text-[#173f35] transition group-hover:text-[#a17b35]">
          {book.title}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          By {book.author}
        </p>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-6 text-gray-600">
          {book.description || "Discover this book in our library."}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400">Available Copies</p>
            <p className="mt-1 font-bold text-[#173f35]">
              {book.availableCopies} / {book.totalCopies}
            </p>
          </div>

          <Link
            href={`/books/${book._id}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#173f35] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245b4c]"
          >
            Details
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
