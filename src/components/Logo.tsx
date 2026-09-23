"use client";

import { useSiteSettings } from "@/lib/useSiteSettings";

export default function Logo({ subtitle }: { subtitle?: string }) {
  const { logoUrl } = useSiteSettings();

  return (
    <div className="flex items-center gap-2">
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt="Aangan logo"
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      )}
      <span className="flex items-baseline gap-2">
        <span className="text-xl font-semibold tracking-tight text-terracotta-600">
          Aangan
        </span>
        <span className="truncate text-sm text-terracotta-400">
          <span className="hidden sm:inline">आंगन{subtitle ? " · " : ""}</span>
          {subtitle}
        </span>
      </span>
    </div>
  );
}