"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquare, Share2 } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { useRedditPosts } from "@/hooks/useRedditPosts";
import { useTips } from "@/hooks/useTips";
import { useReleases } from "@/hooks/useReleases";
import { formatHebrewDate, timeAgo } from "@/lib/utils";

export default function HomePage() {
  const { data: news, isLoading: newsLoading } = useNews(undefined, 4);
  const { data: reddit, isLoading: redditLoading } = useRedditPosts(undefined, 3);
  const { data: tips } = useTips();
  const { data: releases } = useReleases(undefined, 1);

  const featured = news?.[0];
  const latestNews = news?.slice(1, 4);

  return (
    <main className="max-w-[1280px] mx-auto px-6">
      {/* Hero */}
      <section className="grid grid-cols-12 items-center gap-12 py-20">
        <div className="col-span-12 lg:col-span-8 flex flex-col items-start gap-6">
          <h1 className="text-7xl font-extrabold tracking-tighter leading-[1.1] headline-font text-primary">
            כל החדשות על{" "}
            <span className="text-accent">Claude</span> ו-Anthropic
            בעברית
          </h1>
          <p className="text-xl text-muted leading-relaxed max-w-2xl">
            המרכז הישראלי לחדשות, מדריכים ועדכונים על כלי ה-AI המתקדמים
            בעולם. כל מה שצריך לדעת על קלוד ואנתרופיק במקום אחד.
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              href="/news"
              className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all active:scale-95"
            >
              גלה עוד
            </Link>
            <button className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95">
              הירשם לניוזלטר
            </button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 relative flex justify-center items-center h-[400px]">
          <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-accent to-primary blur-3xl opacity-20" />
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-accent via-[#ff6b6b] to-primary shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
          </div>
          <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-accent animate-bounce" />
          <div className="absolute bottom-20 left-10 w-3 h-3 rounded-full bg-primary/40" />
          <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-accent/60" />
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="mb-20">
          <Link
            href={`/news/${featured.slug}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group block border border-slate-100"
          >
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-6 h-[400px] overflow-hidden relative">
                {featured.imageUrl ? (
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={featured.imageUrl}
                    alt={featured.titleHe}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100" />
                )}
                <div className="absolute top-6 right-6 bg-accent text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                  מומלץ
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold headline-font mb-4 text-slate-900 group-hover:text-accent transition-colors">
                  {featured.titleHe}
                </h2>
                <p className="text-muted text-lg mb-8 leading-relaxed">
                  {featured.summaryHe}
                </p>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                  <span>{featured.category || "חדשות"}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span>{formatHebrewDate(featured.publishedAt.toDate())}</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest News Grid */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-extrabold headline-font text-primary">
            חדשות אחרונות
          </h2>
          <Link
            href="/news"
            className="text-accent font-bold hover:underline flex items-center gap-1"
          >
            הצג הכל <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        {newsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-slate-100 rounded-xl mb-4" />
                <div className="h-3 bg-slate-100 rounded w-1/4 mb-3" />
                <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : latestNews?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="bg-white rounded-xl shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  {article.imageUrl ? (
                    <img
                      className="w-full h-full object-cover"
                      src={article.imageUrl}
                      alt={article.titleHe}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100" />
                  )}
                  <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {article.category || "חדשות"}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-muted text-xs mb-2">
                    {formatHebrewDate(article.publishedAt.toDate())}
                  </div>
                  <h3 className="text-xl font-bold headline-font mb-3 leading-snug text-primary group-hover:text-accent transition-colors">
                    {article.titleHe}
                  </h3>
                  <p className="text-muted text-sm line-clamp-2">
                    {article.summaryHe}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center py-12">
            עדיין אין חדשות. בצע שליפה מלוח הבקרה.
          </p>
        )}
      </section>

      {/* Reddit & Updates Split */}
      <section className="grid grid-cols-12 gap-12 mb-20">
        {/* Reddit */}
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-7 w-7 text-orange-500" />
            <h2 className="text-3xl font-extrabold headline-font text-primary">מרדיט</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            {redditLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse" />
              ))
            ) : reddit?.length ? (
              reddit.map((post) => (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl cursor-pointer border-r-4 ${
                    post.subreddit === "ClaudeAI" ? "border-accent" : "border-primary"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center bg-slate-100 rounded-lg p-2 min-w-[50px]">
                    <span className="font-bold text-sm">
                      {post.score >= 1000 ? `${(post.score / 1000).toFixed(1)}k` : post.score}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500">r/{post.subreddit}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-xs text-slate-400">
                        {timeAgo(new Date(post.createdUtc * 1000))}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 leading-snug line-clamp-2">
                      {post.titleHe}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-slate-400 text-xs">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {post.numComments} תגובות
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3.5 w-3.5" />
                        שתף
                      </span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-muted text-center py-8">אין פוסטים עדיין.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
          {/* Release Card */}
          <div className="bg-primary text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              {releases?.[0] ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold headline-font">
                      עדכון אחרון
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold headline-font mb-4">
                    {releases[0].titleHe}
                  </h3>
                  <p className="text-slate-300 mb-6 leading-relaxed line-clamp-3">
                    {releases[0].summaryHe}
                  </p>
                  <a
                    href={releases[0].sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-accent text-white py-3 rounded-xl font-bold text-center hover:brightness-110 transition-all"
                  >
                    קראו את ה-Changelog המלא
                  </a>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold headline-font mb-4">עדכונים</h3>
                  <p className="text-slate-300">שלפו עדכונים מלוח הבקרה.</p>
                </>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-accent to-pink-700 p-8 rounded-2xl shadow-xl text-white">
            <h3 className="text-2xl font-bold headline-font mb-2">
              אל תפספסו אף עדכון
            </h3>
            <p className="text-white/80 mb-6 text-sm">
              הצטרפו למנויים שמקבלים סיכום שבועי על עולם ה-AI הישר למייל.
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-white/20 border-white/30 rounded-xl px-4 py-3 text-white placeholder:text-white/60 focus:ring-white focus:border-white"
                placeholder="האימייל שלך"
                type="email"
              />
              <button className="bg-white text-accent px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
                הרשמה
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      {tips && tips.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-accent text-3xl">💡</span>
            <h2 className="text-3xl font-extrabold headline-font text-primary">
              טיפים ומדריכים
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.slice(0, 2).map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group flex flex-col md:flex-row h-full"
              >
                <div className="md:w-1/3 relative overflow-hidden min-h-[200px] bg-slate-100" />
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        tip.difficulty === "beginner"
                          ? "bg-emerald-50 text-emerald-700"
                          : tip.difficulty === "advanced"
                            ? "bg-primary/10 text-primary"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tip.difficulty === "beginner"
                            ? "bg-emerald-500"
                            : tip.difficulty === "advanced"
                              ? "bg-primary"
                              : "bg-amber-500"
                        }`}
                      />
                      {tip.difficulty === "beginner"
                        ? "מתחילים"
                        : tip.difficulty === "advanced"
                          ? "מתקדם"
                          : "בינוני"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold headline-font mb-3 text-primary">
                    {tip.titleHe}
                  </h3>
                  <p className="text-muted text-sm mb-4 leading-relaxed line-clamp-3">
                    {tip.contentHe}
                  </p>
                  <Link
                    href="/tips"
                    className="text-accent font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    קראו עוד <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
