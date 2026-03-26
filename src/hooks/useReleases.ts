"use client";

import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { ReleaseNote } from "@/types";

export function useReleases(type?: string, count: number = 20) {
  return useQuery({
    queryKey: ["releases", type, count],
    queryFn: async () => {
      const db = getClientDb();
      let q = query(
        collection(db, COLLECTIONS.RELEASES),
        orderBy("publishedAt", "desc"),
        limit(count)
      );

      if (type && type !== "all") {
        q = query(
          collection(db, COLLECTIONS.RELEASES),
          where("type", "==", type),
          orderBy("publishedAt", "desc"),
          limit(count)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as ReleaseNote
      );
    },
  });
}
