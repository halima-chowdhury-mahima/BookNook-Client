"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserRound,
  Mail,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  Camera,
  Upload,
  Trash2,
  Loader2,
  ImagePlus,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  X,
  Crown,
  BookMarked,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "../lib/auth-client";
import { useProfileImage } from "../lib/useProfileImage";
import { API_URL } from "../lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const {
    customImage,
    profileImage,
    refreshProfileImage,
  } = useProfileImage();

  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  async function getAuthToken() {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Please login to continue.");
    }

    return data.token;
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const token = await getAuthToken();
      const formData = new FormData();

      formData.append("avatar", file);

      const response = await fetch(`${API_URL}/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Profile picture upload failed."
        );
      }

      await refreshProfileImage();

      window.dispatchEvent(
        new Event("profile-image-updated")
      );

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Profile upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload profile picture."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveImage() {
    if (!customImage) return;

    try {
      setRemoving(true);

      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/profile/avatar`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to remove profile picture."
        );
      }

      await refreshProfileImage();

      window.dispatchEvent(
        new Event("profile-image-updated")
      );

      setConfirmRemove(false);

      toast.success(
        "Your original profile picture has been restored."
      );
    } catch (error) {
      console.error("Profile removal error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove profile picture."
      );
    } finally {
      setRemoving(false);
    }
  }

  if (isPending || !user) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#f8f6ef]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-[#dfe5dc] border-t-[#173f35]" />
          <p className="mt-5 text-sm font-medium text-[#777b70]">
            Preparing your reading space...
          </p>
        </div>
      </main>
    );
  }

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f6ef] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-[#d6b878]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#173f35]/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Back Navigation */}
        <Link
          href="/"
          className="group mb-9 inline-flex items-center gap-2 text-sm font-semibold text-[#53665b] transition hover:text-[#a88a53]"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Home
        </Link>

        {/* Heading */}
        <div className="mb-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9cba9] bg-white/70 px-4 py-2">
            <Sparkles size={14} className="text-[#a88a53]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8b754c]">
              Your Personal Library
            </span>
          </div>

          <h1 className="font-serif text-4xl font-bold tracking-tight text-[#173f35] sm:text-5xl lg:text-6xl">
            My Profile
            <span className="text-[#b4955d]">.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#777b70] sm:text-base">
            A little space that belongs to you. Manage your account,
            personalize your profile and continue your reading journey.
          </p>
        </div>

        {/* Main Profile Card */}
        <section className="overflow-hidden rounded-[28px] border border-[#e8e1d3] bg-white shadow-[0_24px_80px_rgba(28,53,42,0.08)]">
          {/* Luxury Banner */}
          <div className="relative isolate min-h-[190px] overflow-hidden bg-[#153c32] sm:min-h-[220px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(214,184,120,0.28),transparent_35%),linear-gradient(115deg,#102e27,#1c5142_60%,#9b8050)]" />

            <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full border border-[#e1c68f]/20" />
            <div className="absolute -right-2 -top-16 h-56 w-56 rounded-full border border-[#e1c68f]/20" />
            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full border border-white/10" />

            <div className="relative flex min-h-[190px] flex-col justify-between p-6 sm:min-h-[220px] sm:p-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#e8d5a9]">
                  <BookOpen size={19} />
                  <span className="text-xs font-bold uppercase tracking-[0.25em]">
                    BookNook
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d8c18e]" />
                  Member Area
                </div>
              </div>

              <div className="max-w-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e0c58f]">
                  Welcome to your account
                </p>
                <p className="mt-3 font-serif text-2xl leading-snug text-white sm:text-3xl">
                  Every reader has a story.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 pb-8 sm:px-9 sm:pb-10 lg:px-11">
            {/* Identity Section */}
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative h-28 w-28 shrink-0 rounded-full bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.13)] sm:h-32 sm:w-32">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={user.name || "Profile photo"}
                      className="h-full w-full rounded-full border border-[#e9e0cf] object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#e9d6b2] to-[#c9a875] font-serif text-4xl font-bold text-[#173f35]">
                      {initials}
                    </div>
                  )}

                  <div className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#173f35] text-[#f0d9a1] shadow-md">
                    <Camera size={17} />
                  </div>
                </div>

                <div className="pb-1 sm:pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold text-[#173f35] sm:text-3xl">
                      {user.name || "BookNook Reader"}
                    </h2>
                    <CheckCircle2
                      size={19}
                      className="text-[#ad915d]"
                    />
                  </div>

                  <p className="mt-2 text-sm text-[#85877e]">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-[#e9dfc9] bg-[#faf7ef] px-4 py-2 text-xs font-semibold text-[#8d7447]">
                <Crown size={15} />
                BookNook Member
              </div>
            </div>

            {/* Profile Picture Management */}
            <div className="mt-9 rounded-2xl border border-[#e9e3d7] bg-[#fbfaf6] p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e9eee7] text-[#173f35]">
                    <ImagePlus size={22} />
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#173f35]">
                      Profile Picture
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#85877e]">
                      Make your account feel more like you.
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded-full border border-[#e5dbc5] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#987c4b]">
                  Personalize
                </span>
              </div>

              <div className="mt-6 border-t border-[#e9e3d7] pt-5">
                <p className="text-sm leading-6 text-[#626b60]">
                  Upload a custom photo or continue using your original
                  Google/GitHub profile picture.
                </p>

                <p className="mt-2 text-xs text-[#99998f]">
                  Supported formats: JPG, PNG, WebP · Maximum file size: 5 MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || removing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173f35] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(23,63,53,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#245748] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Upload size={17} />
                    )}

                    {uploading
                      ? "Uploading..."
                      : customImage
                        ? "Change Picture"
                        : "Upload Picture"}
                  </button>

                  {customImage && (
                    <button
                      type="button"
                      onClick={() => setConfirmRemove(true)}
                      disabled={uploading || removing}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#ead4d0] bg-white px-5 py-3.5 text-sm font-semibold text-[#a34e47] transition hover:border-[#d9aaa3] hover:bg-[#fff7f5] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={17} />
                      Remove Picture
                    </button>
                  )}
                </div>

                {confirmRemove && (
                  <div className="mt-5 rounded-xl border border-[#ead4d0] bg-[#fff8f6] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e5e1] text-[#a34e47]">
                        <Trash2 size={17} />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#743e39]">
                          Remove custom profile picture?
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#946e68]">
                          Your original Google/GitHub avatar will be restored.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={removing}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#a34e47] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#873d37] disabled:opacity-60"
                          >
                            {removing && (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            )}
                            {removing ? "Removing..." : "Yes, Remove"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmRemove(false)}
                            disabled={removing}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#e8d4d0] bg-white px-4 py-2.5 text-xs font-semibold text-[#775b56] transition hover:bg-[#faf0ed] disabled:opacity-60"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-4 flex items-center gap-2 text-xs text-[#8c8d83]">
                  <ShieldCheck size={14} className="text-[#a88a53]" />
                  {customImage
                    ? "Your custom profile picture is currently active."
                    : "Your original account avatar is currently active."}
                </p>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-10">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a88a53]">
                    Account Details
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-[#173f35]">
                    Your Information
                  </h3>
                </div>

                <ShieldCheck
                  size={25}
                  className="mb-1 text-[#b4955d]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="group rounded-2xl border border-[#e9e3d7] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d7c59f] hover:shadow-[0_12px_30px_rgba(28,53,42,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf1e9] text-[#173f35]">
                      <UserRound size={19} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a88a53]">
                      Identity
                    </span>
                  </div>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#96968b]">
                    Full Name
                  </p>
                  <p className="mt-2 break-words font-semibold text-[#263b32]">
                    {user.name || "Not provided"}
                  </p>
                </div>

                {/* Email */}
                <div className="group rounded-2xl border border-[#e9e3d7] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d7c59f] hover:shadow-[0_12px_30px_rgba(28,53,42,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5efe2] text-[#a88a53]">
                      <Mail size={19} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a88a53]">
                      Contact
                    </span>
                  </div>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#96968b]">
                    Email Address
                  </p>
                  <p className="mt-2 break-all font-semibold text-[#263b32]">
                    {user.email}
                  </p>
                </div>

                {/* Status */}
                <div className="group rounded-2xl border border-[#e9e3d7] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d7c59f] hover:shadow-[0_12px_30px_rgba(28,53,42,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf1e9] text-[#173f35]">
                      <ShieldCheck size={19} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a88a53]">
                      Security
                    </span>
                  </div>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#96968b]">
                    Account Status
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 font-semibold text-[#276b4e]">
                    <span className="h-2 w-2 rounded-full bg-[#3a9b6c]" />
                    Active Account
                  </p>
                </div>

                {/* Membership */}
                <div className="group rounded-2xl border border-[#e9e3d7] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d7c59f] hover:shadow-[0_12px_30px_rgba(28,53,42,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5efe2] text-[#a88a53]">
                      <BookMarked size={19} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a88a53]">
                      Community
                    </span>
                  </div>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#96968b]">
                    Membership
                  </p>
                  <p className="mt-2 font-semibold text-[#263b32]">
                    BookNook Reader
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="mt-10 overflow-hidden rounded-2xl bg-[#173f35] p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 text-[#e1c58d]">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.23em]">
                      Keep Exploring
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
                    Your next favorite book is waiting.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Explore the collection or revisit the books you have
                    borrowed.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:w-auto">
                  <Link
                    href="/my-borrows"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d8bd84] px-5 py-3.5 text-sm font-bold text-[#173f35] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ebd5a5]"
                  >
                    My Borrowed Books
                    <BookOpen size={17} />
                  </Link>

                  <Link
                    href="/all-books"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3.5 text-sm font-semibold text-white transition duration-300 hover:border-[#d8bd84] hover:bg-white/10"
                  >
                    Explore All Books
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-[#eee8dc] pt-6 text-center sm:flex-row sm:text-left">
              <p className="text-xs text-[#929187]">
                Made for readers, with love.
              </p>
              <p className="font-serif text-sm italic text-[#a88a53]">
                BookNook — A world between the pages.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}