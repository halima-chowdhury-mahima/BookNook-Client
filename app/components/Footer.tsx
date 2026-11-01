
import Link from "next/link";
import {
  BookOpen,
  ArrowUpRight,
  Mail,
  MapPin,
  Heart,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Footer() {
  return (
    <footer className="bg-[#173f35] text-white">
      <div className="container-custom py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9b98b] text-[#173f35]">
                <BookOpen size={25} />
              </div>

              <span className="text-serif text-3xl font-bold">
                BookNook
              </span>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-8 text-white/65">
              A cozy little corner for every book lover.
              Discover wonderful stories, explore new ideas,
              and share the joy of reading with BookNook.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-bold transition hover:border-[#d9b98b] hover:bg-[#d9b98b] hover:text-[#173f35]"
              >
                f
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-bold transition hover:border-[#d9b98b] hover:bg-[#d9b98b] hover:text-[#173f35]"
              >
                IG
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-bold transition hover:border-[#d9b98b] hover:bg-[#d9b98b] hover:text-[#173f35]"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-serif text-xl font-semibold text-[#d9b98b]">
              Explore
            </h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:translate-x-1 hover:text-[#d9b98b]"
                  >
                    {link.name}
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-serif text-xl font-semibold text-[#d9b98b]">
              Get in Touch
            </h3>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-1 shrink-0 text-[#d9b98b]" />
                <div>
                  <p className="text-xs text-white/45">Email us</p>
                  <a
                    href="mailto:hello@booknook.com"
                    className="mt-1 text-sm text-white/75 hover:text-[#d9b98b]"
                  >
                    hello@booknook.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-[#d9b98b]" />
                <div>
                  <p className="text-xs text-white/45">Our Location</p>
                  <p className="mt-1 text-sm text-white/75">
                    Online Library
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/15 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/50">
            © 2026 BookNook. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-xs text-white/55">
            Made with
            <Heart size={13} className="fill-[#d9b98b] text-[#d9b98b]" />
            for every book lover
          </p>
        </div>
      </div>
    </footer>
  );
}
