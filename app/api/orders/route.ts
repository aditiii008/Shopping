import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const orders = await db.order.findMany({
    where: email ? { customerEmail: email } : {},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}


export async function POST(req: Request) {
  try {
    const { products, total, customerName, customerEmail, customerAddress } =
      await req.json();

    if (!products || !total || !customerEmail) {
      return NextResponse.json(
        { error: "Missing order data" },
        { status: 400 }
      );
    }

    const order = await db.order.create({
      data: {
        total,
        products,
        status: "PENDING",
        customerName: customerName || "Guest",
        customerEmail,
        customerAddress: customerAddress || "",
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Order creation failed" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request) {
  try {
    const { orderId, status, trackingUrl } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing order ID or status" },
        { status: 400 }
      );
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        status,
        trackingUrl: trackingUrl || null,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { success: false, error: "Order update failed" },
      { status: 500 }
    );
  }
}
