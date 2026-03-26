import Link from "next/link";
import { cn, formatHebrewDate } from "@/lib/utils";

interface NewsCardProps {
  slug: string;
  titleHe: string;
  summaryHe: string;
  category: string;
  imageUrl: string | null;
  publishedAt: Date;
  className?: string;
}

export default function NewsCard({
  slug,
  titleHe,
  summaryHe,
  category,
  imageUrl,
  publishedAt,
  className,
}: NewsCardProps) {
  return (
    <Link
      href={`/news/${slug}`}
      className={cn(
        "group block overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:shadow-lg hover:border-secondary",
        className
      )}
    >
      {imageUrl && (
        <div className="h-[200px] overflow-hidden">
          <img
            src={imageUrl}
            alt={titleHe}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        {category && (
          <div className="text-xs font-semibold text-secondary uppercase mb-2">
            {category}
          </div>
        )}
        <h3 className="text-lg font-semibold text-primary mb-2 leading-snug group-hover:text-secondary transition-colors line-clamp-2">
          {titleHe}
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-3 line-clamp-3">
          {summaryHe}
        </p>
        <span className="text-xs text-outline">
          {formatHebrewDate(publishedAt)}
        </span>
      </div>
    </Link>
  );
}
