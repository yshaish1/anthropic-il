"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquare, Check } from "lucide-react";
import NewsCard from "@/components/cards/NewsCard";
import RedditCard from "@/components/cards/RedditCard";
import TipCard from "@/components/cards/TipCard";
import { useNews } from "@/hooks/useNews";
import { useRedditPosts } from "@/hooks/useRedditPosts";
import { useTips } from "@/hooks/useTips";
import { useReleases } from "@/hooks/useReleases";

function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[16/10] bg-surface-container-low rounded-xl mb-6" />
          <div className="h-4 bg-surface-container-low rounded w-1/3 mb-4" />
          <div className="h-6 bg-surface-container-low rounded w-3/4 mb-3" />
          <div className="h-4 bg-surface-container-low rounded w-full" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: news, isLoading: newsLoading } = useNews(undefined, 3);
  const { data: reddit, isLoading: redditLoading } = useRedditPosts(undefined, 3);
  const { data: tips } = useTips();
  const { data: releases } = useReleases(undefined, 1);

  return (
    <main className="pt-24 pb-32">
      {/* Hero Section */}
      <section className="px-6 mb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="font-black text-6xl md:text-8xl text-primary tracking-tighter mb-6 leading-[0.9] text-right">
              כל החדשות על <span className="text-secondary">Claude</span> ו-Anthropic בעברית
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed text-right">
              המרכז הישראלי לעדכונים, מדריכים ותובנות על הבינה המלאכותית המתקדמת בעולם. אנחנו אוצרים ומתרגמים עבורכם את המידע החשוב ביותר הישר מהמקור.
            </p>
          </div>
          <div className="hidden lg:block lg:col-span-4 relative">
            <div className="aspect-square bg-surface-container-high rounded-full overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKjXIkRKyMnkGprG2cx_H4wQ7BnknAi9EaxxVTYIib5zmQF4_bdVzGTbXVsjJDUF3Prl1cvPi63kvEN-LQvXjQwzLrm7I2wqZcFo4vuY_Eq4EBj59S_j4uNLf5y156ZdareZFr9fOWsx2try-321PtJo49Iwy3EfIgFWtfBbZ2VxIpSTkm2e86c6-xqX9vbPWy7CzhQNvrv6up8Mu0jAERLiKdOgzmSXRpUJFiUS2n-0lHcFFLfnuU6YzcW6KeQAir-fgMML5yDFUO"
                alt="AI neural network visualization"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="px-6 mb-24 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 border-b border-outline-variant/15 pb-4">
          <h2 className="font-bold text-4xl text-primary">חדשות אחרונות</h2>
          <Link
            href="/news"
            className="text-secondary font-bold flex items-center gap-2 hover:-translate-x-1 transition-transform"
          >
            <span>הצג הכל</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        {newsLoading ? (
          <LoadingSkeleton count={3} />
        ) : news?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {news.map((article) => (
              <article key={article.id} className="group">
                <div className="aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden mb-6">
                  {article.imageUrl ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={article.imageUrl}
                      alt={article.titleHe}
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container" />
                  )}
                </div>
                <div className="flex gap-3 mb-4">
                  <span className="bg-secondary-fixed text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    {article.category || "חדשות"}
                  </span>
                </div>
                <Link href={`/news/${article.slug}`}>
                  <h3 className="font-bold text-2xl mb-3 leading-tight text-primary group-hover:text-secondary transition-colors">
                    {article.titleHe}
                  </h3>
                </Link>
                <p className="text-on-surface-variant leading-relaxed">
                  {article.summaryHe}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant text-center py-12">
            עדיין אין חדשות. בצע שליפה ראשונה מלוח הבקרה.
          </p>
        )}
      </section>

      {/* Reddit & Updates Split Layout */}
      <section className="px-6 mb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          {/* Reddit Section */}
          <div className="col-span-12 lg:col-span-7 bg-surface-container-low rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-3xl text-primary">מרדיט</h2>
              <Link href="/reddit" className="text-secondary font-bold text-sm">
                הצג הכל
              </Link>
            </div>
            <div className="space-y-4">
              {redditLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card p-5 rounded-2xl animate-pulse h-24" />
                ))
              ) : reddit?.length ? (
                reddit.map((post, i) => (
                  <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-card p-5 rounded-2xl flex items-start gap-5 hover:-translate-x-2 transition-transform"
                    style={{ opacity: 1 - i * 0.1 }}
                  >
                    <div className="flex flex-col items-center justify-center min-w-[48px] bg-surface-container p-2 rounded-lg">
                      <span className="font-bold text-sm">{post.score >= 1000 ? `${(post.score / 1000).toFixed(1)}k` : post.score}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-secondary font-bold">r/{post.subreddit}</span>
                        <span className="text-[10px] text-on-surface-variant/40">
                          {new Date(post.createdUtc * 1000).toLocaleDateString("he-IL")}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg leading-tight mb-2">{post.titleHe}</h4>
                      <div className="flex items-center gap-4 text-on-surface-variant/60 text-xs">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post.numComments} תגובות
                        </span>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-on-surface-variant text-center py-8">עדיין אין פוסטים.</p>
              )}
            </div>
          </div>

          {/* Update & Newsletter */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
            {/* Latest Update Card */}
            <div className="bg-primary text-on-primary rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-secondary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <span className="text-xs text-secondary-fixed font-bold block mb-4">עדכון אחרון</span>
                {releases?.[0] ? (
                  <>
                    <h2 className="font-black text-4xl mb-6">{releases[0].titleHe}</h2>
                    <p className="text-lg text-on-primary/80 mb-8">{releases[0].summaryHe}</p>
                    <a
                      href={releases[0].sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-secondary py-4 rounded-xl font-bold text-lg text-center hover:bg-secondary-container transition-colors"
                    >
                      קרא את ההכרזה המלאה
                    </a>
                  </>
                ) : (
                  <h2 className="font-black text-4xl mb-6">אין עדכונים עדיין</h2>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-secondary-fixed p-8 rounded-3xl">
              <h3 className="font-bold text-2xl mb-2 text-primary">הצטרפו לניוזלטר</h3>
              <p className="mb-6 text-on-surface-variant">
                קבלו את כל העדכונים ישירות למייל פעם בשבוע.
              </p>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border-none bg-card focus:ring-2 focus:ring-secondary text-right px-4 py-3"
                  placeholder="האימייל שלך..."
                  type="email"
                />
                <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold">
                  הרשמה
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="px-6 mb-24 max-w-7xl mx-auto">
        <h2 className="font-bold text-4xl text-primary mb-12 border-b border-outline-variant/15 pb-4">
          טיפים ומדריכים
        </h2>
        {tips?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.slice(0, 2).map((tip) => (
              <div
                key={tip.id}
                className="bg-card border border-outline-variant/15 p-1 rounded-3xl flex flex-col md:flex-row gap-6 hover:shadow-2xl hover:shadow-secondary/5 transition-all"
              >
                <div className="md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-surface-container" />
                <div className="md:w-2/3 p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block ${tip.difficulty === "beginner"
                      ? "bg-green-100 text-green-800"
                      : tip.difficulty === "advanced"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {tip.difficulty === "beginner" ? "מתחילים" : tip.difficulty === "advanced" ? "מתקדמים" : "בינוניים"}
                  </span>
                  <h3 className="font-bold text-2xl mb-3 text-primary">{tip.titleHe}</h3>
                  <p className="text-on-surface-variant mb-6 line-clamp-2">{tip.contentHe}</p>
                  <Link href="/tips" className="text-secondary font-bold underline decoration-2 underline-offset-4">
                    קראו עוד
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant text-center py-12">עדיין אין טיפים.</p>
        )}
      </section>
    </main>
  );
}
