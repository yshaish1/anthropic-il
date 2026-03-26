"use client";

import { useState } from "react";
import { useReleases } from "@/hooks/useReleases";
import ReleaseCard from "@/components/cards/ReleaseCard";

const TYPES = [
  { value: "all", label: "הכל" },
  { value: "model", label: "מודלים" },
  { value: "api", label: "API" },
  { value: "pricing", label: "תמחור" },
  { value: "feature", label: "פיצ'רים" },
];

export default function ReleasesPage() {
  const [type, setType] = useState("all");
  const { data: releases, isLoading } = useReleases(
    type === "all" ? undefined : type
  );

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-12 pb-20">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-[56px] font-black headline-font tracking-tight leading-tight text-primary mb-4">
          עדכונים ושחרורים
        </h1>
        <p className="text-xl text-muted max-w-2xl">
          מעקב אחרי כל השינויים בעולם ה-Anthropic ו-Claude
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-row-reverse gap-3 mb-16 overflow-x-auto pb-2 no-scrollbar">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              type === t.value
                ? "bg-accent text-white shadow-md shadow-pink-200"
                : "bg-white border border-slate-200 text-slate-600 hover:border-accent hover:text-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl h-[200px] animate-pulse"
            />
          ))}
        </div>
      ) : releases && releases.length > 0 ? (
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute right-6 top-0 bottom-0 w-px bg-slate-200" />
          <div className="space-y-12">
            {releases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-muted mb-4 block">
            update
          </span>
          <p className="text-muted text-xl">אין עדכונים להצגה</p>
        </div>
      )}
    </div>
  );
}
