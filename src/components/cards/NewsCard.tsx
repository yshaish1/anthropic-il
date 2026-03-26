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
      className={cn("group block overflow-hidden transition-all duration-300", className)}
      style={{
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        border: "1px solid #e4e2de",
      }}
    >
      {imageUrl && (
        <div style={{ height: "200px", overflow: "hidden" }}>
          <img
            src={imageUrl}
            alt={titleHe}
            className="group-hover:scale-105 transition-transform duration-300"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      <div style={{ padding: "20px" }}>
        {category && (
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#ab2c5d",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            {category}
          </div>
        )}
        <h3
          className="group-hover:!text-[#ab2c5d] transition-colors"
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#030612",
            marginBottom: "8px",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: "var(--font-be-vietnam-pro, 'Be Vietnam Pro', var(--font-rubik, 'Rubik', sans-serif))",
          }}
        >
          {titleHe}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#45464c",
            lineHeight: 1.6,
            marginBottom: "12px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {summaryHe}
        </p>
        <span style={{ fontSize: "12px", color: "#76777c" }}>
          {formatHebrewDate(publishedAt)}
        </span>
      </div>
    </Link>
  );
}
