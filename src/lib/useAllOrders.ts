"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { Order } from "@/types/order";

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = ref(db, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const value = snapshot.val() as Record<
        string,
        Record<string, Omit<Order, "id">>
      > | null;

      const list: Order[] = [];
      if (value) {
        for (const uid of Object.keys(value)) {
          for (const [orderId, order] of Object.entries(value[uid])) {
            list.push({ id: orderId, ...order });
          }
        }
      }
      list.sort((a, b) => b.createdAt - a.createdAt);
      setOrders(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { orders, loading };
}