"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Newspaper, MessageSquare, Lightbulb, Bell } from "lucide-react";
import NewsCard from "@/components/cards/NewsCard";
import RedditCard from "@/components/cards/RedditCard";
import TipCard from "@/components/cards/TipCard";
import ReleaseCard from "@/components/cards/ReleaseCard";
import { useNews } from "@/hooks/useNews";
import { useRedditPosts } from "@/hooks/useRedditPosts";
import { useTips } from "@/hooks/useTips";
import { useReleases } from "@/hooks/useReleases";

function SectionHeader({
  icon: Icon,
  title,
  href,
}: {
  icon: React.ElementType;
  title: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-coral" />
        <h2 className="text-xl font-bold text-primary">{title}</h2>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary-container transition-colors"
      >
        הצג הכל
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}

function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl bg-surface-container-low animate-pulse h-64"
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: news, isLoading: newsLoading } = useNews(undefined, 3);
  const { data: reddit, isLoading: redditLoading } = useRedditPosts(
    undefined,
    5
  );
  const { data: tips, isLoading: tipsLoading } = useTips();
  const { data: releases, isLoading: releasesLoading } = useReleases(
    undefined,
    1
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary-container py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-surface/10 backdrop-blur">
              <Sparkles className="h-10 w-10 text-coral" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-on-primary mb-4">
            כל החדשות על Claude ו-Anthropic
            <br />
            <span className="text-coral">בעברית</span>
          </h1>
          <p className="text-lg text-on-primary/70 max-w-2xl mx-auto">
            אגרגטור חדשות אוטומטי שמביא לך את כל העדכונים, הפוסטים המעניינים
            מרדיט, טיפים לשימוש ב-Claude ועדכוני מודלים - הכל מתורגם לעברית.
          </p>
        </div>
      </section>

      {/* Latest News */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <SectionHeader icon={Newspaper} title="חדשות אחרונות" href="/news" />
        {newsLoading ? (
          <LoadingSkeleton count={3} />
        ) : news?.length ? (
          <div className="grid gap-5 md:grid-cols-3">
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
          <p className="text-on-surface-variant text-center py-8">
            עדיין אין חדשות. בצע שליפה ראשונה מלוח הבקרה.
          </p>
        )}
      </section>

      {/* Reddit */}
      <section className="bg-surface-container-low">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <SectionHeader
            icon={MessageSquare}
            title="מרדיט"
            href="/reddit"
          />
          {redditLoading ? (
            <LoadingSkeleton count={3} />
          ) : reddit?.length ? (
            <div className="space-y-3">
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
            <p className="text-on-surface-variant text-center py-8">
              עדיין אין פוסטים מרדיט.
            </p>
          )}
        </div>
      </section>

      {/* Tips */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <SectionHeader icon={Lightbulb} title="טיפים" href="/tips" />
        {tipsLoading ? (
          <LoadingSkeleton count={2} />
        ) : tips?.length ? (
          <div className="grid gap-5 md:grid-cols-2">
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
          <p className="text-on-surface-variant text-center py-8">
            עדיין אין טיפים.
          </p>
        )}
      </section>

      {/* Latest Release */}
      {releases?.[0] && (
        <section className="bg-surface-container-low">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
            <SectionHeader
              icon={Bell}
              title="עדכון אחרון"
              href="/releases"
            />
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
