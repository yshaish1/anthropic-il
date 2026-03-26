"use client";

import { useState } from "react";
import TipCard from "@/components/cards/TipCard";
import { useTips } from "@/hooks/useTips";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "הכל" },
  { value: "prompting", label: "פרומפטים" },
  { value: "api", label: "API" },
  { value: "claude-code", label: "Claude Code" },
  { value: "general", label: "כללי" },
];

const difficulties = [
  { value: "all", label: "כל הרמות" },
  { value: "beginner", label: "מתחיל" },
  { value: "intermediate", label: "בינוני" },
  { value: "advanced", label: "מתקדם" },
];

export default function TipsPage() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const { data: tips, isLoading } = useTips(category, difficulty);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <h1 className="mb-2">טיפים וטריקים</h1>
      <p className="text-on-surface-variant mb-8">
        איך להפיק את המקסימום מ-Claude
      </p>

      {/* Category filters */}
      <div className="flex gap-1 mb-4 border-b border-border">
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

      {/* Difficulty filters */}
      <div className="flex gap-3 mb-10">
        {difficulties.map((diff) => (
          <button
            key={diff.value}
            onClick={() => setDifficulty(diff.value)}
            className={cn(
              "text-xs font-medium transition-colors",
              difficulty === diff.value
                ? "text-primary font-semibold"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            {diff.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-surface-container-low border border-border animate-pulse h-48"
            />
          ))}
        </div>
      ) : tips?.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <TipCard
              key={tip.id}
              titleHe={tip.titleHe}
              contentHe={tip.contentHe}
              category={tip.category}
              difficulty={tip.difficulty}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-on-surface-variant">אין טיפים עדיין.</p>
        </div>
      )}
    </div>
  );
}
