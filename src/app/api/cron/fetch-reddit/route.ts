import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { fetchMultipleSubreddits } from "@/lib/scraper/reddit";
import { translateRedditPost } from "@/lib/claude/translate";
import { Timestamp } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUBREDDITS = ["ClaudeAI", "anthropic"];
const MIN_SCORE = 10;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Timestamp.now();
  const errors: string[] = [];
  let newItems = 0;

  try {
    const posts = await fetchMultipleSubreddits(
      SUBREDDITS,
      25,
      MIN_SCORE
    );

    // Check existing posts
    const existingIds = new Set<string>();
    const snapshot = await getAdminDb()
      .collection(COLLECTIONS.REDDIT_POSTS)
      .select()
      .get();
    snapshot.forEach((doc) => existingIds.add(doc.id));

    const newPosts = posts.filter((p) => !existingIds.has(p.id));

    // Process up to 10 new posts per run
    for (const post of newPosts.slice(0, 10)) {
      try {
        const translation = await translateRedditPost(
          post.title,
          post.selftext
        );

        await getAdminDb()
          .collection(COLLECTIONS.REDDIT_POSTS)
          .doc(post.id)
          .set({
            subreddit: post.subreddit,
            titleEn: post.title,
            titleHe: translation.titleHe,
            summaryHe: translation.summaryHe,
            selfTextEn: post.selftext,
            url: post.permalink,
            externalUrl: post.isLink ? post.url : null,
            score: post.score,
            numComments: post.numComments,
            author: post.author,
            createdUtc: post.createdUtc,
            fetchedAt: Timestamp.now(),
            curated: post.score >= 50, // auto-approve high-score posts
            pinned: false,
          });

        newItems++;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unknown error";
        errors.push(`Reddit ${post.id}: ${msg}`);
      }
    }

    await getAdminDb().collection(COLLECTIONS.FETCH_LOGS).add({
      type: "reddit",
      trigger: "cron",
      triggeredBy: null,
      startedAt,
      completedAt: Timestamp.now(),
      newItems,
      errors,
      status:
        errors.length === 0
          ? "success"
          : newItems > 0
            ? "partial"
            : "failed",
    });

    return NextResponse.json({
      success: true,
      newItems,
      errors: errors.length,
      total: posts.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    errors.push(msg);

    await getAdminDb().collection(COLLECTIONS.FETCH_LOGS).add({
      type: "reddit",
      trigger: "cron",
      triggeredBy: null,
      startedAt,
      completedAt: Timestamp.now(),
      newItems: 0,
      errors,
      status: "failed",
    });

    return NextResponse.json(
      { error: msg, newItems: 0 },
      { status: 500 }
    );
  }
}
