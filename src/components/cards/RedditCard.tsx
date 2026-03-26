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

const subredditColors: Record<string, string> = {
  ClaudeAI: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
  anthropic: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
};

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
      className={cn(
        "group flex gap-4 rounded-xl bg-surface-container-low hover:bg-surface-highest p-5 transition-all duration-200",
        className
      )}
    >
      {/* Score */}
      <div className="flex flex-col items-center justify-start gap-0.5 min-w-[3rem] text-center">
        <ArrowUp className="h-4 w-4 text-coral" />
        <span className="text-sm font-bold text-primary">{score}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              subredditColors[subreddit] ||
                "bg-surface-container-high text-on-surface-variant"
            )}
          >
            r/{subreddit}
          </span>
          <span className="text-xs text-on-surface-variant">
            {timeAgo(new Date(createdUtc * 1000))}
          </span>
          <span className="text-xs text-on-surface-variant">
            u/{author}
          </span>
        </div>

        <h3 className="font-semibold text-primary mb-1.5 group-hover:text-secondary transition-colors line-clamp-2">
          {titleHe}
        </h3>

        <p className="text-sm text-on-surface-variant line-clamp-2 mb-2">
          {summaryHe}
        </p>

        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {numComments} תגובות
          </span>
          <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-3.5 w-3.5" />
            פתח ברדיט
          </span>
        </div>
      </div>
    </a>
  );
}
