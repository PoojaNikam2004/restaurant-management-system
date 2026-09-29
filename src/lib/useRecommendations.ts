"use client";

import { useMemo } from "react";
import { useMyOrders } from "@/lib/useMyOrders";
import { useMenuItems } from "@/lib/useMenuItems";
import { MenuItem } from "@/types/menu";

export function useRecommendations(limit = 6) {
  const { orders, loading: loadingOrders } = useMyOrders();
  const { items, loading: loadingItems } = useMenuItems();

  const recommended = useMemo(() => {
    const available = items.filter((item) => item.available);
    const availableById = new Map(available.map((item) => [item.id, item]));

    const personalCounts = new Map<string, number>();
    for (const order of orders) {
      if (order.status !== "paid") continue;
      for (const line of order.lines) {
        if (!availableById.has(line.itemId)) continue;
        personalCounts.set(
          line.itemId,
          (personalCounts.get(line.itemId) ?? 0) + line.quantity
        );
      }
    }

    const personal = Array.from(personalCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([itemId]) => availableById.get(itemId))
      .filter((item): item is MenuItem => Boolean(item));

    const offerItems = available.filter((item) => item.isOffer);

    const seen = new Set<string>();
    const result: MenuItem[] = [];

    for (const item of [...personal, ...offerItems, ...available]) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      result.push(item);
      if (result.length >= limit) break;
    }

    return result;
  }, [orders, items, limit]);

  return { recommended, loading: loadingOrders || loadingItems };
}