"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Moon, Sun, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

const navLinks = [
  { href: "/news", label: "חדשות" },
  { href: "/reddit", label: "רדיט" },
  { href: "/tips", label: "טיפים" },
  { href: "/releases", label: "עדכונים" },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    setAnimating(true);
    toggle();
    setTimeout(() => setAnimating(false), 500);
  }

  return (
    <button
      onClick={handleClick}
      className="text-slate-600 hover:text-accent transition-all duration-300 active:scale-95"
      aria-label="החלף ערכת נושא"
    >
      <div className={cn("transition-all duration-500", animating && "rotate-[360deg] scale-0")}>
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </div>
    </button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full z-50 bg-card/90 backdrop-blur-md shadow-sm">
      <nav className="flex items-center justify-between px-6 py-4 max-w-[1280px] mx-auto w-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-primary tracking-tight headline-font active:scale-95 transition-transform"
        >
          אנתרופיק IL
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-medium text-base">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-accent transition-colors active:scale-95"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="text-slate-600 hover:text-accent transition-all duration-300 active:scale-95 hidden md:block">
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-600 active:scale-95 transition-transform"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-t border-border px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-lg font-medium text-primary hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
