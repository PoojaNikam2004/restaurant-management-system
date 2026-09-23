"use client";

import { FormEvent, useState } from "react";
import { push, ref, remove, update } from "firebase/database";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopNav from "@/components/TopNav";
import MenuItemImage from "@/components/MenuItemImage";
import { db } from "@/lib/firebase";
import { useMenuItems } from "@/lib/useMenuItems";
import { MenuItem } from "@/types/menu";

function AdminContent() {
  const { items, loading: loadingItems } = useMenuItems();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isOffer, setIsOffer] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImageUrl("");
    setIsOffer(false);
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const numericPrice = parseFloat(price);
    if (!name.trim() || !category.trim() || Number.isNaN(numericPrice)) {
      setError("Please fill in name, category, and a valid price.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        price: numericPrice,
        category: category.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        available: true,
        isOffer,
      };
      if (editingId) {
        await update(ref(db, `menuItems/${editingId}`), payload);
      } else {
        await push(ref(db, "menuItems"), payload);
      }
      resetForm();
    } catch {
      setError("Failed to save item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(item: MenuItem) {
    setEditingId(item.id);
    setName(item.name);
    setPrice(String(item.price));
    setCategory(item.category);
    setDescription(item.description);
    setImageUrl(item.imageUrl ?? "");
    setIsOffer(item.isOffer ?? false);
  }

  async function handleDelete(id: string) {
    await remove(ref(db, `menuItems/${id}`));
    if (editingId === id) resetForm();
  }

  async function toggleAvailability(item: MenuItem) {
    await update(ref(db, `menuItems/${item.id}`), {
      available: !item.available,
    });
  }

  async function toggleOffer(item: MenuItem) {
    await update(ref(db, `menuItems/${item.id}`), {
      isOffer: !item.isOffer,
    });
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <TopNav
        subtitle="Admin"
        links={[
          { href: "/admin/orders", label: "Orders & Analytics" },
          { href: "/admin/ads", label: "Ads" },
          { href: "/kitchen", label: "Kitchen queue" },
          { href: "/dashboard", label: "Customer view" },
        ]}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-10 sm:px-12">
        <section>
          <h1 className="text-2xl font-semibold text-terracotta-900">
            Menu items
          </h1>
          <p className="mt-1 text-sm text-terracotta-700/60">
            Add, edit, or remove items customers can order.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid grid-cols-1 gap-4 rounded-3xl border border-cream-300 bg-cream-50 p-6 sm:grid-cols-2"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-terracotta-800">
                Item name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-sm text-terracotta-900 outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                placeholder="Paneer Tikka"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-terracotta-800">
                Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-sm text-terracotta-900 outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                placeholder="249"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-terracotta-800">
                Category
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-sm text-terracotta-900 outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                placeholder="Starters"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-terracotta-800">
                Image URL
              </label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-sm text-terracotta-900 outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                placeholder="https://…"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-terracotta-800">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm text-terracotta-900 outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                placeholder="Short description shown to customers"
              />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="isOffer"
                type="checkbox"
                checked={isOffer}
                onChange={(e) => setIsOffer(e.target.checked)}
                className="h-4 w-4 rounded border-cream-300 text-terracotta-500 focus:ring-terracotta-300"
              />
              <label
                htmlFor="isOffer"
                className="text-sm font-medium text-terracotta-800"
              >
                Feature as today&apos;s offer
              </label>
            </div>

            {imageUrl.trim() && (
              <div className="flex items-center gap-3 sm:col-span-2">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-cream-300">
                  <MenuItemImage
                    imageUrl={imageUrl.trim()}
                    name={name || "Preview"}
                    category={category || "General"}
                  />
                </div>
                <span className="text-xs text-terracotta-700/50">
                  Image preview
                </span>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 sm:col-span-2">{error}</p>
            )}

            <div className="flex items-center gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 items-center justify-center rounded-full bg-terracotta-500 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-600 disabled:opacity-60"
              >
                {editingId ? "Save changes" : "Add item"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex h-11 items-center justify-center rounded-full border border-cream-300 px-6 text-sm font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-terracotta-900">
            Current items ({items.length})
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {loadingItems && (
              <p className="text-sm text-terracotta-700/60">
                Loading items…
              </p>
            )}
            {!loadingItems && items.length === 0 && (
              <p className="text-sm text-terracotta-700/60">
                No menu items yet. Add your first one above.
              </p>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-cream-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <MenuItemImage
                      imageUrl={item.imageUrl}
                      name={item.name}
                      category={item.category}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-terracotta-900">
                        {item.name}
                      </p>
                      <span className="rounded-full bg-cream-200 px-2 py-0.5 text-xs text-terracotta-700">
                        {item.category}
                      </span>
                      {item.isOffer && (
                        <span className="rounded-full bg-saffron-100 px-2 py-0.5 text-xs text-saffron-700">
                          Today&apos;s offer
                        </span>
                      )}
                      {!item.available && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                          Unavailable
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-terracotta-700/60">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-1 inline-flex items-center rounded-full bg-saffron-100 px-2.5 py-0.5 text-sm font-medium text-saffron-700">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => toggleOffer(item)}
                    className="rounded-full border border-cream-300 px-3 py-1.5 text-xs font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
                  >
                    {item.isOffer ? "Unfeature offer" : "Feature as offer"}
                  </button>
                  <button
                    onClick={() => toggleAvailability(item)}
                    className="rounded-full border border-cream-300 px-3 py-1.5 text-xs font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
                  >
                    {item.available ? "Mark unavailable" : "Mark available"}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded-full border border-cream-300 px-3 py-1.5 text-xs font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminContent />
    </ProtectedRoute>
  );
}