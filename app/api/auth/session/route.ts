import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  
  const user = {
    id: (session as any).id || "",
    email: (session as any).email || "",
    name: (session as any).name || "",
  };

  return NextResponse.json(user);
}
