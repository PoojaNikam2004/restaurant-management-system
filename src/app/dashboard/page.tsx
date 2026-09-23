"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopNav from "@/components/TopNav";
import AdCarousel from "@/components/AdCarousel";
import MenuItemRow from "@/components/MenuItemRow";
import CartPanel from "@/components/CartPanel";
import MobileCartBar from "@/components/MobileCartBar";
import { useAuth } from "@/context/AuthContext";
import { useMyOrders } from "@/lib/useMyOrders";
import { useRecommendations } from "@/lib/useRecommendations";
import { useMenuItems } from "@/lib/useMenuItems";

const kitchenStatusLabel: Record<string, string> = {
  queued: "Queued in kitchen",
  preparing: "Being prepared",
  ready: "Ready to serve",
  served: "Served",
};

function RecentOrderBanner() {
  const { orders, loading } = useMyOrders();
  if (loading) return null;

  const active = orders.find(
    (o) => o.status === "paid" && o.kitchenStatus !== "served"
  );
  if (!active) return null;

  return (
    <section className="flex items-start gap-3 rounded-3xl border border-mint-300 bg-mint-100 p-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-mint-700">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 8v4l3 2M12 3a9 9 0 1 0 9 9"
          />
        </svg>
      </span>
      <div className="flex flex-1 items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-mint-700">
            {active.orderNumber
              ? `Order #${active.orderNumber} is on the way`
              : "Your order is on the way"}
          </p>
          <p className="mt-1 text-sm text-mint-700/70">
            {kitchenStatusLabel[active.kitchenStatus ?? "queued"]}
          </p>
        </div>
        <Link
          href="/orders"
          className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-mint-700 shadow-sm transition-colors hover:bg-mint-50"
        >
          Track
        </Link>
      </div>
    </section>
  );
}

function RewardsBanner() {
  const { orders, loading } = useMyOrders();
  const paidOrders = orders.filter((o) => o.status === "paid");
  const points = paidOrders.reduce(
    (sum, o) => sum + Math.floor(o.totalAmount / 10),
    0
  );

  return (
    <section className="flex items-start gap-3 rounded-3xl border border-butter-300 bg-butter-100 p-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-butter-700">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="m12 3 2.5 5.5L20 9l-4.5 4 1.3 6-4.8-3-4.8 3 1.3-6L4 9l5.5-.5L12 3Z"
          />
        </svg>
      </span>
      <div>
        <p className="text-sm font-medium text-butter-700">
          Offers & reward points
        </p>
        {loading ? (
          <p className="mt-1 text-sm text-butter-700/70">Loading…</p>
        ) : points > 0 ? (
          <p className="mt-1 text-sm text-butter-700/70">
            You&apos;ve earned{" "}
            <span className="font-semibold">{points} points</span> from{" "}
            {paidOrders.length} order{paidOrders.length === 1 ? "" : "s"}.
            Keep ordering to unlock rewards.
          </p>
        ) : (
          <p className="mt-1 text-sm text-butter-700/70">
            You don&apos;t have any offers or reward points yet — place an
            order to start earning.
          </p>
        )}
      </div>
    </section>
  );
}

function OffersPreview() {
  const { items, loading } = useMenuItems();
  const offers = items.filter((item) => item.available && item.isOffer);
  if (loading || offers.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-terracotta-900">
          Today&apos;s Offers
        </h2>
        <Link
          href="/menu?filter=offer"
          className="text-xs font-medium text-terracotta-600 hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="mt-4">
        <MenuItemRow items={offers.slice(0, 8)} />
      </div>
    </section>
  );
}

function RecommendedSection() {
  const { recommended, loading } = useRecommendations();
  if (loading || recommended.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-terracotta-900">
        Recommended for you
      </h2>
      <div className="mt-4">
        <MenuItemRow items={recommended} />
      </div>
    </section>
  );
}

function DashboardContent() {
  const { user, isAdmin } = useAuth();
  const firstName = (user?.displayName || user?.email || "").split(" ")[0];

  const links = [
    { href: "/menu", label: "Menu" },
    { href: "/orders", label: "My Orders" },
  ];
  if (isAdmin) links.push({ href: "/admin", label: "Admin panel" });

  return (
    <div className="flex flex-1 flex-col bg-white">
      <TopNav links={links} />

      <main className="mx-auto grid w-full max-w-6xl min-w-0 flex-1 grid-cols-1 gap-8 px-4 py-6 pb-24 sm:px-12 sm:py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:pb-8">
        <div className="flex min-w-0 flex-col gap-6">
          <section>
            <h1 className="text-2xl font-semibold text-terracotta-900">
              Welcome back{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="mt-1 text-sm text-terracotta-700/60">
              Here&apos;s what&apos;s fresh today.
            </p>
          </section>

          <AdCarousel />

          <RecentOrderBanner />
          <RewardsBanner />

          <RecommendedSection />
          <OffersPreview />

          <Link
            href="/menu"
            className="group relative flex items-center justify-between overflow-hidden rounded-3xl border border-terracotta-200 bg-gradient-to-r from-terracotta-500 to-coral-500 px-6 py-5 shadow-sm transition-shadow hover:shadow-md sm:px-8"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10"
            />
            <div className="relative">
              <p className="text-base font-semibold text-white">
                Explore the full menu
              </p>
              <p className="mt-0.5 text-sm text-white/80">
                Every dish, every category, all in one place.
              </p>
            </div>
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-terracotta-600 transition-transform group-hover:translate-x-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>

        <aside className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
          <CartPanel />
        </aside>
      </main>

      <MobileCartBar />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}