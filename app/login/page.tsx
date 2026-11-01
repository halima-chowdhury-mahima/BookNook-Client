
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "../lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Welcome back to BookNook!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google login failed.");
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Unable to sign in with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-12 flex items-center justify-center">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">

        {/* Left Side - Brand Section */}
        <div className="hidden lg:flex relative bg-[#173f35] text-white p-14 flex-col justify-between overflow-hidden">

          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full border border-white/10" />

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-[#e9c98b] rounded-xl flex items-center justify-center">
              <BookOpen className="text-[#173f35]" size={27} />
            </div>

            <span className="text-2xl font-bold tracking-wide">
              BookNook
            </span>
          </Link>

          <div className="relative z-10 max-w-md">
            <p className="text-[#e9c98b] uppercase tracking-[0.3em] text-xs font-semibold mb-6">
              Welcome Back
            </p>

            <h1 className="text-5xl xl:text-6xl font-serif leading-tight mb-7">
              Every book opens a new world.
            </h1>

            <p className="text-white/70 leading-8 text-base">
              Your next great read is waiting. Sign in to explore
              your personal library, discover new stories and
              continue your reading journey.
            </p>
          </div>

          <p className="relative z-10 text-white/50 text-sm">
            © 2026 BookNook. A world of stories.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-7 sm:p-12 lg:p-14 flex flex-col justify-center">

          <Link href="/" className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-11 h-11 bg-[#173f35] rounded-xl flex items-center justify-center">
              <BookOpen className="text-[#e9c98b]" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#173f35]">
              BookNook
            </span>
          </Link>

          <div className="max-w-md w-full mx-auto">

            <div className="mb-9">
              <p className="text-[#b18a4a] uppercase tracking-[0.25em] text-xs font-bold mb-4">
                Your Reading Journey
              </p>

              <h2 className="text-4xl font-serif text-[#173f35] mb-3">
                Sign in
              </h2>

              <p className="text-gray-500 text-sm leading-6">
                Welcome back! Enter your details to access your account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#173f35] mb-2"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-[#fcfbf8] text-gray-800 outline-none focus:border-[#173f35] focus:ring-2 focus:ring-[#173f35]/10 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#173f35]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-[#fcfbf8] text-gray-800 outline-none focus:border-[#173f35] focus:ring-2 focus:ring-[#173f35]/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#173f35]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-[#173f35] hover:bg-[#245849] disabled:opacity-60 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition duration-300 shadow-lg shadow-[#173f35]/10"
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                Or continue with
              </span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full border border-gray-200 hover:border-[#173f35] hover:bg-[#fcfbf8] disabled:opacity-60 rounded-xl py-3.5 flex items-center justify-center gap-3 text-gray-700 font-semibold transition"
            >
              {googleLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.72 7.18l7.3 5.66c4.26-3.94 6.46-9.75 6.46-17.31Z" />
                  <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-6.14l-7.3-5.66c-2.03 1.36-4.62 2.16-8.6 2.16-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
                </svg>
              )}

              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#173f35] font-bold hover:text-[#b18a4a] transition"
              >
                Create Account
              </Link>
            </p>

            <Link
              href="/"
              className="block text-center text-xs text-gray-400 hover:text-[#173f35] mt-6 transition"
            >
              ← Back to Home
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}
