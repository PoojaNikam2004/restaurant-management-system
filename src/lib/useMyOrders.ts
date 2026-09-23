"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { KitchenStatus, Order } from "@/types/order";

export interface OrderWithKitchenStatus extends Order {
  kitchenStatus?: KitchenStatus;
}

export function useMyOrders() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [orders, setOrders] = useState<OrderWithKitchenStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const kitchenUnsubscribers = new Map<string, () => void>();

    const ordersRef = ref(db, `orders/${uid}`);
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const value = snapshot.val() as Record<string, Omit<Order, "id">> | null;
      const list: OrderWithKitchenStatus[] = value
        ? Object.entries(value).map(([id, order]) => ({ id, ...order }))
        : [];
      list.sort((a, b) => b.createdAt - a.createdAt);

      const paidIds = new Set(
        list.filter((o) => o.status === "paid").map((o) => o.id)
      );

      for (const [orderId, unsub] of kitchenUnsubscribers) {
        if (!paidIds.has(orderId)) {
          unsub();
          kitchenUnsubscribers.delete(orderId);
        }
      }

      for (const orderId of paidIds) {
        if (kitchenUnsubscribers.has(orderId)) continue;
        const kitchenRef = ref(db, `kitchenQueue/${orderId}/status`);
        const unsub = onValue(kitchenRef, (statusSnap) => {
          const status = statusSnap.val() as KitchenStatus | null;
          setOrders((prev) =>
            prev.map((o) =>
              o.id === orderId ? { ...o, kitchenStatus: status ?? undefined } : o
            )
          );
        });
        kitchenUnsubscribers.set(orderId, unsub);
      }

      setOrders((prev) =>
        list.map((order) => {
          const existing = prev.find((p) => p.id === order.id);
          return { ...order, kitchenStatus: existing?.kitchenStatus };
        })
      );
      setLoading(false);
    });

    return () => {
      unsubscribeOrders();
      for (const unsub of kitchenUnsubscribers.values()) unsub();
    };
  }, [uid]);

  if (!uid) {
    return { orders: [], loading: false };
  }

  return { orders, loading };
}