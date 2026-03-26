import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  fetchArticleList,
  fetchArticleContent,
} from "@/lib/scraper/anthropic-news";
import { classifyArticle, translateArticle } from "@/lib/claude/translate";
import { Timestamp } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Timestamp.now();
  const errors: string[] = [];
  let newItems = 0;

  try {
    const articleList = await fetchArticleList();

    // Check which slugs already exist in releases
    const existingReleaseSlugs = new Set<string>();
    const releaseSnap = await getAdminDb()
      .collection(COLLECTIONS.RELEASES)
      .select()
      .get();
    releaseSnap.forEach((doc) => existingReleaseSlugs.add(doc.id));

    // Also check articles to avoid re-processing already-classified items
    const existingArticleSlugs = new Set<string>();
    const articleSnap = await getAdminDb()
      .collection(COLLECTIONS.ARTICLES)
      .select("slug")
      .get();
    articleSnap.forEach((doc) => existingArticleSlugs.add(doc.data().slug));

    // Only process slugs not yet in releases collection
    const unchecked = articleList.filter(
      (a) => !existingReleaseSlugs.has(a.slug)
    );

    // Process up to 3 per run
    for (const article of unchecked.slice(0, 3)) {
      try {
        const content = await fetchArticleContent(article.slug);

        if (!content.body || content.body.length < 50) {
          errors.push(`${article.slug}: body too short`);
          continue;
        }

        // Classify with Claude
        const classification = await classifyArticle(
          content.title,
          content.body
        );

        if (!classification.isRelease) {
          // Not a release — store a marker so we don't re-check
          await getAdminDb()
            .collection(COLLECTIONS.RELEASES)
            .doc(article.slug)
            .set({ _notRelease: true, checkedAt: Timestamp.now() });
          continue;
        }

        // It's a release — translate and store
        const translation = await translateArticle(
          content.title,
          content.body
        );

        const now = Timestamp.now();
        await getAdminDb()
          .collection(COLLECTIONS.RELEASES)
          .doc(article.slug)
          .set({
            titleEn: content.title,
            titleHe: translation.titleHe,
            summaryHe: translation.summaryHe,
            bodyHe: translation.bodyHe,
            type: classification.type,
            version: classification.version,
            sourceUrl: `https://www.anthropic.com/news/${article.slug}`,
            publishedAt: content.date
              ? Timestamp.fromDate(new Date(content.date))
              : now,
            fetchedAt: now,
          });

        newItems++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${article.slug}: ${msg}`);
      }
    }

    await getAdminDb().collection(COLLECTIONS.FETCH_LOGS).add({
      type: "releases",
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
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    errors.push(msg);

    await getAdminDb().collection(COLLECTIONS.FETCH_LOGS).add({
      type: "releases",
      trigger: "cron",
      triggeredBy: null,
      startedAt,
      completedAt: Timestamp.now(),
      newItems: 0,
      errors,
      status: "failed",
    });

    return NextResponse.json({ error: msg, newItems: 0 }, { status: 500 });
  }
}
