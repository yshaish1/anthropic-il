import { Lightbulb, Code, Terminal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TipCardProps {
  titleHe: string;
  contentHe: string;
  category: "prompting" | "api" | "claude-code" | "general";
  difficulty: "beginner" | "intermediate" | "advanced";
  className?: string;
}

const difficultyConfig = {
  beginner: { label: "מתחיל", className: "text-green-600" },
  intermediate: { label: "בינוני", className: "text-yellow-600" },
  advanced: { label: "מתקדם", className: "text-red-600" },
};

const categoryConfig = {
  prompting: { label: "פרומפטים", icon: Lightbulb },
  api: { label: "API", icon: Code },
  "claude-code": { label: "Claude Code", icon: Terminal },
  general: { label: "כללי", icon: Zap },
};

export default function TipCard({
  titleHe,
  contentHe,
  category,
  difficulty,
  className,
}: TipCardProps) {
  const diff = difficultyConfig[difficulty];
  const cat = categoryConfig[category];
  const Icon = cat.icon;

  return (
    <div
      className={cn(
        "rounded-lg bg-card border border-border p-5 transition-all duration-300 hover:shadow-lg hover:border-secondary",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-5 w-5 text-secondary" />
        <span className="text-xs font-semibold text-secondary uppercase">
          {cat.label}
        </span>
        <span className={cn("text-xs font-semibold uppercase ms-auto", diff.className)}>
          {diff.label}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{titleHe}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-4">
        {contentHe}
      </p>
    </div>
  );
}
