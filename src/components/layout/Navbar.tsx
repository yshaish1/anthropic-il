"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "בית" },
  { href: "/news", label: "חדשות" },
  { href: "/reddit", label: "רדיט" },
  { href: "/tips", label: "טיפים" },
  { href: "/releases", label: "עדכונים" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <Sparkles className="h-6 w-6 text-coral" />
            <span>אנתרופיק IL</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-container-low"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
