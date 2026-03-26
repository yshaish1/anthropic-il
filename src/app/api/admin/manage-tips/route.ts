import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { Timestamp } from "firebase-admin/firestore";

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

export async function GET(request: NextRequest) {
  const adminUid = await verifyAdmin(request);
  if (!adminUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getAdminDb()
    .collection(COLLECTIONS.TIPS)
    .orderBy("order")
    .get();

  const tips = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(tips);
}

export async function POST(request: NextRequest) {
  const adminUid = await verifyAdmin(request);
  if (!adminUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const now = Timestamp.now();

  const docRef = await getAdminDb().collection(COLLECTIONS.TIPS).add({
    titleHe: body.titleHe,
    contentHe: body.contentHe,
    category: body.category || "general",
    difficulty: body.difficulty || "beginner",
    order: body.order || 0,
    createdAt: now,
    updatedAt: now,
    published: body.published ?? false,
  });

  return NextResponse.json({ id: docRef.id, success: true });
}

export async function PUT(request: NextRequest) {
  const adminUid = await verifyAdmin(request);
  if (!adminUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id) {
    return NextResponse.json(
      { error: "Missing tip ID" },
      { status: 400 }
    );
  }

  await getAdminDb()
    .collection(COLLECTIONS.TIPS)
    .doc(body.id)
    .update({
      ...body,
      updatedAt: Timestamp.now(),
    });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const adminUid = await verifyAdmin(request);
  if (!adminUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { error: "Missing tip ID" },
      { status: 400 }
    );
  }

  await getAdminDb().collection(COLLECTIONS.TIPS).doc(id).delete();
  return NextResponse.json({ success: true });
}
