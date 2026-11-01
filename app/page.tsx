
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
    <main>
      {/* Four Different Hero Slides */}
      <HeroSlider />

      {/* Latest Six Books from MongoDB */}
      <NewArrivals />

      {/* Two Additional Static Sections */}
      <HomeSections />
    </main>
  );
}
