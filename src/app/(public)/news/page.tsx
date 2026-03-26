"use client";

import { useState } from "react";
import { Newspaper } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Newspaper className="h-7 w-7 text-coral" />
        <h1 className="text-3xl font-bold text-primary">חדשות</h1>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              category === cat.value
                ? "bg-secondary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-surface-container-low animate-pulse h-80"
            />
          ))}
        </div>
      ) : articles?.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
          <Newspaper className="h-12 w-12 text-on-surface-variant/30 mx-auto mb-4" />
          <p className="text-on-surface-variant">
            אין חדשות עדיין. בצע שליפה ראשונה מלוח הבקרה.
          </p>
        </div>
      )}
    </div>
  );
}
