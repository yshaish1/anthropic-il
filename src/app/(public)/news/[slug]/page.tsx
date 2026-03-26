"use client";

import { use } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Share2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { useArticle, useNews } from "@/hooks/useNews";
import { formatHebrewDate } from "@/lib/utils";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: article, isLoading } = useArticle(slug);
  const { data: relatedArticles } = useNews(undefined, 4);

  // Filter out current article from related
  const related = relatedArticles?.filter((a) => a.slug !== slug)?.slice(0, 3);

  if (isLoading) {
    return (
      <main className="pt-16 pb-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-surface-container-low rounded-full w-24" />
            <div className="h-12 bg-surface-container-low rounded w-3/4" />
            <div className="h-5 bg-surface-container-low rounded w-1/3" />
            <div className="aspect-[16/9] bg-surface-container-low rounded-xl" />
            <div className="space-y-3 mt-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-surface-container-low rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="pt-16 pb-32">
        <div className="mx-auto max-w-3xl px-6 text-center py-20">
          <h1 className="text-4xl font-black text-primary mb-4">
            הכתבה לא נמצאה
          </h1>
          <Link
            href="/news"
            className="text-secondary font-medium hover:underline"
          >
            חזרה לחדשות
          </Link>
        </div>
      </main>
    );
  }

  const readTime = Math.max(
    1,
    Math.ceil((article.bodyHe?.length || 0) / 800)
  );

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: article!.titleHe,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  function handleTwitterShare() {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article!.titleHe)}`,
      "_blank"
    );
  }

  return (
    <main className="pt-16 pb-32">
      <div className="mx-auto max-w-3xl px-6">
        {/* Breadcrumb badge */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-secondary-fixed text-secondary rounded-full text-sm font-medium mb-8 hover:bg-secondary/10 transition-colors"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          חזרה לחדשות
        </Link>

        <article>
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-[1.1]">
            {article.titleHe}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant mb-8">
            {article.category && (
              <span className="px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold">
                {article.category}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatHebrewDate(article.publishedAt.toDate())}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime} דק&apos; קריאה
            </span>
          </div>

          {/* Hero Image */}
          {article.imageUrl && (
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-10">
              <img
                src={article.imageUrl}
                alt={article.titleHe}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Summary callout */}
          <div className="p-8 bg-surface-container-low rounded-xl border-r-4 border-secondary mb-10">
            <p className="text-on-surface leading-relaxed text-lg">
              {article.summaryHe}
            </p>
          </div>

          {/* Body */}
          <div className="text-base text-on-surface leading-[1.8] whitespace-pre-line mb-12">
            {article.bodyHe}
          </div>

          {/* Share buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span className="text-sm font-medium text-on-surface-variant">
              שתפו:
            </span>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-card border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-white hover:border-secondary transition-all"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleTwitterShare}
              className="w-10 h-10 rounded-full bg-card border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-white hover:border-secondary transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          </div>

          {/* Original source */}
          <div className="pt-6 border-t border-outline-variant/20">
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

        {/* Related Articles */}
        {related && related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-black text-primary mb-8">
              כתבות נוספות
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/news/${r.slug}`}
                  className="group bg-card rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-md transition-all"
                >
                  {r.imageUrl ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={r.imageUrl}
                        alt={r.titleHe}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-surface-container-low" />
                  )}
                  <div className="p-4">
                    <span className="text-xs text-on-surface-variant">
                      {formatHebrewDate(r.publishedAt.toDate())}
                    </span>
                    <h3 className="text-base font-bold text-primary mt-1 leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                      {r.titleHe}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
