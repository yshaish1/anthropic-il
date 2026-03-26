"use client";

import { useState } from "react";
import ReleaseCard from "@/components/cards/ReleaseCard";
import { useReleases } from "@/hooks/useReleases";
import { cn } from "@/lib/utils";

const typeFilters = [
  { value: "all", label: "הכל" },
  { value: "model", label: "מודלים" },
  { value: "api", label: "API" },
  { value: "pricing", label: "תמחור" },
  { value: "feature", label: "פיצ'רים" },
];

export default function ReleasesPage() {
  const [type, setType] = useState("all");
  const { data: releases, isLoading } = useReleases(type);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <h1 className="mb-2">עדכונים ושחרורים</h1>
      <p className="text-on-surface-variant mb-8">
        מעקב אחרי עדכוני מודלים, API ותמחור
      </p>

      {/* Type filters */}
      <div className="flex gap-1 mb-10 border-b border-border">
        {typeFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setType(filter.value)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              type === filter.value
                ? "border-secondary text-secondary"
                : "border-transparent text-on-surface-variant hover:text-primary"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-surface-container-low border border-border animate-pulse h-36"
            />
          ))}
        </div>
      ) : releases?.length ? (
        <div className="space-y-4">
          {releases.map((release) => (
            <ReleaseCard
              key={release.id}
              titleHe={release.titleHe}
              summaryHe={release.summaryHe}
              type={release.type}
              version={release.version}
              publishedAt={release.publishedAt.toDate()}
              sourceUrl={release.sourceUrl}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-on-surface-variant">אין עדכונים עדיין.</p>
        </div>
      )}
    </div>
  );
}
