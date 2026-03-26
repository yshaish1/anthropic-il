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
      className={cn(
        "group flex gap-5 py-5 border-b border-border last:border-b-0 transition-colors",
        className
      )}
    >
      {/* Score */}
      <div className="flex flex-col items-center min-w-[48px] pt-1 gap-0.5">
        <ArrowUp className="h-4 w-4 text-secondary" />
        <span className="text-base font-bold text-primary">{score}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-primary mb-1.5 leading-snug group-hover:text-secondary transition-colors line-clamp-2">
          {titleHe}
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-3 line-clamp-2">
          {summaryHe}
        </p>
        <div className="flex items-center gap-4 text-sm text-on-surface-variant flex-wrap">
          <span className="font-medium text-secondary">r/{subreddit}</span>
          <span>u/{author}</span>
          <span>{timeAgo(new Date(createdUtc * 1000))}</span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {numComments}
          </span>
          <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ms-auto">
            <ExternalLink className="h-3.5 w-3.5" />
            פתח ברדיט
          </span>
        </div>
      </div>
    </a>
  );
}
