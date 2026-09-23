import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = body ?? {};

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { verified: false, error: "Missing payment fields." },
      { status: 400 }
    );
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json(
      { verified: false, error: "Server misconfigured." },
      { status: 500 }
    );
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "utf8");
  const actual = Buffer.from(signature, "utf8");

  const verified =
    expected.length === actual.length && timingSafeEqual(expected, actual);

  if (!verified) {
    return NextResponse.json(
      { verified: false, error: "Signature mismatch." },
      { status: 400 }
    );
  }

  return NextResponse.json({ verified: true, paymentId, orderId });
}