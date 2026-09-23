"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/context/AuthContext";
import { useMyOrders } from "@/lib/useMyOrders";
import { KitchenStatus } from "@/types/order";

const kitchenStages: { key: KitchenStatus; label: string }[] = [
  { key: "queued", label: "Queued" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "served", label: "Served" },
];

function KitchenProgress({ status }: { status?: KitchenStatus }) {
  const currentIndex = status
    ? kitchenStages.findIndex((s) => s.key === status)
    : -1;

  return (
    <div className="flex items-center gap-2">
      {kitchenStages.map((stage, index) => {
        const reached = currentIndex >= index;
        return (
          <div key={stage.key} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  reached ? "bg-mint-500" : "bg-cream-300"
                }`}
              />
              <span
                className={`text-[11px] font-medium ${
                  reached ? "text-mint-700" : "text-terracotta-700/40"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {index < kitchenStages.length - 1 && (
              <span
                className={`h-0.5 w-6 sm:w-10 ${
                  currentIndex > index ? "bg-mint-500" : "bg-cream-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    created: "bg-butter-100 text-butter-700",
    paid: "bg-mint-100 text-mint-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-cream-200 text-terracotta-700"}`}
    >
      {status === "paid" ? "Paid" : status === "failed" ? "Failed" : "Pending"}
    </span>
  );
}

function OrdersContent() {
  const { orders, loading } = useMyOrders();
  const { isAdmin } = useAuth();

  const links = [{ href: "/dashboard", label: "Menu" }];
  if (isAdmin) links.push({ href: "/admin", label: "Admin panel" });

  return (
    <div className="flex flex-1 flex-col bg-white">
      <TopNav subtitle="My Orders" links={links} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8 sm:px-12">
        <div>
          <h1 className="text-2xl font-semibold text-terracotta-900">
            Your orders
          </h1>
          <p className="mt-1 text-sm text-terracotta-700/60">
            Track live status and view your order history.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-terracotta-700/60">Loading orders…</p>
        )}

        {!loading && orders.length === 0 && (
          <div className="rounded-3xl border border-cream-300 bg-cream-50 p-8 text-center">
            <p className="text-sm text-terracotta-700/60">
              You haven&apos;t placed any orders yet.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-cream-300 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-terracotta-900">
                    {order.orderNumber
                      ? `Order #${order.orderNumber}`
                      : `Order ${order.id.slice(-8)}`}
                  </p>
                  <StatusBadge status={order.status} />
                  {order.tableNumber && (
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                      Table {order.tableNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-terracotta-700/50">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <ul className="mt-3 flex flex-col gap-1">
                {order.lines.map((line) => (
                  <li
                    key={line.itemId}
                    className="flex items-center justify-between text-sm text-terracotta-700/80"
                  >
                    <span>
                      {line.name} × {line.quantity}
                    </span>
                    <span>₹{(line.price * line.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-cream-200 pt-3">
                <span className="text-sm font-medium text-terracotta-700">
                  Total
                </span>
                <span className="text-base font-semibold text-terracotta-900">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>

              {order.status === "paid" && (
                <div className="mt-4 overflow-x-auto pt-1">
                  <KitchenProgress status={order.kitchenStatus} />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}