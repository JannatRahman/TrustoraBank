import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/types";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
}

export interface ServerSession {
  user: AuthenticatedUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

/**
 * Retrieves the current Better Auth session from the incoming server request headers.
 * Returns null if the user is unauthenticated.
 */
export async function getServerSession(): Promise<ServerSession | null> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return null;
    }

    const role = (session.user as { role?: string }).role;
    const validatedRole: UserRole =
      role === "admin" || role === "banking-staff" || role === "customer"
        ? (role as UserRole)
        : "customer";

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: validatedRole,
        image: session.user.image,
      },
      session: {
        id: session.session.id,
        userId: session.session.userId,
        token: session.session.token,
        expiresAt: session.session.expiresAt,
        ipAddress: session.session.ipAddress,
        userAgent: session.session.userAgent,
      },
    };
  } catch (error) {
    console.error("Error retrieving server session:", error);
    return null;
  }
}
