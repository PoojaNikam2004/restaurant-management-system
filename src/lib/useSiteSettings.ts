"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";

export function useSiteSettings() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsRef = ref(db, "settings/logoUrl");
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      setLogoUrl(snapshot.exists() ? (snapshot.val() as string) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { logoUrl, loading };
}