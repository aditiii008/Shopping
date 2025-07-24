import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { cartItems, customer } = await req.json();
    

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    
    const productIds = cartItems.map((item) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    
    for (const item of cartItems) {
      const product = dbProducts.find((p) => p.id === item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
    }

    
    const totalAmount = cartItems.reduce((sum, item) => {
      const product = dbProducts.find((p) => p.id === item.id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    
    const order = await prisma.order.create({
      data: {
        total: totalAmount,
        products: cartItems,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
      },
    });

    
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }
}
