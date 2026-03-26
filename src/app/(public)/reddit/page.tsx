"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-2">
        <MessageSquare className="h-7 w-7 text-coral" />
        <h1 className="text-3xl font-bold text-primary">רדיט</h1>
      </div>
      <p className="text-on-surface-variant mb-8">
        פוסטים נבחרים מ-r/ClaudeAI ו-r/anthropic
      </p>

      {/* Tab filters */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSubreddit(tab.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              subreddit === tab.value
                ? "bg-secondary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-surface-container-low animate-pulse h-32"
            />
          ))}
        </div>
      ) : posts?.length ? (
        <div className="space-y-3">
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
          <MessageSquare className="h-12 w-12 text-on-surface-variant/30 mx-auto mb-4" />
          <p className="text-on-surface-variant">אין פוסטים עדיין.</p>
        </div>
      )}
    </div>
  );
}
