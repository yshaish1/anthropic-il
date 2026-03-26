"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Share2, Mail } from "lucide-react";
import { useArticle } from "@/hooks/useNews";
import { formatHebrewDate } from "@/lib/utils";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: article, isLoading } = useArticle(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-surface-container-low rounded w-3/4" />
          <div className="h-4 bg-surface-container-low rounded w-1/3" />
          <div className="h-[300px] bg-surface-container-low rounded-lg mt-8" />
          <div className="space-y-3 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-surface-container-low rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-16 text-center">
        <h1 className="mb-4">הכתבה לא נמצאה</h1>
        <Link href="/news" className="text-secondary hover:underline">
          חזרה לחדשות
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[800px] px-4 py-12">
      {/* Back link */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-8"
      >
        <ArrowRight className="h-4 w-4" />
        חזרה לחדשות
      </Link>

      <article>
        {/* Title */}
        <h1 className="text-[40px] font-bold text-primary mb-6 leading-[1.2]">
          {article.titleHe}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-8 text-sm text-on-surface-variant mb-8">
          {article.category && (
            <span className="font-semibold text-secondary uppercase text-xs">
              {article.category}
            </span>
          )}
          <span>{formatHebrewDate(article.publishedAt.toDate())}</span>
        </div>

        {/* Hero Image */}
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.titleHe}
            className="w-full rounded-lg mb-8 object-cover"
          />
        )}

        {/* Summary highlight */}
        <div className="bg-surface-container-low border-s-4 border-secondary py-5 px-6 rounded mb-8">
          <p className="text-on-surface leading-relaxed">
            {article.summaryHe}
          </p>
        </div>

        {/* Body */}
        <div className="text-base text-on-surface leading-[1.8] whitespace-pre-line mb-10">
          {article.bodyHe}
        </div>

        {/* Share section */}
        <div className="bg-surface-container-low rounded-lg p-6 mb-10">
          <h4 className="text-base font-semibold text-primary mb-3">
            שתף את הכתבה:
          </h4>
          <div className="flex gap-4">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-outline-variant rounded text-sm text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors">
              <Share2 className="h-4 w-4" />
              שיתוף
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-outline-variant rounded text-sm text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors">
              <Mail className="h-4 w-4" />
              שלח דוא&quot;ל
            </button>
          </div>
        </div>

        {/* Original link */}
        <div className="pt-6 border-t border-border">
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            קרא את המקור באנגלית
          </a>
        </div>
      </article>
    </div>
  );
}
