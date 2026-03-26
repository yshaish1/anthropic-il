"use client";

import Link from "next/link";
import type { Article } from "@/types";
import { formatHebrewDate } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  product: "מוצר",
  research: "מחקר",
  policy: "מדיניות",
  company: "חברה",
};

export default function NewsCard({ article }: { article: Article }) {
  const date = article.publishedAt?.toDate
    ? article.publishedAt.toDate()
    : new Date();

  return (
    <Link href={`/news/${article.slug}`}>
      <article className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
        {article.imageUrl && (
          <div className="relative aspect-video overflow-hidden">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={article.imageUrl}
              alt={article.titleHe}
            />
            <span className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
          </div>
        )}
        <div className="p-8">
          <time className="text-muted text-sm mb-2 block">
            {formatHebrewDate(date)}
          </time>
          <h3 className="font-[var(--font-sora)] text-[22px] font-bold text-primary mb-3 transition-colors group-hover:text-accent line-clamp-2 headline-font">
            {article.titleHe}
          </h3>
          <p className="text-muted text-sm line-clamp-3 leading-relaxed">
            {article.summaryHe}
          </p>
        </div>
      </article>
    </Link>
  );
}
