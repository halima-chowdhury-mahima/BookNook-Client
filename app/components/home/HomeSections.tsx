import Link from "next/link";
import {
  Search,
  BookOpen,
  RotateCcw,
  FlaskConical,
  Landmark,
  Baby,
  Feather,
  ArrowUpRight,
  Wallet,
  HeartHandshake,
  Cpu,
  BookMarked,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore our carefully organized collection and discover stories that speak to your interests.",
    icon: Search,
  },
  {
    number: "02",
    title: "Borrow",
    description:
      "Choose a book you love and make it yours with a simple and convenient borrowing experience.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Enjoy & Return",
    description:
      "Immerse yourself in every chapter and return your book when your reading journey is complete.",
    icon: RotateCcw,
  },
];

const categories = [
  {
    name: "Fiction",
    description: "Stories beyond imagination",
    icon: Feather,
    number: "01",
  },
  {
    name: "Science",
    description: "Explore how the world works",
    icon: FlaskConical,
    number: "02",
  },
  {
    name: "History",
    description: "Discover stories of the past",
    icon: Landmark,
    number: "03",
  },
  {
    name: "Kids",
    description: "Little books, big adventures",
    icon: Baby,
    number: "04",
  },
  {
    name: "Self-Help",
    description: "Grow, learn and become your best self",
    icon: HeartHandshake,
    number: "05",
  },
  {
    name: "Finance",
    description: "Learn about money and wealth",
    icon: Wallet,
    number: "06",
  },
  {
    name: "Technology",
    description: "Discover the world of innovation",
    icon: Cpu,
    number: "07",
  },
  {
    name: "Education",
    description: "Knowledge that inspires learning",
    icon: BookMarked,
    number: "08",
  },
];

export default function HomeSections() {
  return (
    <>
      {/* How BookNook Works */}
      <section className="relative overflow-hidden bg-[#fbfaf6] py-16 sm:py-20 lg:py-24">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-[#d7bd85]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#173f35]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e5d9bf] bg-white px-4 py-2">
              <Sparkles size={14} className="text-[#a88a53]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8d7549]">
                Simple & Wonderful
              </span>
            </div>

            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#173f35] sm:text-4xl lg:text-5xl">
              How BookNook Works
              <span className="text-[#b4955d]">.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#777b70] sm:text-base">
              A beautiful reading experience begins with a simple journey.
              Discover, borrow and enjoy your next favorite story.
            </p>
          </div>

          <div className="relative grid gap-6 md:grid-cols-3 md:gap-7">
            {/* Connecting Line */}
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-[46px] hidden border-t border-dashed border-[#cbb78d] md:block" />

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative rounded-2xl border border-[#e9e2d5] bg-white p-7 text-center shadow-[0_8px_30px_rgba(28,53,42,0.035)] transition-all duration-300 hover:-translate-y-2 hover:border-[#cbb78d] hover:shadow-[0_20px_45px_rgba(28,53,42,0.09)] sm:p-9"
                >
                  <div className="relative mx-auto flex h-[92px] w-[92px] items-center justify-center rounded-full border border-[#e8dcc2] bg-[#fbf8f0]">
                    <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#173f35] text-[#e4ca94] shadow-lg transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
                      <Icon size={27} strokeWidth={1.7} />
                    </div>

                    <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#c3a46b] font-serif text-[11px] font-bold text-white shadow-sm">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 font-serif text-2xl font-bold text-[#173f35]">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#7b8077]">
                    {step.description}
                  </p>

                  <div className="mx-auto mt-7 h-px w-12 bg-[#c6aa74] transition-all duration-300 group-hover:w-20" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="relative overflow-hidden bg-[#173f35] py-16 sm:py-20 lg:py-24">
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/[0.07]" />
        <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border border-white/[0.07]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#c5a56b]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2">
                <BookOpen size={14} className="text-[#e0c48c]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e0c48c]">
                  Find Your Interest
                </span>
              </div>

              <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Explore by Category
                <span className="text-[#d8bd84]">.</span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                From imaginary worlds to fascinating discoveries, find a
                collection that inspires your curiosity and imagination.
              </p>
            </div>

            <Link
              href="/all-books"
              className="group inline-flex w-fit items-center gap-3 rounded-xl border border-[#d8bd84]/50 px-5 py-3.5 text-sm font-semibold text-[#f0d9a1] transition duration-300 hover:border-[#d8bd84] hover:bg-[#d8bd84] hover:text-[#173f35]"
            >
              Explore All Books
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/all-books?category=${encodeURIComponent(category.name)}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition-all duration-300 hover:-translate-y-2 hover:border-[#d8bd84]/70 hover:bg-white/[0.11] hover:shadow-[0_20px_40px_rgba(0,0,0,0.16)] sm:p-7"
                >
                  {/* Card Number */}
                  <span className="absolute right-5 top-5 font-serif text-2xl font-bold text-white/[0.10] transition-colors group-hover:text-[#d8bd84]/40">
                    {category.number}
                  </span>

                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d8bd84]/25 bg-[#d8bd84]/10 text-[#e3c991] transition-all duration-300 group-hover:rotate-[-6deg] group-hover:bg-[#d8bd84] group-hover:text-[#173f35]">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>

                  <h3 className="mt-6 font-serif text-lg font-bold text-white transition-colors group-hover:text-[#e5cb96] sm:text-xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 min-h-10 text-xs leading-6 text-white/55 sm:text-sm">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8bd84]">
                      Discover
                    </span>

                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all group-hover:border-[#d8bd84] group-hover:bg-[#d8bd84] group-hover:text-[#173f35]">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Brand Accent */}
          <div className="mt-14 flex items-center justify-center gap-4 border-t border-white/10 pt-8">
            <span className="h-px w-10 bg-[#d8bd84]/50" />
            <p className="font-serif text-sm italic tracking-wide text-[#e0c48c]">
              Find the book that finds you.
            </p>
            <span className="h-px w-10 bg-[#d8bd84]/50" />
          </div>
        </div>
      </section>
    </>
  );
}