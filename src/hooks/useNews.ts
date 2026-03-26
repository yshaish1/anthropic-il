"use client";

import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Article } from "@/types";

export function useNews(category?: string, count: number = 20) {
  return useQuery({
    queryKey: ["news", category, count],
    queryFn: async () => {
      let q = query(
        collection(db, COLLECTIONS.ARTICLES),
        orderBy("publishedAt", "desc"),
        limit(count)
      );

      if (category && category !== "all") {
        q = query(
          collection(db, COLLECTIONS.ARTICLES),
          where("category", "==", category),
          orderBy("publishedAt", "desc"),
          limit(count)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Article
      );
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const docRef = doc(db, COLLECTIONS.ARTICLES, slug);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as Article;
    },
    enabled: !!slug,
  });
}
