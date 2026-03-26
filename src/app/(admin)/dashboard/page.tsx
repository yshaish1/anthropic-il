"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  MessageSquare,
  Bell,
  RefreshCw,
  CheckCircle,
  XCircle,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { getClientAuth, getClientDb } from "@/lib/firebase/config";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FetchType = "news" | "reddit" | "releases";

interface FetchLogEntry {
  id: string;
  type: string;
  trigger: string;
  status: string;
  newItems: number;
  completedAt: { toDate: () => Date };
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState<FetchType | null>(null);
  const [fetchLogs, setFetchLogs] = useState<FetchLogEntry[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getClientAuth(), async (u) => {
      setUser(u);
      if (u) {
        const adminDoc = await getDoc(
          doc(getClientDb(), COLLECTIONS.ADMINS, u.uid)
        );
        setIsAdmin(adminDoc.exists());
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    loadFetchLogs();
  }, [isAdmin]);

  async function loadFetchLogs() {
    const q = query(
      collection(getClientDb(), COLLECTIONS.FETCH_LOGS),
      orderBy("completedAt", "desc"),
      limit(10)
    );
    const snapshot = await getDocs(q);
    setFetchLogs(
      snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as FetchLogEntry)
    );
  }

  async function handleSignIn() {
    try {
      await signInWithPopup(getClientAuth(), new GoogleAuthProvider());
    } catch (err) {
      toast.error("שגיאה בהתחברות");
    }
  }

  async function triggerFetch(type: FetchType) {
    if (!user) return;
    setFetching(type);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/trigger-fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`נשלפו ${data.newItems} פריטים חדשים`);
        loadFetchLogs();
      } else {
        toast.error(data.error || "שגיאה בשליפה");
      }
    } catch {
      toast.error("שגיאה בשליפה");
    }
    setFetching(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-on-surface-variant" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <LayoutDashboard className="h-16 w-16 text-on-surface-variant/30" />
        <h1 className="text-2xl font-bold text-primary">לוח בקרה</h1>
        <p className="text-on-surface-variant">יש להתחבר כדי לגשת ללוח הבקרה</p>
        <button
          onClick={handleSignIn}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors"
        >
          <LogIn className="h-5 w-5" />
          התחבר עם Google
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold text-primary">אין גישה</h1>
        <p className="text-on-surface-variant">
          המשתמש {user.email} אינו מנהל מערכת.
        </p>
      </div>
    );
  }

  const fetchButtons: { type: FetchType; icon: React.ElementType; label: string }[] = [
    { type: "news", icon: Newspaper, label: "שלוף חדשות" },
    { type: "reddit", icon: MessageSquare, label: "שלוף רדיט" },
    { type: "releases", icon: Bell, label: "שלוף עדכונים" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="h-7 w-7 text-coral" />
        <h1 className="text-3xl font-bold text-primary">לוח בקרה</h1>
      </div>

      {/* Manual Fetch */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-primary mb-4">
          שליפת תוכן
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {fetchButtons.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => triggerFetch(type)}
              disabled={fetching !== null}
              className={cn(
                "flex items-center gap-3 p-5 rounded-xl bg-surface-container-low hover:bg-surface-highest transition-all font-medium",
                fetching === type && "opacity-60"
              )}
            >
              {fetching === type ? (
                <RefreshCw className="h-5 w-5 animate-spin text-coral" />
              ) : (
                <Icon className="h-5 w-5 text-coral" />
              )}
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Fetch Logs */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">
          יומן שליפות
        </h2>
        {fetchLogs.length > 0 ? (
          <div className="space-y-2">
            {fetchLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low"
              >
                {log.status === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                ) : log.status === "partial" ? (
                  <CheckCircle className="h-5 w-5 text-yellow-500 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{log.type}</span>
                  <span className="text-on-surface-variant mx-2">
                    ({log.trigger})
                  </span>
                  <span className="text-sm text-on-surface-variant">
                    {log.newItems} פריטים חדשים
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant shrink-0">
                  {log.completedAt?.toDate?.()?.toLocaleString("he-IL")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant text-center py-8">
            אין רשומות עדיין.
          </p>
        )}
      </section>
    </div>
  );
}
