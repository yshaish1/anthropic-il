import { Box, Code, DollarSign, Zap } from "lucide-react";
import { cn, formatHebrewDate } from "@/lib/utils";

interface ReleaseCardProps {
  titleHe: string;
  summaryHe: string;
  type: "model" | "api" | "pricing" | "feature";
  version: string | null;
  publishedAt: Date;
  sourceUrl: string;
  className?: string;
}

const typeConfig = {
  model: { label: "מודל", icon: Box, className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200" },
  api: { label: "API", icon: Code, className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" },
  pricing: { label: "תמחור", icon: DollarSign, className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" },
  feature: { label: "פיצ'ר", icon: Zap, className: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200" },
};

export default function ReleaseCard({
  titleHe,
  summaryHe,
  type,
  version,
  publishedAt,
  sourceUrl,
  className,
}: ReleaseCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group block rounded-xl bg-surface-container-low hover:bg-surface-highest p-5 transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
            config.className
          )}
        >
          <Icon className="h-3 w-3" />
          {config.label}
        </span>
        {version && (
          <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
            {version}
          </span>
        )}
        <span className="text-xs text-on-surface-variant ms-auto">
          {formatHebrewDate(publishedAt)}
        </span>
      </div>

      <h3 className="font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
        {titleHe}
      </h3>
      <p className="text-sm text-on-surface-variant line-clamp-3">
        {summaryHe}
      </p>
    </a>
  );
}
