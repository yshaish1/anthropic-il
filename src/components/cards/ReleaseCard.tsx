"use client";

import type { ReleaseNote } from "@/types";
import { formatHebrewDate } from "@/lib/utils";

const TYPE_CONFIG: Record<
  string,
  { label: string; dotColor: string; badgeBg: string; badgeText: string }
> = {
  model: {
    label: "מודל",
    dotColor: "bg-accent",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
  },
  api: {
    label: "API",
    dotColor: "bg-blue-500",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  },
  pricing: {
    label: "תמחור",
    dotColor: "bg-green-500",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
  },
  feature: {
    label: "פיצ'ר",
    dotColor: "bg-orange-500",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
  },
};

export default function ReleaseCard({
  release,
}: {
  release: ReleaseNote;
}) {
  const config = TYPE_CONFIG[release.type] || TYPE_CONFIG.feature;
  const date = release.publishedAt?.toDate
    ? release.publishedAt.toDate()
    : new Date();

  return (
    <div className="relative pr-16 group">
      {/* Timeline Dot */}
      <div
        className={`absolute right-[21px] top-8 w-3 h-3 rounded-full ${config.dotColor} border-4 border-white ring-4 ring-${config.dotColor.replace("bg-", "")}/10 transition-all group-hover:scale-125 z-10`}
        style={{
          boxShadow: `0 0 0 4px color-mix(in srgb, currentColor 10%, transparent)`,
        }}
      />
      <div className="bg-white p-8 rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`px-3 py-1 rounded-full ${config.badgeBg} ${config.badgeText} text-xs font-bold`}
          >
            {config.label}
          </span>
          {release.version && (
            <span className="text-slate-400 text-sm">{release.version}</span>
          )}
          <span className="text-slate-400 text-sm">&bull;</span>
          <span className="text-slate-400 text-sm">
            {formatHebrewDate(date)}
          </span>
        </div>
        <h3 className="text-2xl font-bold headline-font mb-4 text-primary">
          {release.titleHe}
        </h3>
        <p className="text-muted leading-relaxed mb-6">{release.summaryHe}</p>
        {release.sourceUrl && (
          <a
            href={release.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent font-bold hover:underline"
          >
            קרא עוד
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
