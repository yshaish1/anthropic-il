"use client";

import type { Tip } from "@/types";

const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; colorClass: string; bgClass: string }
> = {
  beginner: {
    label: "מתחילים",
    colorClass: "text-[#00b894]",
    bgClass: "bg-[#00b894]/10",
  },
  intermediate: {
    label: "בינוני",
    colorClass: "text-yellow-600",
    bgClass: "bg-yellow-400/10",
  },
  advanced: {
    label: "מתקדם",
    colorClass: "text-accent",
    bgClass: "bg-accent/10",
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  prompting: "lightbulb",
  api: "code",
  "claude-code": "terminal",
  general: "psychology",
};

const CATEGORY_COLORS: Record<string, string> = {
  prompting: "bg-blue-50 text-blue-600",
  api: "bg-green-50 text-[#00b894]",
  "claude-code": "bg-purple-50 text-purple-600",
  general: "bg-orange-50 text-orange-600",
};

export default function TipCard({ tip }: { tip: Tip }) {
  const diff = DIFFICULTY_CONFIG[tip.difficulty] || DIFFICULTY_CONFIG.beginner;
  const icon = CATEGORY_ICONS[tip.category] || "lightbulb";
  const iconColor = CATEGORY_COLORS[tip.category] || "bg-blue-50 text-blue-600";

  return (
    <div className="bg-white rounded-2xl p-8 min-h-[280px] shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div
            className={`w-14 h-14 rounded-xl ${iconColor} flex items-center justify-center`}
          >
            <span className="material-symbols-outlined text-3xl">{icon}</span>
          </div>
          <span
            className={`px-3 py-1 ${diff.bgClass} ${diff.colorClass} text-xs font-bold rounded-full`}
          >
            {diff.label}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-primary mb-3 headline-font">
          {tip.titleHe}
        </h3>
        <p className="text-muted leading-relaxed mb-6 line-clamp-3">
          {tip.contentHe}
        </p>
      </div>
      <span className="flex items-center gap-2 text-accent font-bold group-hover:gap-3 transition-all cursor-pointer">
        <span>קרא עוד</span>
        <span className="material-symbols-outlined">arrow_back</span>
      </span>
    </div>
  );
}
