"use client";

import { useState } from "react";
import { useTips } from "@/hooks/useTips";
import TipCard from "@/components/cards/TipCard";

const CATEGORIES = [
  { value: "all", label: "הכל" },
  { value: "prompting", label: "Prompts" },
  { value: "api", label: "API" },
  { value: "claude-code", label: "Claude Code" },
  { value: "general", label: "כללי" },
];

const DIFFICULTIES = [
  { value: "all", label: "הכל" },
  { value: "beginner", label: "מתחילים", color: "bg-[#00b894]" },
  { value: "intermediate", label: "בינוני", color: "bg-yellow-400" },
  { value: "advanced", label: "מתקדם", color: "bg-accent" },
];

export default function TipsPage() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const { data: tips, isLoading } = useTips(
    category === "all" ? undefined : category,
    difficulty === "all" ? undefined : difficulty
  );

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-[56px] headline-font font-extrabold tracking-tight text-primary mb-4 leading-tight">
          טיפים וטריקים
        </h1>
        <p className="text-xl text-muted max-w-2xl">
          כלים, טכניקות ומדריכים לעבודה מיטבית עם Claude
        </p>
      </header>

      {/* Filters & Legend */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        {/* Difficulty Legend */}
        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          {DIFFICULTIES.filter((d) => d.value !== "all").map((d) => (
            <button
              key={d.value}
              onClick={() =>
                setDifficulty(difficulty === d.value ? "all" : d.value)
              }
              className={`flex items-center gap-2 transition-opacity ${
                difficulty !== "all" && difficulty !== d.value
                  ? "opacity-40"
                  : ""
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${d.color}`} />
              <span className="text-sm font-medium text-primary">
                {d.label}
              </span>
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                category === cat.value
                  ? "bg-accent text-white shadow-md shadow-accent/20 font-bold"
                  : "bg-white text-muted border border-border hover:border-accent hover:text-accent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl h-[280px] animate-pulse"
            />
          ))}
        </div>
      ) : tips && tips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {tips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-muted mb-4 block">
            lightbulb
          </span>
          <p className="text-muted text-xl">אין טיפים בקטגוריה זו</p>
        </div>
      )}
    </div>
  );
}
