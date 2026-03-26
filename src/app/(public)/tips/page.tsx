"use client";

import { useState } from "react";
import { Lightbulb, Code, Terminal, Zap } from "lucide-react";
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

const difficultyConfig: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  beginner: {
    label: "מתחיל",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  intermediate: {
    label: "בינוני",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  advanced: {
    label: "מתקדם",
    color: "text-rose-700",
    bg: "bg-rose-50 border-rose-200",
    dot: "bg-rose-500",
  },
};

const categoryConfig: Record<
  string,
  { label: string; icon: React.ElementType; iconBg: string; iconColor: string }
> = {
  prompting: {
    label: "פרומפטים",
    icon: Lightbulb,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  api: {
    label: "API",
    icon: Code,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  "claude-code": {
    label: "Claude Code",
    icon: Terminal,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  general: {
    label: "כללי",
    icon: Zap,
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
};

export default function TipsPage() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const { data: tips, isLoading } = useTips(category, difficulty);

  return (
    <main className="pt-16 pb-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-black text-primary mb-3">
            טיפים וטריקים
          </h1>
          <p className="text-lg text-on-surface-variant">
            כלים, טכניקות ומדריכים לעבודה מיטבית עם Claude
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                category === cat.value
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-card border border-outline-variant/20 text-on-surface-variant hover:border-secondary hover:text-secondary"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Difficulty legend + filter */}
        <div className="flex flex-wrap items-center gap-6 mb-10">
          <span className="text-sm text-on-surface-variant font-medium">
            רמת קושי:
          </span>
          {difficulties.map((diff) => {
            const config = difficultyConfig[diff.value];
            return (
              <button
                key={diff.value}
                onClick={() => setDifficulty(diff.value)}
                className={cn(
                  "flex items-center gap-2 text-sm transition-all",
                  difficulty === diff.value
                    ? "font-bold text-primary"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {config && (
                  <span
                    className={cn("w-2.5 h-2.5 rounded-full", config.dot)}
                  />
                )}
                {diff.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-8 rounded-xl bg-card animate-pulse min-h-[280px]"
              />
            ))}
          </div>
        ) : tips?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip) => {
              const cat = categoryConfig[tip.category];
              const diff = difficultyConfig[tip.difficulty];
              const Icon = cat?.icon || Zap;

              return (
                <div
                  key={tip.id}
                  className="group p-8 rounded-xl bg-card border border-outline-variant/10 shadow-sm hover:shadow-md transition-all duration-300 min-h-[280px] flex flex-col justify-between"
                >
                  <div>
                    {/* Top row: icon + difficulty */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          cat?.iconBg || "bg-surface-container-low"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            cat?.iconColor || "text-secondary"
                          )}
                        />
                      </div>
                      {diff && (
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold border",
                            diff.bg,
                            diff.color
                          )}
                        >
                          {diff.label}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-primary mb-3 leading-snug">
                      {tip.titleHe}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-4">
                      {tip.contentHe}
                    </p>
                  </div>

                  {/* Read more */}
                  <div className="mt-6">
                    <span className="text-secondary font-bold text-sm group-hover:underline cursor-pointer">
                      קרא עוד &larr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg">
              אין טיפים עדיין.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
