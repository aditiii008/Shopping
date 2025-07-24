import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const TOKEN_NAME = "session";
const JWT_SECRET = process.env.JWT_SECRET || "secret123"; // Keep this secure

export interface SessionPayload {
  id: string;
  email: string;
}

export async function setSession(payload: SessionPayload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  (await cookies()).set(TOKEN_NAME, token, { httpOnly: true });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function clearSession() {
  (await cookies()).delete(TOKEN_NAME);
}
