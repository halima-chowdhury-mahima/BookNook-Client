"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error("Password needs uppercase, lowercase and at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || `${provider} login failed.`);
        setSocialLoading("");
      }
    } catch {
      toast.error("Social login failed. Please try again.");
      setSocialLoading("");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ed] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-[#173f35]/10 sm:p-10">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173f35] text-white">
            <BookOpen size={28} />
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#173f35]">
            Join BookNook
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your account and discover your next favorite book.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={loading || !!socialLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            {socialLoading === "google" ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.4 1.2 8.8 3.5l6.5-6.5C35.3 2.8 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.6 5.9C12.1 13.5 17.6 9.5 24 9.5Z" />
                <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.5 6.9l7.3 5.7c4.3-4 6.9-9.9 6.9-17.1Z" />
                <path fill="#FBBC05" d="M10.2 28.9a14.5 14.5 0 0 1 0-9.8l-7.6-5.9a24 24 0 0 0 0 21.6l7.6-5.9Z" />
                <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15.1-5.4l-7.3-5.7c-2 1.4-4.6 2.2-7.8 2.2-6.4 0-11.9-4-13.8-9.6l-7.6 5.9C6.5 43.4 14.6 48 24 48Z" />
              </svg>
            )}
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            disabled={loading || !!socialLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            {socialLoading === "github" ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <svg
  viewBox="0 0 24 24"
  width="20"
  height="20"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="M12 .297a12 12 0 0 0-3.797 23.383c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.467-1.334-5.467-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 6.006 0c2.292-1.552 3.298-1.23 3.298-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.814 1.102.814 2.222v3.293c0 .319.216.694.825.576A12 12 0 0 0 12 .297" />
</svg>
            )}
            Continue with GitHub
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Or register with email
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-[#173f35] focus:ring-2 focus:ring-[#173f35]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-[#173f35] focus:ring-2 focus:ring-[#173f35]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-gray-800 outline-none focus:border-[#173f35] focus:ring-2 focus:ring-[#173f35]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              At least 6 characters, including uppercase and lowercase letters.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password again"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-[#173f35] focus:ring-2 focus:ring-[#173f35]/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173f35] py-3.5 font-semibold text-white transition hover:bg-[#24594b] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#173f35] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}