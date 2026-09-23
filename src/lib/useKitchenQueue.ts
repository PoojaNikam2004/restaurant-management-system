"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { KitchenQueueEntry } from "@/types/order";

export function useKitchenQueue() {
  const [entries, setEntries] = useState<KitchenQueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queueRef = ref(db, "kitchenQueue");
    const unsubscribe = onValue(queueRef, (snapshot) => {
      const value = snapshot.val() as Record<
        string,
        KitchenQueueEntry
      > | null;
      const list = value ? Object.values(value) : [];
      list.sort((a, b) => a.createdAt - b.createdAt);
      setEntries(list.filter((entry) => entry.status !== "served"));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { entries, loading };
}