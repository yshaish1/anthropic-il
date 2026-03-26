"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

const NAV_LINKS = [
  { href: "/", label: "דף הבית" },
  { href: "/news", label: "חדשות" },
  { href: "/tips", label: "טיפים" },
  { href: "/releases", label: "עדכונים" },
  { href: "/reddit", label: "קהילה" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.04)] border-b border-border">
      <div className="flex flex-row-reverse justify-between items-center px-6 py-4 max-w-[1280px] mx-auto w-full">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-primary tracking-tighter headline-font"
        >
          אנתרופיק IL
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex flex-row-reverse items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "text-accent border-b-2 border-accent pb-1 font-bold"
                  : "text-muted font-medium hover:text-accent transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-primary">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-all md:hidden"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-primary">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-lg font-medium ${
                isActive(link.href)
                  ? "text-accent font-bold"
                  : "text-muted hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
