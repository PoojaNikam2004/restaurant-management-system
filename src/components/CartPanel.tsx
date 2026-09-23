"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/lib/useCheckout";

export default function CartPanel() {
  const { lines, totalPrice, setQuantity, removeItem } = useCart();
  const { state, error, lastOrderNumber, startCheckout, reset } =
    useCheckout();

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-cream-300 bg-white p-6 text-center shadow-sm">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-100 text-lg text-mint-700">
          ✓
        </span>
        <p className="text-sm font-semibold text-terracotta-900">
          Order placed!
        </p>
        <p className="text-xs text-terracotta-700/60">
          Payment confirmed
          {lastOrderNumber ? ` · Order #${lastOrderNumber}` : ""}. Your food
          is being prepared.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Link
            href="/orders"
            className="rounded-full bg-terracotta-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-terracotta-600"
          >
            Track order
          </Link>
          <button
            onClick={reset}
            className="rounded-full border border-cream-300 px-4 py-1.5 text-xs font-medium text-terracotta-800 transition-colors hover:bg-cream-100"
          >
            Order more
          </button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-cream-300 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-terracotta-700/60">
          Your cart is empty. Add items from the menu to get started.
        </p>
      </div>
    );
  }

  const isBusy = state === "creating" || state === "paying" || state === "verifying";
  const buttonLabel =
    state === "creating"
      ? "Preparing checkout…"
      : state === "paying"
        ? "Waiting for payment…"
        : state === "verifying"
          ? "Confirming payment…"
          : "Place order";

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-cream-300 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-terracotta-900">
        Your order
      </h3>

      <div className="flex flex-col gap-3">
        {lines.map(({ item, quantity }) => (
          <div key={item.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-terracotta-900">
                {item.name}
              </p>
              <p className="text-xs text-terracotta-700/50">
                ₹{item.price} each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(item.id, quantity - 1)}
                aria-label={`Decrease quantity of ${item.name}`}
                disabled={isBusy}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-cream-300 text-sm text-terracotta-700 transition-colors hover:bg-cream-100 disabled:opacity-50"
              >
                −
              </button>
              <span className="w-4 text-center text-sm text-terracotta-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(item.id, quantity + 1)}
                aria-label={`Increase quantity of ${item.name}`}
                disabled={isBusy}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-cream-300 text-sm text-terracotta-700 transition-colors hover:bg-cream-100 disabled:opacity-50"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name} from cart`}
                disabled={isBusy}
                className="ml-1 text-xs text-red-600 hover:underline disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-cream-200 pt-4">
        <span className="text-sm font-medium text-terracotta-700">
          Total
        </span>
        <span className="text-base font-semibold text-terracotta-900">
          ₹{totalPrice.toFixed(2)}
        </span>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        onClick={startCheckout}
        disabled={isBusy}
        className="flex h-11 items-center justify-center rounded-full bg-terracotta-500 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-600 disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </div>
  );
}