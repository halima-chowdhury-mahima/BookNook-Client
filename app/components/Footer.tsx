
import Link from "next/link";
import {
  BookOpen,
  ArrowUpRight,
  Mail,
  MapPin,
  Heart,
  BookMarked,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/all-books" },
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    label: "f",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#102f28] text-white dark:bg-[#0b1712]">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full border border-[#d6b36c]/10" />
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border border-[#d6b36c]/10" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-[#d6b36c]/[0.035] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">

        {/* Top Brand Section */}
        <div className="mb-14 flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-[#d6b36c]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d6b36c]">
                A World Between Pages
              </span>
            </div>

            <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
              Every Book Has
              <span className="block text-[#e3c783]">
                A Story to Tell.
              </span>
            </h2>
          </div>

          <Link
            href="/all-books"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#d6b36c]/50 bg-[#d6b36c]/10 px-6 py-3.5 text-sm font-semibold text-[#f0d9a1] transition-all duration-300 hover:-translate-y-1 hover:border-[#d6b36c] hover:bg-[#d6b36c] hover:text-[#173f35] hover:shadow-[0_8px_25px_rgba(214,179,108,0.15)]"
          >
            Explore Collection

            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

        </div>

        {/* Main Footer Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl border border-[#d6b36c]/50 bg-gradient-to-br from-[#e3c783] to-[#b28a50] text-[#173f35] shadow-[0_6px_20px_rgba(214,179,108,0.15)] transition-transform duration-300 group-hover:rotate-6">
                <BookOpen size={25} strokeWidth={1.8} />
              </div>

              <div>
                <span className="block font-serif text-3xl font-bold tracking-wide text-white">
                  BookNook
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d6b36c]">
                  Your Literary Escape
                </span>
              </div>
            </Link>

            <p className="mt-7 max-w-sm text-sm leading-8 text-white/55">
              A cozy little corner for every book lover.
              Discover wonderful stories, explore new ideas,
              and share the joy of reading with BookNook.
              Your next favorite story is waiting here.
            </p>

            {/* Social Links */}
            <div className="mt-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d6b36c]">
                Follow Our Journey
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-sm font-bold text-white/65 transition-all duration-300 hover:-translate-y-1 hover:border-[#d6b36c] hover:bg-[#d6b36c] hover:text-[#173f35] hover:shadow-lg"
                  >
                    {social.label}
                  </a>
                ))}

                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-sm font-bold text-white/65 transition-all duration-300 hover:-translate-y-1 hover:border-[#d6b36c] hover:bg-[#d6b36c] hover:text-[#173f35]"
                >
                  𝕏
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="mb-7 flex items-center gap-3">
              <BookMarked size={17} className="text-[#d6b36c]" />

              <h3 className="font-serif text-xl font-bold text-[#f0d9a1]">
                Explore
              </h3>
            </div>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group/link inline-flex items-center gap-2 text-sm text-white/55 transition-all duration-300 hover:translate-x-1.5 hover:text-[#e3c783]"
                  >
                    <span className="h-px w-0 bg-[#d6b36c] transition-all duration-300 group-hover/link:w-4" />

                    {link.name}

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-opacity duration-300 group-hover/link:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="mb-7 flex items-center gap-3">
              <Mail size={17} className="text-[#d6b36c]" />

              <h3 className="font-serif text-xl font-bold text-[#f0d9a1]">
                Get in Touch
              </h3>
            </div>

            <div className="space-y-6">

              {/* Email */}
              <a
                href="mailto:hello@booknook.com"
                className="group/contact flex items-start gap-3"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#d6b36c]/20 bg-[#d6b36c]/10 text-[#d6b36c] transition-all duration-300 group-hover/contact:bg-[#d6b36c] group-hover/contact:text-[#173f35]">
                  <Mail size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
                    Email Us
                  </p>

                  <p className="mt-1 text-sm text-white/75 transition-colors group-hover/contact:text-[#e3c783]">
                    hello@booknook.com
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#d6b36c]/20 bg-[#d6b36c]/10 text-[#d6b36c]">
                  <MapPin size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
                    Our Location
                  </p>

                  <p className="mt-1 text-sm text-white/75">
                    Online Library
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Gold Divider */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d6b36c]/40 to-[#d6b36c]/10" />

          <BookOpen size={17} className="text-[#d6b36c]" />

          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#d6b36c]/40 to-[#d6b36c]/10" />
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">

          <p className="text-xs leading-6 text-white/40">
            © 2026 BookNook. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-xs text-white/50">
            Crafted with

            <Heart
              size={13}
              className="fill-[#d6b36c] text-[#d6b36c]"
            />

            for every book lover.
          </p>

          <Link
            href="/"
            className="text-xs font-semibold tracking-wide text-[#d6b36c] transition-colors hover:text-[#f0d9a1]"
          >
            Back to Top ↑
          </Link>

        </div>
      </div>
    </footer>
  );
}
