"use client";

import { useState } from "react";

const palettes = [
  { bg: "from-coral-100 to-coral-300", fg: "text-coral-700" },
  { bg: "from-mint-100 to-mint-300", fg: "text-mint-700" },
  { bg: "from-butter-100 to-butter-300", fg: "text-butter-700" },
  { bg: "from-sky-100 to-sky-300", fg: "text-sky-700" },
  { bg: "from-plum-100 to-plum-300", fg: "text-plum-700" },
];

function paletteForCategory(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return palettes[hash % palettes.length];
}

export default function MenuItemImage({
  imageUrl,
  name,
  category,
  className = "",
}: {
  imageUrl?: string;
  name: string;
  category: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const palette = paletteForCategory(category);

  if (imageUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${palette.bg} ${className}`}
    >
      <span className={`text-2xl font-semibold ${palette.fg}`}>{initial}</span>
    </div>
  );
}