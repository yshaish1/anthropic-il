"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

const navLinks = [
  { href: "/news", label: "חדשות", active: true },
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
      className="p-2 rounded-full hover:bg-surface-container-low transition-all active:scale-90"
      aria-label="החלף ערכת נושא"
    >
      <div className={cn("transition-all duration-500", animating && "rotate-[360deg] scale-0")}>
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-primary" />
        ) : (
          <Sun className="h-5 w-5 text-primary" />
        )}
      </div>
    </button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6 h-16">
      {/* Right side: Logo + Nav */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-black text-primary tracking-tighter ml-4">
          אנתרופיק IL
        </Link>
        <nav className="hidden md:flex gap-8 mr-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xl tracking-tighter px-2 transition-colors",
                link.active
                  ? "text-secondary font-bold"
                  : "text-primary-container hover:bg-surface-container-low"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Left side: Theme + Menu */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-full hover:bg-surface-container-low transition-all active:scale-90"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-primary" />
          ) : (
            <Menu className="h-6 w-6 text-primary" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/15 md:hidden">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-lg font-medium text-primary hover:text-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
