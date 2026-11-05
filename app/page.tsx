
import type { Metadata } from "next";

import HeroSlider from "./components/home/HeroSlider";
import NewArrivals from "./components/home/NewArrivals";
import HomeSections from "./components/home/HomeSections";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover wonderful stories, explore new books and enjoy borrowing at BookNook.",
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">

      {/* Hero Section */}
      <section
        aria-label="Featured books"
        className="relative isolate"
      >
        <HeroSlider />
      </section>

      {/* Decorative Transition */}
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-center gap-4 px-6 py-5 sm:py-7">

        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d8c69f] dark:to-[#6d6047]" />

        <span className="font-serif text-xs italic tracking-[0.2em] text-[#a88a53] dark:text-[#d6b779] sm:text-sm">
          Discover · Read · Belong
        </span>

        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d8c69f] dark:to-[#6d6047]" />

      </div>

      {/* Latest Arrivals */}
      <section
        aria-label="Latest book arrivals"
        className="relative isolate overflow-hidden bg-background py-10 transition-colors duration-300 sm:py-14 lg:py-16"
      >

        {/* Background Decoration */}
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#d9c59b]/10 blur-3xl" />

        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#173f35]/5 blur-3xl dark:bg-[#6caa8c]/5" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <NewArrivals />
        </div>

      </section>

      {/* Editorial Divider */}
      <div className="relative z-10 bg-background px-4 transition-colors duration-300">
        <div className="mx-auto max-w-7xl border-t border-border" />
      </div>

      {/* Explore Library */}
      <section
        aria-label="Explore the library"
        className="relative isolate overflow-hidden bg-secondary py-12 transition-colors duration-300 sm:py-16 lg:py-20"
      >

        {/* Soft Background Accents */}
        <div className="pointer-events-none absolute -left-36 top-10 h-80 w-80 rounded-full bg-[#d9c59b]/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#173f35]/5 blur-3xl dark:bg-[#6caa8c]/5" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <HomeSections />
        </div>

      </section>

      {/* Closing Brand Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-[#c5a56b] to-primary" />

    </main>
  );
}
