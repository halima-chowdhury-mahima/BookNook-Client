
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Theme loading"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e4da] bg-white text-[#173f35] opacity-60"
      >
        <Moon size={19} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e4da] bg-white text-[#173f35] transition hover:bg-[#e8eee5] dark:border-[#3b4b45] dark:bg-[#243a32] dark:text-[#f0d9a1] dark:hover:bg-[#304b40]"
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
