"use client";

import { useState } from "react";
import { useNews } from "@/hooks/useNews";
import NewsCard from "@/components/cards/NewsCard";

const CATEGORIES = [
  { value: "all", label: "הכל" },
  { value: "product", label: "מוצר" },
  { value: "research", label: "מחקר" },
  { value: "policy", label: "מדיניות" },
  { value: "company", label: "חברה" },
];

export default function NewsPage() {
  const [category, setCategory] = useState("all");
  const { data: articles, isLoading } = useNews(
    category === "all" ? undefined : category
  );

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="headline-font font-extrabold text-[56px] text-primary leading-tight tracking-tight">
          חדשות
        </h1>
        <div className="h-[3px] w-[48px] bg-accent mt-2 mb-4" />
        <p className="text-muted text-xl max-w-2xl">
          כל החדשות והעדכונים מ-Anthropic בתרגום לעברית
        </p>
      </header>

      {/* Filter Bar */}
      <section className="flex flex-wrap gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
              category === cat.value
                ? "bg-accent text-white shadow-sm shadow-accent/20"
                : "bg-white border border-slate-200 text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* News Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl h-[400px] animate-pulse"
            />
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-muted mb-4 block">
            article
          </span>
          <p className="text-muted text-xl">אין כתבות בקטגוריה זו</p>
        </div>
      )}
    </div>
  );
}
