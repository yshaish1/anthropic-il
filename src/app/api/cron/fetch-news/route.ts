import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  fetchArticleList,
  fetchArticleContent,
} from "@/lib/scraper/anthropic-news";
import { translateArticle } from "@/lib/claude/translate";
import { Timestamp } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Timestamp.now();
  const errors: string[] = [];
  let newItems = 0;

  try {
    const articleList = await fetchArticleList();

    // Check which articles already exist in Firestore
    const existingSlugs = new Set<string>();
    const snapshot = await getAdminDb()
      .collection(COLLECTIONS.ARTICLES)
      .select("slug")
      .get();
    snapshot.forEach((doc) => existingSlugs.add(doc.data().slug));

    const newArticles = articleList.filter(
      (a) => !existingSlugs.has(a.slug)
    );

    // Process up to 5 new articles per run to stay within timeout
    for (const article of newArticles.slice(0, 5)) {
      try {
        const content = await fetchArticleContent(article.slug);

        if (!content.body || content.body.length < 50) {
          errors.push(`Article ${article.slug}: body too short, skipping`);
          continue;
        }

        const translation = await translateArticle(
          content.title,
          content.body
        );

        const now = Timestamp.now();
        await getAdminDb()
          .collection(COLLECTIONS.ARTICLES)
          .doc(article.slug)
          .set({
            slug: article.slug,
            originalUrl: `https://www.anthropic.com/news/${article.slug}`,
            titleEn: content.title,
            titleHe: translation.titleHe,
            summaryHe: translation.summaryHe,
            bodyHe: translation.bodyHe,
            bodyEn: content.body,
            category: content.category || article.category || "General",
            imageUrl: content.imageUrl || article.imageUrl,
            publishedAt: content.date
              ? Timestamp.fromDate(new Date(content.date))
              : now,
            fetchedAt: now,
            translatedAt: now,
          });

        newItems++;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unknown error";
        errors.push(`Article ${article.slug}: ${msg}`);
      }
    }

    // Log the fetch
    await getAdminDb().collection(COLLECTIONS.FETCH_LOGS).add({
      type: "news",
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
      total: articleList.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    errors.push(msg);

    await getAdminDb().collection(COLLECTIONS.FETCH_LOGS).add({
      type: "news",
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
