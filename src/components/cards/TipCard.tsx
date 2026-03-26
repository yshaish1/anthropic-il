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
  beginner: { label: "מתחיל", color: "#16a34a" },
  intermediate: { label: "בינוני", color: "#ca8a04" },
  advanced: { label: "מתקדם", color: "#dc2626" },
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
      className={cn("transition-all duration-300", className)}
      style={{
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        border: "1px solid #e4e2de",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <Icon style={{ width: "20px", height: "20px", color: "#ab2c5d" }} />
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#ab2c5d", textTransform: "uppercase" }}>
          {cat.label}
        </span>
        <span style={{ fontSize: "12px", fontWeight: 600, color: diff.color, textTransform: "uppercase", marginInlineStart: "auto" }}>
          {diff.label}
        </span>
      </div>

      <h3
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
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {contentHe}
      </p>
    </div>
  );
}
