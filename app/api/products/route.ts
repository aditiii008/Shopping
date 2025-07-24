import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, description, price, image, stock } = await req.json();

  
  const stockValue = typeof stock === "number" && stock >= 0 ? stock : 0;

  const product = await prisma.product.create({
    data: { name, description, price, image, stock: stockValue },
  });

  return NextResponse.json(product);
}
