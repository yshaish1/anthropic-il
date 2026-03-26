"use client";

import { useState } from "react";
import RedditCard from "@/components/cards/RedditCard";
import { useRedditPosts } from "@/hooks/useRedditPosts";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "all", label: "הכל" },
  { value: "ClaudeAI", label: "r/ClaudeAI" },
  { value: "anthropic", label: "r/anthropic" },
];

export default function RedditPage() {
  const [subreddit, setSubreddit] = useState("all");
  const { data: posts, isLoading } = useRedditPosts(subreddit);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <h1 className="mb-2">רדיט</h1>
      <p className="text-on-surface-variant mb-8">
        פוסטים נבחרים מ-r/ClaudeAI ו-r/anthropic
      </p>

      {/* Tab filters */}
      <div className="flex gap-1 mb-10 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSubreddit(tab.value)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              subreddit === tab.value
                ? "border-secondary text-secondary"
                : "border-transparent text-on-surface-variant hover:text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-border animate-pulse h-24"
            />
          ))}
        </div>
      ) : posts?.length ? (
        <div>
          {posts.map((post) => (
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
        <div className="text-center py-16">
          <p className="text-on-surface-variant">אין פוסטים עדיין.</p>
        </div>
      )}
    </div>
  );
}
