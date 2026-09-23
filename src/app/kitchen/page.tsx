"use client";

import { ref, set } from "firebase/database";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopNav from "@/components/TopNav";
import { db } from "@/lib/firebase";
import { useKitchenQueue } from "@/lib/useKitchenQueue";
import { KitchenStatus } from "@/types/order";
import KitchenTicket from "@/components/KitchenTicket";
import { useAuth } from "@/context/AuthContext";

const nextStatus: Record<KitchenStatus, KitchenStatus | null> = {
  queued: "preparing",
  preparing: "ready",
  ready: "served",
  served: null,
};

const nextActionLabel: Record<KitchenStatus, string> = {
  queued: "Start preparing",
  preparing: "Mark ready",
  ready: "Mark served",
  served: "",
};

async function advance(orderId: string, current: KitchenStatus) {
  const next = nextStatus[current];
  if (!next) return;
  await set(ref(db, `kitchenQueue/${orderId}/status`), next);
  await set(ref(db, `kitchenQueue/${orderId}/updatedAt`), Date.now());
}

function KitchenContent() {
  const { entries, loading } = useKitchenQueue();
  const { isAdmin } = useAuth();
  const [current, ...upNext] = entries;

  const links = isAdmin
    ? [
        { href: "/admin/orders", label: "Analytics" },
        { href: "/admin", label: "Menu items" },
        { href: "/admin/ads", label: "Ads" },
      ]
    : [];

  return (
    <div className="flex flex-1 flex-col bg-white">
      <TopNav
        subtitle="Kitchen"
        links={links}
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-8 sm:px-12">
        <div>
          <h1 className="text-2xl font-semibold text-terracotta-900">
            Kitchen queue
          </h1>
          <p className="mt-1 text-sm text-terracotta-700/60">
            This mirrors what the kitchen display shows. Advancing an order
            here updates it live everywhere, including the ESP32 display.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-terracotta-700/60">Loading queue…</p>
        )}

        {!loading && !current && (
          <div className="rounded-3xl border border-cream-300 bg-cream-50 p-10 text-center">
            <p className="text-sm text-terracotta-700/60">
              No active orders. New paid orders will appear here.
            </p>
          </div>
        )}

        {current && (
          <div className="rounded-3xl border-2 border-terracotta-300 bg-terracotta-50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-terracotta-600">
                Now preparing
              </p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-terracotta-700">
                {current.status}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-3xl font-semibold text-terracotta-900">
                Order #{current.orderNumber}
              </p>
              {current.tableNumber && (
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                  Table {current.tableNumber}
                </span>
              )}
            </div>
            <ul className="mt-4 flex flex-col gap-1.5">
              {current.lines.map((line) => (
                <li
                  key={line.itemId}
                  className="flex items-center justify-between text-sm text-terracotta-800"
                >
                  <span>{line.name}</span>
                  <span className="font-medium">× {line.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => advance(current.orderId, current.status)}
                className="flex h-12 flex-1 items-center justify-center rounded-full bg-terracotta-500 text-base font-medium text-white shadow-sm transition-colors hover:bg-terracotta-600"
              >
                {nextActionLabel[current.status]}
              </button>
              <button
                onClick={() => window.print()}
                className="flex h-12 items-center justify-center rounded-full border border-terracotta-300 px-5 text-base font-medium text-terracotta-700 transition-colors hover:bg-white"
              >
                Print ticket
              </button>
            </div>
            <KitchenTicket entry={current} />
          </div>
        )}

        {upNext.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-terracotta-700/60">
              Up next ({upNext.length})
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {upNext.map((entry) => (
                <div
                  key={entry.orderId}
                  className="flex items-center justify-between rounded-xl border border-cream-300 bg-white px-4 py-3"
                >
                  <span className="flex items-center gap-2 font-medium text-terracotta-900">
                    Order #{entry.orderNumber}
                    {entry.tableNumber && (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                        Table {entry.tableNumber}
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-terracotta-700/60">
                    {entry.lines.reduce((sum, l) => sum + l.quantity, 0)} items
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function KitchenPage() {
  return (
    <ProtectedRoute requireKitchenOrAdmin allowKitchen>
      <KitchenContent />
    </ProtectedRoute>
  );
}