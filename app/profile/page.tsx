
"use client";

import { useEffect, useRef, useState } from "react";
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
    event: React.ChangeEvent<HTMLInputElement>
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

      const response = await fetch(
        `${API_URL}/profile/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

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

    const confirmed = window.confirm(
      "Are you sure you want to remove your custom profile picture?"
    );

    if (!confirmed) return;

    try {
      setRemoving(true);

      const token = await getAuthToken();

      const response = await fetch(
        `${API_URL}/profile/avatar`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      toast.success(
        "Custom picture removed. Your original avatar is restored."
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
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5ed]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#d9dfd7] border-t-[#173f35]" />
          <p className="mt-4 text-sm text-[#77776f]">
            Loading your profile...
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
    <main className="min-h-screen bg-[#f8f5ed] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#173f35] transition hover:gap-3"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a88a53]">
            BookNook Account
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold text-[#173f35] sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm text-[#77776f]">
            Manage your account information and reading journey.
          </p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-[#e7e1d5] bg-white shadow-sm">

          {/* Profile Banner */}
          <div className="h-36 bg-gradient-to-r from-[#173f35] via-[#245748] to-[#a88a53]" />

          <div className="px-6 pb-8 sm:px-10">

            {/* Profile Picture */}
            <div className="-mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-end">

              <div className="relative shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user.name || "Profile photo"}
                    className="h-28 w-28 rounded-full border-4 border-white bg-[#eee9dd] object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#e3c69d] font-serif text-3xl font-bold text-[#173f35] shadow-md">
                    {initials}
                  </div>
                )}

                <div className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#173f35] text-white shadow">
                  <Camera size={16} />
                </div>
              </div>

              <div className="pb-1">
                <h2 className="font-serif text-2xl font-bold text-[#173f35]">
                  {user.name || "BookNook Reader"}
                </h2>

                <p className="mt-1 text-sm text-[#77776f]">
                  Welcome to your personal reading space.
                </p>
              </div>
            </div>

            {/* Profile Picture Management */}
            <div className="mt-8 rounded-2xl border border-[#e7e1d5] bg-[#faf9f5] p-5 sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8eee5] text-[#173f35]">
                  <ImagePlus size={21} />
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#173f35]">
                    Profile Picture
                  </h3>

                  <p className="text-xs text-[#77776f]">
                    Personalize your BookNook account.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm text-[#555e55]">
                  Upload your own photo or keep your Google/GitHub profile picture.
                </p>

                <p className="mt-2 text-xs text-[#929187]">
                  JPG, PNG or WebP · Maximum size 5 MB
                </p>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || removing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245748] disabled:cursor-not-allowed disabled:opacity-60"
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
                    onClick={handleRemoveImage}
                    disabled={uploading || removing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {removing ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Trash2 size={17} />
                    )}

                    {removing ? "Removing..." : "Remove Picture"}
                  </button>
                )}
              </div>

              <p className="mt-4 text-xs text-[#929187]">
                {customImage
                  ? "You are currently using your custom profile picture."
                  : "You are currently using your account's original profile picture."}
              </p>
            </div>

            {/* Account Information */}
            <div className="mt-10">
              <h3 className="mb-5 font-serif text-xl font-bold text-[#173f35]">
                Account Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-[#e7e1d5] bg-[#faf9f5] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#a88a53]">
                    <UserRound size={19} />

                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Full Name
                    </span>
                  </div>

                  <p className="break-words font-semibold text-[#24352f]">
                    {user.name || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7e1d5] bg-[#faf9f5] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#a88a53]">
                    <Mail size={19} />

                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Email Address
                    </span>
                  </div>

                  <p className="break-all font-semibold text-[#24352f]">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7e1d5] bg-[#faf9f5] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#a88a53]">
                    <ShieldCheck size={19} />

                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Account Status
                    </span>
                  </div>

                  <p className="font-semibold text-[#173f35]">
                    Active Account
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7e1d5] bg-[#faf9f5] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#a88a53]">
                    <BookOpen size={19} />

                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Reading Community
                    </span>
                  </div>

                  <p className="font-semibold text-[#24352f]">
                    BookNook Member
                  </p>
                </div>

              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/my-borrows"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173f35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245748]"
              >
                My Borrowed Books
                <BookOpen size={17} />
              </Link>

              <Link
                href="/all-books"
                className="inline-flex items-center justify-center rounded-xl border border-[#173f35] px-6 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#f0ede5]"
              >
                Explore Books
              </Link>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
