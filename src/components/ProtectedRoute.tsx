"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireKitchenOrAdmin = false,
  allowKitchen = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
  requireKitchenOrAdmin?: boolean;
  /** Set on the /kitchen page itself so kitchen-role users aren't bounced from it. */
  allowKitchen?: boolean;
}) {
  const { user, isAdmin, isKitchen, loading } = useAuth();
  const router = useRouter();

  const authorized =
    ((!requireAdmin && !requireKitchenOrAdmin) ||
      (requireAdmin && isAdmin) ||
      (requireKitchenOrAdmin && (isAdmin || isKitchen))) &&
    (!isKitchen || allowKitchen);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!authorized) {
      router.replace(isKitchen ? "/kitchen" : "/dashboard");
    }
  }, [loading, user, authorized, isKitchen, router]);

  if (loading || !user || !authorized) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white">
        <p className="text-sm text-terracotta-700/60">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}