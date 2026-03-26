import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";

export const dynamic = "force-dynamic";

async function verifyAdmin(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split("Bearer ")[1];
    const decoded = await getAdminAuth().verifyIdToken(token);
    const adminDoc = await getAdminDb()
      .collection(COLLECTIONS.ADMINS)
      .doc(decoded.uid)
      .get();

    return adminDoc.exists ? decoded.uid : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const adminUid = await verifyAdmin(request);
  if (!adminUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await request.json();
  if (!["news", "reddit", "releases"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid fetch type" },
      { status: 400 }
    );
  }

  // Build the cron URL to call internally
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const cronPath =
    type === "news"
      ? "/api/cron/fetch-news"
      : type === "reddit"
        ? "/api/cron/fetch-reddit"
        : "/api/cron/fetch-news"; // releases reuses news for now

  try {
    const res = await fetch(`${baseUrl}${cronPath}`, {
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
