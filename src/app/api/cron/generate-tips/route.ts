import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { generateTips } from "@/lib/claude/translate";
import { Timestamp } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get existing tip titles to avoid duplicates
    const existingSnap = await getAdminDb()
      .collection(COLLECTIONS.TIPS)
      .select("titleHe")
      .get();

    const existingTitles = existingSnap.docs.map(
      (doc) => doc.data().titleHe as string
    );

    // Don't generate if we already have 20+
    if (existingTitles.length >= 20) {
      return NextResponse.json({
        success: true,
        newItems: 0,
        message: "Already have 20+ tips",
      });
    }

    const tips = await generateTips(existingTitles);
    const now = Timestamp.now();
    let newItems = 0;

    // Get next order number
    const lastTip = await getAdminDb()
      .collection(COLLECTIONS.TIPS)
      .orderBy("order", "desc")
      .limit(1)
      .get();
    let nextOrder = lastTip.empty ? 0 : (lastTip.docs[0].data().order || 0) + 1;

    for (const tip of tips) {
      await getAdminDb().collection(COLLECTIONS.TIPS).add({
        titleHe: tip.titleHe,
        contentHe: tip.contentHe,
        category: tip.category,
        difficulty: tip.difficulty,
        order: nextOrder++,
        createdAt: now,
        updatedAt: now,
        published: false, // Admin must review and publish
      });
      newItems++;
    }

    return NextResponse.json({ success: true, newItems });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
