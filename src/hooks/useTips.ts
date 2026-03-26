"use client";

import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Tip } from "@/types";

export function useTips(category?: string, difficulty?: string) {
  return useQuery({
    queryKey: ["tips", category, difficulty],
    queryFn: async () => {
      const constraints = [
        where("published", "==", true),
        orderBy("order"),
      ];

      if (category && category !== "all") {
        constraints.push(where("category", "==", category));
      }
      if (difficulty && difficulty !== "all") {
        constraints.push(where("difficulty", "==", difficulty));
      }

      const q = query(
        collection(db, COLLECTIONS.TIPS),
        ...constraints
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Tip
      );
    },
  });
}
