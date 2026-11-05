
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  Menu,
  X,
  ChevronDown,
  UserRound,
  LogOut,
  UserCircle,
  ArrowRight,
  Loader2,
  Search,
} from "lucide-react";

import { authClient } from "../lib/auth-client";
import { useProfileImage } from "../lib/useProfileImage";
import ThemeToggle from "./ThemeToggle";

const publicLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/all-books" },
  { name: "Explore Books", href: "/google-books" },
];

const privateLinks = [
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const { profileImage } = useProfileImage();

  const isLoggedIn = user !== null;

  const links = isLoggedIn
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await authClient.signOut();

      setProfileOpen(false);
      setMobileMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e4da] bg-[#f8f5ed]/95 backdrop-blur-md dark:border-[#34483f] dark:bg-[#111d19]/95">
      <nav className="container-custom flex h-[82px] items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173f35] text-[#d9b98b] transition-transform duration-300 group-hover:rotate-[-8deg]">
            <BookOpen size={23} />
          </div>

          <div>
            <h1 className="text-serif text-2xl font-bold tracking-tight text-[#173f35] dark:text-[#e9d5aa]">
              BookNook
            </h1>

            <p className="text-[9px] font-semibold tracking-[0.25em] text-[#8a8e82] dark:text-[#a4b2a8]">
              YOUR READING CORNER
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-2 text-[13px] font-semibold text-[#555e55] transition-colors duration-200 hover:text-[#173f35] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#c47755] after:transition-all hover:after:w-full dark:text-[#c4d0c8] dark:hover:text-[#e9d5aa]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">

          <ThemeToggle />

          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#173f35] dark:text-[#e9d5aa]" />
          ) : user ? (
            <div className="relative">

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
                className="flex items-center gap-2 rounded-full border border-[#e8e4da] bg-white px-3 py-2 dark:border-[#34483f] dark:bg-[#243a32]"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <UserRound
                    size={19}
                    className="text-[#173f35] dark:text-[#e9d5aa]"
                  />
                )}

                <span className="max-w-[120px] truncate text-sm font-semibold text-[#173f35] dark:text-[#e9d5aa]">
                  {user.name || "My Account"}
                </span>

                <ChevronDown
                  size={15}
                  className="dark:text-[#e9d5aa]"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-56 rounded-lg border border-[#e8e4da] bg-white p-2 shadow-xl dark:border-[#34483f] dark:bg-[#1c2c25]">

                  <div className="border-b border-[#eeeae2] px-3 py-3 dark:border-[#34483f]">
                    <div className="mb-2 flex items-center gap-2">

                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <UserRound
                          size={28}
                          className="text-[#173f35] dark:text-[#e9d5aa]"
                        />
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#173f35] dark:text-[#e9d5aa]">
                          {user.name || "BookNook Reader"}
                        </p>

                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-gray-700 hover:bg-[#f0f4ed] dark:text-gray-200 dark:hover:bg-[#304b40]"
                  >
                    <UserCircle size={17} />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                  >
                    {loggingOut ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <LogOut size={17} />
                    )}

                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-3 text-sm font-semibold text-[#173f35] transition hover:text-[#c47755] dark:text-[#e9d5aa]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="btn-primary-custom !rounded-md !px-5 !py-3 text-sm"
              >
                Join BookNook
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">

          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#e8e4da] text-[#173f35] dark:border-[#34483f] dark:text-[#e9d5aa]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-[#e8e4da] bg-[#f8f5ed] px-5 py-5 shadow-lg dark:border-[#34483f] dark:bg-[#111d19] lg:hidden">

          <div className="container-custom flex flex-col gap-1">

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-[#46534a] transition hover:bg-[#e8eee5] hover:text-[#173f35] dark:text-[#c4d0c8] dark:hover:bg-[#243a32] dark:hover:text-[#e9d5aa]"
              >
                {link.href === "/google-books" && (
                  <Search size={16} />
                )}

                {link.name}
              </Link>
            ))}

            <div className="mt-3 border-t border-[#e8e4da] pt-4 dark:border-[#34483f]">

              {isPending ? (
                <div className="flex justify-center py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-[#173f35] dark:text-[#e9d5aa]" />
                </div>
              ) : user ? (
                <div className="flex flex-col gap-2">

                  {/* Mobile User Information */}
                  <div className="flex items-center gap-3 px-4 py-3">

                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-11 w-11 rounded-full border border-[#e8e4da] object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8eee5] dark:bg-[#304b40]">
                        <UserRound
                          size={22}
                          className="text-[#173f35] dark:text-[#e9d5aa]"
                        />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#173f35] dark:text-[#e9d5aa]">
                        {user.name || "BookNook Reader"}
                      </p>

                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-[#173f35] hover:bg-[#e8eee5] dark:text-[#e9d5aa] dark:hover:bg-[#243a32]"
                  >
                    <UserCircle size={18} />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                  >
                    {loggingOut ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <LogOut size={18} />
                    )}

                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">

                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-outline-custom !py-3 text-sm"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary-custom !py-3 text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
