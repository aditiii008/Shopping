import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      total,
      items,
      customerName,
      customerEmail,
      customerAddress,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment data" },
        { status: 400 }
      );
    }

    // Verify payment signature
    const raw = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(raw)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Ensure items are valid
    const formattedItems = Array.isArray(items)
      ? items.map((item: any) => ({
          id: item.id,
          name: item.name || "Unknown Product",
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.imageUrl || "/placeholder.png",
        }))
      : [];

    // Reduce stock for each product
    for (const item of formattedItems) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Serialize address if needed
    const addressString =
      typeof customerAddress === "object"
        ? JSON.stringify(customerAddress)
        : customerAddress || "";

    // Save order
    const orderRecord = await prisma.order.create({
      data: {
        total: typeof total === "number" ? total : 0,
        status: "PAID",
        products: formattedItems,
        customerName: customerName || "Guest",
        customerEmail: customerEmail || "guest@example.com",
        customerAddress: addressString,
      },
    });

    return NextResponse.json({ verified: true, orderId: orderRecord.id });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
