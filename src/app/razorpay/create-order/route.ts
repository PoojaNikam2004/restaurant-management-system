import { NextRequest, NextResponse } from "next/server";
import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { razorpay } from "@/lib/razorpay";
import { MenuItem } from "@/types/menu";

interface CartLineInput {
  itemId: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const lines = body?.lines as CartLineInput[] | undefined;

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  let totalAmount = 0;
  const resolvedLines: { itemId: string; name: string; price: number; quantity: number }[] = [];

  for (const line of lines) {
    if (!line.itemId || !Number.isInteger(line.quantity) || line.quantity <= 0) {
      return NextResponse.json({ error: "Invalid cart line." }, { status: 400 });
    }
    const snap = await get(ref(db, `menuItems/${line.itemId}`));
    const item = snap.val() as MenuItem | null;
    if (!item || !item.available) {
      return NextResponse.json(
        { error: `Item ${line.itemId} is not available.` },
        { status: 400 }
      );
    }
    totalAmount += item.price * line.quantity;
    resolvedLines.push({
      itemId: line.itemId,
      name: item.name,
      price: item.price,
      quantity: line.quantity,
    });
  }

  const amountInPaise = Math.round(totalAmount * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    notes: {
      lineCount: String(resolvedLines.length),
    },
  });

  return NextResponse.json({
    razorpayOrderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: razorpayOrder.currency,
    lines: resolvedLines,
    totalAmount,
  });
}