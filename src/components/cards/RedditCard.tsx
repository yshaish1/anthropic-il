import { ArrowUp, MessageSquare, ExternalLink } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";

interface RedditCardProps {
  titleHe: string;
  summaryHe: string;
  subreddit: string;
  score: number;
  numComments: number;
  author: string;
  createdUtc: number;
  url: string;
  className?: string;
}

export default function RedditCard({
  titleHe,
  summaryHe,
  subreddit,
  score,
  numComments,
  author,
  createdUtc,
  url,
  className,
}: RedditCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("group flex transition-colors", className)}
      style={{
        gap: "20px",
        padding: "20px 0",
        borderBottom: "1px solid #e4e2de",
      }}
    >
      {/* Score */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "48px", paddingTop: "4px", gap: "2px" }}>
        <ArrowUp style={{ width: "16px", height: "16px", color: "#ab2c5d" }} />
        <span style={{ fontSize: "16px", fontWeight: 700, color: "#030612" }}>{score}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          className="group-hover:!text-[#ab2c5d] transition-colors"
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#030612",
            marginBottom: "6px",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {titleHe}
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "#45464c",
            lineHeight: 1.5,
            marginBottom: "12px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {summaryHe}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", color: "#45464c" }}>
          <span style={{ fontWeight: 500, color: "#ab2c5d" }}>r/{subreddit}</span>
          <span>u/{author}</span>
          <span>{timeAgo(new Date(createdUtc * 1000))}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MessageSquare style={{ width: "14px", height: "14px" }} />
            {numComments}
          </span>
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ display: "flex", alignItems: "center", gap: "4px", marginInlineStart: "auto" }}
          >
            <ExternalLink style={{ width: "14px", height: "14px" }} />
            פתח ברדיט
          </span>
        </div>
      </div>
    </a>
  );
}
