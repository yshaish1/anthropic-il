"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewsCard from "@/components/cards/NewsCard";
import RedditCard from "@/components/cards/RedditCard";
import TipCard from "@/components/cards/TipCard";
import ReleaseCard from "@/components/cards/ReleaseCard";
import { useNews } from "@/hooks/useNews";
import { useRedditPosts } from "@/hooks/useRedditPosts";
import { useTips } from "@/hooks/useTips";
import { useReleases } from "@/hooks/useReleases";

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: "32px" }}>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#030612",
          fontFamily: "var(--font-be-vietnam-pro, 'Be Vietnam Pro', var(--font-rubik, 'Rubik', sans-serif))",
        }}
      >
        {title}
      </h2>
      <Link
        href={href}
        className="flex items-center gap-1 transition-colors hover:!text-[#ab2c5d]"
        style={{ fontSize: "14px", fontWeight: 500, color: "#45464c" }}
      >
        הצג הכל
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}

function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(count, 3)}, 1fr)`, gap: "24px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            borderRadius: "8px",
            backgroundColor: "#f5f3ef",
            border: "1px solid #e4e2de",
            height: "280px",
          }}
          className="animate-pulse"
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: news, isLoading: newsLoading } = useNews(undefined, 3);
  const { data: reddit, isLoading: redditLoading } = useRedditPosts(undefined, 5);
  const { data: tips, isLoading: tipsLoading } = useTips();
  const { data: releases } = useReleases(undefined, 1);

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "48px 0 64px" }}>
        <div className="mx-auto max-w-[1200px] px-4">
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 700,
              color: "#030612",
              lineHeight: 1.1,
              marginBottom: "32px",
              fontFamily: "var(--font-be-vietnam-pro, 'Be Vietnam Pro', var(--font-rubik, 'Rubik', sans-serif))",
            }}
          >
            כל החדשות על{" "}
            <span style={{ color: "#ab2c5d" }}>Claude</span> ו-
            <br />
            Anthropic
            <br />
            בעברית
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#45464c",
              lineHeight: 1.7,
              maxWidth: "540px",
            }}
          >
            המרכז הישראלי לעדכונים, מדריכים ותובנות על הבינה המלאכותית המתקדמת
            בעולם. אנחנו אוצרים ומתרגמים עבורכם את המידע החשוב ביותר הישר
            מהמקור.
          </p>
        </div>
      </section>

      {/* Latest News */}
      <section style={{ paddingBottom: "48px" }}>
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionHeader title="חדשות אחרונות" href="/news" />
          {newsLoading ? (
            <LoadingSkeleton count={3} />
          ) : news?.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {news.map((article) => (
                <NewsCard
                  key={article.id}
                  slug={article.slug}
                  titleHe={article.titleHe}
                  summaryHe={article.summaryHe}
                  category={article.category}
                  imageUrl={article.imageUrl}
                  publishedAt={article.publishedAt.toDate()}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: "#45464c", textAlign: "center", padding: "32px 0" }}>
              עדיין אין חדשות. בצע שליפה ראשונה מלוח הבקרה.
            </p>
          )}
        </div>
      </section>

      {/* Reddit */}
      <section style={{ borderTop: "1px solid #e4e2de", padding: "48px 0" }}>
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionHeader title="פוסטים מרדיט" href="/reddit" />
          {redditLoading ? (
            <LoadingSkeleton count={3} />
          ) : reddit?.length ? (
            <div>
              {reddit.map((post) => (
                <RedditCard
                  key={post.id}
                  titleHe={post.titleHe}
                  summaryHe={post.summaryHe}
                  subreddit={post.subreddit}
                  score={post.score}
                  numComments={post.numComments}
                  author={post.author}
                  createdUtc={post.createdUtc}
                  url={post.url}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: "#45464c", textAlign: "center", padding: "32px 0" }}>
              עדיין אין פוסטים מרדיט.
            </p>
          )}
        </div>
      </section>

      {/* Tips */}
      <section style={{ borderTop: "1px solid #e4e2de", padding: "48px 0" }}>
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionHeader title="טיפים וטריקים" href="/tips" />
          {tipsLoading ? (
            <LoadingSkeleton count={2} />
          ) : tips?.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
              {tips.slice(0, 2).map((tip) => (
                <TipCard
                  key={tip.id}
                  titleHe={tip.titleHe}
                  contentHe={tip.contentHe}
                  category={tip.category}
                  difficulty={tip.difficulty}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: "#45464c", textAlign: "center", padding: "32px 0" }}>
              עדיין אין טיפים.
            </p>
          )}
        </div>
      </section>

      {/* Latest Release */}
      {releases?.[0] && (
        <section style={{ borderTop: "1px solid #e4e2de", padding: "48px 0" }}>
          <div className="mx-auto max-w-[1200px] px-4">
            <SectionHeader title="עדכון אחרון" href="/releases" />
            <ReleaseCard
              titleHe={releases[0].titleHe}
              summaryHe={releases[0].summaryHe}
              type={releases[0].type}
              version={releases[0].version}
              publishedAt={releases[0].publishedAt.toDate()}
              sourceUrl={releases[0].sourceUrl}
            />
          </div>
        </section>
      )}
    </div>
  );
}
