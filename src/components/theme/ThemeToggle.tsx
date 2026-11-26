"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR / before mount, render a placeholder button of equal dimensions to prevent layout shift
  if (!mounted) {
    return (
      <div
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent opacity-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={
        isDark
          ? `Current theme: Dark (mode: ${theme}). Click to switch to Light.`
          : `Current theme: Light (mode: ${theme}). Click to switch to Dark.`
      }
      className={`group relative inline-flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white/80 p-2 text-gray-700 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-[#3F72AF] hover:bg-white hover:text-[#3F72AF] hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white ${className}`}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        {/* Sun Icon */}
        <Sun
          size={18}
          className={`transition-transform duration-300 ${
            isDark
              ? "rotate-90 scale-0 opacity-0 absolute text-amber-400"
              : "rotate-0 scale-100 opacity-100 text-amber-500"
          }`}
        />

        {/* Moon Icon */}
        <Moon
          size={18}
          className={`transition-transform duration-300 ${
            isDark
              ? "rotate-0 scale-100 opacity-100 text-blue-300"
              : "-rotate-90 scale-0 opacity-0 absolute text-gray-400"
          }`}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
