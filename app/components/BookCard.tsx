
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  BookMarked,
  CheckCircle2,
  XCircle,
} from "lucide-react";

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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e8e0d0] bg-white shadow-[0_5px_25px_rgba(23,63,53,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d6b36c]/70 hover:shadow-[0_18px_45px_rgba(23,63,53,0.14)]">

      {/* Book Cover */}
      <Link
        href={`/books/${book._id}`}
        aria-label={`View ${book.title} details`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#f3f0e8]"
      >
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <BookOpen
              size={58}
              strokeWidth={1.2}
              className="text-[#173f35]/40"
            />
            <span className="text-xs font-medium tracking-[0.2em] text-[#173f35]/50">
              BOOKNOOK LIBRARY
            </span>
          </div>
        )}

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102a24]/55 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

        {/* Category Badge */}
        <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-[#fffaf0]/95 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#173f35] shadow-lg backdrop-blur-md">
          {book.category || "General"}
        </span>

        {/* Availability Badge */}
        <span
          className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-lg backdrop-blur-md ${
            isAvailable
              ? "border border-emerald-200 bg-emerald-50/95 text-emerald-800"
              : "border border-red-200 bg-red-50/95 text-red-700"
          }`}
        >
          {isAvailable ? (
            <CheckCircle2 size={13} />
          ) : (
            <XCircle size={13} />
          )}
          {isAvailable ? "Available" : "Out of Stock"}
        </span>

        {/* Bottom Image Label */}
        <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white">
          <BookMarked size={16} className="text-[#f0d9a1]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
            Discover Your Next Read
          </span>
        </div>
      </Link>

      {/* Book Information */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex-1">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ad8b49]">
            Featured Collection
          </p>

          <h3 className="line-clamp-2 font-serif text-xl font-bold leading-snug text-[#173f35] transition-colors duration-300 group-hover:text-[#a17b35]">
            {book.title}
          </h3>

          <p className="mt-2 text-sm font-medium text-[#77766f]">
            By <span className="text-[#4c6259]">{book.author}</span>
          </p>

          <p className="mt-4 line-clamp-2 min-h-[48px] text-sm leading-6 text-[#77766f]">
            {book.description || "Discover this wonderful book in our library and explore its story."}
          </p>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-gradient-to-r from-transparent via-[#e6ddca] to-transparent" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#99958b]">
              Available Copies
            </p>

            <p className="mt-1.5 flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-[#173f35]">
                {book.availableCopies}
              </span>
              <span className="text-sm text-[#99958b]">
                / {book.totalCopies}
              </span>
            </p>
          </div>

          {/* Premium Gold Button */}
          <Link
            href={`/books/${book._id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#c6a45f] bg-[#d6b36c] px-4 py-3 text-sm font-bold text-[#173f35] shadow-[0_4px_12px_rgba(214,179,108,0.2)] transition-all duration-300 hover:border-[#173f35] hover:bg-[#173f35] hover:text-[#f0d9a1] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b36c] focus-visible:ring-offset-2"
          >
            Details
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Bottom Gold Accent */}
      <div className="h-[3px] w-0 bg-gradient-to-r from-[#ad8b49] to-[#f0d9a1] transition-all duration-500 group-hover:w-full" />
    </article>
  );
}
