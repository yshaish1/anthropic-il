import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "אנתרופיק IL | חדשות Anthropic ו-Claude בעברית",
  description:
    "כל החדשות, העדכונים והטיפים על Anthropic ו-Claude - מתורגמים לעברית. פוסטים מרדיט, עדכוני מודלים, וטיפים לשימוש ב-Claude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="bottom-left" dir="rtl" />
        </QueryProvider>
      </body>
    </html>
  );
}
