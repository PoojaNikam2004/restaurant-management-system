"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { MenuItem } from "@/types/menu";

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const itemsRef = ref(db, "menuItems");
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const value = snapshot.val() as Record<
        string,
        Omit<MenuItem, "id">
      > | null;
      const list = value
        ? Object.entries(value).map(([id, item]) => ({ id, ...item }))
        : [];
      list.sort((a, b) => a.name.localeCompare(b.name));
      setItems(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { items, loading };
}