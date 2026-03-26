"use client";

import { useState } from "react";
import { ArrowUp, MessageSquare, ExternalLink } from "lucide-react";
import { useRedditPosts } from "@/hooks/useRedditPosts";
import { cn, timeAgo } from "@/lib/utils";

const tabs = [
  { value: "all", label: "הכל" },
  { value: "ClaudeAI", label: "r/ClaudeAI" },
  { value: "anthropic", label: "r/anthropic" },
];

const sortOptions = [
  { value: "popular", label: "פופולרי" },
  { value: "new", label: "חדש" },
];

const subredditColors: Record<string, string> = {
  ClaudeAI: "border-accent",
  anthropic: "border-primary/30",
};

export default function RedditPage() {
  const [subreddit, setSubreddit] = useState("all");
  const [sort, setSort] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(10);
  const { data: posts, isLoading } = useRedditPosts(subreddit);

  const sortedPosts = posts
    ? [...posts].sort((a, b) =>
        sort === "new" ? b.createdUtc - a.createdUtc : b.score - a.score
      )
    : [];

  const visiblePosts = sortedPosts.slice(0, visibleCount);

  return (
    <main className="pt-16 pb-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="headline-font text-5xl md:text-6xl font-black text-primary mb-3">
            רדיט
          </h1>
          <p className="text-lg text-muted">
            פוסטים נבחרים מ-r/ClaudeAI ו-r/anthropic
          </p>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          {/* Tab pills */}
          <div className="flex bg-slate-100 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSubreddit(tab.value)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all",
                  subreddit === tab.value
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex bg-card rounded-xl p-1 border border-slate-200 ms-auto">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  sort === opt.value
                    ? "bg-slate-100 text-primary"
                    : "text-muted hover:text-primary"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-xl border border-slate-100 animate-pulse h-36"
              />
            ))}
          </div>
        ) : visiblePosts.length ? (
          <>
            <div className="space-y-4">
              {visiblePosts.map((post) => (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex gap-5 bg-card p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 border border-slate-100 border-r-4 transition-all duration-300",
                    subredditColors[post.subreddit] || "border-r-accent"
                  )}
                >
                  {/* Score */}
                  <div className="flex flex-col items-center min-w-[48px] gap-1">
                    <ArrowUp className="h-4 w-4 text-accent" />
                    <span className="text-lg font-bold text-primary">
                      {post.score}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Subreddit badge */}
                    <span className="inline-block bg-accent text-white rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wide mb-2">
                      r/{post.subreddit}
                    </span>

                    <h3 className="text-xl font-bold text-primary mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {post.titleHe}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
                      {post.summaryHe}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-4 text-sm text-muted">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {post.numComments} תגובות
                      </span>
                      <span>{timeAgo(new Date(post.createdUtc * 1000))}</span>
                      <span className="flex items-center gap-1.5 ms-auto text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-3.5 w-3.5" />
                        פתח ברדיט
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Load more */}
            {visibleCount < sortedPosts.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + 10)}
                  className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/80 transition-colors"
                >
                  טען עוד פוסטים
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted text-lg">
              אין פוסטים עדיין.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
