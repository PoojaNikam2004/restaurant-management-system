"use client";

import { useState } from "react";
import { ref, runTransaction, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { RazorpaySuccessResponse } from "@/types/razorpay";
import { OrderLine } from "@/types/order";
import { getStoredTableNumber } from "@/lib/tableNumber";

type CheckoutState = "idle" | "creating" | "paying" | "verifying" | "success" | "error";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function now(): number {
  return Date.now();
}

export function useCheckout() {
  const { user } = useAuth();
  const { lines, totalPrice, clearCart } = useCart();
  const [state, setState] = useState<CheckoutState>("idle");
  const [error, setError] = useState("");
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [lastOrderNumber, setLastOrderNumber] = useState<number | null>(null);

  async function startCheckout() {
    if (!user || lines.length === 0) return;
    setError("");
    setState("creating");

    try {
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((line) => ({
            itemId: line.item.id,
            quantity: line.quantity,
          })),
        }),
      });

      if (!createRes.ok) {
        const body = await createRes.json().catch(() => ({}));
        throw new Error(body.error || "Could not start checkout.");
      }

      const order = await createRes.json();
      const orderId = order.razorpayOrderId as string;

      const tableNumber = getStoredTableNumber();
      const orderRecordRef = ref(db, `orders/${user.uid}/${orderId}`);
      await set(orderRecordRef, {
        uid: user.uid,
        lines: order.lines,
        totalAmount: order.totalAmount,
        status: "created",
        razorpayOrderId: orderId,
        createdAt: now(),
        ...(tableNumber ? { tableNumber } : {}),
      });

      setState("paying");

      if (window.Razorpay) {
        openCheckout(order, orderId);
      } else {
        setState("error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  function openCheckout(
    order: { amount: number; currency: string; lines: OrderLine[] },
    orderId: string
  ) {
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      setError("Payments are not configured.");
      setState("error");
      return;
    }

    const checkout = new window.Razorpay({
      key: razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      name: "Aangan",
      description: "Order payment",
      order_id: orderId,
      prefill: {
        name: user?.displayName ?? undefined,
        email: user?.email ?? undefined,
      },
      theme: { color: "#d15f28" },
      handler: (response) => {
        void handlePaymentSuccess(response, orderId, order.lines);
      },
      modal: {
        ondismiss: () => {
          setState("idle");
        },
      },
    });

    checkout.open();
  }

  async function handlePaymentSuccess(
    response: RazorpaySuccessResponse,
    orderId: string,
    orderLines: OrderLine[]
  ) {
    if (!user) return;
    setState("verifying");
    try {
      const verifyRes = await fetch("/api/razorpay/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });
      const result = await verifyRes.json();

      if (result.verified) {
        const counterRef = ref(db, `orderCounter/${todayKey()}`);
        const counterResult = await runTransaction(
          counterRef,
          (current: number | null) => (current ?? 0) + 1
        );
        const orderNumber = counterResult.snapshot.val() as number;

        await set(
          ref(db, `orders/${user.uid}/${orderId}/orderNumber`),
          orderNumber
        );
        await set(
          ref(db, `orders/${user.uid}/${orderId}/razorpayPaymentId`),
          response.razorpay_payment_id
        );
        await set(ref(db, `orders/${user.uid}/${orderId}/status`), "paid");

        const tableNumber = getStoredTableNumber();
        const queuedAt = now();
        await set(ref(db, `kitchenQueue/${orderId}`), {
          orderId,
          uid: user.uid,
          orderNumber,
          lines: orderLines,
          status: "queued",
          createdAt: queuedAt,
          updatedAt: queuedAt,
          ...(tableNumber ? { tableNumber } : {}),
        });

        setLastOrderId(orderId);
        setLastOrderNumber(orderNumber);
        clearCart();
        setState("success");
      } else {
        await set(ref(db, `orders/${user.uid}/${orderId}/status`), "failed");
        setError("Payment could not be verified.");
        setState("error");
      }
    } catch {
      setError("Payment succeeded but confirmation failed. Contact support.");
      setState("error");
    }
  }

  function reset() {
    setState("idle");
    setError("");
  }

  return {
    state,
    error,
    lastOrderId,
    lastOrderNumber,
    totalPrice,
    startCheckout,
    reset,
  };
}