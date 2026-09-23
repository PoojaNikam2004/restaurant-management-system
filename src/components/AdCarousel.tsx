"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAds } from "@/lib/useAds";

const AUTO_SLIDE_MS = 5000;

export default function AdCarousel() {
  const { ads, loading } = useAds();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (ads.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [ads.length, paused]);

  if (loading || ads.length === 0) return null;

  const ad = ads[index % ads.length];

  function go(delta: number) {
    setIndex((prev) => (prev + delta + ads.length) % ads.length);
  }

  function openAd() {
    if (ad.linkCategory) {
      router.push(`/menu?category=${encodeURIComponent(ad.linkCategory)}`);
    } else {
      router.push("/menu");
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      go(delta < 0 ? 1 : -1);
    }
    touchStartX.current = null;
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-cream-300 shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button onClick={openAd} className="block w-full text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="h-40 w-full object-cover sm:h-56"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-sm font-semibold text-white">{ad.title}</p>
        </div>
      </button>

      {ads.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous ad"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-terracotta-700 shadow-sm hover:bg-white"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next ad"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-terracotta-700 shadow-sm hover:bg-white"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to ad ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  i === index % ads.length ? "w-4 bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}