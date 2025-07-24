import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all orders (optional: filter by email if provided)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const orders = await db.order.findMany({
    where: email ? { customerEmail: email } : {},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

// POST - Create a new order and store customer info
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
