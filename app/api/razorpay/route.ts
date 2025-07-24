import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!, // use server key
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount, // already in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { platform: "uncover-store" },
    });

    return NextResponse.json(order);
  } catch (e: any) {
    console.error("Razorpay order error:", e?.message || e);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
