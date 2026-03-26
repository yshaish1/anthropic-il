import Link from "next/link";
import { Calendar } from "lucide-react";
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

const categoryColors: Record<string, string> = {
  Product: "bg-secondary-fixed text-secondary",
  Research: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Policy: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Company: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

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
        "group block rounded-xl bg-surface-container-low hover:bg-surface-highest transition-all duration-200",
        className
      )}
    >
      {imageUrl && (
        <div className="aspect-[16/9] overflow-hidden rounded-t-xl">
          <img
            src={imageUrl}
            alt={titleHe}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <span
              className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-full",
                categoryColors[category] ||
                  "bg-surface-container-high text-on-surface-variant"
              )}
            >
              {category}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-on-surface-variant">
            <Calendar className="h-3 w-3" />
            {formatHebrewDate(publishedAt)}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2">
          {titleHe}
        </h3>
        <p className="text-sm text-on-surface-variant line-clamp-3">
          {summaryHe}
        </p>
      </div>
    </Link>
  );
}
