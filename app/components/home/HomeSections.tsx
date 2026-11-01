
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
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore our collection and find stories that match your interests.",
    icon: Search,
  },
  {
    number: "02",
    title: "Borrow",
    description:
      "Choose your favorite book and borrow it with just a few clicks.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Enjoy & Return",
    description:
      "Enjoy every chapter and return your book when you finish reading.",
    icon: RotateCcw,
  },
];

const categories = [
  {
    name: "Fiction",
    description: "Stories beyond imagination",
    icon: Feather,
  },
  {
    name: "Science",
    description: "Explore how the world works",
    icon: FlaskConical,
  },
  {
    name: "History",
    description: "Discover stories of the past",
    icon: Landmark,
  },
  {
    name: "Kids",
    description: "Little books, big adventures",
    icon: Baby,
  },
  {
    name: "Self-Help",
    description: "Grow, learn and become your best self",
    icon: HeartHandshake,
  },
  {
    name: "Finance",
    description: "Learn about money and wealth",
    icon: Wallet,
  },
  {
    name: "Technology",
    description: "Discover the world of innovation",
    icon: Cpu,
  },
  {
    name: "Education",
    description: "Knowledge that inspires learning",
    icon: BookMarked,
  },
];

export default function HomeSections() {
  return (
    <>
      {/* How BookNook Works */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-xs font-bold tracking-[0.25em] text-[#c47755]">
              SIMPLE & WONDERFUL
            </span>

            <h2 className="section-title mt-4">
              How BookNook Works
            </h2>

            <p className="section-description mt-5">
              Your journey to a wonderful reading experience
              is only three simple steps away.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative rounded-lg border border-[#e8e4da] bg-[#f8f5ed] p-8 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <span className="absolute right-6 top-5 text-4xl font-bold text-[#173f35]/10">
                    {step.number}
                  </span>

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#173f35] text-[#e3c69d] transition duration-300 group-hover:rotate-[-8deg]">
                    <Icon size={27} />
                  </div>

                  <h3 className="text-serif mt-7 text-2xl font-semibold text-[#173f35]">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#737b73]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="section-padding bg-[#eaf0e7]">
        <div className="container-custom">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-[#c47755]">
                FIND YOUR INTEREST
              </span>

              <h2 className="section-title mt-4">
                Explore by Category
              </h2>

              <p className="section-description mt-4 max-w-xl">
                From imaginary worlds to fascinating discoveries,
                find the kind of books you love.
              </p>
            </div>

            <Link
              href="/all-books"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#173f35] transition hover:text-[#c47755]"
            >
              Explore All
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/all-books?category=${encodeURIComponent(category.name)}`}
                  className="group rounded-lg border border-[#dce5d8] bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-[#173f35] hover:shadow-lg sm:p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf0e7] text-[#173f35] transition group-hover:bg-[#173f35] group-hover:text-[#e3c69d]">
                    <Icon size={25} />
                  </div>

                  <h3 className="text-serif mt-6 text-xl font-semibold text-[#173f35]">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#737b73]">
                    {category.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#c47755]">
                    Discover
                    <ArrowUpRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
