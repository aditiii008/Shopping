import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.id },  
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const data = await req.json();
  const { fullName, street, city, state, postalCode, country, phone } = data;

  if (!fullName || !street || !city || !state || !postalCode || !country) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const address = await prisma.address.create({
    data: { fullName, street, city, state, postalCode, country, phone, userId: session.id },
  });

  return NextResponse.json({ success: true, address });
}
