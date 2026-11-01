
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
    <main className="min-h-screen overflow-hidden bg-base-100">
      {/* Hero Banner */}
      <section aria-label="Featured books">
        <HeroSlider />
      </section>

      {/* Latest Books */}
      <section
        aria-label="Latest book arrivals"
        className="relative py-8 sm:py-12"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <NewArrivals />
        </div>
      </section>

      {/* Additional Library Sections */}
      <section
        aria-label="Explore the library"
        className="relative border-t border-base-200 bg-base-200/30 py-8 sm:py-12"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <HomeSections />
        </div>
      </section>
    </main>
  );
}
