"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ExternalLink, Tag } from "lucide-react";
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-container-low rounded w-3/4" />
          <div className="h-4 bg-surface-container-low rounded w-1/2" />
          <div className="h-64 bg-surface-container-low rounded-xl" />
          <div className="space-y-2">
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">
          הכתבה לא נמצאה
        </h1>
        <Link
          href="/news"
          className="text-secondary hover:text-secondary-container"
        >
          חזרה לחדשות
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-6"
      >
        <ArrowRight className="h-4 w-4" />
        חזרה לחדשות
      </Link>

      {/* Metadata */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {article.category && (
          <span className="flex items-center gap-1 text-xs font-medium bg-secondary-fixed text-secondary px-2.5 py-1 rounded-full">
            <Tag className="h-3 w-3" />
            {article.category}
          </span>
        )}
        <span className="flex items-center gap-1 text-sm text-on-surface-variant">
          <Calendar className="h-4 w-4" />
          {formatHebrewDate(article.publishedAt.toDate())}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6 leading-tight">
        {article.titleHe}
      </h1>

      {/* Summary */}
      <p className="text-lg text-on-surface-variant mb-8 border-r-4 border-coral pr-4">
        {article.summaryHe}
      </p>

      {/* Hero Image */}
      {article.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-8">
          <img
            src={article.imageUrl}
            alt={article.titleHe}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Body */}
      <div className="prose prose-lg max-w-none text-on-surface leading-relaxed whitespace-pre-line">
        {article.bodyHe}
      </div>

      {/* Original link */}
      <div className="mt-10 pt-6 border-t border-outline-variant/20">
        <a
          href={article.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-sm font-medium text-on-surface-variant transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          קרא את המקור באנגלית
        </a>
      </div>
    </article>
  );
}
