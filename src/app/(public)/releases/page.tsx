"use client";

import { useState } from "react";
import { Box, Code, DollarSign, Zap, ExternalLink, Mail } from "lucide-react";
import { useReleases } from "@/hooks/useReleases";
import { cn, formatHebrewDate } from "@/lib/utils";

const typeFilters = [
  { value: "all", label: "הכל" },
  { value: "model", label: "מודלים" },
  { value: "api", label: "API" },
  { value: "pricing", label: "תמחור" },
  { value: "feature", label: "פיצ'רים" },
];

const typeConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    dot: string;
    badgeBg: string;
  }
> = {
  model: {
    label: "מודל",
    icon: Box,
    color: "text-purple-700",
    bg: "bg-purple-50",
    dot: "bg-purple-500",
    badgeBg: "bg-purple-100 text-purple-700",
  },
  api: {
    label: "API",
    icon: Code,
    color: "text-blue-700",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
    badgeBg: "bg-blue-100 text-blue-700",
  },
  pricing: {
    label: "תמחור",
    icon: DollarSign,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  feature: {
    label: "פיצ'ר",
    icon: Zap,
    color: "text-orange-700",
    bg: "bg-orange-50",
    dot: "bg-orange-500",
    badgeBg: "bg-orange-100 text-orange-700",
  },
};

const resources = [
  {
    label: "דף שינויים רשמי",
    url: "https://docs.anthropic.com/en/docs/about-claude/models",
  },
  {
    label: "בלוג Anthropic",
    url: "https://www.anthropic.com/blog",
  },
  {
    label: "סטטוס API",
    url: "https://status.anthropic.com",
  },
];

export default function ReleasesPage() {
  const [type, setType] = useState("all");
  const { data: releases, isLoading } = useReleases(type);

  return (
    <main className="pt-16 pb-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-primary mb-3">
            עדכונים ושחרורים
          </h1>
          <p className="text-lg text-on-surface-variant">
            מעקב אחרי כל השינויים בעולם Claude ו-Anthropic
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setType(filter.value)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                type === filter.value
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-card border border-outline-variant/20 text-on-surface-variant hover:border-secondary hover:text-secondary"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Main content: timeline + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Timeline */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <div className="space-y-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-8 animate-pulse h-48"
                  />
                ))}
              </div>
            ) : releases?.length ? (
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute right-5 top-0 bottom-0 w-px bg-outline-variant/30" />

                <div className="space-y-8">
                  {releases.map((release) => {
                    const config = typeConfig[release.type] || typeConfig.feature;
                    const Icon = config.icon;

                    return (
                      <div key={release.id} className="relative flex gap-6">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex-shrink-0">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              config.bg
                            )}
                          >
                            <Icon className={cn("h-4 w-4", config.color)} />
                          </div>
                        </div>

                        {/* Content card */}
                        <div className="flex-1 bg-card rounded-xl p-8 border border-outline-variant/10 shadow-sm hover:shadow-md transition-all">
                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold",
                                config.badgeBg
                              )}
                            >
                              {config.label}
                            </span>
                            {release.version && (
                              <span className="px-2.5 py-0.5 rounded bg-surface-container-low text-xs font-mono font-medium text-on-surface-variant">
                                {release.version}
                              </span>
                            )}
                            <span className="text-xs text-on-surface-variant ms-auto">
                              {formatHebrewDate(release.publishedAt.toDate())}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-primary mb-3 leading-snug">
                            {release.titleHe}
                          </h3>

                          {/* Summary */}
                          <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                            {release.summaryHe}
                          </p>

                          {/* Source link */}
                          {release.sourceUrl && (
                            <a
                              href={release.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              קרא במקור
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-on-surface-variant text-lg">
                  אין עדכונים עדיין.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Newsletter signup */}
              <div className="bg-card rounded-xl p-6 border border-outline-variant/10 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <Mail className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  הישארו מעודכנים
                </h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  קבלו עדכון שבועי על כל השינויים החשובים ישירות למייל.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    dir="ltr"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary"
                  />
                  <button className="px-4 py-2.5 bg-secondary text-white rounded-xl text-sm font-medium hover:bg-secondary/90 transition-colors whitespace-nowrap">
                    הרשמה
                  </button>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-card rounded-xl p-6 border border-outline-variant/10 shadow-sm">
                <h3 className="text-lg font-bold text-primary mb-4">
                  קישורים שימושיים
                </h3>
                <ul className="space-y-3">
                  {resources.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        {r.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
