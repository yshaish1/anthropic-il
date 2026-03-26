"use client";

import type { RedditPost } from "@/types";
import { timeAgo } from "@/lib/utils";

export default function RedditCard({ post }: { post: RedditPost }) {
  const date = new Date(post.createdUtc * 1000);
  const isClaudeAI = post.subreddit === "ClaudeAI";

  return (
    <article
      className={`bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border-r-4 ${
        isClaudeAI ? "border-accent" : "border-primary"
      } flex flex-row-reverse p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      {/* Vote Count */}
      <div className="flex flex-col items-center ml-6 min-w-[48px]">
        <span className="material-symbols-outlined text-muted">
          arrow_upward
        </span>
        <span className="font-bold text-lg text-primary my-1">
          {post.score >= 1000
            ? `${(post.score / 1000).toFixed(1)}k`
            : post.score}
        </span>
        <span className="material-symbols-outlined text-muted">
          arrow_downward
        </span>
      </div>

      {/* Content */}
      <div className="flex-grow text-right">
        <div className="flex flex-row-reverse items-center gap-3 mb-3">
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
              isClaudeAI
                ? "bg-accent/10 text-accent"
                : "bg-primary/10 text-primary"
            }`}
          >
            r/{post.subreddit}
          </span>
          <span className="text-muted text-xs">
            {timeAgo(date)} &bull; פורסם ע&quot;י u/{post.author}
          </span>
        </div>
        <h2 className="text-xl font-bold headline-font text-primary mb-2">
          {post.titleHe}
        </h2>
        <p className="text-muted text-sm line-clamp-2 mb-4">
          {post.summaryHe}
        </p>
        <div className="flex flex-row-reverse justify-between items-center">
          <div className="flex flex-row-reverse items-center gap-4 text-muted text-xs">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">
                chat_bubble
              </span>
              <span>{post.numComments} תגובות</span>
            </div>
          </div>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-accent font-bold text-sm hover:underline"
          >
            <span>פתח ברדיט</span>
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
