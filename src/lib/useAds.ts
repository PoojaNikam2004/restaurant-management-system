"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { Ad } from "@/types/ad";

export function useAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adsRef = ref(db, "ads");
    const unsubscribe = onValue(adsRef, (snapshot) => {
      const value = snapshot.val() as Record<string, Omit<Ad, "id">> | null;
      const list = value
        ? Object.entries(value).map(([id, ad]) => ({ id, ...ad }))
        : [];
      list.sort((a, b) => a.order - b.order);
      setAds(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { ads, loading };
}