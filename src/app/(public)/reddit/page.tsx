"use client";

import { useState } from "react";
import { useRedditPosts } from "@/hooks/useRedditPosts";
import RedditCard from "@/components/cards/RedditCard";

const SUBREDDITS = [
  { value: "all", label: "הכל" },
  { value: "ClaudeAI", label: "r/ClaudeAI" },
  { value: "Anthropic", label: "r/Anthropic" },
];

export default function RedditPage() {
  const [subreddit, setSubreddit] = useState("all");
  const { data: posts, isLoading } = useRedditPosts(
    subreddit === "all" ? undefined : subreddit
  );

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12 md:py-20">
      {/* Page Header */}
      <header className="mb-12 text-right">
        <h1 className="text-5xl md:text-[56px] font-extrabold headline-font tracking-tight text-primary mb-4">
          רדיט
        </h1>
        <p className="text-xl text-muted">
          פוסטים נבחרים מ-r/Anthropic ו-r/ClaudeAI
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-6 mb-10">
        <div className="bg-gray-100 p-1.5 rounded-full flex flex-row-reverse items-center">
          {SUBREDDITS.map((sub) => (
            <button
              key={sub.value}
              onClick={() => setSubreddit(sub.value)}
              className={`px-8 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                subreddit === sub.value
                  ? "bg-primary text-white"
                  : "text-muted hover:text-primary"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      {isLoading ? (
        <div className="space-y-6 max-w-4xl ml-auto">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl h-[180px] animate-pulse"
            />
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-6 max-w-4xl ml-auto">
          {posts.map((post) => (
            <RedditCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-muted mb-4 block">
            forum
          </span>
          <p className="text-muted text-xl">אין פוסטים להצגה</p>
        </div>
      )}
    </div>
  );
}
