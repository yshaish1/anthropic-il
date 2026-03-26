"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Bell className="h-7 w-7 text-coral" />
        <h1 className="text-3xl font-bold text-primary">עדכונים ושחרורים</h1>
      </div>
      <p className="text-on-surface-variant mb-8">
        מעקב אחרי עדכוני מודלים, API ותמחור
      </p>

      {/* Type filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {typeFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setType(filter.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              type === filter.value
                ? "bg-secondary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
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
              className="rounded-xl bg-surface-container-low animate-pulse h-36"
            />
          ))}
        </div>
      ) : releases?.length ? (
        <div className="space-y-4">
          {/* Timeline line */}
          <div className="relative">
            <div className="absolute top-0 bottom-0 right-6 w-0.5 bg-outline-variant/30" />
            <div className="space-y-4 relative">
              {releases.map((release) => (
                <div key={release.id} className="relative pr-14">
                  <div className="absolute right-4 top-6 w-4 h-4 rounded-full bg-coral border-4 border-background z-10" />
                  <ReleaseCard
                    titleHe={release.titleHe}
                    summaryHe={release.summaryHe}
                    type={release.type}
                    version={release.version}
                    publishedAt={release.publishedAt.toDate()}
                    sourceUrl={release.sourceUrl}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 text-on-surface-variant/30 mx-auto mb-4" />
          <p className="text-on-surface-variant">אין עדכונים עדיין.</p>
        </div>
      )}
    </div>
  );
}
