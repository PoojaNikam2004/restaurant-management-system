"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";
import ProfileMenu from "@/components/ProfileMenu";

export default function TopNav({
  subtitle,
  links = [],
}: {
  subtitle?: string;
  links?: { href: string; label: string }[];
}) {
  const { logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="relative flex w-full items-center justify-between border-b border-cream-200 px-4 py-4 sm:px-12 sm:py-5">
      <Logo subtitle={subtitle} />

      <div className="hidden items-center gap-3 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full px-4 py-2 text-sm font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
          >
            {link.label}
          </Link>
        ))}
        <ProfileMenu />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ProfileMenu compact />
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 text-terracotta-700"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
            {menuOpen ? (
              <path strokeLinecap="round" strokeWidth={1.8} d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path strokeLinecap="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-20 flex flex-col gap-1 border-b border-cream-200 bg-white p-4 shadow-md md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="rounded-xl border border-cream-300 px-4 py-2.5 text-left text-sm font-medium text-terracotta-700 transition-colors hover:bg-cream-100"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}