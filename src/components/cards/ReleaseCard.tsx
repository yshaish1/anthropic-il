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
  model: { label: "מודל", icon: Box, className: "text-purple-600" },
  api: { label: "API", icon: Code, className: "text-blue-600" },
  pricing: { label: "תמחור", icon: DollarSign, className: "text-green-600" },
  feature: { label: "פיצ'ר", icon: Zap, className: "text-orange-600" },
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
        "group block rounded-lg bg-card border border-border p-5 transition-all duration-300 hover:shadow-lg hover:border-secondary",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className={cn("h-4 w-4", config.className)} />
        <span className={cn("text-xs font-semibold uppercase", config.className)}>
          {config.label}
        </span>
        {version && (
          <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
            {version}
          </span>
        )}
        <span className="text-xs text-outline ms-auto">
          {formatHebrewDate(publishedAt)}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
        {titleHe}
      </h3>
      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
        {summaryHe}
      </p>
    </a>
  );
}
