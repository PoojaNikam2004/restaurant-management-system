"use client";

import { useMemo, useState } from "react";
import { useMenuItems } from "@/lib/useMenuItems";
import { useCart } from "@/context/CartContext";
import MenuItemImage from "@/components/MenuItemImage";
import VoiceSearchButton from "@/components/VoiceSearchButton";
import { fuzzyIncludes } from "@/lib/fuzzyMatch";

const categoryPalette = [
  { dot: "bg-coral-500", label: "text-coral-700" },
  { dot: "bg-mint-500", label: "text-mint-700" },
  { dot: "bg-sky-500", label: "text-sky-700" },
  { dot: "bg-butter-500", label: "text-butter-700" },
  { dot: "bg-plum-500", label: "text-plum-700" },
];

export default function MenuBrowser() {
  const { items, loading } = useMenuItems();
  const { addItem } = useCart();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(() => {
    if (typeof window === "undefined") return "All";
    const params = new URLSearchParams(window.location.search);
    if (params.get("filter") === "offer") return "Today's Offer";
    return params.get("category") || "All";
  });

  const available = useMemo(
    () => items.filter((item) => item.available),
    [items]
  );

  const categoryList = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const item of available) {
      if (!seen.has(item.category)) {
        seen.add(item.category);
        list.push(item.category);
      }
    }
    return list;
  }, [available]);

  const hasOffers = useMemo(
    () => available.some((item) => item.isOffer),
    [available]
  );

  const filters = useMemo(() => {
    const base = ["All"];
    if (hasOffers) base.push("Today's Offer");
    return [...base, ...categoryList];
  }, [hasOffers, categoryList]);

  const categoryFiltered = useMemo(() => {
    return available.filter((item) => {
      if (activeFilter === "Today's Offer") return item.isOffer;
      if (activeFilter === "All") return true;
      return item.category === activeFilter;
    });
  }, [available, activeFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categoryFiltered;

    const exact = categoryFiltered.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
    if (exact.length > 0) return exact;

    return categoryFiltered.filter(
      (item) =>
        fuzzyIncludes(item.name, q) ||
        fuzzyIncludes(item.description, q) ||
        fuzzyIncludes(item.category, q)
    );
  }, [categoryFiltered, query]);

  const categories = useMemo(() => {
    const grouped = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const list = grouped.get(item.category) ?? [];
      list.push(item);
      grouped.set(item.category, list);
    }
    return Array.from(grouped.entries());
  }, [filtered]);

  if (loading) {
    return <p className="text-sm text-terracotta-700/60">Loading menu…</p>;
  }

  if (available.length === 0) {
    return (
      <div className="rounded-3xl border border-cream-300 bg-cream-50 p-6 text-center">
        <p className="text-sm text-terracotta-700/60">
          The menu isn&apos;t available yet. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-terracotta-400"
        >
          <circle cx="11" cy="11" r="7" strokeWidth={1.8} />
          <path strokeLinecap="round" strokeWidth={1.8} d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dishes, e.g. paneer, biryani, chai…"
          className="h-12 w-full rounded-full border border-cream-300 bg-white pl-11 pr-12 text-sm text-terracotta-900 outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
        />
        <VoiceSearchButton onResult={setQuery} />
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              activeFilter === filter
                ? "border-terracotta-500 bg-terracotta-500 text-white"
                : "border-cream-300 bg-white text-terracotta-700 hover:bg-cream-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {categories.length === 0 ? (
        <div className="rounded-3xl border border-cream-300 bg-cream-50 p-6 text-center">
          <p className="text-sm text-terracotta-700/60">
            No dishes match &quot;{query}&quot;. Try a different search or
            filter.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {categories.map(([category, categoryItems], index) => {
            const palette = categoryPalette[index % categoryPalette.length];
            return (
              <div key={category}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${palette.dot}`} />
                  <h3
                    className={`text-sm font-semibold uppercase tracking-wide ${palette.label}`}
                  >
                    {category}
                  </h3>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="relative h-36 w-full">
                        <MenuItemImage
                          imageUrl={item.imageUrl}
                          name={item.name}
                          category={item.category}
                        />
                        {item.isOffer && (
                          <span className="absolute left-2 top-2 rounded-full bg-saffron-500 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
                            Today&apos;s Offer
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-4">
                        <p className="font-medium text-terracotta-900">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="line-clamp-2 text-sm text-terracotta-700/60">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <span className="inline-flex items-center rounded-full bg-saffron-100 px-2.5 py-0.5 text-sm font-medium text-saffron-700">
                            ₹{item.price}
                          </span>
                          <button
                            onClick={() => addItem(item)}
                            className="flex h-9 shrink-0 items-center justify-center rounded-full bg-terracotta-500 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-600"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}