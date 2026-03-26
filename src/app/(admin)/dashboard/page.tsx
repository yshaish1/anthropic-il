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
  Lightbulb,
  TrendingUp,
  FileText,
  Users,
} from "lucide-react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getClientAuth, getClientDb } from "@/lib/firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { cn, formatHebrewDate } from "@/lib/utils";
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

interface Stats {
  articles: number;
  reddit: number;
  releases: number;
  tips: number;
}

interface TipItem {
  id: string;
  titleHe: string;
  contentHe: string;
  category: string;
  difficulty: string;
  published: boolean;
  order: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState<FetchType | null>(null);
  const [fetchLogs, setFetchLogs] = useState<FetchLogEntry[]>([]);
  const [tips, setTips] = useState<TipItem[]>([]);
  const [editingTip, setEditingTip] = useState<TipItem | null>(null);
  const [showTipForm, setShowTipForm] = useState(false);
  const [generatingTips, setGeneratingTips] = useState(false);
  const [tipForm, setTipForm] = useState({
    titleHe: "",
    contentHe: "",
    category: "general",
    difficulty: "beginner",
  });
  const [stats, setStats] = useState<Stats>({
    articles: 0,
    reddit: 0,
    releases: 0,
    tips: 0,
  });

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
    loadStats();
    loadTips();
  }, [isAdmin]);

  async function loadStats() {
    const db = getClientDb();
    try {
      const [articles, reddit, releases, tips] = await Promise.all([
        getCountFromServer(collection(db, COLLECTIONS.ARTICLES)),
        getCountFromServer(collection(db, COLLECTIONS.REDDIT_POSTS)),
        getCountFromServer(collection(db, COLLECTIONS.RELEASES)),
        getCountFromServer(collection(db, COLLECTIONS.TIPS)),
      ]);
      setStats({
        articles: articles.data().count,
        reddit: reddit.data().count,
        releases: releases.data().count,
        tips: tips.data().count,
      });
    } catch {
      // Counts may fail if collections don't exist yet
    }
  }

  async function loadFetchLogs() {
    const q = query(
      collection(getClientDb(), COLLECTIONS.FETCH_LOGS),
      orderBy("completedAt", "desc"),
      limit(10)
    );
    const snapshot = await getDocs(q);
    setFetchLogs(
      snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as FetchLogEntry
      )
    );
  }

  async function loadTips() {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/manage-tips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTips(data);
      }
    } catch {
      // ignore
    }
  }

  async function saveTip(isEdit: boolean) {
    if (!user) return;
    const token = await user.getIdToken();
    const method = isEdit ? "PUT" : "POST";
    const body = isEdit
      ? { ...tipForm, id: editingTip?.id }
      : { ...tipForm, published: false };

    const res = await fetch("/api/admin/manage-tips", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success(isEdit ? "הטיפ עודכן" : "הטיפ נוצר");
      setShowTipForm(false);
      setEditingTip(null);
      setTipForm({ titleHe: "", contentHe: "", category: "general", difficulty: "beginner" });
      loadTips();
      loadStats();
    } else {
      toast.error("שגיאה בשמירת הטיפ");
    }
  }

  async function deleteTip(id: string) {
    if (!user || !confirm("למחוק את הטיפ?")) return;
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/manage-tips", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success("הטיפ נמחק");
      loadTips();
      loadStats();
    }
  }

  async function togglePublish(tip: TipItem) {
    if (!user) return;
    const token = await user.getIdToken();
    await fetch("/api/admin/manage-tips", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: tip.id, published: !tip.published }),
    });
    loadTips();
    loadStats();
  }

  async function autoGenerateTips() {
    if (!user) return;
    setGeneratingTips(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/trigger-fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "tips" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`נוצרו ${data.newItems} טיפים חדשים`);
        loadTips();
        loadStats();
      } else {
        toast.error(data.error || "שגיאה ביצירת טיפים");
      }
    } catch {
      toast.error("שגיאה ביצירת טיפים");
    }
    setGeneratingTips(false);
  }

  async function handleSignIn() {
    try {
      await signInWithPopup(getClientAuth(), new GoogleAuthProvider());
    } catch {
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
        loadStats();
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
      <main className="pt-16 pb-32">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
          <div className="w-20 h-20 rounded-2xl bg-surface-container-low flex items-center justify-center">
            <LayoutDashboard className="h-10 w-10 text-on-surface-variant/40" />
          </div>
          <h1 className="text-4xl font-black text-primary">לוח בקרה</h1>
          <p className="text-on-surface-variant text-lg">
            יש להתחבר כדי לגשת ללוח הבקרה
          </p>
          <button
            onClick={handleSignIn}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors text-base"
          >
            <LogIn className="h-5 w-5" />
            התחבר עם Google
          </button>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="pt-16 pb-32">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <XCircle className="h-16 w-16 text-red-500" />
          <h1 className="text-4xl font-black text-primary">אין גישה</h1>
          <p className="text-on-surface-variant text-lg">
            המשתמש {user.email} אינו מנהל מערכת.
          </p>
        </div>
      </main>
    );
  }

  const fetchButtons: {
    type: FetchType;
    icon: React.ElementType;
    label: string;
    description: string;
  }[] = [
    {
      type: "news",
      icon: Newspaper,
      label: "שלוף חדשות",
      description: "שליפה ותרגום כתבות מבלוג Anthropic",
    },
    {
      type: "reddit",
      icon: MessageSquare,
      label: "שלוף רדיט",
      description: "שליפת פוסטים פופולריים מ-Reddit",
    },
    {
      type: "releases",
      icon: Bell,
      label: "שלוף עדכונים",
      description: "שליפת עדכוני מוצר ושחרורים",
    },
  ];

  const statCards = [
    {
      icon: FileText,
      label: "כתבות",
      value: stats.articles,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: MessageSquare,
      label: "פוסטים מרדיט",
      value: stats.reddit,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: TrendingUp,
      label: "עדכונים",
      value: stats.releases,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: Lightbulb,
      label: "טיפים",
      value: stats.tips,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <main className="pt-16 pb-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-primary mb-1">לוח בקרה</h1>
          <p className="text-on-surface-variant">
            שלום, {user.displayName || user.email}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card rounded-xl p-5 border border-outline-variant/10 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center",
                      stat.bg
                    )}
                  >
                    <Icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                  <span className="text-sm text-on-surface-variant font-medium">
                    {stat.label}
                  </span>
                </div>
                <span className="text-3xl font-black text-primary">
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content fetch section */}
        <section className="bg-surface-container-low rounded-xl p-8 mb-10">
          <h2 className="text-xl font-bold text-primary mb-2">שליפת תוכן</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            שליפה ידנית של תוכן ממקורות חיצוניים
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {fetchButtons.map(({ type, icon: Icon, label, description }) => (
              <button
                key={type}
                onClick={() => triggerFetch(type)}
                disabled={fetching !== null}
                className={cn(
                  "flex flex-col items-start gap-2 p-5 rounded-xl bg-card border border-outline-variant/10 hover:shadow-md hover:border-secondary transition-all text-right",
                  fetching === type && "opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  {fetching === type ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-secondary" />
                  ) : (
                    <Icon className="h-5 w-5 text-secondary" />
                  )}
                  <span className="font-bold text-primary">{label}</span>
                </div>
                <span className="text-xs text-on-surface-variant">
                  {description}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Tips management */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">ניהול טיפים</h2>
            <div className="flex gap-2">
              <button
                onClick={autoGenerateTips}
                disabled={generatingTips}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 text-secondary font-medium text-sm hover:bg-secondary/20 transition-colors"
              >
                {generatingTips ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4" />
                )}
                צור טיפים אוטומטיים
              </button>
              <button
                onClick={() => {
                  setShowTipForm(true);
                  setEditingTip(null);
                  setTipForm({ titleHe: "", contentHe: "", category: "general", difficulty: "beginner" });
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-medium text-sm hover:bg-primary-container transition-colors"
              >
                + הוסף טיפ
              </button>
            </div>
          </div>

          {/* Tip form */}
          {showTipForm && (
            <div className="bg-card rounded-xl border border-outline-variant/10 p-6 mb-4">
              <h3 className="font-bold text-primary mb-4">
                {editingTip ? "עריכת טיפ" : "טיפ חדש"}
              </h3>
              <div className="space-y-4">
                <input
                  value={tipForm.titleHe}
                  onChange={(e) => setTipForm({ ...tipForm, titleHe: e.target.value })}
                  placeholder="כותרת הטיפ"
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant/20 bg-surface text-primary text-right"
                />
                <textarea
                  value={tipForm.contentHe}
                  onChange={(e) => setTipForm({ ...tipForm, contentHe: e.target.value })}
                  placeholder="תוכן הטיפ"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant/20 bg-surface text-primary text-right"
                />
                <div className="flex gap-4">
                  <select
                    value={tipForm.category}
                    onChange={(e) => setTipForm({ ...tipForm, category: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-outline-variant/20 bg-surface text-primary"
                  >
                    <option value="general">כללי</option>
                    <option value="prompting">פרומפטים</option>
                    <option value="api">API</option>
                    <option value="claude-code">Claude Code</option>
                  </select>
                  <select
                    value={tipForm.difficulty}
                    onChange={(e) => setTipForm({ ...tipForm, difficulty: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-outline-variant/20 bg-surface text-primary"
                  >
                    <option value="beginner">מתחיל</option>
                    <option value="intermediate">בינוני</option>
                    <option value="advanced">מתקדם</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveTip(!!editingTip)}
                    className="px-6 py-2 rounded-lg bg-primary text-on-primary font-medium text-sm"
                  >
                    {editingTip ? "עדכן" : "שמור"}
                  </button>
                  <button
                    onClick={() => { setShowTipForm(false); setEditingTip(null); }}
                    className="px-6 py-2 rounded-lg border border-outline-variant/20 text-on-surface-variant font-medium text-sm"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tips list */}
          {tips.length > 0 ? (
            <div className="space-y-2">
              {tips.filter(t => !("_notRelease" in t)).map((tip) => (
                <div
                  key={tip.id}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-outline-variant/10"
                >
                  <button
                    onClick={() => togglePublish(tip)}
                    className={cn(
                      "w-3 h-3 rounded-full shrink-0 transition-colors",
                      tip.published ? "bg-emerald-500" : "bg-outline-variant"
                    )}
                    title={tip.published ? "פורסם" : "טיוטה"}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-primary text-sm line-clamp-1">
                      {tip.titleHe}
                    </span>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full">
                        {tip.category}
                      </span>
                      <span className="text-[10px] text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full">
                        {tip.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingTip(tip);
                        setTipForm({
                          titleHe: tip.titleHe,
                          contentHe: tip.contentHe,
                          category: tip.category,
                          difficulty: tip.difficulty,
                        });
                        setShowTipForm(true);
                      }}
                      className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTip(tip.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-outline-variant/10 p-8 text-center">
              <p className="text-on-surface-variant">אין טיפים עדיין. צור טיפים אוטומטיים או הוסף ידנית.</p>
            </div>
          )}
        </section>

        {/* Fetch log table */}
        <section>
          <h2 className="text-xl font-bold text-primary mb-4">יומן שליפות</h2>
          {fetchLogs.length > 0 ? (
            <div className="bg-card rounded-xl border border-outline-variant/10 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/10 bg-surface-container-low">
                    <th className="text-right p-4 font-medium text-on-surface-variant">
                      סטטוס
                    </th>
                    <th className="text-right p-4 font-medium text-on-surface-variant">
                      סוג
                    </th>
                    <th className="text-right p-4 font-medium text-on-surface-variant">
                      מקור
                    </th>
                    <th className="text-right p-4 font-medium text-on-surface-variant">
                      פריטים חדשים
                    </th>
                    <th className="text-right p-4 font-medium text-on-surface-variant">
                      תאריך
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fetchLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-outline-variant/5 last:border-b-0 hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="p-4">
                        {log.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : log.status === "partial" ? (
                          <CheckCircle className="h-5 w-5 text-amber-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                      <td className="p-4 font-medium text-primary">
                        {log.type}
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {log.trigger}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
                          {log.newItems}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant text-xs">
                        {log.completedAt?.toDate?.()?.toLocaleString("he-IL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-outline-variant/10 p-12 text-center">
              <p className="text-on-surface-variant">אין רשומות עדיין.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
