"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 mt-auto bg-[#fafafa] border-t border-border">
      <div className="flex flex-col md:flex-row-reverse justify-between items-center px-8 max-w-[1280px] mx-auto w-full gap-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-lg font-bold text-primary headline-font"
        >
          אנתרופיק IL
        </Link>

        {/* Footer Links */}
        <div className="flex flex-row-reverse gap-8 text-sm">
          <Link
            href="#"
            className="text-muted hover:text-accent transition-colors hover:underline underline-offset-4"
          >
            אודות
          </Link>
          <Link
            href="#"
            className="text-muted hover:text-accent transition-colors hover:underline underline-offset-4"
          >
            תנאי שימוש
          </Link>
          <Link
            href="#"
            className="text-muted hover:text-accent transition-colors hover:underline underline-offset-4"
          >
            פרטיות
          </Link>
          <Link
            href="#"
            className="text-muted hover:text-accent transition-colors hover:underline underline-offset-4"
          >
            צור קשר
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-muted">
          © {new Date().getFullYear()} אנתרופיק IL — כל הזכויות שמורות
        </div>
      </div>
    </footer>
  );
}
