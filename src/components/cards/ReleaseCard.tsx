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
  model: { label: "מודל", icon: Box, color: "#7c3aed" },
  api: { label: "API", icon: Code, color: "#2563eb" },
  pricing: { label: "תמחור", icon: DollarSign, color: "#16a34a" },
  feature: { label: "פיצ'ר", icon: Zap, color: "#ea580c" },
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
      className={cn("group block transition-all duration-300", className)}
      style={{
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        border: "1px solid #e4e2de",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <Icon style={{ width: "16px", height: "16px", color: config.color }} />
        <span style={{ fontSize: "12px", fontWeight: 600, color: config.color, textTransform: "uppercase" }}>
          {config.label}
        </span>
        {version && (
          <span
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              fontWeight: 500,
              color: "#45464c",
              backgroundColor: "#f5f3ef",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {version}
          </span>
        )}
        <span style={{ fontSize: "12px", color: "#76777c", marginInlineStart: "auto" }}>
          {formatHebrewDate(publishedAt)}
        </span>
      </div>

      <h3
        className="group-hover:!text-[#ab2c5d] transition-colors"
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#030612",
          marginBottom: "8px",
          fontFamily: "var(--font-be-vietnam-pro, 'Be Vietnam Pro', var(--font-rubik, 'Rubik', sans-serif))",
        }}
      >
        {titleHe}
      </h3>
      <p
        style={{
          fontSize: "14px",
          color: "#45464c",
          lineHeight: 1.7,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {summaryHe}
      </p>
    </a>
  );
}
