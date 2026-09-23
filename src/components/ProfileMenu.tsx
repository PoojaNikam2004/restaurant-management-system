"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useMyOrders } from "@/lib/useMyOrders";

const roleLabel: Record<string, string> = {
  admin: "Admin",
  kitchen: "Kitchen staff",
  customer: "Customer",
};

export default function ProfileMenu({ compact = false }: { compact?: boolean }) {
  const { user, role, logout } = useAuth();
  const { orders } = useMyOrders();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const paidOrders = orders.filter((o) => o.status === "paid");
  const totalSpent = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const points = Math.floor(totalSpent / 10);
  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : null;

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push("/");
  }

  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account"
        aria-expanded={open}
        className={`flex items-center justify-center rounded-full bg-terracotta-100 font-medium text-terracotta-700 transition-colors hover:bg-terracotta-200 ${
          compact ? "h-9 w-9 text-sm" : "h-10 w-10 text-sm"
        }`}
      >
        {initial}
      </button>

      {open && (
        <>
          <button
            aria-label="Close profile menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20"
          />
          <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl border border-cream-300 bg-white p-4 shadow-lg">
            <p className="truncate text-sm font-semibold text-terracotta-900">
              {user?.displayName || "Guest"}
            </p>
            <p className="truncate text-xs text-terracotta-700/60">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-xs font-medium text-terracotta-700">
                {roleLabel[role ?? ""] ?? "Customer"}
              </span>
              {memberSince && (
                <span className="text-xs text-terracotta-700/50">
                  Member since {memberSince}
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-cream-200 pt-4">
              <div className="text-center">
                <p className="text-base font-semibold text-terracotta-900">
                  {paidOrders.length}
                </p>
                <p className="text-[11px] text-terracotta-700/60">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-terracotta-900">
                  ₹{totalSpent.toFixed(0)}
                </p>
                <p className="text-[11px] text-terracotta-700/60">Spent</p>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-terracotta-900">{points}</p>
                <p className="text-[11px] text-terracotta-700/60">Points</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 flex h-10 w-full items-center justify-center rounded-full border border-cream-300 text-sm font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}