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
import type { RedditPost } from "@/types";

export function useRedditPosts(
  subreddit?: string,
  count: number = 20
) {
  return useQuery({
    queryKey: ["reddit", subreddit, count],
    queryFn: async () => {
      const db = getClientDb();
      let q = query(
        collection(db, COLLECTIONS.REDDIT_POSTS),
        where("curated", "==", true),
        orderBy("score", "desc"),
        limit(count)
      );

      if (subreddit && subreddit !== "all") {
        q = query(
          collection(db, COLLECTIONS.REDDIT_POSTS),
          where("curated", "==", true),
          where("subreddit", "==", subreddit),
          orderBy("score", "desc"),
          limit(count)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as RedditPost
      );
    },
  });
}
