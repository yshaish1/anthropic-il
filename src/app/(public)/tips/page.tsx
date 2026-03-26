"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Lightbulb className="h-7 w-7 text-coral" />
        <h1 className="text-3xl font-bold text-primary">טיפים וטריקים</h1>
      </div>
      <p className="text-on-surface-variant mb-8">
        איך להפיק את המקסימום מ-Claude
      </p>

      {/* Filters */}
      <div className="space-y-3 mb-8">
        <div className="flex gap-2 flex-wrap">
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
        <div className="flex gap-2 flex-wrap">
          {difficulties.map((diff) => (
            <button
              key={diff.value}
              onClick={() => setDifficulty(diff.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                difficulty === diff.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-surface-container-low animate-pulse h-48"
            />
          ))}
        </div>
      ) : tips?.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
          <Lightbulb className="h-12 w-12 text-on-surface-variant/30 mx-auto mb-4" />
          <p className="text-on-surface-variant">אין טיפים עדיין.</p>
        </div>
      )}
    </div>
  );
}
