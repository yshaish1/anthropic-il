"use client";

import { useEffect, useState, useCallback } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getClientAuth, getClientDb } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Tip, FetchLog } from "@/types";
import { toast } from "sonner";
import { formatHebrewDate } from "@/lib/utils";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    articles: 0,
    reddit: 0,
    releases: 0,
    tips: 0,
  });

  // Tips management
  const [tips, setTips] = useState<Tip[]>([]);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [showTipForm, setShowTipForm] = useState(false);
  const [tipForm, setTipForm] = useState({
    titleHe: "",
    contentHe: "",
    category: "general" as Tip["category"],
    difficulty: "beginner" as Tip["difficulty"],
  });

  // Fetch logs
  const [fetchLogs, setFetchLogs] = useState<FetchLog[]>([]);

  // Fetching states
  const [fetchingType, setFetchingType] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const db = getClientDb();
        const adminDoc = await getDocs(
          query(
            collection(db, COLLECTIONS.ADMINS),
            where("uid", "==", u.uid)
          )
        );
        setIsAdmin(!adminDoc.empty);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Load data
  const loadData = useCallback(async () => {
    if (!isAdmin) return;
    const db = getClientDb();

    // Stats
    const [articlesSnap, redditSnap, releasesSnap, tipsSnap] =
      await Promise.all([
        getCountFromServer(collection(db, COLLECTIONS.ARTICLES)),
        getCountFromServer(collection(db, COLLECTIONS.REDDIT_POSTS)),
        getCountFromServer(collection(db, COLLECTIONS.RELEASES)),
        getCountFromServer(collection(db, COLLECTIONS.TIPS)),
      ]);

    setStats({
      articles: articlesSnap.data().count,
      reddit: redditSnap.data().count,
      releases: releasesSnap.data().count,
      tips: tipsSnap.data().count,
    });

    // Tips (all, including unpublished)
    const tipsQuery = query(
      collection(db, COLLECTIONS.TIPS),
      orderBy("order")
    );
    const tipsSnapshot = await getDocs(tipsQuery);
    setTips(
      tipsSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Tip)
    );

    // Fetch logs
    const logsQuery = query(
      collection(db, COLLECTIONS.FETCH_LOGS),
      orderBy("startedAt", "desc"),
      limit(10)
    );
    const logsSnapshot = await getDocs(logsQuery);
    setFetchLogs(
      logsSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as FetchLog)
    );
  }, [isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sign in
  const handleSignIn = async () => {
    const auth = getClientAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch {
      toast.error("שגיאה בהתחברות");
    }
  };

  // Sign out
  const handleSignOut = async () => {
    const auth = getClientAuth();
    await signOut(auth);
  };

  // Trigger fetch
  const handleFetch = async (type: string) => {
    setFetchingType(type);
    try {
      const res = await fetch("/api/admin/trigger-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) throw new Error("Fetch failed");
      toast.success(`שליפת ${type} הושלמה בהצלחה`);
      loadData();
    } catch {
      toast.error(`שגיאה בשליפת ${type}`);
    } finally {
      setFetchingType(null);
    }
  };

  // Tip CRUD
  const handleSaveTip = async () => {
    const db = getClientDb();
    try {
      if (editingTip) {
        await updateDoc(doc(db, COLLECTIONS.TIPS, editingTip.id), {
          titleHe: tipForm.titleHe,
          contentHe: tipForm.contentHe,
          category: tipForm.category,
          difficulty: tipForm.difficulty,
          updatedAt: new Date(),
        });
        toast.success("הטיפ עודכן בהצלחה");
      } else {
        const newId = crypto.randomUUID();
        await setDoc(doc(db, COLLECTIONS.TIPS, newId), {
          titleHe: tipForm.titleHe,
          contentHe: tipForm.contentHe,
          category: tipForm.category,
          difficulty: tipForm.difficulty,
          order: tips.length + 1,
          published: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success("הטיפ נוצר בהצלחה");
      }
      resetTipForm();
      loadData();
    } catch {
      toast.error("שגיאה בשמירת הטיפ");
    }
  };

  const handleDeleteTip = async (tipId: string) => {
    const db = getClientDb();
    try {
      await deleteDoc(doc(db, COLLECTIONS.TIPS, tipId));
      toast.success("הטיפ נמחק");
      loadData();
    } catch {
      toast.error("שגיאה במחיקת הטיפ");
    }
  };

  const handleTogglePublish = async (tip: Tip) => {
    const db = getClientDb();
    try {
      await updateDoc(doc(db, COLLECTIONS.TIPS, tip.id), {
        published: !tip.published,
        updatedAt: new Date(),
      });
      toast.success(tip.published ? "הטיפ הוסתר" : "הטיפ פורסם");
      loadData();
    } catch {
      toast.error("שגיאה בעדכון הטיפ");
    }
  };

  const startEditTip = (tip: Tip) => {
    setEditingTip(tip);
    setTipForm({
      titleHe: tip.titleHe,
      contentHe: tip.contentHe,
      category: tip.category,
      difficulty: tip.difficulty,
    });
    setShowTipForm(true);
  };

  const resetTipForm = () => {
    setEditingTip(null);
    setShowTipForm(false);
    setTipForm({
      titleHe: "",
      contentHe: "",
      category: "general",
      difficulty: "beginner",
    });
  };

  const handleAutoGenerateTips = async () => {
    setFetchingType("tips");
    try {
      const res = await fetch("/api/admin/trigger-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "tips" }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("יצירת טיפים אוטומטית הושלמה");
      loadData();
    } catch {
      toast.error("שגיאה ביצירת טיפים");
    } finally {
      setFetchingType(null);
    }
  };

  // Difficulty config
  const DIFF_LABELS: Record<string, { label: string; color: string }> = {
    beginner: { label: "קל", color: "text-[#00b894]" },
    intermediate: { label: "בינוני", color: "text-amber-600" },
    advanced: { label: "מתקדם", color: "text-red-600" },
  };

  const CATEGORY_LABELS: Record<string, string> = {
    prompting: "פרומפטינג",
    api: "API",
    "claude-code": "Claude Code",
    general: "כללי",
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
        <h1 className="text-4xl font-black headline-font text-primary">
          לוח בקרה
        </h1>
        <p className="text-muted text-lg">יש להתחבר כדי לגשת ללוח הבקרה</p>
        <button
          onClick={handleSignIn}
          className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center gap-3"
        >
          <span className="material-symbols-outlined">login</span>
          התחברות עם Google
        </button>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <span className="material-symbols-outlined text-6xl text-red-500">
          block
        </span>
        <h1 className="text-3xl font-bold headline-font text-primary">
          אין גישה
        </h1>
        <p className="text-muted">המשתמש {user.email} אינו מנהל מורשה</p>
        <button
          onClick={handleSignOut}
          className="px-6 py-3 bg-slate-200 text-primary rounded-lg font-bold"
        >
          התנתקות
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 pt-8 pb-12">
      {/* Page Header */}
      <header className="mb-10 text-right flex flex-row-reverse justify-between items-start">
        <div>
          <h1 className="text-[48px] font-black headline-font text-primary tracking-tight mb-2">
            לוח בקרה
          </h1>
          <p className="text-muted text-lg">שלום, {user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-muted hover:text-primary transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>התנתקות</span>
        </button>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "כתבות",
            count: stats.articles,
            icon: "article",
            bg: "bg-pink-50",
            text: "text-accent",
          },
          {
            label: "פוסטים מרדיט",
            count: stats.reddit,
            icon: "forum",
            bg: "bg-blue-50",
            text: "text-blue-500",
          },
          {
            label: "עדכונים",
            count: stats.releases,
            icon: "trending_up",
            bg: "bg-purple-50",
            text: "text-purple-500",
          },
          {
            label: "טיפים",
            count: stats.tips,
            icon: "lightbulb",
            bg: "bg-amber-50",
            text: "text-amber-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4 flex-row-reverse">
              <div
                className={`w-12 h-12 ${stat.bg} ${stat.text} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-muted font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black headline-font text-primary">
                {stat.count}
              </h3>
            </div>
          </div>
        ))}
      </section>

      {/* Content Fetch Section */}
      <section className="bg-slate-100 p-8 rounded-xl mb-12">
        <div className="mb-8 text-right">
          <h2 className="text-2xl font-black headline-font text-primary mb-1">
            שליפת תוכן
          </h2>
          <p className="text-muted">שליפה ידנית של תוכן ממקורות חיצוניים</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              type: "news",
              label: "שלוף חדשות",
              desc: "עדכון מאתרים ובלוגים מובילים",
              icon: "newspaper",
              bg: "bg-pink-50",
              text: "text-accent",
            },
            {
              type: "reddit",
              label: "שלוף רדיט",
              desc: "סנכרון מ-r/ClaudeAI ו-r/Anthropic",
              icon: "chat",
              bg: "bg-blue-50",
              text: "text-blue-500",
            },
            {
              type: "releases",
              label: "שלוף עדכונים",
              desc: "סריקה של דפי שחרור גרסאות",
              icon: "notifications_active",
              bg: "bg-green-50",
              text: "text-[#00b894]",
            },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => handleFetch(item.type)}
              disabled={fetchingType === item.type}
              className="flex flex-col items-center bg-white p-8 rounded-xl border-2 border-transparent hover:border-accent transition-all group text-center shadow-sm disabled:opacity-50"
            >
              <div
                className={`w-16 h-16 ${item.bg} ${item.text} rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}
              >
                {fetchingType === item.type ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
                ) : (
                  <span className="material-symbols-outlined text-3xl">
                    {item.icon}
                  </span>
                )}
              </div>
              <span className="text-xl font-bold mb-2">{item.label}</span>
              <span className="text-sm text-muted">{item.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Tips Management */}
      <section className="mb-12">
        <div className="flex flex-row-reverse justify-between items-center mb-8">
          <h2 className="text-2xl font-black headline-font text-primary">
            ניהול טיפים
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handleAutoGenerateTips}
              disabled={fetchingType === "tips"}
              className="px-6 py-2 rounded-full border-2 border-accent text-accent font-bold hover:bg-accent/5 transition-all disabled:opacity-50"
            >
              {fetchingType === "tips" ? "מייצר..." : "צור טיפים אוטומטיים"}
            </button>
            <button
              onClick={() => {
                resetTipForm();
                setShowTipForm(true);
              }}
              className="px-6 py-2 rounded-full bg-primary text-white font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>הוסף טיפ</span>
            </button>
          </div>
        </div>

        {/* Tip Form Modal */}
        {showTipForm && (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-border">
            <h3 className="text-xl font-bold headline-font text-primary mb-6">
              {editingTip ? "עריכת טיפ" : "טיפ חדש"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  כותרת
                </label>
                <input
                  type="text"
                  value={tipForm.titleHe}
                  onChange={(e) =>
                    setTipForm({ ...tipForm, titleHe: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-right"
                  placeholder="כותרת הטיפ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  תוכן
                </label>
                <textarea
                  value={tipForm.contentHe}
                  onChange={(e) =>
                    setTipForm({ ...tipForm, contentHe: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-right"
                  placeholder="תוכן הטיפ..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    קטגוריה
                  </label>
                  <select
                    value={tipForm.category}
                    onChange={(e) =>
                      setTipForm({
                        ...tipForm,
                        category: e.target.value as Tip["category"],
                      })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent text-right"
                  >
                    <option value="prompting">פרומפטינג</option>
                    <option value="api">API</option>
                    <option value="claude-code">Claude Code</option>
                    <option value="general">כללי</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    רמת קושי
                  </label>
                  <select
                    value={tipForm.difficulty}
                    onChange={(e) =>
                      setTipForm({
                        ...tipForm,
                        difficulty: e.target.value as Tip["difficulty"],
                      })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent text-right"
                  >
                    <option value="beginner">מתחילים</option>
                    <option value="intermediate">בינוני</option>
                    <option value="advanced">מתקדם</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 justify-end pt-4">
                <button
                  onClick={resetTipForm}
                  className="px-6 py-2 text-muted hover:text-primary transition-colors"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSaveTip}
                  disabled={!tipForm.titleHe || !tipForm.contentHe}
                  className="px-8 py-2 bg-accent text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {editingTip ? "עדכון" : "שמירה"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tips List */}
        <div className="space-y-3">
          {tips.map((tip) => {
            const diff = DIFF_LABELS[tip.difficulty] || DIFF_LABELS.beginner;
            return (
              <div
                key={tip.id}
                className="bg-white p-4 rounded-xl flex flex-row-reverse items-center justify-between shadow-sm border border-transparent hover:border-border transition-all"
              >
                <div className="flex flex-row-reverse items-center gap-6">
                  <button
                    onClick={() => handleTogglePublish(tip)}
                    title={tip.published ? "מפורסם" : "טיוטה"}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tip.published ? "bg-[#00b894]" : "bg-slate-300"
                      }`}
                    />
                  </button>
                  <span className="font-bold text-primary">
                    {tip.titleHe}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-muted text-xs rounded-full">
                    {CATEGORY_LABELS[tip.category] || tip.category}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs font-bold ${diff.color}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        diff.color === "text-[#00b894]"
                          ? "bg-[#00b894]"
                          : diff.color === "text-amber-600"
                          ? "bg-amber-600"
                          : "bg-red-600"
                      }`}
                    />
                    {diff.label}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditTip(tip)}
                    className="p-2 text-muted hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTip(tip.id)}
                    className="p-2 text-muted hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fetch Log Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-black headline-font text-primary mb-6 text-right">
          יומן שליפות
        </h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-border">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted">סטטוס</th>
                <th className="px-6 py-4 font-bold text-muted">סוג</th>
                <th className="px-6 py-4 font-bold text-muted">הופעל ע&quot;י</th>
                <th className="px-6 py-4 font-bold text-muted">פריטים חדשים</th>
                <th className="px-6 py-4 font-bold text-muted">תאריך</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fetchLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted"
                  >
                    אין רשומות ביומן
                  </td>
                </tr>
              ) : (
                fetchLogs.map((log) => {
                  const logDate = log.startedAt?.toDate
                    ? log.startedAt.toDate()
                    : new Date();
                  const typeBadge: Record<
                    string,
                    { bg: string; text: string; label: string }
                  > = {
                    news: {
                      bg: "bg-pink-100",
                      text: "text-accent",
                      label: "News",
                    },
                    reddit: {
                      bg: "bg-blue-100",
                      text: "text-blue-700",
                      label: "Reddit",
                    },
                    releases: {
                      bg: "bg-green-100",
                      text: "text-[#00b894]",
                      label: "Update",
                    },
                  };
                  const badge = typeBadge[log.type] || typeBadge.news;

                  return (
                    <tr key={log.id}>
                      <td className="px-6 py-4">
                        <span
                          className={`material-symbols-outlined ${
                            log.status === "success"
                              ? "text-[#00b894]"
                              : log.status === "failed"
                              ? "text-red-500"
                              : "text-amber-500"
                          }`}
                        >
                          {log.status === "success"
                            ? "check_circle"
                            : log.status === "failed"
                            ? "cancel"
                            : "warning"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 ${badge.bg} ${badge.text} rounded text-xs font-bold`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {log.trigger === "cron" ? "אוטומטי" : "ידני"}
                      </td>
                      <td className="px-6 py-4">{log.newItems} פריטים</td>
                      <td className="px-6 py-4 text-muted text-sm">
                        {formatHebrewDate(logDate)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
