"use client";

import { useState } from "react";
import NewsCard from "@/components/cards/NewsCard";
import { useNews } from "@/hooks/useNews";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "הכל" },
  { value: "Product", label: "מוצר" },
  { value: "Research", label: "מחקר" },
  { value: "Policy", label: "מדיניות" },
  { value: "Company", label: "חברה" },
];

export default function NewsPage() {
  const [category, setCategory] = useState("all");
  const { data: articles, isLoading } = useNews(category);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <h1 className="mb-2">חדשות</h1>
      <p className="text-on-surface-variant mb-8">
        כל החדשות והעדכונים מ-Anthropic בתרגום לעברית
      </p>

      {/* Category filters */}
      <div className="flex gap-1 mb-10 border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              category === cat.value
                ? "border-secondary text-secondary"
                : "border-transparent text-on-surface-variant hover:text-primary"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-surface-container-low border border-border animate-pulse h-80"
            />
          ))}
        </div>
      ) : articles?.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              slug={article.slug}
              titleHe={article.titleHe}
              summaryHe={article.summaryHe}
              category={article.category}
              imageUrl={article.imageUrl}
              publishedAt={article.publishedAt.toDate()}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-on-surface-variant">
            אין חדשות עדיין. בצע שליפה ראשונה מלוח הבקרה.
          </p>
        </div>
      )}
    </div>
  );
}
