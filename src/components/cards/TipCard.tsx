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
  beginner: { label: "מתחיל", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" },
  intermediate: { label: "בינוני", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200" },
  advanced: { label: "מתקדם", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200" },
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
        "rounded-xl bg-surface-container-low p-5 transition-all duration-200 hover:bg-surface-highest",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-surface-container-high">
          <Icon className="h-4 w-4 text-coral" />
        </div>
        <span className="text-xs font-medium text-on-surface-variant">
          {cat.label}
        </span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full ms-auto",
            diff.className
          )}
        >
          {diff.label}
        </span>
      </div>

      <h3 className="font-semibold text-primary mb-2">{titleHe}</h3>
      <p className="text-sm text-on-surface-variant line-clamp-4">
        {contentHe}
      </p>
    </div>
  );
}
