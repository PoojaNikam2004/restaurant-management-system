"use client";

import { useEffect } from "react";
import { captureTableNumberFromUrl } from "@/lib/tableNumber";

export default function TableNumberCapture() {
  useEffect(() => {
    captureTableNumberFromUrl(new URLSearchParams(window.location.search));
  }, []);

  return null;
}