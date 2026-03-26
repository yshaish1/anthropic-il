"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useArticle } from "@/hooks/useNews";
import { formatHebrewDate } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  product: "מוצר",
  research: "מחקר",
  policy: "מדיניות",
  company: "חברה",
};

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: article, isLoading } = useArticle(slug);

  if (isLoading) {
    return (
      <div className="pt-12 pb-20 px-6">
        <div className="max-w-[800px] mx-auto space-y-6">
          <div className="h-12 bg-white rounded-lg animate-pulse w-3/4" />
          <div className="h-6 bg-white rounded animate-pulse w-1/2" />
          <div className="aspect-[16/9] bg-white rounded-2xl animate-pulse" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-5 bg-white rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-12 pb-20 px-6 text-center">
        <span className="material-symbols-outlined text-6xl text-muted mb-4 block">
          error
        </span>
        <h1 className="text-3xl font-bold headline-font text-primary mb-4">
          הכתבה לא נמצאה
        </h1>
        <Link
          href="/news"
          className="text-accent font-bold hover:underline"
        >
          חזרה לחדשות
        </Link>
      </div>
    );
  }

  const date = article.publishedAt?.toDate
    ? article.publishedAt.toDate()
    : new Date();

  return (
    <div className="pt-12 pb-20 px-6">
      <article className="max-w-[800px] mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-bold hover:bg-accent/20 transition-colors"
          >
            <span className="ml-2">&larr;</span>
            חזרה לחדשות
          </Link>
        </div>

        {/* Title Section */}
        <header className="mb-8">
          <h1 className="text-[48px] headline-font font-black text-primary leading-[1.1] tracking-tight mb-6">
            {article.titleHe}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-muted text-sm font-medium">
            <span className="px-3 py-1 bg-accent text-white rounded-full text-xs font-bold">
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-[20px]">
                calendar_today
              </span>
              <span>{formatHebrewDate(date)}</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {article.imageUrl && (
          <figure className="mb-12">
            <img
              alt={article.titleHe}
              className="w-full aspect-[16/9] object-cover rounded-2xl shadow-xl"
              src={article.imageUrl}
            />
          </figure>
        )}

        {/* Callout Box */}
        <div className="bg-[#f8f4ff] border-r-4 border-accent p-8 rounded-xl mb-10 shadow-sm">
          <p className="text-[18px] text-primary leading-relaxed font-medium">
            {article.summaryHe}
          </p>
        </div>

        {/* Article Body */}
        <div
          className="text-[16px] text-primary leading-[1.8] space-y-6"
          dangerouslySetInnerHTML={{ __html: article.bodyHe }}
        />

        {/* Share Section */}
        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-primary">שתפו:</span>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.share?.({
                    title: article.titleHe,
                    url: window.location.href,
                  });
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-accent hover:text-accent transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  share
                </span>
              </button>
            </div>
          </div>
          {article.originalUrl && (
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent font-bold hover:underline transition-all"
            >
              <span>קרא את המקור באנגלית</span>
              <span className="material-symbols-outlined text-[18px]">
                open_in_new
              </span>
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
