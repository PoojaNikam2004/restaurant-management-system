"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import TopNav from "@/components/TopNav";
import MenuBrowser from "@/components/MenuBrowser";
import CartPanel from "@/components/CartPanel";
import MobileCartBar from "@/components/MobileCartBar";
import { useAuth } from "@/context/AuthContext";

function MenuContent() {
  const { isAdmin } = useAuth();

  const links = [
    { href: "/dashboard", label: "Home" },
    { href: "/orders", label: "My Orders" },
  ];
  if (isAdmin) links.push({ href: "/admin", label: "Admin panel" });

  return (
    <div className="flex flex-1 flex-col bg-white">
      <TopNav subtitle="Menu" links={links} />

      <main className="mx-auto grid w-full max-w-6xl min-w-0 flex-1 grid-cols-1 gap-8 px-4 py-6 pb-24 sm:px-12 sm:py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:pb-8">
        <div className="flex min-w-0 flex-col gap-6">
          <section>
            <h1 className="text-2xl font-semibold text-terracotta-900">
              Full menu
            </h1>
            <p className="mt-1 text-sm text-terracotta-700/60">
              Search or filter to find exactly what you&apos;re craving.
            </p>
          </section>

          <MenuBrowser />
        </div>

        <aside className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
          <CartPanel />
        </aside>
      </main>

      <MobileCartBar />
    </div>
  );
}

export default function MenuPage() {
  return (
    <ProtectedRoute>
      <MenuContent />
    </ProtectedRoute>
  );
}