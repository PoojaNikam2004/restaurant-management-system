"use client";

import { FormEvent, useState } from "react";
import { push, ref, remove, set, update } from "firebase/database";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopNav from "@/components/TopNav";
import { db } from "@/lib/firebase";
import { useAds } from "@/lib/useAds";
import { useMenuItems } from "@/lib/useMenuItems";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { Ad } from "@/types/ad";

function BrandingForm({ initialLogoUrl }: { initialLogoUrl: string }) {
  const [value, setValue] = useState(initialLogoUrl);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await set(ref(db, "settings/logoUrl"), value.trim() || null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-cream-300 bg-cream-50 p-6 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-sm font-medium text-terracotta-800">
          Logo image URL
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-sm text-terracotta-900 outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
          placeholder="https://… (leave empty to remove)"
        />
      </div>
      {value.trim() && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value.trim()}
          alt="Logo preview"
          className="h-11 w-11 shrink-0 rounded-full border border-cream-300 object-cover"
        />
      )}
      <button
        onClick={save}
        disabled={saving}
        className="flex h-11 items-center justify-center rounded-full bg-terracotta-500 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-600 disabled:opacity-60"
      >
        Save
      </button>
    </div>
  );
}

function BrandingSection() {
  const { logoUrl, loading } = useSiteSettings();

  return (
    <section>
      <h1 className="text-2xl font-semibold text-terracotta-900">Branding</h1>
      <p className="mt-1 text-sm text-terracotta-700/60">
        Set a logo image shown next to the Aangan name on every page.
      </p>
      {!loading && <BrandingForm key={logoUrl ?? ""} initialLogoUrl={logoUrl ?? ""} />}
    </section>
  );
}

function AdminAdsContent() {
  const { ads, loading } = useAds();
  const { items } = useMenuItems();

  const categories = Array.from(new Set(items.map((item) => item.category)));

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkCategory, setLinkCategory] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  function resetForm() {
    setTitle("");
    setImageUrl("");
    setLinkCategory("");
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim() || !imageUrl.trim()) {
      setError("Please fill in a title and image URL.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        ...(linkCategory ? { linkCategory } : {}),
        order: editingId
          ? (ads.find((a) => a.id === editingId)?.order ?? ads.length)
          : ads.length,
      };
      if (editingId) {
        await update(ref(db, `ads/${editingId}`), payload);
      } else {
        await push(ref(db, "ads"), payload);
      }
      resetForm();
    } catch {
      setError("Failed to save ad. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(ad: Ad) {
    setEditingId(ad.id);
    setTitle(ad.title);
    setImageUrl(ad.imageUrl);
    setLinkCategory(ad.linkCategory ?? "");
  }

  async function handleDelete(id: string) {
    await remove(ref(db, `ads/${id}`));
    if (editingId === id) resetForm();
  }

  async function move(ad: Ad, direction: -1 | 1) {
    const sorted = [...ads].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((a) => a.id === ad.id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;
    await update(ref(db, `ads/${ad.id}`), { order: swapWith.order });
    await update(ref(db, `ads/${swapWith.id}`), { order: ad.order });
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <TopNav
        subtitle="Admin · Branding & Ads"
        links={[
          { href: "/admin", label: "Menu items" },
          { href: "/admin/orders", label: "Orders & Analytics" },
          { href: "/kitchen", label: "Kitchen queue" },
          { href: "/dashboard", label: "Customer view" },
        ]}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-10 sm:px-12">
        <BrandingSection />

        <section>
          <h2 className="text-lg font-semibold text-terracotta-900">
            Home screen ads
          </h2>
          <p className="mt-1 text-sm text-terracotta-700/60">
            Banners shown at the top of the customer home screen, in order.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid grid-cols-1 gap-4 rounded-3xl border border-cream-300 bg-cream-50 p-6 sm:grid-cols-2"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-terracotta-800">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-sm text-terracotta-900 outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                placeholder="Weekend Biryani Fest"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-terracotta-800">
                Links to category (optional)
              </label>
              <select
                value={linkCategory}
                onChange={(e) => setLinkCategory(e.target.value)}
                className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-sm text-terracotta-900 outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
              >
                <option value="">None — links to full menu</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
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

            {imageUrl.trim() && (
              <div className="sm:col-span-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl.trim()}
                  alt="Ad preview"
                  className="h-32 w-full rounded-xl border border-cream-300 object-cover"
                />
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
                {editingId ? "Save changes" : "Add ad"}
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
            Current ads ({ads.length})
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {loading && (
              <p className="text-sm text-terracotta-700/60">Loading ads…</p>
            )}
            {!loading && ads.length === 0 && (
              <p className="text-sm text-terracotta-700/60">
                No ads yet. Add your first banner above.
              </p>
            )}
            {ads.map((ad, index) => (
              <div
                key={ad.id}
                className="flex flex-col gap-3 rounded-2xl border border-cream-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="h-14 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-medium text-terracotta-900">
                      {ad.title}
                    </p>
                    {ad.linkCategory && (
                      <p className="mt-1 text-xs text-terracotta-700/50">
                        Links to: {ad.linkCategory}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => move(ad, -1)}
                    disabled={index === 0}
                    className="rounded-full border border-cream-300 px-3 py-1.5 text-xs font-medium text-terracotta-700 transition-colors hover:bg-cream-100 disabled:opacity-40"
                  >
                    Move up
                  </button>
                  <button
                    onClick={() => move(ad, 1)}
                    disabled={index === ads.length - 1}
                    className="rounded-full border border-cream-300 px-3 py-1.5 text-xs font-medium text-terracotta-700 transition-colors hover:bg-cream-100 disabled:opacity-40"
                  >
                    Move down
                  </button>
                  <button
                    onClick={() => handleEdit(ad)}
                    className="rounded-full border border-cream-300 px-3 py-1.5 text-xs font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ad.id)}
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

export default function AdminAdsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminAdsContent />
    </ProtectedRoute>
  );
}