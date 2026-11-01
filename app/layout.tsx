
import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";

import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { cn } from "./lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookNook | Discover Your Next Story",
    template: "%s | BookNook",
  },
  description:
    "BookNook is your cozy online library. Discover books, borrow your favorites, and enjoy reading.",
  keywords: [
    "BookNook",
    "Online Library",
    "Books",
    "Book Borrowing",
    "Reading Community",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(dmSans.variable, playfair.variable)}
    >
      <body className="font-sans">
        <Navbar />

        {children}

        <Footer />

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#173f35",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "14px 18px",
            },
            success: {
              iconTheme: {
                primary: "#e9c98b",
                secondary: "#173f35",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
