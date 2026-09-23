"use client";

import { MenuItem } from "@/types/menu";
import { useCart } from "@/context/CartContext";
import MenuItemImage from "@/components/MenuItemImage";

export default function MenuItemRow({ items }: { items: MenuItem[] }) {
  const { addItem } = useCart();

  return (
    <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-sm"
        >
          <div className="relative h-28 w-full">
            <MenuItemImage imageUrl={item.imageUrl} name={item.name} category={item.category} />
            {item.isOffer && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-saffron-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
                Offer
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-2.5">
            <p className="truncate text-sm font-medium text-terracotta-900">
              {item.name}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs font-medium text-saffron-700">
                ₹{item.price}
              </span>
              <button
                onClick={() => addItem(item)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta-500 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-600"
                aria-label={`Add ${item.name}`}
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}