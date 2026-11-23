import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type UserRole, type CustomerStatus, type DbUser } from "@/types";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: CustomerStatus;
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
 * Retrieves the current Better Auth session from incoming server request headers.
 * Validates the user's live database record to ensure real-time role and status enforcement.
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

    // Query live database status to ensure BLOCKED/DEACTIVATED status is enforced immediately
    const db = await getDatabase();
    const dbUser = await db
      .collection<DbUser>(COLLECTIONS.USER)
      .findOne({ email: session.user.email.toLowerCase() });

    const rawRole = dbUser?.role || (session.user as { role?: string }).role;
    const validatedRole: UserRole =
      rawRole === "admin" || rawRole === "banking-staff" || rawRole === "customer"
        ? (rawRole as UserRole)
        : "customer";

    const userStatus: CustomerStatus = dbUser?.status || "ACTIVE";

    return {
      user: {
        id: session.user.id,
        name: dbUser?.name || session.user.name,
        email: session.user.email,
        role: validatedRole,
        status: userStatus,
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
