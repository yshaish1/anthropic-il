"use client";

import { useState } from "react";
import Link from "next/link";
import { useNews } from "@/hooks/useNews";
import { cn, formatHebrewDate } from "@/lib/utils";

const categories = [
  { value: "all", label: "הכל" },
  { value: "Product", label: "מוצר" },
  { value: "Research", label: "מחקר" },
  { value: "Policy", label: "מדיניות" },
  { value: "Company", label: "חברה" },
];

const categoryColors: Record<string, string> = {
  Product: "bg-accent text-white",
  Research: "bg-primary text-white",
  Policy: "bg-amber-500 text-white",
  Company: "bg-emerald-600 text-white",
};

export default function NewsPage() {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const { data: articles, isLoading } = useNews(category);

  const totalPages = articles ? Math.ceil(articles.length / perPage) : 1;
  const paginatedArticles = articles?.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <main className="pt-16 pb-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="headline-font text-5xl md:text-6xl font-black text-primary mb-3">
            חדשות
          </h1>
          <div className="h-1.5 w-12 bg-accent rounded-full mb-4" />
          <p className="text-lg text-muted">
            כל החדשות והעדכונים מ-Anthropic בתרגום לעברית
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                setPage(1);
              }}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                category === cat.value
                  ? "bg-accent text-white shadow-sm"
                  : "bg-card border-2 border-slate-200 text-muted hover:border-accent hover:text-accent"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-card border border-slate-100 animate-pulse"
              >
                <div className="aspect-video bg-slate-100 rounded-t-xl" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-5 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedArticles?.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group bg-card rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 border border-slate-100 overflow-hidden transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.titleHe}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100" />
                    )}
                    {/* Category badge */}
                    {article.category && (
                      <span
                        className={cn(
                          "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold",
                          categoryColors[article.category] ||
                            "bg-accent text-white"
                        )}
                      >
                        {article.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <span className="text-xs text-muted">
                      {formatHebrewDate(article.publishedAt.toDate())}
                    </span>
                    <h3 className="text-xl font-bold text-primary mt-2 mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {article.titleHe}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed line-clamp-2">
                      {article.summaryHe}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full bg-card border border-slate-200 text-muted hover:bg-slate-100 disabled:opacity-30 transition-all flex items-center justify-center"
                >
                  &rsaquo;
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "w-10 h-10 rounded-full text-sm font-medium transition-all flex items-center justify-center",
                      page === i + 1
                        ? "bg-accent text-white"
                        : "bg-card border border-slate-200 text-muted hover:bg-slate-100"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full bg-card border border-slate-200 text-muted hover:bg-slate-100 disabled:opacity-30 transition-all flex items-center justify-center"
                >
                  &lsaquo;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted text-lg">
              אין חדשות עדיין. בצע שליפה ראשונה מלוח הבקרה.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
