"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartPanel from "@/components/CartPanel";

export default function MobileCartBar() {
  const { lines, totalItems, totalPrice } = useCart();
  const [open, setOpen] = useState(false);

  if (lines.length === 0) return null;

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="fixed inset-x-4 bottom-4 z-30 flex h-14 items-center justify-between rounded-full bg-terracotta-500 px-5 text-white shadow-lg"
      >
        <span className="text-sm font-medium">
          {totalItems} item{totalItems === 1 ? "" : "s"} in cart
        </span>
        <span className="text-sm font-semibold">
          View cart · ₹{totalPrice.toFixed(2)}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <button
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-terracotta-950/40"
          />
          <div className="relative max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream-50 p-4 pb-6 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="mx-auto h-1.5 w-10 rounded-full bg-cream-300" />
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close cart"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-terracotta-700 shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeWidth={1.8} d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <CartPanel />
          </div>
        </div>
      )}
    </div>
  );
}