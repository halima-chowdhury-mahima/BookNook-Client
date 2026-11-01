
import { authClient } from "./auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Please login to continue.");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Something went wrong."
    );
  }

  return result as T;
}
