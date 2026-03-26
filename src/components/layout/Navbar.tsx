"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "ראשי" },
  { href: "/news", label: "חדשות" },
  { href: "/reddit", label: "רדיט" },
  { href: "/tips", label: "טיפים" },
  { href: "/releases", label: "עדכונים" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: "#fbf9f5", borderBottom: "1px solid #e4e2de" }}
    >
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex items-center justify-between" style={{ padding: "16px 0" }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="font-black"
              style={{ fontSize: "14px", color: "#ab2c5d" }}
            >
              IL
            </span>
            <span
              className="font-bold"
              style={{ fontSize: "18px", color: "#030612", fontFamily: "var(--font-be-vietnam-pro, 'Be Vietnam Pro', var(--font-rubik, 'Rubik', sans-serif))" }}
            >
              אנתרופיק
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center" style={{ gap: "32px" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1a" }}
                className="hover:!text-[#ab2c5d] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: moon + hamburger */}
          <div className="flex items-center gap-3">
            <button style={{ color: "#45464c" }} className="p-1">
              <Moon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1"
              style={{ color: "#1b1c1a" }}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-80" : "max-h-0"
        )}
        style={{ borderTop: mobileOpen ? "1px solid #e4e2de" : "none" }}
      >
        <div className="px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block hover:!text-[#ab2c5d] transition-colors"
              style={{ padding: "12px 0", fontSize: "14px", fontWeight: 500, color: "#1b1c1a" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
