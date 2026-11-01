
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "./auth-client";
import { apiRequest } from "./api-client";

interface ProfileImageData {
  userId: string;
  imageUrl: string;
  publicId: string;
  updatedAt: string;
}

interface ProfileImageResponse {
  success: boolean;
  data: ProfileImageData | null;
}

interface CustomImageState {
  userId: string;
  imageUrl: string;
}

export function useProfileImage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;
  const userId = user?.id ?? null;

  const [customImage, setCustomImage] =
    useState<CustomImageState | null>(null);

  // Load custom profile image
  useEffect(() => {
    if (isPending || !userId) return;

    let cancelled = false;

    const loadImage = async () => {
      try {
        const response =
          await apiRequest<ProfileImageResponse>("/profile");

        if (cancelled) return;

        const imageUrl = response.data?.imageUrl;

        setCustomImage(
          imageUrl
            ? {
                userId,
                imageUrl,
              }
            : null
        );
      } catch (error) {
        console.error("Profile image fetch error:", error);

        if (!cancelled) {
          setCustomImage((current) =>
            current?.userId === userId ? null : current
          );
        }
      }
    };

    void loadImage();

    return () => {
      cancelled = true;
    };
  }, [isPending, userId]);

  // Refresh image after upload or removal
  const refreshProfileImage = useCallback(async () => {
    if (!userId) return;

    try {
      const response =
        await apiRequest<ProfileImageResponse>("/profile");

      const imageUrl = response.data?.imageUrl;

      setCustomImage(
        imageUrl
          ? {
              userId,
              imageUrl,
            }
          : null
      );
    } catch (error) {
      console.error("Profile image refresh error:", error);
    }
  }, [userId]);

  // Listen for image updates
  useEffect(() => {
    const handleProfileImageUpdate = () => {
      void refreshProfileImage();
    };

    window.addEventListener(
      "profile-image-updated",
      handleProfileImageUpdate
    );

    return () => {
      window.removeEventListener(
        "profile-image-updated",
        handleProfileImageUpdate
      );
    };
  }, [refreshProfileImage]);

  const customImageUrl =
    customImage?.userId === userId
      ? customImage.imageUrl
      : null;

  return {
    customImage: customImageUrl,
    profileImage: customImageUrl || user?.image || null,
    refreshProfileImage,
  };
}
