
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  BookOpen,
  BookMarked,
  CheckCircle2,
  XCircle,
  Sparkles,
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

  const availabilityStyle = isAvailable
    ? "border-emerald-200/80 bg-emerald-50/95 text-emerald-800 dark:border-emerald-700/70 dark:bg-emerald-950/90 dark:text-emerald-300"
    : "border-red-200/80 bg-red-50/95 text-red-700 dark:border-red-800/70 dark:bg-red-950/90 dark:text-red-300";

  return (
    <article className="group/card relative flex h-full flex-col overflow-hidden rounded-[26px] border border-[#e8e0d0] bg-[#fffefa] shadow-[0_8px_30px_rgba(23,63,53,0.055)] transition-all duration-500 hover:-translate-y-2 hover:border-[#c6a45f]/60 hover:shadow-[0_24px_55px_rgba(23,63,53,0.14)] dark:border-[#34483d] dark:bg-[#1b2b24] dark:shadow-[0_8px_30px_rgba(0,0,0,0.18)] dark:hover:border-[#c6a45f]/70 dark:hover:shadow-[0_24px_55px_rgba(0,0,0,0.35)]">

      {/* Book Cover */}
      <Link
        href={`/books/${book._id}`}
        aria-label={`View ${book.title} details`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#eeeae0] dark:bg-[#243a32]"
      >
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover/card:scale-110"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#f5f0e5] to-[#e8e0d0] dark:from-[#243a32] dark:to-[#14231c]">
            <BookOpen
              size={62}
              strokeWidth={1}
              className="text-[#173f35]/40 dark:text-[#d6b779]/60"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#173f35]/50 dark:text-[#d6b779]/70">
              BookNook Library
            </span>
          </div>
        )}

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102a24]/75 via-[#102a24]/5 to-[#102a24]/10 opacity-80 transition-opacity duration-500 group-hover/card:opacity-100 dark:from-black/85 dark:via-black/15 dark:to-black/20" />

        {/* Inner Image Frame */}
        <div className="pointer-events-none absolute inset-3 rounded-[18px] border border-white/20 transition-all duration-500 group-hover/card:inset-4 group-hover/card:border-[#f0d9a1]/50" />

        {/* Category Badge */}
        <span className="absolute left-5 top-5 inline-flex items-center rounded-full border border-white/60 bg-[#fffaf0]/95 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#173f35] shadow-lg backdrop-blur-md">
          {book.category || "General"}
        </span>

        {/* Availability Badge */}
        <span
          className={`absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold shadow-lg backdrop-blur-md ${availabilityStyle}`}
        >
          {isAvailable ? (
            <CheckCircle2 size={12} />
          ) : (
            <XCircle size={12} />
          )}
          {isAvailable ? "Available" : "Out of Stock"}
        </span>

        {/* Image Bottom Content */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-white">
            <div className="flex size-8 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md">
              <BookMarked size={15} className="text-[#f0d9a1]" />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/90">
              Discover Your Next Read
            </span>
          </div>

          <Sparkles
            size={17}
            className="text-[#f0d9a1] opacity-0 transition-all duration-500 group-hover/card:rotate-12 group-hover/card:opacity-100"
          />
        </div>
      </Link>

      {/* Book Information */}
      <div className="relative flex flex-1 flex-col p-5 sm:p-6">

        {/* Small Gold Label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="h-px w-6 bg-[#c6a45f]" />
          <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#ad8b49] dark:text-[#d6b779]">
            Curated Collection
          </p>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[3.5rem] font-serif text-[21px] font-bold leading-snug text-[#173f35] transition-colors duration-300 group-hover/card:text-[#a17b35] dark:text-[#e8eee8] dark:group-hover/card:text-[#f0d9a1]">
          {book.title}
        </h3>

        {/* Author */}
        <p className="mt-2 text-xs font-medium tracking-wide text-[#88857b] dark:text-[#a6b5aa]">
          Written by{" "}
          <span className="font-semibold text-[#52665c] dark:text-[#d0dcd2]">
            {book.author}
          </span>
        </p>

        {/* Description */}
        <p className="mt-4 line-clamp-2 min-h-[48px] text-[13px] leading-6 text-[#77766f] dark:text-[#aab8ae]">
          {book.description ||
            "Discover this wonderful book in our library and explore its story."}
        </p>

        {/* Elegant Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e4dac5] to-[#e4dac5] dark:via-[#405449] dark:to-[#405449]" />
          <Sparkles size={12} className="text-[#c6a45f] dark:text-[#d6b779]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#e4dac5] to-[#e4dac5] dark:via-[#405449] dark:to-[#405449]" />
        </div>

        {/* Card Footer */}
        <div className="mt-auto flex items-center justify-between gap-3">

          {/* Available Copies */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#99958b] dark:text-[#a6b5aa]">
              Available Copies
            </p>

            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={`font-serif text-[27px] font-bold ${
                  isAvailable
                    ? "text-[#173f35] dark:text-[#e8eee8]"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {book.availableCopies}
              </span>

              <span className="text-sm text-[#aaa397] dark:text-[#819288]">
                / {book.totalCopies}
              </span>
            </div>

            <div className="mt-2 h-1 w-16 overflow-hidden rounded-full bg-[#eeeae0] dark:bg-[#34483d]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isAvailable ? "bg-[#b28a50]" : "bg-red-400"
                }`}
                style={{
                  width: `${
                    book.totalCopies > 0
                      ? Math.min(
                          100,
                          (book.availableCopies / book.totalCopies) * 100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Premium Details Button */}
          <Link
            href={`/books/${book._id}`}
            className="group/details inline-flex shrink-0 items-center gap-2 rounded-full border border-[#c6a45f] bg-gradient-to-br from-[#e3c783] to-[#c6a45f] px-4 py-3 text-xs font-bold text-[#173f35] shadow-[0_5px_15px_rgba(198,164,95,0.20)] transition-all duration-300 hover:-translate-y-1 hover:border-[#173f35] hover:from-[#173f35] hover:to-[#245747] hover:text-[#f0d9a1] hover:shadow-[0_10px_22px_rgba(23,63,53,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a45f] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1b2b24]"
          >
            Details

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Animated Gold Bottom Accent */}
      <div className="h-[3px] w-0 bg-gradient-to-r from-[#ad8b49] via-[#f0d9a1] to-[#ad8b49] transition-all duration-700 group-hover/card:w-full" />
    </article>
  );
}
