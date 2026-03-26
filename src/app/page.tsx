"use client";

import Link from "next/link";
import { useNews } from "@/hooks/useNews";
import { useRedditPosts } from "@/hooks/useRedditPosts";
import { useTips } from "@/hooks/useTips";
import { useReleases } from "@/hooks/useReleases";
import NewsCard from "@/components/cards/NewsCard";
import RedditCard from "@/components/cards/RedditCard";
import TipCard from "@/components/cards/TipCard";
import ReleaseCard from "@/components/cards/ReleaseCard";

export default function HomePage() {
  const { data: news, isLoading: newsLoading } = useNews(undefined, 4);
  const { data: redditPosts, isLoading: redditLoading } = useRedditPosts(
    undefined,
    3
  );
  const { data: tips, isLoading: tipsLoading } = useTips();
  const { data: releases, isLoading: releasesLoading } = useReleases(
    undefined,
    3
  );

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12 md:py-20">
      {/* Hero Header */}
      <header className="mb-16 text-right">
        <h1 className="text-[56px] font-extrabold headline-font tracking-tight text-primary leading-tight mb-4">
          אנתרופיק IL
        </h1>
        <div className="h-[3px] w-[48px] bg-accent mt-2 mb-4" />
        <p className="text-xl text-muted max-w-2xl">
          כל החדשות, העדכונים, הטיפים ודיוני הקהילה מ-Anthropic ו-Claude
          בתרגום לעברית
        </p>
      </header>

      {/* Latest News */}
      <section className="mb-20">
        <div className="flex flex-row-reverse justify-between items-center mb-8">
          <h2 className="text-3xl font-bold headline-font text-primary">
            חדשות אחרונות
          </h2>
          <Link
            href="/news"
            className="text-accent font-bold hover:underline flex items-center gap-1"
          >
            <span>כל החדשות</span>
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
          </Link>
        </div>
        {newsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-[400px] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news?.slice(0, 4).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Tips Section */}
      <section className="mb-20">
        <div className="flex flex-row-reverse justify-between items-center mb-8">
          <h2 className="text-3xl font-bold headline-font text-primary">
            טיפים וטריקים
          </h2>
          <Link
            href="/tips"
            className="text-accent font-bold hover:underline flex items-center gap-1"
          >
            <span>כל הטיפים</span>
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
          </Link>
        </div>
        {tipsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-[280px] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips?.slice(0, 4).map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}
      </section>

      {/* Reddit Section */}
      <section className="mb-20">
        <div className="flex flex-row-reverse justify-between items-center mb-8">
          <h2 className="text-3xl font-bold headline-font text-primary">
            מהקהילה
          </h2>
          <Link
            href="/reddit"
            className="text-accent font-bold hover:underline flex items-center gap-1"
          >
            <span>כל הפוסטים</span>
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
          </Link>
        </div>
        {redditLoading ? (
          <div className="space-y-6 max-w-4xl ml-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl h-[180px] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl ml-auto">
            {redditPosts?.slice(0, 3).map((post) => (
              <RedditCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Releases Section */}
      <section className="mb-20">
        <div className="flex flex-row-reverse justify-between items-center mb-8">
          <h2 className="text-3xl font-bold headline-font text-primary">
            עדכונים ושחרורים
          </h2>
          <Link
            href="/releases"
            className="text-accent font-bold hover:underline flex items-center gap-1"
          >
            <span>כל העדכונים</span>
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
          </Link>
        </div>
        {releasesLoading ? (
          <div className="space-y-12 relative">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl h-[200px] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute right-6 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-12">
              {releases?.slice(0, 3).map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
