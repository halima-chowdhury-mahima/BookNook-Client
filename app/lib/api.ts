export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  books: `${API_URL}/books`,
  borrows: `${API_URL}/borrows`,
  googleBooks: `${API_URL}/google-books`,
};