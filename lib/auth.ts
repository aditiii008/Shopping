
import { db } from "@/lib/db";


export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}


export async function getCurrentUser(): Promise<AuthUser | null> {
  const devUserId = process.env.DEV_USER_ID?.trim();
  if (!devUserId) {
    return null; 
  }

 
  const user = await db.user.findUnique({
    where: { id: devUserId },
    select: { id: true, email: true, name: true },
  });

  if (!user) return null;

  return user;
}
