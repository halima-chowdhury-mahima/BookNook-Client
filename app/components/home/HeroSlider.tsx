
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import {
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

const slides = [
  {
    id: 1,
    eyebrow: "WELCOME TO BOOKNOOK",
    title: "Discover Your Next Story.",
    highlight: "Find Your Next Chapter.",
    description:
      "A beautiful collection of stories, ideas and adventures is waiting for you. Find the book that speaks to your heart.",
    button: "Browse Books",
    href: "/all-books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=2000&q=85",
    number: "01",
  },
  {
    id: 2,
    eyebrow: "YOUR MOMENT OF ESCAPE",
    title: "A Little Escape",
    highlight: "Through Books.",
    description:
      "Leave the everyday behind and step into wonderful worlds. Every page is an invitation to discover something new.",
    button: "Explore Collection",
    href: "/all-books",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=85",
    number: "02",
  },
  {
    id: 3,
    eyebrow: "READING MADE SIMPLE",
    title: "Borrow. Read.",
    highlight: "Return. Repeat.",
    description:
      "Your favorite stories are closer than ever. Borrow a book, enjoy every chapter and return it when you are done.",
    button: "Start Reading",
    href: "/all-books",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=2000&q=85",
    number: "03",
  },
  {
    id: 4,
    eyebrow: "A COMMUNITY OF READERS",
    title: "Every Reader",
    highlight: "Belongs Here.",
    description:
      "Whether you love fiction, history or science, there is a little something waiting for every curious mind.",
    button: "Find Your Book",
    href: "/google-books",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2000&q=85",
    number: "04",
  },
];

export default function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnLastSnap: false,
      }),
    []
  );

  useEffect(() => {
    if (!api) return;

    const updateSlide = () => {
      setActiveSlide(api.selectedScrollSnap());
    };

    updateSlide();

    api.on("select", updateSlide);

    return () => {
      api.off("select", updateSlide);
    };
  }, [api]);

  return (
    <section className="relative overflow-hidden bg-[#173f35]">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="basis-full pl-0">
              <div
                className="relative flex min-h-[570px] items-center bg-cover bg-center md:min-h-[680px]"
                style={{
                  backgroundImage: `url("${slide.image}")`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#102c25]/95 via-[#173f35]/75 to-[#173f35]/20" />

                <div className="absolute inset-0 bg-black/10" />

                <div className="container-custom relative z-10 w-full py-20">
                  <div className="max-w-3xl text-white">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 backdrop-blur-sm">
                      <Sparkles
                        size={15}
                        className="text-[#d9b98b]"
                      />

                      <span className="text-[10px] font-semibold tracking-[0.25em] text-[#f0dfc0]">
                        {slide.eyebrow}
                      </span>
                    </div>

                    <h1 className="text-serif text-5xl font-semibold leading-[1.12] md:text-7xl lg:text-[82px]">
                      {slide.title}
                      <br />

                      <span className="text-[#e3c69d]">
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="mt-7 max-w-xl text-sm leading-8 text-white/75 md:text-base">
                      {slide.description}
                    </p>

                    {/* Working Button */}
                    <Link
                      href={slide.href}
                      className="btn-primary-custom mt-9 !border-[#e3c69d] !bg-[#e3c69d] !px-7 !py-4 !text-[#173f35] hover:!border-white hover:!bg-white"
                    >
                      <BookOpen size={18} />
                      {slide.button}
                      <ArrowRight size={17} />
                    </Link>

                    <div className="mt-14 flex items-center gap-4">
                      <span className="text-sm font-semibold text-[#e3c69d]">
                        {slide.number}
                      </span>

                      <div className="h-px w-16 bg-white/40" />

                      <span className="text-xs tracking-[0.2em] text-white/60">
                        04 — STORIES AWAIT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-8 right-5 z-20 flex items-center gap-4 md:bottom-12 md:right-12">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === index
                    ? "w-7 bg-[#e3c69d]"
                    : "w-2 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0 h-11 w-11 rounded-full border border-white/40 bg-transparent text-white hover:border-[#e3c69d] hover:bg-[#e3c69d] hover:text-[#173f35] disabled:opacity-50" />

            <CarouselNext className="static translate-y-0 h-11 w-11 rounded-full border border-white/40 bg-transparent text-white hover:border-[#e3c69d] hover:bg-[#e3c69d] hover:text-[#173f35] disabled:opacity-50" />
          </div>
        </div>
      </Carousel>
    </section>
  );
}
