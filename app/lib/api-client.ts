
import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Please login again. Authentication token not found.");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  const responseText = await response.text();

  let result: Record<string, unknown> = {};

  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error("Backend returned an invalid response.");
    }
  }

  if (!response.ok) {
    throw new Error(
      typeof result.message === "string"
        ? result.message
        : `Request failed with status ${response.status}.`
    );
  }

  return result as T;
}
